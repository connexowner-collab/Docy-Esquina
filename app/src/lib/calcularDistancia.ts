// Utilitário compartilhado para geocodificação e cálculo de distância.
// Usado nas APIs de cadastro de cliente/endereço para salvar distancia_km automaticamente.
//
// Quando GOOGLE_MAPS_API_KEY está configurada:
//   → Geocodificação: apenas Google Geocoding API
//   → Distância: apenas Google Distance Matrix API
//   (sem Nominatim, sem OSRM, sem Haversine nesse caminho)
//
// Quando a key NÃO está configurada (fallback sem custo):
//   → Geocodificação: Nominatim estruturado → Nominatim livre → CEP
//   → Distância: OSRM → Haversine × 1.30

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY

// ---------------------------------------------------------------------------
// ViaCEP — obtém cidade/UF a partir do CEP (gratuito, sem API key)
// ---------------------------------------------------------------------------
async function cidadePorCEP(cep: string): Promise<{ cidade: string; uf: string } | null> {
  try {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) return null
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: AbortSignal.timeout(4000) })
    const data = await res.json()
    if (data && !data.erro && data.localidade && data.uf) {
      return { cidade: data.localidade, uf: data.uf }
    }
  } catch {}
  return null
}

// ---------------------------------------------------------------------------
// Google Geocoding API — endereço → coordenadas
// ---------------------------------------------------------------------------
async function geocodificarGoogle(endereco: string): Promise<{ lat: number; lng: number } | null> {
  if (!GOOGLE_KEY) return null
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&region=br&language=pt-BR&key=${GOOGLE_KEY}`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data.status === 'OK' && data.results?.[0]) {
      const { lat, lng } = data.results[0].geometry.location
      console.log(`[distancia] Google Geocoding OK: "${endereco}" → lat=${lat}, lng=${lng}`)
      return { lat, lng }
    }
    console.warn(`[distancia] Google Geocoding falhou: status=${data.status}, erro=${data.error_message ?? ''}`)
  } catch (e) {
    console.warn(`[distancia] Google Geocoding exception: ${e}`)
  }
  return null
}

// ---------------------------------------------------------------------------
// Google Distance Matrix API — distância de rota entre dois pontos
// ---------------------------------------------------------------------------
async function distanciaGoogleMatrix(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): Promise<number | null> {
  if (!GOOGLE_KEY) return null
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lng1}&destinations=${lat2},${lng2}&mode=driving&language=pt-BR&key=${GOOGLE_KEY}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    const element = data.rows?.[0]?.elements?.[0]
    if (element?.status === 'OK' && element.distance?.value) {
      const km = Math.round((element.distance.value / 1000) * 100) / 100
      console.log(`[distancia] Google Distance Matrix OK: ${km} km (${element.duration?.text ?? ''})`)
      return km
    }
    console.warn(`[distancia] Google Distance Matrix falhou: status=${element?.status}, rows=${JSON.stringify(data.rows)}`)
  } catch (e) {
    console.warn(`[distancia] Google Distance Matrix exception: ${e}`)
  }
  return null
}

// ---------------------------------------------------------------------------
// Nominatim — geocodificação estruturada (sem key, fallback)
// ---------------------------------------------------------------------------
async function geocodificarNominatimEstruturado(params: {
  logradouro: string
  numero?: string
  cidade?: string
  uf?: string
}): Promise<{ lat: number; lng: number } | null> {
  try {
    const p = new URLSearchParams({ format: 'json', limit: '1', countrycodes: 'br' })
    const street = params.numero ? `${params.numero} ${params.logradouro}` : params.logradouro
    p.set('street', street)
    if (params.cidade) p.set('city', params.cidade)
    if (params.uf) p.set('state', params.uf)
    const url = `https://nominatim.openstreetmap.org/search?${p.toString()}`
    const res = await fetch(url, { headers: { 'User-Agent': 'DocyEsquina/1.0' }, signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data?.[0]) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      console.log(`[distancia] Nominatim estruturado OK: lat=${lat}, lng=${lng}`)
      return { lat, lng }
    }
  } catch {}
  return null
}

// ---------------------------------------------------------------------------
// Nominatim — geocodificação livre (fallback)
// ---------------------------------------------------------------------------
async function geocodificarNominatimLivre(endereco: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1&countrycodes=br`
    const res = await fetch(url, { headers: { 'User-Agent': 'DocyEsquina/1.0' }, signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data?.[0]) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      console.log(`[distancia] Nominatim livre OK: lat=${lat}, lng=${lng}`)
      return { lat, lng }
    }
  } catch {}
  return null
}

// ---------------------------------------------------------------------------
// OSRM — distância de rota (fallback sem custo)
// ---------------------------------------------------------------------------
async function osrmKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    if (data?.routes?.[0]?.distance) {
      const km = Math.round((data.routes[0].distance / 1000) * 100) / 100
      console.log(`[distancia] OSRM OK: ${km} km`)
      return km
    }
  } catch {}
  return null
}

// ---------------------------------------------------------------------------
// Haversine — linha reta com margem (último recurso)
// ---------------------------------------------------------------------------
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ---------------------------------------------------------------------------
// Tipos públicos
// ---------------------------------------------------------------------------
export type ResultadoDistancia = {
  km: number
  fonte: string         // 'google-matrix' | 'osrm' | 'haversine'
  fonteGeo: string      // 'google' | 'nominatim-estruturado' | 'nominatim-livre' | 'cep'
  latDest: number
  lngDest: number
}

// ---------------------------------------------------------------------------
// Função principal
// ---------------------------------------------------------------------------
/**
 * Dado um endereço de destino e as coordenadas de origem da loja,
 * retorna a distância em km + metadados de rastreabilidade.
 *
 * Com GOOGLE_MAPS_API_KEY configurada:
 *   → usa Google Geocoding + Google Distance Matrix (mais preciso)
 *
 * Sem key:
 *   → Nominatim (geocodificação) + OSRM/Haversine (rota)
 */
export async function calcularDistanciaParaLoja(params: {
  logradouro?: string
  numero?: string
  bairro?: string
  cep?: string
  cidade?: string
  uf?: string
  latOrigem: number
  lngOrigem: number
}): Promise<ResultadoDistancia | null> {
  const { logradouro, numero, bairro, cep, latOrigem, lngOrigem } = params
  let { cidade, uf } = params

  // 1. Resolver cidade/UF via ViaCEP quando não informado
  if (!cidade && cep) {
    const cepData = await cidadePorCEP(cep)
    if (cepData) {
      cidade = cepData.cidade
      uf = cepData.uf
      console.log(`[distancia] ViaCEP: CEP ${cep} → ${cidade}, ${uf}`)
    } else {
      console.warn(`[distancia] ViaCEP falhou para CEP ${cep}`)
    }
  }

  // Montar string de endereço completo para APIs de texto livre
  const partesEndereco = [
    logradouro && numero ? `${logradouro}, ${numero}` : logradouro,
    bairro,
    cidade,
    uf,
    'Brasil',
  ].filter(Boolean)
  const enderecoCompleto = partesEndereco.join(', ')

  // =========================================================================
  // CAMINHO A: Google completo (Geocoding + Distance Matrix)
  // =========================================================================
  if (GOOGLE_KEY) {
    console.log(`[distancia] Usando Google APIs para: "${enderecoCompleto}"`)

    const geo = await geocodificarGoogle(enderecoCompleto)
    if (!geo) {
      console.warn('[distancia] Google Geocoding não retornou coords — abortando (verifique a API key e Geocoding API)')
      return null
    }

    const km = await distanciaGoogleMatrix(latOrigem, lngOrigem, geo.lat, geo.lng)
    if (km === null) {
      console.warn('[distancia] Google Distance Matrix falhou — verifique se a Distance Matrix API está habilitada no Google Cloud Console')
      return null
    }

    return { km, fonte: 'google-matrix', fonteGeo: 'google', latDest: geo.lat, lngDest: geo.lng }
  }

  // =========================================================================
  // CAMINHO B: Fallback sem Google (Nominatim + OSRM/Haversine)
  // =========================================================================
  console.warn('[distancia] GOOGLE_MAPS_API_KEY não configurada — usando fallback Nominatim/OSRM')

  let geo: { lat: number; lng: number } | null = null
  let fonteGeo = 'desconhecido'

  // 2a. Nominatim estruturado (mais preciso quando temos cidade)
  if (logradouro && cidade) {
    geo = await geocodificarNominatimEstruturado({ logradouro, numero, cidade, uf })
    if (geo) fonteGeo = 'nominatim-estruturado'
  }

  // 2b. Nominatim livre
  if (!geo && partesEndereco.length > 1) {
    geo = await geocodificarNominatimLivre(enderecoCompleto)
    if (geo) fonteGeo = 'nominatim-livre'
  }

  // 2c. Fallback por CEP
  if (!geo && cep) {
    const digits = cep.replace(/\D/g, '')
    geo = await geocodificarNominatimLivre(`${digits}, Brasil`)
    if (geo) fonteGeo = 'cep'
  }

  if (!geo) {
    console.warn('[distancia] Não foi possível geocodificar o destino (sem Google key)')
    return null
  }

  console.log(`[distancia] Coords destino (${fonteGeo}): lat=${geo.lat}, lng=${geo.lng}`)

  // 3. Distância via OSRM
  const osrm = await osrmKm(latOrigem, lngOrigem, geo.lat, geo.lng)
  if (osrm !== null) {
    return { km: osrm, fonte: 'osrm', fonteGeo, latDest: geo.lat, lngDest: geo.lng }
  }

  // 4. Haversine × 1.30 (último recurso)
  const hav = Math.round(haversineKm(latOrigem, lngOrigem, geo.lat, geo.lng) * 1.30 * 100) / 100
  console.warn(`[distancia] Usando Haversine como último recurso: ${hav} km`)
  return { km: hav, fonte: 'haversine', fonteGeo, latDest: geo.lat, lngDest: geo.lng }
}
