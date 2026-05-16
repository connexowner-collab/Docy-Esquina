import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY

// ── Haversine — distância linha reta (último fallback) ────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Google Geocoding API ──────────────────────────────────────────────────────
async function geocodificarGoogle(endereco: string): Promise<{ lat: number; lng: number } | null> {
  if (!GOOGLE_KEY) return null
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&region=br&language=pt-BR&key=${GOOGLE_KEY}`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data.status === 'OK' && data.results?.[0]) {
      const { lat, lng } = data.results[0].geometry.location
      return { lat, lng }
    }
  } catch {}
  return null
}

// ── Google Distance Matrix API ────────────────────────────────────────────────
async function distanciaGoogle(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number | null> {
  if (!GOOGLE_KEY) return null
  try {
    const origins = `${lat1},${lng1}`
    const destinations = `${lat2},${lng2}`
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=driving&language=pt-BR&key=${GOOGLE_KEY}`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    const element = data.rows?.[0]?.elements?.[0]
    if (element?.status === 'OK' && element.distance?.value) {
      return element.distance.value / 1000
    }
  } catch {}
  return null
}

// ── Nominatim (OpenStreetMap) — fallback gratuito ─────────────────────────────
async function geocodificarNominatim(endereco: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1&countrycodes=br`
    const res = await fetch(url, { headers: { 'User-Agent': 'DocyEsquina/1.0' }, signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

async function geocodificarCepNominatim(cep: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const digits = cep.replace(/\D/g, '')
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${digits}&countrycodes=br&format=json&limit=1`
    const res = await fetch(url, { headers: { 'User-Agent': 'DocyEsquina/1.0' }, signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

// ── OSRM — rota real, fallback gratuito ──────────────────────────────────────
async function osrmKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    if (data?.routes?.[0]?.distance) return data.routes[0].distance / 1000
  } catch {}
  return null
}

// ── Geocodifica com fallback: Google → Nominatim ──────────────────────────────
async function geocodificar(endereco: string): Promise<{ lat: number; lng: number } | null> {
  return (await geocodificarGoogle(endereco)) ?? (await geocodificarNominatim(endereco))
}

async function geocodificarCep(cep: string): Promise<{ lat: number; lng: number } | null> {
  const digits = cep.replace(/\D/g, '')
  // Tenta Google com o CEP como endereço
  const google = await geocodificarGoogle(`${digits}, Brasil`)
  if (google) return google
  return geocodificarCepNominatim(cep)
}

// ── Calcula distância com fallback: Google → OSRM → Haversine ─────────────────
async function calcularDistanciaKm(
  latOrig: number, lngOrig: number,
  latDest: number, lngDest: number
): Promise<{ distanciaKm: number; fonte: string }> {
  // 1. Google Distance Matrix (mais preciso)
  const google = await distanciaGoogle(latOrig, lngOrig, latDest, lngDest)
  if (google !== null) return { distanciaKm: google, fonte: 'google' }

  // 2. OSRM (rota real gratuita)
  const osrm = await osrmKm(latOrig, lngOrig, latDest, lngDest)
  if (osrm !== null) return { distanciaKm: osrm, fonte: 'osrm' }

  // 3. Haversine + 15% (linha reta)
  const hav = haversineKm(latOrig, lngOrig, latDest, lngDest) * 1.15
  return { distanciaKm: hav, fonte: 'haversine' }
}

// ── Handler principal ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { lat_destino, lng_destino, endereco_destino, cep_destino, km_manual, bairro } = body

  const supabase = await createClient()
  const [{ data: config }, { data: taxaBairroRow }] = await Promise.all([
    supabase.from('configuracoes').select('*').single(),
    bairro
      ? supabase.from('taxas_bairro').select('taxa').eq('bairro', bairro).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  // Taxa fixa por bairro tem prioridade
  if (taxaBairroRow?.taxa != null) {
    return NextResponse.json({
      distancia_km: km_manual ? Number(km_manual) : 0,
      taxa: Number(taxaBairroRow.taxa),
      fora_cobertura: false,
      fonte: 'bairro',
    })
  }

  // KM manual informado → calcula taxa direto
  if (km_manual !== undefined && km_manual !== null) {
    const distanciaKm = Number(km_manual)
    const taxa = Number(config?.taxa_minima ?? 5) +
      Math.max(0, distanciaKm - Number(config?.km_base ?? 2)) * Number(config?.valor_por_km ?? 2)
    return NextResponse.json({
      distancia_km: distanciaKm,
      taxa: Math.round(taxa * 100) / 100,
      fora_cobertura: distanciaKm > Number(config?.km_maximo ?? 15),
      fonte: 'manual',
    })
  }

  // Resolver lat/lng de origem
  let latOrigem = config?.lat_origem ? Number(config.lat_origem) : null
  let lngOrigem = config?.lng_origem ? Number(config.lng_origem) : null

  if (!latOrigem || !lngOrigem) {
    const endOrig = [config?.logradouro_origem, config?.numero_origem, config?.bairro_origem, config?.cidade_origem, config?.uf_origem]
      .filter(Boolean).join(', ')
    const cepOrig = config?.cep_origem
    const geo = endOrig ? await geocodificar(endOrig) : cepOrig ? await geocodificarCep(cepOrig) : null
    if (geo) { latOrigem = geo.lat; lngOrigem = geo.lng }
  }

  if (!latOrigem || !lngOrigem) {
    return NextResponse.json({ error: 'Configure o endereço de origem nas Configurações.' }, { status: 400 })
  }

  // Resolver lat/lng de destino
  let latDest = lat_destino ? Number(lat_destino) : null
  let lngDest = lng_destino ? Number(lng_destino) : null

  if (!latDest || !lngDest) {
    if (endereco_destino) {
      const geo = await geocodificar(endereco_destino)
      if (geo) { latDest = geo.lat; lngDest = geo.lng }
    }
    if ((!latDest || !lngDest) && cep_destino) {
      const geo = await geocodificarCep(cep_destino)
      if (geo) { latDest = geo.lat; lngDest = geo.lng }
    }
  }

  if (!latDest || !lngDest) {
    return NextResponse.json({ error: 'Endereço de destino não encontrado.' }, { status: 400 })
  }

  // Calcular distância
  const { distanciaKm, fonte } = await calcularDistanciaKm(latOrigem, lngOrigem, latDest, lngDest)
  const distanciaFinal = Math.round(distanciaKm * 100) / 100
  const taxa = Number(config?.taxa_minima ?? 5) +
    Math.max(0, distanciaFinal - Number(config?.km_base ?? 2)) * Number(config?.valor_por_km ?? 2)

  return NextResponse.json({
    distancia_km: distanciaFinal,
    taxa: Math.round(taxa * 100) / 100,
    fora_cobertura: distanciaFinal > Number(config?.km_maximo ?? 15),
    fonte,
  })
}
