import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function todayBrasilia(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}
function startOfDay(d: string) { return `${d}T00:00:00.000Z` }
function endOfDay(d: string)   { return `${d}T23:59:59.999Z` }
function startOfMonth(d: string) { return `${d.slice(0, 7)}-01T00:00:00.000Z` }
function endOfMonth(d: string) {
  const [y, m] = d.split('-').map(Number)
  const last = new Date(y, m, 0).getDate()
  return `${d.slice(0, 7)}-${String(last).padStart(2, '0')}T23:59:59.999Z`
}
function startOfYear(d: string) { return `${d.slice(0, 4)}-01-01T00:00:00.000Z` }
function endOfYear(d: string)   { return `${d.slice(0, 4)}-12-31T23:59:59.999Z` }

function buildPagamento() {
  return { pix: { quantidade: 0, total: 0 }, dinheiro: { quantidade: 0, total: 0 }, debito: { quantidade: 0, total: 0 }, credito: { quantidade: 0, total: 0 } }
}
function processPedidos(pedidos: { total: string | number; taxa_entrega: string | number; pagamento: string }[]) {
  const pag = buildPagamento()
  let faturamento = 0, taxa = 0
  for (const p of pedidos) {
    faturamento += Number(p.total)
    taxa += Number(p.taxa_entrega)
    const k = p.pagamento as keyof typeof pag
    if (pag[k]) { pag[k].quantidade++; pag[k].total += Number(p.total) }
  }
  return { count: pedidos.length, faturamento, taxa, pag }
}
function round2(v: number) { return Math.round(v * 100) / 100 }

export async function GET() {
  const supabase = await createClient()
  const hoje = todayBrasilia()

  const [{ data: rawHoje }, { data: rawMes }, { data: rawAno }, { data: rawItens }] = await Promise.all([
    supabase.from('pedidos').select('total, taxa_entrega, pagamento')
      .eq('desconsiderado', false)
      .gte('created_at', startOfDay(hoje)).lte('created_at', endOfDay(hoje)),
    supabase.from('pedidos').select('total, taxa_entrega, pagamento')
      .eq('desconsiderado', false)
      .gte('created_at', startOfMonth(hoje)).lte('created_at', endOfMonth(hoje)),
    supabase.from('pedidos').select('total, taxa_entrega, pagamento')
      .eq('desconsiderado', false)
      .gte('created_at', startOfYear(hoje)).lte('created_at', endOfYear(hoje)),
    supabase.from('pedidos')
      .select('itens_pedido(quantidade, subtotal, itens_cardapio(categorias(nome)))')
      .eq('desconsiderado', false)
      .gte('created_at', startOfDay(hoje)).lte('created_at', endOfDay(hoje)),
  ])

  const h = processPedidos(rawHoje ?? [])
  const m = processPedidos(rawMes ?? [])
  const a = processPedidos(rawAno ?? [])

  // Agrupa por categoria
  const catMap: Record<string, { quantidade: number; valor: number }> = {}
  for (const ped of (rawItens ?? [])) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const item of ((ped as any).itens_pedido ?? [])) {
      const cat: string = item.itens_cardapio?.categorias?.nome ?? 'Sem Categoria'
      if (!catMap[cat]) catMap[cat] = { quantidade: 0, valor: 0 }
      catMap[cat].quantidade += item.quantidade
      catMap[cat].valor += Number(item.subtotal)
    }
  }
  const porCategoria = Object.entries(catMap)
    .map(([categoria, d]) => ({ categoria, quantidade: d.quantidade, valor: round2(d.valor) }))
    .sort((a, b) => b.valor - a.valor)

  return NextResponse.json({
    hoje: {
      pedidos:     h.count,
      faturamento: round2(h.faturamento),
      taxaTotal:   round2(h.taxa),
      taxaMedia:   h.count > 0 ? round2(h.taxa / h.count) : 0,
      porPagamento: h.pag,
    },
    mes: {
      pedidos:     m.count,
      faturamento: round2(m.faturamento),
      taxaTotal:   round2(m.taxa),
      porPagamento: m.pag,
    },
    ano: {
      pedidos:     a.count,
      faturamento: round2(a.faturamento),
      taxaTotal:   round2(a.taxa),
      ticketMedio: a.count > 0 ? round2(a.faturamento / a.count) : 0,
      porPagamento: a.pag,
    },
    porCategoria,
  })
}
