import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const nome = searchParams.get('nome')
  const telefone = searchParams.get('telefone')

  let query = supabase
    .from('clientes')
    .select('*, enderecos(*)')
    .order('nome', { ascending: true })

  if (nome) query = query.ilike('nome', `%${nome}%`)
  if (telefone) {
    const digits = telefone.replace(/\D/g, '')
    // Gera variante com/sem o dígito 9 após o DDD
    let alt = digits
    if (digits.length === 11 && digits[2] === '9') {
      alt = digits.slice(0, 2) + digits.slice(3) // remove o 9
    } else if (digits.length === 10) {
      alt = digits.slice(0, 2) + '9' + digits.slice(2) // adiciona o 9
    }
    query = alt !== digits
      ? query.or(`telefone.ilike.%${digits}%,telefone.ilike.%${alt}%`)
      : query.ilike('telefone', `%${digits}%`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { nome, telefone, enderecos } = body

  if (!nome || !telefone) {
    return NextResponse.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
  }

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .insert({ nome, telefone: telefone.replace(/\D/g, '') })
    .select()
    .single()

  if (clienteError) {
    if (clienteError.code === '23505') {
      return NextResponse.json({ error: 'Telefone já cadastrado' }, { status: 409 })
    }
    return NextResponse.json({ error: clienteError.message }, { status: 500 })
  }

  if (enderecos && Array.isArray(enderecos) && enderecos.length > 0) {
    const enderecosMapped = enderecos.map((e: Record<string, unknown>) => ({
      cliente_id: cliente.id,
      cep: e.cep || null,
      logradouro: e.logradouro,
      numero: e.numero,
      complemento: e.complemento || null,
      bairro: e.bairro,
      referencia: e.referencia || null,
      distancia_km: e.distancia_km ? Number(e.distancia_km) : null,
    }))
    const { error: enderecoError } = await supabase.from('enderecos').insert(enderecosMapped)
    if (enderecoError) return NextResponse.json({ error: enderecoError.message }, { status: 500 })
  }

  const { data: clienteCompleto } = await supabase
    .from('clientes')
    .select('*, enderecos(*)')
    .eq('id', cliente.id)
    .single()

  return NextResponse.json(clienteCompleto, { status: 201 })
}
