import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const clienteId = req.nextUrl.searchParams.get('clienteId')
  if (!clienteId) return NextResponse.json({ error: 'clienteId obrigatório' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, numero_seq, status_pedido, total, created_at, tipo_entrega')
    .eq('cliente_id', Number(clienteId))
    .eq('origem', 'pwa')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ pedidos: data ?? [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clienteId, enderecoId, tipoEntrega, mesa, nome, itens, pagamento, troco, observacoes, taxaEntrega, subtotal, total } = body

  // Pedido de mesa (consumo local)
  const isMesa = tipoEntrega === 'local'
  const tipo = isMesa ? 'local' : tipoEntrega === 'retirada' ? 'retirada' : 'entrega'

  if (!itens?.length || !pagamento) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }
  if (!isMesa && !clienteId) {
    return NextResponse.json({ error: 'clienteId obrigatório para pedidos online' }, { status: 400 })
  }
  if (isMesa && (!mesa || !nome)) {
    return NextResponse.json({ error: 'Mesa e nome obrigatórios para pedido local' }, { status: 400 })
  }
  if (tipo === 'entrega' && !enderecoId) {
    return NextResponse.json({ error: 'Endereço obrigatório para entrega' }, { status: 400 })
  }

  // Admin client bypassa RLS — seguro pois esta rota roda apenas no servidor
  const supabase = createAdminClient()

  const { data: cfg } = await supabase.from('configuracoes').select('pwa_ativo').single()
  if (cfg && cfg.pwa_ativo === false) {
    return NextResponse.json({ error: 'Restaurante fechado no momento.' }, { status: 503 })
  }

  // Sessão de mesa: encontra sessão aberta pelo número da mesa (ignora nome)
  // Assim qualquer pessoa que sentar na mesa continua na mesma comanda aberta
  let sessaoMesaId: number | null = null
  if (isMesa) {
    const { data: sessaoExistente } = await supabase
      .from('sessoes_mesa')
      .select('id')
      .eq('mesa_numero', Number(mesa))
      .eq('status', 'aberta')
      .order('aberta_em', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (sessaoExistente) {
      sessaoMesaId = sessaoExistente.id
    } else {
      const { data: novaSessao, error: sessaoError } = await supabase
        .from('sessoes_mesa')
        .insert({ mesa_numero: Number(mesa), nome_cliente: nome, status: 'aberta' })
        .select('id')
        .single()
      if (sessaoError) console.error('[sessoes_mesa] Erro ao criar sessão:', sessaoError.message)
      if (novaSessao) sessaoMesaId = novaSessao.id
    }
  }

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      cliente_id: isMesa ? null : clienteId,
      endereco_id: tipo === 'entrega' ? enderecoId : null,
      mesa_numero: isMesa ? Number(mesa) : null,
      nome_local: isMesa ? nome : null,
      sessao_mesa_id: sessaoMesaId,
      subtotal: subtotal ?? 0,
      taxa_entrega: (tipo === 'retirada' || tipo === 'local') ? 0 : (taxaEntrega ?? 0),
      total: total ?? subtotal ?? 0,
      pagamento: pagamento ?? 'pendente',
      troco: troco || null,
      observacoes: observacoes || null,
      origem: isMesa ? 'mesa' : 'pwa',
      tipo_entrega: tipo,
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
