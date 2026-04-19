import { NextRequest, NextResponse } from 'next/server'

async function tentarGeocodificar(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'DoxyEsquina/1.0 (delivery-management)' },
      signal: AbortSignal.timeout(8000),
    })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

async function tentarPorCep(cep: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const digits = cep.replace(/\D/g, '')
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${digits}&countrycodes=br&format=json&limit=1`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'DoxyEsquina/1.0 (delivery-management)' },
      signal: AbortSignal.timeout(8000),
    })
    const data = await res.json()
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

export async function POST(request: NextRequest) {
  const { logradouro, numero, bairro, cidade, uf, cep } = await request.json()

  // Tentativa 1 — endereço completo com cidade e UF
  if (logradouro && numero && cidade && uf) {
    const geo = await tentarGeocodificar(`${logradouro}, ${numero}, ${bairro ?? ''}, ${cidade}, ${uf}`)
    if (geo) return NextResponse.json({ ...geo, fonte: 'endereco_completo' })
  }

  // Tentativa 2 — só logradouro com cidade e UF
  if (logradouro && cidade && uf) {
    const geo = await tentarGeocodificar(`${logradouro}, ${cidade}, ${uf}`)
    if (geo) return NextResponse.json({ ...geo, fonte: 'logradouro_cidade' })
  }

  // Tentativa 3 — CEP
  if (cep) {
    const geo = await tentarPorCep(cep)
    if (geo) return NextResponse.json({ ...geo, fonte: 'cep' })
  }

  // Tentativa 4 — cidade + UF
  if (cidade && uf) {
    const geo = await tentarGeocodificar(`${cidade}, ${uf}, Brasil`)
    if (geo) return NextResponse.json({ ...geo, fonte: 'cidade' })
  }

  return NextResponse.json({ error: 'Não foi possível geocodificar o endereço.' }, { status: 400 })
}
