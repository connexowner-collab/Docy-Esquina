import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()
  const { logradouro, numero, complemento, bairro, referencia, lat, lng, distancia_km } = body

  if (!logradouro || !numero || !bairro) {
    return NextResponse.json({ error: 'logradouro, numero e bairro são obrigatórios' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('enderecos')
    .insert({
      cliente_id: Number(id),
      logradouro,
      numero,
      complemento: complemento ?? null,
      bairro,
      referencia: referencia ?? null,
      lat: lat ?? null,
      lng: lng ?? null,
      distancia_km: distancia_km ? Number(distancia_km) : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
