import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/mesas/sessoes/fechadas — sessões fechadas hoje
export async function GET() {
  const supabase = createAdminClient()

  const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })

  const { data, error } = await supabase
    .from('sessoes_mesa')
    .select(`
      id, mesa_numero, nome_cliente, status, aberta_em, fechada_em, pagamento, total,
      pedidos(id, numero_seq, subtotal, total, pagamento, created_at, status_pedido,
        itens_pedido(id, nome_snapshot, quantidade, preco_snapshot))
    `)
    .eq('status', 'fechada')
    .gte('fechada_em', `${hoje}T03:00:00.000Z`)
    .order('fechada_em', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ sessoes: data ?? [] })
}
