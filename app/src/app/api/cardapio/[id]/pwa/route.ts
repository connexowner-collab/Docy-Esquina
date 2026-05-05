import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const { pwa_visivel } = await request.json()

  if (typeof pwa_visivel !== 'boolean') {
    return NextResponse.json({ error: 'Campo pwa_visivel (boolean) é obrigatório' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('itens_cardapio')
    .update({ pwa_visivel })
    .eq('id', id)
    .select('*, categorias(id, nome, ordem)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
