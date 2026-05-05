import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { acao, motivoRecusa } = await req.json()

  if (!['aceitar', 'recusar'].includes(acao)) {
    return NextResponse.json({ error: 'acao inválida' }, { status: 400 })
  }

  const supabase = await createClient()

  const updates = acao === 'aceitar'
    ? { status_pedido: 'em_preparo', status_validacao: 'aceito', aceito_em: new Date().toISOString(), status_updated_at: new Date().toISOString() }
    : { status_pedido: 'recusado', status_validacao: 'recusado', motivo_recusa: motivoRecusa || null, status_updated_at: new Date().toISOString() }

  const { error } = await supabase.from('pedidos').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
