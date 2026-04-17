import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const categoriaId = searchParams.get('categoriaId')
  const ativoParam = searchParams.get('ativo')

  let query = supabase
    .from('itens_cardapio')
    .select('*, categorias(id, nome, ordem)')
    .order('nome', { ascending: true })

  if (categoriaId) query = query.eq('categoria_id', categoriaId)
  if (ativoParam !== null) query = query.eq('ativo', ativoParam === 'true')

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { categoria_id, nome, descricao, preco } = body

  if (!categoria_id || !nome || preco === undefined) {
    return NextResponse.json({ error: 'categoria_id, nome e preco são obrigatórios' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('itens_cardapio')
    .insert({ categoria_id, nome, descricao: descricao ?? null, preco, ativo: true })
    .select('*, categorias(id, nome, ordem)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
