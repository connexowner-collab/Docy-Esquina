import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clienteId, enderecoId, itens, pagamento, troco, observacoes, taxaEntrega, subtotal, total } = body

  if (!clienteId || !enderecoId || !itens?.length || !pagamento) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      cliente_id: clienteId,
      endereco_id: enderecoId,
      subtotal: subtotal ?? 0,
      taxa_entrega: taxaEntrega ?? 0,
      total: total ?? subtotal ?? 0,
      pagamento,
      troco: troco || null,
      observacoes: observacoes || null,
      origem: 'pwa',
      status_pedido: 'pendente',
      status_validacao: 'pendente',
    })
    .select('id, numero_seq')
    .single()

  if (pedidoError) return NextResponse.json({ error: pedidoError.message }, { status: 500 })

  const itensMapped = itens.map((i: Record<string, unknown>) => ({
    pedido_id: pedido.id,
    item_cardapio_id: i.itemId,
    nome_snapshot: i.nome,
    preco_snapshot: i.preco,
    quantidade: i.qty,
    subtotal: Number(i.preco) * Number(i.qty),
    observacao_item: i.observacao || null,
  }))

  const { error: itensError } = await supabase.from('itens_pedido').insert(itensMapped)
  if (itensError) return NextResponse.json({ error: itensError.message }, { status: 500 })

  return NextResponse.json({ pedidoId: pedido.id, numeroPedido: pedido.numero_seq }, { status: 201 })
}
