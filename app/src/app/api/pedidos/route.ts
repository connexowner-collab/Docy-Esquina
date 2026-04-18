import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const dataInicio = searchParams.get('dataInicio')
  const dataFim = searchParams.get('dataFim')
  const clienteNome = searchParams.get('clienteNome')
  const telefone = searchParams.get('telefone')
  const pagamento = searchParams.get('pagamento')
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') ?? 20)))

  let query = supabase
    .from('pedidos')
    .select(`
      *,
      clientes(id, nome, telefone),
      enderecos(id, logradouro, numero, bairro, referencia),
      itens_pedido(*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (dataInicio) query = query.gte('created_at', dataInicio)
  if (dataFim) {
    const fim = new Date(dataFim)
    fim.setDate(fim.getDate() + 1)
    query = query.lt('created_at', fim.toISOString())
  }
  if (pagamento) query = query.eq('pagamento', pagamento)
  if (clienteNome || telefone) {
    const { data: clientesFiltro } = await supabase
      .from('clientes')
      .select('id')
      .or([
        clienteNome ? `nome.ilike.%${clienteNome}%` : null,
        telefone ? `telefone.ilike.%${telefone.replace(/\D/g, '')}%` : null,
      ].filter(Boolean).join(','))

    const ids = (clientesFiltro ?? []).map((c: { id: number }) => c.id)
    if (ids.length === 0) {
      return NextResponse.json({ data: [], total: 0, page, pageSize })
    }
    query = query.in('cliente_id', ids)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, pageSize })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const {
    cliente_id,
    endereco_id,
    distancia_km,
    taxa_entrega,
    taxa_manual,
    subtotal,
    total,
    pagamento,
    troco,
    observacoes,
    itens,
  } = body

  if (!cliente_id || !endereco_id || !subtotal || !total || !pagamento || !itens?.length) {
    return NextResponse.json({ error: 'Dados incompletos para criar pedido' }, { status: 400 })
  }

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      cliente_id,
      endereco_id,
      distancia_km: distancia_km ?? 0,
      taxa_entrega: taxa_entrega ?? 0,
      taxa_manual: taxa_manual ?? null,
      subtotal,
      total,
      pagamento,
      troco: troco ?? null,
      observacoes: observacoes ?? null,
    })
    .select()
    .single()

  if (pedidoError) return NextResponse.json({ error: pedidoError.message }, { status: 500 })

  const itensMapped = (itens as Array<{
    item_cardapio_id: number
    nome_snapshot: string
    preco_snapshot: number
    quantidade: number
    subtotal: number
    observacao?: string | null
  }>).map(item => ({
    pedido_id: pedido.id,
    item_cardapio_id: item.item_cardapio_id,
    nome_snapshot: item.nome_snapshot,
    preco_snapshot: item.preco_snapshot,
    quantidade: item.quantidade,
    subtotal: item.subtotal,
    observacao: item.observacao ?? null,
  }))

  const { error: itensError } = await supabase.from('itens_pedido').insert(itensMapped)
  if (itensError) return NextResponse.json({ error: itensError.message }, { status: 500 })

  const { data: pedidoCompleto } = await supabase
    .from('pedidos')
    .select(`
      *,
      clientes(id, nome, telefone),
      enderecos(id, logradouro, numero, bairro, referencia),
      itens_pedido(*)
    `)
    .eq('id', pedido.id)
    .single()

  return NextResponse.json(pedidoCompleto, { status: 201 })
}
