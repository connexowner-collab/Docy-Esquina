import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: categorias, error: catError } = await supabase
    .from('categorias')
    .select('id, nome, ordem')
    .order('ordem', { ascending: true })

  if (catError) return NextResponse.json({ error: catError.message }, { status: 500 })

  const { data: itens, error: itemError } = await supabase
    .from('itens_cardapio')
    .select('id, categoria_id, nome, descricao, preco')
    .eq('pwa_visivel', true)
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 })

  const result = (categorias ?? []).map(cat => ({
    ...cat,
    itens: (itens ?? []).filter(i => i.categoria_id === cat.id),
  })).filter(cat => cat.itens.length > 0)

  return NextResponse.json(result)
}
