import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('taxas_bairro').select('*').order('bairro')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { bairro, taxa } = await request.json()
  if (!bairro || taxa == null) return NextResponse.json({ error: 'bairro e taxa são obrigatórios' }, { status: 400 })
  const { data, error } = await supabase
    .from('taxas_bairro')
    .upsert({ bairro: bairro.trim(), taxa: Number(taxa) }, { onConflict: 'bairro' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const bairro = searchParams.get('bairro')
  if (!bairro) return NextResponse.json({ error: 'bairro obrigatório' }, { status: 400 })
  const { error } = await supabase.from('taxas_bairro').delete().eq('bairro', bairro)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
