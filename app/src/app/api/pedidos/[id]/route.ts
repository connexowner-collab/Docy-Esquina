import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      clientes(id, nome, telefone),
      enderecos(id, logradouro, numero, complemento, bairro, referencia),
      itens_pedido(*)
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}
