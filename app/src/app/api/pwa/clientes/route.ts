import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const telefone = req.nextUrl.searchParams.get('telefone')
  if (!telefone) return NextResponse.json({ error: 'telefone obrigatório' }, { status: 400 })

  const supabase = await createClient()
  const digits = telefone.replace(/\D/g, '')

  let alt = digits
  if (digits.length === 11 && digits[2] === '9') {
    alt = digits.slice(0, 2) + digits.slice(3)
  } else if (digits.length === 10) {
    alt = digits.slice(0, 2) + '9' + digits.slice(2)
  }

  const { data, error } = await supabase
    .from('clientes')
    .select('id, nome, telefone, enderecos(*)')
    .or(alt !== digits ? `telefone.eq.${digits},telefone.eq.${alt}` : `telefone.eq.${digits}`)
    .single()

  if (error || !data) {
    return NextResponse.json({ encontrado: false }, { status: 404 })
  }

  return NextResponse.json({
    encontrado: true,
    clienteId: data.id,
    nome: data.nome,
    telefone: data.telefone,
    enderecos: data.enderecos,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nome, telefone, enderecos } = body

  if (!nome || !telefone) {
    return NextResponse.json({ error: 'Nome e telefone obrigatórios' }, { status: 400 })
  }

  const supabase = await createClient()
  const digits = telefone.replace(/\D/g, '')

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .insert({ nome: nome.trim(), telefone: digits, origem: 'pwa' })
    .select()
    .single()

  if (clienteError) {
    if (clienteError.code === '23505') {
      return NextResponse.json({ error: 'Telefone já cadastrado' }, { status: 409 })
    }
    return NextResponse.json({ error: clienteError.message }, { status: 500 })
  }

  let enderecoId: number | null = null
  if (enderecos && Array.isArray(enderecos) && enderecos.length > 0) {
    const mapped = enderecos.map((e: Record<string, unknown>) => ({
      cliente_id: cliente.id,
      logradouro: e.logradouro,
      numero: e.numero ?? 'S/N',
      complemento: e.complemento || null,
      bairro: e.bairro,
      referencia: e.referencia || null,
      cep: e.cep || null,
    }))
    const { data: endData } = await supabase
      .from('enderecos')
      .insert(mapped)
      .select('id')
    enderecoId = endData?.[0]?.id ?? null
  }

  return NextResponse.json({ clienteId: cliente.id, enderecoId }, { status: 201 })
}
