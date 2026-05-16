import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calcularDistanciaParaLoja } from '@/lib/calcularDistancia'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clienteId, logradouro, numero, complemento, bairro, cep, referencia } = body

  if (!clienteId || !logradouro || !numero || !bairro) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const supabase = await createClient()

  // Busca coordenadas da loja
  const { data: config } = await supabase
    .from('configuracoes')
    .select('lat_origem, lng_origem, cidade_origem, uf_origem')
    .single()

  const latOrigem = config?.lat_origem ? Number(config.lat_origem) : null
  const lngOrigem = config?.lng_origem ? Number(config.lng_origem) : null

  // Calcula distância automaticamente
  let distancia_km: number | null = null
  if (latOrigem && lngOrigem) {
    distancia_km = await calcularDistanciaParaLoja({
      logradouro,
      numero,
      bairro,
      cep,
      cidade: config?.cidade_origem ?? undefined,
      uf: config?.uf_origem ?? undefined,
      latOrigem,
      lngOrigem,
    })
  }

  const { data, error } = await supabase
    .from('enderecos')
    .insert({
      cliente_id: clienteId,
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      complemento: complemento?.trim() || null,
      bairro: bairro.trim(),
      cep: cep?.replace(/\D/g, '') || null,
      referencia: referencia?.trim() || null,
      distancia_km,
    })
    .select('id, logradouro, numero, complemento, bairro, cep, distancia_km')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
