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

  const { data: sessao } = await supabase
    .from('sessoes_mesa')
    .select(`
      id, mesa_numero, nome_cliente, status, aberta_em,
      pedidos(
        id, numero_seq, subtotal, total, status_pedido, status_validacao,
        motivo_recusa, created_at, observacoes,
        itens_pedido(id, nome_snapshot, quantidade, preco_snapshot, observacao_item)
      )
    `)
    .eq('mesa_numero', Number(mesa))
    .eq('status', 'aberta')
    .order('aberta_em', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ sessao: sessao ?? null })
}
