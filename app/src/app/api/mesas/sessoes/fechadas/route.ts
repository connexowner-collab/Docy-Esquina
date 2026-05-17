import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/mesas/sessoes/fechadas — todas as sessões fechadas
export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('sessoes_mesa')
    .select(`
      id, mesa_numero, nome_cliente, status, aberta_em, fechada_em, pagamento, total,
      pedidos(id, numero_seq, subtotal, total, pagamento, created_at, status_pedido,
        itens_pedido(id, nome_snapshot, quantidade, preco_snapshot))
    `)
    .eq('status', 'fechada')
    .order('fechada_em', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ sessoes: data ?? [] })
}
