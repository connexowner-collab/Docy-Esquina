import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Brasília = UTC-3: meia-noite BRT = 03:00 UTC do mesmo dia
function startOfDay(dateStr: string): string {
  return `${dateStr}T03:00:00.000Z`
}
function endOfDay(dateStr: string): string {
  const next = new Date(`${dateStr}T03:00:00.000Z`)
  next.setDate(next.getDate() + 1)
  next.setMilliseconds(next.getMilliseconds() - 1)
  return next.toISOString() // próximo dia 02:59:59.999Z = 23:59:59.999 BRT
}
function subtractOneDay(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}
function todayBrasilia(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const data = searchParams.get('data') ?? todayBrasilia()
  const ontem = subtractOneDay(data)

  const { data: pedidosHoje } = await supabase
    .from('pedidos')
    .select('total, taxa_entrega, pagamento')
    .eq('desconsiderado', false)
    .gte('created_at', startOfDay(data))
    .lte('created_at', endOfDay(data))

  const { data: pedidosOntem } = await supabase
    .from('pedidos')
    .select('total')
    .eq('desconsiderado', false)
    .gte('created_at', startOfDay(ontem))
    .lte('created_at', endOfDay(ontem))

  const hoje = pedidosHoje ?? []
  const ontemArr = pedidosOntem ?? []

  const totalPedidos = hoje.length
  const faturamentoTotal = hoje.reduce((s, p) => s + Number(p.total), 0)
  const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0
  const taxaMediaEntrega = totalPedidos > 0
    ? hoje.reduce((s, p) => s + Number(p.taxa_entrega), 0) / totalPedidos
    : 0

  const totalPedidosOntem = ontemArr.length
  const faturamentoOntem = ontemArr.reduce((s, p) => s + Number(p.total), 0)

  const porFormaPagamento = {
    pix: { quantidade: 0, total: 0 },
    dinheiro: { quantidade: 0, total: 0 },
    debito: { quantidade: 0, total: 0 },
    credito: { quantidade: 0, total: 0 },
  }
  for (const p of hoje) {
    const forma = p.pagamento as keyof typeof porFormaPagamento
    if (porFormaPagamento[forma]) {
      porFormaPagamento[forma].quantidade += 1
      porFormaPagamento[forma].total += Number(p.total)
    }
  }

  return NextResponse.json({
    totalPedidos,
    faturamentoTotal: Math.round(faturamentoTotal * 100) / 100,
    ticketMedio: Math.round(ticketMedio * 100) / 100,
    taxaMediaEntrega: Math.round(taxaMediaEntrega * 100) / 100,
    variacao: {
      pedidos: totalPedidosOntem > 0
        ? Math.round(((totalPedidos - totalPedidosOntem) / totalPedidosOntem) * 100)
        : null,
      faturamento: faturamentoOntem > 0
        ? Math.round(((faturamentoTotal - faturamentoOntem) / faturamentoOntem) * 100)
        : null,
    },
    porFormaPagamento,
  })
}
