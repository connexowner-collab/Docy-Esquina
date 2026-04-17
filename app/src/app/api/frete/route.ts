import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Haversine — distância em linha reta (fallback quando OSRM falha)
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Geocodifica endereço via Nominatim (OpenStreetMap) — gratuito, sem API key
async function geocodificar(endereco: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`
    const res = await fetch(url, { headers: { 'User-Agent': 'DoxyEsquina/1.0' } })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

// Distância por rota real via OSRM — gratuito, sem API key
async function osrmKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    if (data?.routes?.[0]?.distance) return data.routes[0].distance / 1000
  } catch {}
  return null
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Aceita: coordenadas diretas OU endereço texto OU KM manual
  const { lat_destino, lng_destino, endereco_destino, km_manual } = body

  const supabase = await createClient()
  const { data: config } = await supabase.from('configuracoes').select('*').single()

  // Se KM manual informado, calcular taxa direto
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
  let latOrigem = config?.lat_origem
  let lngOrigem = config?.lng_origem

  if ((!latOrigem || !lngOrigem) && config?.endereco_origem) {
    const geo = await geocodificar(config.endereco_origem)
    if (geo) { latOrigem = geo.lat; lngOrigem = geo.lng }
  }

  if (!latOrigem || !lngOrigem) {
    return NextResponse.json({ error: 'Configure o endereço de origem nas Configurações.' }, { status: 400 })
  }

  // Resolver lat/lng de destino
  let latDest = lat_destino
  let lngDest = lng_destino

  if ((!latDest || !lngDest) && endereco_destino) {
    const geo = await geocodificar(endereco_destino)
    if (geo) { latDest = geo.lat; lngDest = geo.lng }
  }

  if (!latDest || !lngDest) {
    return NextResponse.json({ error: 'Endereço de destino não encontrado.' }, { status: 400 })
  }

  // Calcular distância — tenta OSRM (rota real), fallback haversine (linha reta)
  let distanciaKm = await osrmKm(Number(latOrigem), Number(lngOrigem), Number(latDest), Number(lngDest))
  const fonte = distanciaKm !== null ? 'osrm' : 'haversine'
  if (distanciaKm === null) {
    distanciaKm = haversineKm(Number(latOrigem), Number(lngOrigem), Number(latDest), Number(lngDest))
    // +15% para aproximar rota real a partir da linha reta
    distanciaKm *= 1.15
  }

  distanciaKm = Math.round(distanciaKm * 100) / 100
  const foraCoberto = distanciaKm > Number(config?.km_maximo ?? 15)
  const taxa = Number(config?.taxa_minima ?? 5) +
    Math.max(0, distanciaKm - Number(config?.km_base ?? 2)) * Number(config?.valor_por_km ?? 2)

  return NextResponse.json({
    distancia_km: distanciaKm,
    taxa: Math.round(taxa * 100) / 100,
    fora_cobertura: foraCoberto,
    fonte,
  })
}
