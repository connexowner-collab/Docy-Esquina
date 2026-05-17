import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calcularDistanciaParaLoja } from '@/lib/calcularDistancia'

export async function GET(req: NextRequest) {
  const telefone = req.nextUrl.searchParams.get('telefone')
  if (!telefone) return NextResponse.json({ error: 'telefone obrigatório' }, { status: 400 })

  const supabase = await createClient()
  const digits = telefone.replace(/\D/g, '')

  let alt = digits
  if (digits.length === 11 && digits[2] === '9') {
    alt = digits.slice(0, 2) + digits.slice(3)
  } else if (digits.length === 10) {
    alt = digits.slice(0, 2) + '9' + digits.slice(2)
  }

  const { data, error } = await supabase
    .from('clientes')
    .select('id, nome, telefone, enderecos(id, logradouro, numero, complemento, bairro, cep, referencia, distancia_km, taxa_entrega)')
    .or(alt !== digits ? `telefone.eq.${digits},telefone.eq.${alt}` : `telefone.eq.${digits}`)
    .single()

  if (error || !data) {
    return NextResponse.json({ encontrado: false }, { status: 404 })
  }

  return NextResponse.json({
    encontrado: true,
    clienteId: data.id,
    nome: data.nome,
    telefone: data.telefone,
    enderecos: data.enderecos,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nome, telefone, enderecos } = body

  if (!nome || !telefone) {
    return NextResponse.json({ error: 'Nome e telefone obrigatórios' }, { status: 400 })
  }

  const supabase = await createClient()
  const digits = telefone.replace(/\D/g, '')

  // Busca coordenadas da loja para cálculo de distância.
  // Apenas lat/lng — cidade_origem NÃO deve ser repassada como cidade do cliente.
  const { data: config } = await supabase
    .from('configuracoes')
    .select('lat_origem, lng_origem')
    .single()

  const latOrigem = config?.lat_origem ? Number(config.lat_origem) : null
  const lngOrigem = config?.lng_origem ? Number(config.lng_origem) : null

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .insert({ nome: nome.trim(), telefone: digits, origem: 'pwa' })
    .select()
    .single()

  if (clienteError) {
    if (clienteError.code === '23505') {
      return NextResponse.json({ error: 'Telefone já cadastrado' }, { status: 409 })
    }
    return NextResponse.json({ error: clienteError.message }, { status: 500 })
  }

  let enderecoId: number | null = null
  let mapped: Array<{ cliente_id: number; logradouro: string; numero: string; complemento: string | null; bairro: string; referencia: string | null; cep: string | null; distancia_km: number | null; taxa_entrega: number | null; _fonte: string | null }> = []

  if (enderecos && Array.isArray(enderecos) && enderecos.length > 0) {
    mapped = await Promise.all(
      enderecos.map(async (e: Record<string, string>) => {
        let distancia_km: number | null = null

        let fonte_distancia: string | null = null
        if (latOrigem && lngOrigem) {
          const resultado = await calcularDistanciaParaLoja({
            logradouro: e.logradouro,
            numero: e.numero ?? 'S/N',
            bairro: e.bairro,
            cep: e.cep,
            latOrigem,
            lngOrigem,
          })
          if (resultado) {
            distancia_km = resultado.km
            fonte_distancia = `${resultado.fonte}/${resultado.fonteGeo}`
          }
        }

        // Calcula taxa para salvar no endereço
        let taxa_end: number | null = null
        if (distancia_km !== null) {
          const { data: cfgEnd } = await supabase.from('configuracoes').select('taxa_minima,km_base,valor_por_km').single()
          const { data: taxaBairroEnd } = e.bairro
            ? await supabase.from('taxas_bairro').select('taxa').eq('bairro', e.bairro).maybeSingle()
            : { data: null }
          if (taxaBairroEnd?.taxa != null) {
            taxa_end = Number(taxaBairroEnd.taxa)
          } else if (cfgEnd) {
            taxa_end = Number(cfgEnd.taxa_minima ?? 5) +
              Math.max(0, distancia_km - Number(cfgEnd.km_base ?? 2)) * Number(cfgEnd.valor_por_km ?? 2)
            taxa_end = Math.round(taxa_end * 100) / 100
          }
        }

        return {
          cliente_id: cliente.id,
          logradouro: e.logradouro,
          numero: e.numero ?? 'S/N',
          complemento: e.complemento || null,
          bairro: e.bairro,
          referencia: e.referencia || null,
          cep: e.cep || null,
          distancia_km,
          taxa_entrega: taxa_end,
          _fonte: fonte_distancia, // só para log, não vai para o banco
        }
      })
    )

    // Remove campo auxiliar _fonte antes de inserir no banco
    const mappedParaBanco = mapped.map(({ _fonte: _, ...rest }) => rest)
    const { data: endData } = await supabase
      .from('enderecos')
      .insert(mappedParaBanco)
      .select('id')

    enderecoId = endData?.[0]?.id ?? null
  }

  // Taxa já calculada e salva no endereço — só repassar ao frontend (popup)
  const distanciaKm = mapped?.[0]?.distancia_km ?? null
  const taxa = mapped?.[0]?.taxa_entrega ?? null
  const fonteDistancia = mapped?.[0]?._fonte ?? null
  return NextResponse.json({ clienteId: cliente.id, enderecoId, distancia_km: distanciaKm, taxa, fonte_distancia: fonteDistancia }, { status: 201 })
}
