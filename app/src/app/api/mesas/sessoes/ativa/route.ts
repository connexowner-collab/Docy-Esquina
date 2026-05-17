import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/mesas/sessoes/ativa?mesa=X
// Retorna qualquer sessão aberta para a mesa (independente do nome)
export async function GET(req: NextRequest) {
  const mesa = req.nextUrl.searchParams.get('mesa')

  if (!mesa) {
    return NextResponse.json({ sessao: null })
  }

  const supabase = createAdminClient()

  // Passo 1: busca a sessão aberta (sem join para evitar falhas)
  const { data: sessao, error } = await supabase
    .from('sessoes_mesa')
    .select('id, mesa_numero, nome_cliente, status, aberta_em')
    .eq('mesa_numero', Number(mesa))
    .eq('status', 'aberta')
    .order('aberta_em', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[sessoes/ativa] Erro ao buscar sessão:', error.message)
    return NextResponse.json({ sessao: null, erro: error.message })
  }

  if (!sessao) return NextResponse.json({ sessao: null })

  // Passo 2: busca os pedidos da sessão separadamente
  const { data: pedidos, error: pedidosError } = await supabase
    .from('pedidos')
    .select(`
      id, numero_seq, subtotal, total, status_pedido, status_validacao,
      motivo_recusa, created_at, observacoes,
      itens_pedido(id, nome_snapshot, quantidade, preco_snapshot, observacao_item)
    `)
    .eq('sessao_mesa_id', sessao.id)
    .order('created_at', { ascending: true })

  if (pedidosError) console.error('[sessoes/ativa] Erro ao buscar pedidos:', pedidosError.message)

  return NextResponse.json({ sessao: { ...sessao, pedidos: pedidos ?? [] } })
}
