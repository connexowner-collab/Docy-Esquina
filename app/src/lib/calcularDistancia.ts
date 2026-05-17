// Utilitário compartilhado para geocodificação e cálculo de distância.
// Usado nas APIs de cadastro de cliente/endereço para salvar distancia_km automaticamente.

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY

// Busca cidade/UF a partir do CEP usando ViaCEP (gratuito, sem API key)
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

async function geocodificarNominatim(endereco: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1&countrycodes=br`
    const res = await fetch(url, { headers: { 'User-Agent': 'DocyEsquina/1.0' }, signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

async function distanciaGoogle(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number | null> {
  if (!GOOGLE_KEY) return null
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lng1}&destinations=${lat2},${lng2}&mode=driving&language=pt-BR&key=${GOOGLE_KEY}`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    const data = await res.json()
    const element = data.rows?.[0]?.elements?.[0]
    if (element?.status === 'OK' && element.distance?.value) {
      return element.distance.value / 1000
    }
  } catch {}
  return null
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function osrmKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    if (data?.routes?.[0]?.distance) return data.routes[0].distance / 1000
  } catch {}
  return null
}

// Geocodifica endereço: Google → Nominatim
async function geocodificar(endereco: string): Promise<{ lat: number; lng: number } | null> {
  return (await geocodificarGoogle(endereco)) ?? (await geocodificarNominatim(endereco))
}

// Calcula distância de rota: Google → OSRM → Haversine+15%
async function calcularKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number> {
  const google = await distanciaGoogle(lat1, lng1, lat2, lng2)
  if (google !== null) return Math.round(google * 100) / 100

  const osrm = await osrmKm(lat1, lng1, lat2, lng2)
  if (osrm !== null) return Math.round(osrm * 100) / 100

  return Math.round(haversineKm(lat1, lng1, lat2, lng2) * 1.15 * 100) / 100
}

/**
 * Dado um endereço de destino (logradouro, bairro, CEP, cidade)
 * e as coordenadas de origem da loja, retorna a distância em km.
 * Retorna null se não for possível geocodificar o destino.
 */
export async function calcularDistanciaParaLoja(params: {
  logradouro?: string
  numero?: string
  bairro?: string
  cep?: string
  cidade?: string  // cidade do CLIENTE — nunca passe a cidade da loja aqui
  uf?: string
  latOrigem: number
  lngOrigem: number
}): Promise<number | null> {
  const { logradouro, numero, bairro, cep, latOrigem, lngOrigem } = params
  let { cidade, uf } = params

  // Se cidade não foi informada mas há CEP, busca cidade real via ViaCEP
  // Isso evita o bug de passar a cidade da loja como cidade do cliente
  if (!cidade && cep) {
    const cepData = await cidadePorCEP(cep)
    if (cepData) { cidade = cepData.cidade; uf = cepData.uf }
  }

  // Monta string de endereço completo do CLIENTE
  const partes = [
    logradouro && numero ? `${logradouro}, ${numero}` : logradouro,
    bairro,
    cidade,
    uf,
    'Brasil',
  ].filter(Boolean)

  let geo: { lat: number; lng: number } | null = null

  // 1. Tenta com endereço completo (rua + bairro + cidade via ViaCEP)
  if (partes.length > 1) {
    geo = await geocodificar(partes.join(', '))
  }

  // 2. Fallback: geocodifica só pelo CEP (posição aproximada do logradouro)
  if (!geo && cep) {
    const digits = cep.replace(/\D/g, '')
    geo = await geocodificar(`${digits}, Brasil`)
  }

  if (!geo) return null

  return calcularKm(latOrigem, lngOrigem, geo.lat, geo.lng)
}
