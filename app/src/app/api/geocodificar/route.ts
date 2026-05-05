import { NextRequest, NextResponse } from 'next/server'

const HEADERS = { 'User-Agent': 'DoxyEsquina/1.0 (delivery-management)' }
const TIMEOUT = 5000

async function buscar(url: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT) })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

export async function POST(request: NextRequest) {
  const { logradouro, numero, bairro, cidade, uf, cep } = await request.json()

  const base = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br'

  // 1 — busca estruturada: rua + número + cidade + estado (mais precisa)
  if (logradouro && cidade && uf) {
    const street = [logradouro, numero].filter(Boolean).join(' ')
    const url = `${base}&street=${encodeURIComponent(street)}&city=${encodeURIComponent(cidade)}&state=${encodeURIComponent(uf)}&country=Brazil`
    const geo = await buscar(url)
    if (geo) return NextResponse.json({ ...geo, fonte: 'estruturado' })
  }

  // 2 — sem número (só rua + cidade)
  if (logradouro && cidade && uf) {
    const url = `${base}&street=${encodeURIComponent(logradouro)}&city=${encodeURIComponent(cidade)}&state=${encodeURIComponent(uf)}&country=Brazil`
    const geo = await buscar(url)
    if (geo) return NextResponse.json({ ...geo, fonte: 'rua_cidade' })
  }

  // 3 — bairro + cidade + estado
  if (bairro && cidade && uf) {
    const url = `${base}&q=${encodeURIComponent(`${bairro}, ${cidade}, ${uf}, Brasil`)}`
    const geo = await buscar(url)
    if (geo) return NextResponse.json({ ...geo, fonte: 'bairro_cidade' })
  }

  // 4 — CEP (postal code)
  if (cep) {
    const digits = String(cep).replace(/\D/g, '')
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${digits}&countrycodes=br&format=json&limit=1`
    const geo = await buscar(url)
    if (geo) return NextResponse.json({ ...geo, fonte: 'cep' })
  }

  // 5 — centroide da cidade (último recurso — distância aproximada)
  if (cidade && uf) {
    const url = `${base}&q=${encodeURIComponent(`${cidade}, ${uf}, Brasil`)}`
    const geo = await buscar(url)
    if (geo) return NextResponse.json({ ...geo, fonte: 'cidade', aproximado: true })
  }

  return NextResponse.json({ error: 'Endereço não encontrado.' }, { status: 400 })
}
