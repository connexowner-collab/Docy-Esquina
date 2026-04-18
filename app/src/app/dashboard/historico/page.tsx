'use client'

import { useEffect, useState, useCallback } from 'react'
import { imprimirComanda } from '@/lib/print/printService'

type ItemPedido = { id: number; nome_snapshot: string; quantidade: number; preco_snapshot: number; subtotal: number }
type ClientePedido = { id: number; nome: string; telefone: string }
type EnderecoPedido = { id: number; logradouro: string; numero: string; bairro: string; referencia: string | null }
type Pedido = {
  id: number
  numero_seq: number
  created_at: string
  subtotal: number
  taxa_entrega: number
  total: number
  pagamento: 'pix' | 'dinheiro' | 'debito' | 'credito'
  troco: number | null
  observacoes: string | null
  distancia_km: number
  clientes: ClientePedido
  enderecos: EnderecoPedido
  itens_pedido: ItemPedido[]
}
type ResumoDia = {
  totalPedidos: number
  faturamentoTotal: number
  ticketMedio: number
  taxaMediaEntrega: number
  variacao: { pedidos: number | null; faturamento: number | null }
  porFormaPagamento: Record<string, { quantidade: number; total: number }>
}

function formatTelefone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
function fmtMoeda(v: number): string {
  return `R$ ${Number(v).toFixed(2).replace('.', ',')}`
}
function fmtData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const pagamentoBadge: Record<string, string> = {
  pix: 'badge-green',
  dinheiro: 'badge-amber',
  debito: 'badge-blue',
  credito: 'badge-blue',
}
const pagamentoLabel: Record<string, string> = {
  pix: 'Pix', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito',
}

function VariacaoChip({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>
  const cor = value >= 0 ? '#0F6E56' : '#A32D2D'
  const bg = value >= 0 ? '#E1F5EE' : '#FCEBEB'
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: cor, background: bg, padding: '2px 6px', borderRadius: 6 }}>
      {value >= 0 ? '+' : ''}{value}%
    </span>
  )
}

export default function HistoricoPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [loading, setLoading] = useState(false)
  const [resumo, setResumo] = useState<ResumoDia | null>(null)
  const [showResumo, setShowResumo] = useState(false)
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    clienteNome: '',
    telefone: '',
    pagamento: '',
  })
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtros)

  const fetchPedidos = useCallback(async (f: typeof filtros, p: number) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), pageSize: String(pageSize) })
    if (f.dataInicio) params.set('dataInicio', f.dataInicio)
    if (f.dataFim) params.set('dataFim', f.dataFim)
    if (f.clienteNome) params.set('clienteNome', f.clienteNome)
    if (f.telefone) params.set('telefone', f.telefone)
    if (f.pagamento) params.set('pagamento', f.pagamento)
    const res = await fetch(`/api/pedidos?${params}`)
    const data = await res.json()
    setPedidos(data.data ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [])

  const fetchResumo = useCallback(async () => {
    const res = await fetch('/api/pedidos/resumo-dia')
    const data = await res.json()
    setResumo(data)
  }, [])

  useEffect(() => {
    fetchPedidos(filtros, 1)
    fetchResumo()
  }, []) // eslint-disable-line

  function handleFiltrar() {
    setFiltrosAplicados(filtros)
    setPage(1)
    fetchPedidos(filtros, 1)
  }

  function handlePageChange(p: number) {
    setPage(p)
    fetchPedidos(filtrosAplicados, p)
  }

  async function exportarExcel() {
    const { utils, writeFile } = await import('xlsx')
    const rows = pedidos.map(p => ({
      '#': p.numero_seq,
      'Data/Hora': fmtData(p.created_at),
      'Cliente': p.clientes?.nome ?? '',
      'Telefone': formatTelefone(p.clientes?.telefone ?? ''),
      'Itens': p.itens_pedido?.map(i => `${i.quantidade}x ${i.nome_snapshot}`).join(', ') ?? '',
      'Endereço': p.enderecos ? `${p.enderecos.logradouro}, ${p.enderecos.numero} — ${p.enderecos.bairro}` : '',
      'Subtotal': Number(p.subtotal),
      'Taxa Entrega': Number(p.taxa_entrega),
      'Total': Number(p.total),
      'Pagamento': pagamentoLabel[p.pagamento] ?? p.pagamento,
      'Troco': p.troco ? Number(p.troco) : '',
      'Observações': p.observacoes ?? '',
    }))
    const ws = utils.json_to_sheet(rows)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Pedidos')
    writeFile(wb, `pedidos_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Histórico de Pedidos</h1>
          <p style={{ fontSize: 14, color: '#888', margin: '6px 0 0' }}>Consulte e exporte todos os pedidos do estabelecimento</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { fetchResumo(); setShowResumo(true) }} style={{ background: '#fff', color: '#1a1a1a', border: '1.5px solid #e8e8ee', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Resumo do Dia
          </button>
          <button onClick={exportarExcel} style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Metric cards */}
      {resumo && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Pedidos hoje', value: String(resumo.totalPedidos), chip: resumo.variacao.pedidos, color: '#1a1a1a' },
            { label: 'Faturamento', value: fmtMoeda(resumo.faturamentoTotal), chip: resumo.variacao.faturamento, color: '#0F6E56' },
            { label: 'Ticket Médio', value: fmtMoeda(resumo.ticketMedio), chip: null, color: '#1a1a1a' },
            { label: 'Taxa Média', value: fmtMoeda(resumo.taxaMediaEntrega), chip: null, color: '#1a1a1a' },
          ].map(card => (
            <div key={card.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 8px' }}>{card.label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: card.color, margin: '0 0 6px' }}>{card.value}</p>
              <VariacaoChip value={card.chip} />
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Data início</label>
            <input type="date" className="input" style={{ width: 150 }} value={filtros.dataInicio} onChange={e => setFiltros(p => ({ ...p, dataInicio: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Data fim</label>
            <input type="date" className="input" style={{ width: 150 }} value={filtros.dataFim} onChange={e => setFiltros(p => ({ ...p, dataFim: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Cliente</label>
            <input className="input" style={{ width: 180 }} placeholder="Nome do cliente" value={filtros.clienteNome} onChange={e => setFiltros(p => ({ ...p, clienteNome: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Telefone</label>
            <input className="input" style={{ width: 150 }} placeholder="Telefone" value={filtros.telefone} onChange={e => setFiltros(p => ({ ...p, telefone: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Pagamento</label>
            <select className="input" style={{ width: 130 }} value={filtros.pagamento} onChange={e => setFiltros(p => ({ ...p, pagamento: e.target.value }))}>
              <option value="">Todos</option>
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleFiltrar}>Filtrar</button>
          <button className="btn-outline" onClick={() => { const f = { dataInicio: '', dataFim: '', clienteNome: '', telefone: '', pagamento: '' }; setFiltros(f); setFiltrosAplicados(f); setPage(1); fetchPedidos(f, 1) }}>Limpar</button>
        </div>
      </div>

      {/* Tabela */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="table-header">
              <th style={{ padding: '10px 12px', textAlign: 'left', width: 50 }}>#</th>
              <th style={{ padding: '10px 12px', textAlign: 'left' }}>Data/Hora</th>
              <th style={{ padding: '10px 12px', textAlign: 'left' }}>Cliente</th>
              <th style={{ padding: '10px 12px', textAlign: 'left' }}>Itens</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Entrega</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Pagamento</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</td></tr>
            ) : pedidos.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum pedido encontrado...</td></tr>
            ) : pedidos.map(p => (
              <tr key={p.id} className="table-row-alt" style={{ borderBottom: '0.5px solid #eee' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#C0392B' }}>#{p.numero_seq}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{fmtData(p.created_at)}</td>
                <td style={{ padding: '10px 12px' }}>
                  <p style={{ fontWeight: 500, fontSize: 13 }}>{p.clientes?.nome}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatTelefone(p.clientes?.telefone ?? '')}</p>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12 }}>
                  {p.itens_pedido?.slice(0, 2).map(i => (
                    <p key={i.id}>{i.quantidade}x {i.nome_snapshot}</p>
                  ))}
                  {(p.itens_pedido?.length ?? 0) > 2 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>+{p.itens_pedido.length - 2} mais</p>
                  )}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12 }}>{fmtMoeda(Number(p.taxa_entrega))}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{fmtMoeda(Number(p.total))}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span className={`badge ${pagamentoBadge[p.pagamento] ?? 'badge-gray'}`}>
                    {pagamentoLabel[p.pagamento] ?? p.pagamento}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <button
                    className="btn-outline"
                    style={{ fontSize: 11, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    onClick={() => imprimirComanda({
                      numero_seq: p.numero_seq,
                      created_at: p.created_at,
                      clientes: { nome: p.clientes?.nome ?? '', telefone: p.clientes?.telefone ?? '' },
                      enderecos: { logradouro: p.enderecos?.logradouro ?? '', numero: p.enderecos?.numero ?? '', bairro: p.enderecos?.bairro ?? '', referencia: p.enderecos?.referencia ?? null },
                      itens_pedido: (p.itens_pedido ?? []).map(i => ({ nome_snapshot: i.nome_snapshot, quantidade: i.quantidade, preco_snapshot: i.preco_snapshot, subtotal: i.subtotal })),
                      subtotal: Number(p.subtotal),
                      taxa_entrega: Number(p.taxa_entrega),
                      total: Number(p.total),
                      pagamento: p.pagamento,
                      troco: p.troco,
                      observacoes: p.observacoes,
                    })}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Reimprimir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16, alignItems: 'center' }}>
          <button className="btn-outline" style={{ padding: '5px 10px' }} disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>&laquo;</button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page + i - 3
            if (p < 1 || p > totalPages) return null
            return (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                style={{
                  padding: '5px 10px', borderRadius: 8, border: '0.5px solid var(--border)',
                  background: p === page ? '#C0392B' : '#fff', color: p === page ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer', fontSize: 13,
                }}
              >
                {p}
              </button>
            )
          })}
          <button className="btn-outline" style={{ padding: '5px 10px' }} disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>&raquo;</button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{total} pedido{total !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Modal Resumo do Dia */}
      {showResumo && resumo && (
        <div className="modal-overlay" onClick={() => setShowResumo(false)}>
          <div className="modal-card" style={{ maxWidth: 520 }} onClick={ev => ev.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Resumo do Dia</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>TOTAL PEDIDOS</p>
                <p style={{ fontSize: 20, fontWeight: 700 }}>{resumo.totalPedidos}</p>
                <VariacaoChip value={resumo.variacao.pedidos} />
              </div>
              <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>FATURAMENTO</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#0F6E56' }}>{fmtMoeda(resumo.faturamentoTotal)}</p>
                <VariacaoChip value={resumo.variacao.faturamento} />
              </div>
              <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>TICKET MÉDIO</p>
                <p style={{ fontSize: 18, fontWeight: 700 }}>{fmtMoeda(resumo.ticketMedio)}</p>
              </div>
              <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>TAXA MÉDIA</p>
                <p style={{ fontSize: 18, fontWeight: 700 }}>{fmtMoeda(resumo.taxaMediaEntrega)}</p>
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>POR FORMA DE PAGAMENTO</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {Object.entries(resumo.porFormaPagamento).map(([forma, dados]) => (
                <div key={forma} className={`badge ${pagamentoBadge[forma] ?? 'badge-gray'}`} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '6px 10px', borderRadius: 8 }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{pagamentoLabel[forma] ?? forma}</span>
                  <span style={{ fontSize: 11 }}>{dados.quantidade} pedido{dados.quantidade !== 1 ? 's' : ''} &middot; {fmtMoeda(dados.total)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-outline" onClick={() => setShowResumo(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
