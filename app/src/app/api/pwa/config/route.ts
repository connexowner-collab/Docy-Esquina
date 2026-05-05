import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('configuracoes')
    .select('nome_estabelecimento, telefone, taxa_minima, km_base, valor_por_km, km_maximo, pwa_ativo, mensagem_fechado')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    aberto: data.pwa_ativo ?? true,
    nomeEstabelecimento: data.nome_estabelecimento,
    telefone: data.telefone,
    mensagemFechado: data.mensagem_fechado ?? 'Estamos fechados no momento',
    taxaMinima: data.taxa_minima,
    kmBase: data.km_base,
    valorPorKm: data.valor_por_km,
    kmMaximo: data.km_maximo,
  })
}
