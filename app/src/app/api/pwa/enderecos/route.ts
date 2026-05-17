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

  // Busca coordenadas da loja (apenas lat/lng — cidade da loja NÃO deve ser
  // repassada como cidade do cliente, pois causaria geocodificação errada)
  const { data: config } = await supabase
    .from('configuracoes')
    .select('lat_origem, lng_origem')
    .single()

  const latOrigem = config?.lat_origem ? Number(config.lat_origem) : null
  const lngOrigem = config?.lng_origem ? Number(config.lng_origem) : null

  // Calcula distância automaticamente.
  // A cidade do cliente é obtida via ViaCEP a partir do CEP informado,
  // garantindo que o geocode aponte para a cidade correta do cliente.
  let distancia_km: number | null = null
  if (latOrigem && lngOrigem) {
    distancia_km = await calcularDistanciaParaLoja({
      logradouro,
      numero,
      bairro,
      cep,
      // cidade e uf são resolvidos internamente via ViaCEP quando cep está presente
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

  // Calcula taxa para retornar ao frontend (popup)
  let taxa: number | null = null
  if (distancia_km !== null) {
    const { data: taxaBairro } = await supabase.from('taxas_bairro').select('taxa').eq('bairro', bairro.trim()).maybeSingle()
    if (taxaBairro?.taxa != null) {
      taxa = Number(taxaBairro.taxa)
    } else {
      const { data: cfg } = await supabase.from('configuracoes').select('taxa_minima,km_base,valor_por_km').single()
      if (cfg) {
        taxa = Number(cfg.taxa_minima ?? 5) +
          Math.max(0, distancia_km - Number(cfg.km_base ?? 2)) * Number(cfg.valor_por_km ?? 2)
        taxa = Math.round(taxa * 100) / 100
      }
    }
  }

  return NextResponse.json({ ...data, taxa }, { status: 201 })
}
