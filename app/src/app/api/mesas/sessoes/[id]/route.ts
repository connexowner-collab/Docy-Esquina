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
  const sessaoId = Number(id)

  // Calcula o total somando todos os pedidos da sessão
  const { data: pedidosDaSessao } = await supabase
    .from('pedidos')
    .select('total')
    .eq('sessao_mesa_id', sessaoId)

  const totalSessao = (pedidosDaSessao ?? []).reduce((s, p) => s + Number(p.total), 0)

  // Passo 1 — atualiza status (crítico, deve sempre funcionar)
  const { error: errStatus } = await supabase
    .from('sessoes_mesa')
    .update({ status: 'fechada' })
    .eq('id', sessaoId)

  if (errStatus) {
    console.error('[fechar sessão] Erro ao atualizar status:', errStatus.message)
    return NextResponse.json({ error: errStatus.message }, { status: 500 })
  }

  // Passo 2 — atualiza dados complementares (pagamento, total, fechada_em)
  // Pode falhar se as colunas ainda não existirem na tabela (migração pendente)
  const { error: errDados } = await supabase
    .from('sessoes_mesa')
    .update({
      pagamento,
      observacoes: observacoes || null,
      fechada_em: new Date().toISOString(),
      total: totalSessao,
    })
    .eq('id', sessaoId)

  if (errDados) {
    // Mesa já está fechada (passo 1 funcionou); logamos mas não falhamos
    console.warn('[fechar sessão] Colunas extras não encontradas — rode a migração SQL:', errDados.message)
  }

  return NextResponse.json({ ok: true, total: totalSessao })
}
