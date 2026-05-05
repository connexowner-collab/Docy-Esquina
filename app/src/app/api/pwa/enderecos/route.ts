import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clienteId, logradouro, numero, complemento, bairro, cep } = body

  if (!clienteId || !logradouro || !numero || !bairro) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('enderecos')
    .insert({
      cliente_id: clienteId,
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      complemento: complemento?.trim() || null,
      bairro: bairro.trim(),
      cep: cep?.replace(/\D/g, '') || null,
    })
    .select('id, logradouro, numero, complemento, bairro, cep')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
