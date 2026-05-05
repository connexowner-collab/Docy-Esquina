import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status } = await req.json()

  if (!['em_entrega', 'entregue'].includes(status)) {
    return NextResponse.json({ error: 'status inválido' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('pedidos')
    .update({ status_pedido: status, status_updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
