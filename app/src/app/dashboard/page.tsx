'use client'

import { useEffect, useState, useCallback } from 'react'

type PorPagamento = { quantidade: number; total: number }
type KpiHoje = {
  pedidos: number
  faturamento: number
  taxaTotal: number
  taxaMedia: number
  porPagamento: Record<string, PorPagamento>
  qtd_app: number
  faturamento_app: number
}
type KpiMes = {
  pedidos: number
  faturamento: number
  taxaTotal: number
  porPagamento: Record<string, PorPagamento>
}
type KpiAno = {
  pedidos: number
  faturamento: number
  taxaTotal: number
  ticketMedio: number
  porPagamento: Record<string, PorPagamento>
}
type Categoria = { categoria: string; quantidade: number; valor: number }
type DashboardData = { hoje: KpiHoje; mes: KpiMes; ano: KpiAno; porCategoria: Categoria[] }

function fmtMoeda(v: number) {
  return `R$ ${Number(v).toFixed(2).replace('.', ',')}`
}
function fmtData() {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

const PAG_LABELS: Record<string, string> = { pix: 'PIX', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito' }
const PAG_COLORS: Record<string, string> = { pix: '#0F6E56', dinheiro: '#E8870A', debito: '#2563EB', credito: '#7C3AED' }

function KpiCard({ label, value, sub, color = '#1a1a1a', accent }: { label: string; value: string; sub?: string; color?: string; accent?: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: accent ? `3px solid ${accent}` : undefined }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 10px' }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 800, color, margin: '0 0 4px' }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{sub}</p>}
    </div>
  )
}

function PagCard({ label, data, color }: { label: string; data: PorPagamento; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `3px solid ${color}` }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 2px' }}>{fmtMoeda(data.total)}</p>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{data.quantidade} pedido{data.quantidade !== 1 ? 's' : ''}</p>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 28 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1.2, margin: 0 }}>{children}</p>
      <div style={{ flex: 1, height: 1, background: '#e8e8ee' }} />
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/dashboard')
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#888', margin: '6px 0 0', textTransform: 'capitalize' }}>{fmtData()}</p>
        </div>
        <button
          onClick={fetchData}
          style={{ background: '#fff', border: '1.5px solid #e8e8ee', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Atualizar
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Carregando KPIs...</div>
      ) : !data ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Erro ao carregar dados.</div>
      ) : (
        <>
          {/* ── HOJE ── */}
          <SectionTitle>Hoje</SectionTitle>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            <KpiCard label="Pedidos Hoje" value={String(data.hoje.pedidos)} accent="#C0392B" />
            <KpiCard label="Faturamento Hoje" value={fmtMoeda(data.hoje.faturamento)} color="#0F6E56" accent="#0F6E56" />
            <KpiCard label="Taxa Total Hoje" value={fmtMoeda(data.hoje.taxaTotal)} accent="#E8870A" />
            <KpiCard label="Taxa Média Hoje" value={fmtMoeda(data.hoje.taxaMedia)} sub="por pedido" accent="#2563EB" />
            <KpiCard label="Via App Hoje" value={String(data.hoje.qtd_app)} sub={fmtMoeda(data.hoje.faturamento_app)} color="#0F6E56" accent="#0F6E56" />
          </div>

          <SectionTitle>Pagamento Hoje</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {Object.entries(data.hoje.porPagamento).map(([k, v]) => (
              <PagCard key={k} label={PAG_LABELS[k] ?? k} data={v} color={PAG_COLORS[k] ?? '#999'} />
            ))}
          </div>

          {/* Quantidade por categoria */}
          {data.porCategoria.length > 0 && (
            <>
              <SectionTitle>Vendas por Categoria Hoje</SectionTitle>
              <div className="card" style={{ padding: '16px 20px' }}>
                {(() => {
                  const maxVal = Math.max(...data.porCategoria.map(c => c.valor), 1)
                  return data.porCategoria.map(cat => (
                    <div key={cat.categoria} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.categoria}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cat.quantidade} un &nbsp;·&nbsp; {fmtMoeda(cat.valor)}</span>
                      </div>
                      <div style={{ height: 6, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#C0392B', borderRadius: 4, width: `${(cat.valor / maxVal) * 100}%`, transition: 'width .4s' }} />
                      </div>
                    </div>
                  ))
                })()}
              </div>
            </>
          )}

          {/* ── MÊS ── */}
          <SectionTitle>Este Mês</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <KpiCard label="Pedidos Mês" value={String(data.mes.pedidos)} accent="#C0392B" />
            <KpiCard label="Faturamento Mês" value={fmtMoeda(data.mes.faturamento)} color="#0F6E56" accent="#0F6E56" />
            <KpiCard label="Taxa Total Mês" value={fmtMoeda(data.mes.taxaTotal)} accent="#E8870A" />
          </div>

          <SectionTitle>Pagamento Mês</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {Object.entries(data.mes.porPagamento).map(([k, v]) => (
              <PagCard key={k} label={PAG_LABELS[k] ?? k} data={v} color={PAG_COLORS[k] ?? '#999'} />
            ))}
          </div>

          {/* ── ANO ── */}
          <SectionTitle>Este Ano ({new Date().getFullYear()})</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <KpiCard label="Pedidos Ano" value={String(data.ano.pedidos)} accent="#C0392B" />
            <KpiCard label="Faturamento Ano" value={fmtMoeda(data.ano.faturamento)} color="#0F6E56" accent="#0F6E56" />
            <KpiCard label="Taxa Total Ano" value={fmtMoeda(data.ano.taxaTotal)} accent="#E8870A" />
            <KpiCard label="Ticket Médio Ano" value={fmtMoeda(data.ano.ticketMedio)} sub="por pedido" accent="#2563EB" />
          </div>

          <SectionTitle>Pagamento Ano</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
            {Object.entries(data.ano.porPagamento).map(([k, v]) => (
              <PagCard key={k} label={PAG_LABELS[k] ?? k} data={v} color={PAG_COLORS[k] ?? '#999'} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
