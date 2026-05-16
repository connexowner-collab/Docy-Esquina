import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/mesas/sessoes/[id] — fechar sessão de mesa
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { pagamento, observacoes } = body

  if (!pagamento) {
    return NextResponse.json({ error: 'Forma de pagamento obrigatória' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('sessoes_mesa')
    .update({
      status: 'fechada',
      pagamento,
      observacoes: observacoes || null,
      fechada_em: new Date().toISOString(),
    })
    .eq('id', Number(id))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
