import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/mesas/sessoes — todas as sessões abertas com pedidos
export async function GET() {
  const supabase = await createClient()

  const { data: sessoes, error } = await supabase
    .from('sessoes_mesa')
    .select(`
      id, mesa_numero, nome_cliente, status, aberta_em,
      pedidos(
        id, numero_seq, subtotal, taxa_entrega, total, pagamento, observacoes, created_at, status_pedido,
        itens_pedido(id, nome_snapshot, quantidade, preco_snapshot, observacao_item)
      )
    `)
    .eq('status', 'aberta')
    .order('mesa_numero', { ascending: true })
    .order('aberta_em', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ sessoes: sessoes ?? [] })
}
