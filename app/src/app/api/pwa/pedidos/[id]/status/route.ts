import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id, numero_seq, status_pedido, status_validacao,
      motivo_recusa, status_updated_at, created_at,
      subtotal, taxa_entrega, total, pagamento, troco,
      clientes(nome, telefone),
      enderecos(logradouro, numero, bairro),
      itens_pedido(nome_snapshot, preco_snapshot, quantidade, observacao_item)
    `)
    .eq('id', id)
    .eq('origem', 'pwa')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

  return NextResponse.json(data)
}
