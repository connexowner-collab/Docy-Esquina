import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; endId: string }> }
) {
  const supabase = await createClient()
  const { endId } = await params
  const body = await request.json()
  const { logradouro, numero, complemento, bairro, referencia, distancia_km } = body

  const { data, error } = await supabase
    .from('enderecos')
    .update({
      logradouro,
      numero,
      complemento: complemento ?? null,
      bairro,
      referencia: referencia ?? null,
      distancia_km: distancia_km ? Number(distancia_km) : null,
    })
    .eq('id', endId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; endId: string }> }
) {
  const supabase = await createClient()
  const { endId } = await params

  const { error } = await supabase.from('enderecos').delete().eq('id', endId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
