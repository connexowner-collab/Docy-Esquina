import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// PATCH /api/mesas/sessoes/[id] — fechar sessão de mesa
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { pagamento, observacoes } = body

  if (!pagamento) {
    return NextResponse.json({ error: 'Forma de pagamento obrigatória' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Calcula o total da sessão somando os pedidos aceitos
  const { data: sessao } = await supabase
    .from('sessoes_mesa')
    .select('id, pedidos(total)')
    .eq('id', Number(id))
    .single()

  const totalSessao = (sessao?.pedidos as { total: number }[] | null)
    ?.reduce((s, p) => s + Number(p.total), 0) ?? 0

  const { error } = await supabase
    .from('sessoes_mesa')
    .update({
      status: 'fechada',
      pagamento,
      observacoes: observacoes || null,
      fechada_em: new Date().toISOString(),
      total: totalSessao,
    })
    .eq('id', Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
