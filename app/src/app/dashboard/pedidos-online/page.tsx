'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type StatusPedido = 'pendente' | 'em_preparo' | 'em_entrega' | 'entregue' | 'recusado'

type Pedido = {
  id: number
  numero_seq: number
  status_pedido: StatusPedido
  status_validacao: string
  motivo_recusa?: string
  created_at: string
  subtotal: number
  taxa_entrega: number
  total: number
  pagamento: string
  troco?: number
  observacoes?: string
  tipo_entrega: 'entrega' | 'retirada'
  clientes: { nome: string; telefone: string }
  enderecos: { logradouro: string; numero: string; bairro: string } | null
  itens_pedido: { nome_snapshot: string; preco_snapshot: number; quantidade: number; observacao_item?: string }[]
}

type Aba = 'aguardando' | 'aceitos' | 'recusados'
type ViewMode = 'lista' | 'kanban'

function fmtMoeda(v: number) { return `R$ ${v.toFixed(2).replace('.', ',')}` }
function fmtTel(t: string) {
  const d = t.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return t
}
function fmtTempo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'agora'
  if (diff < 60) return `${diff}min`
  return `${Math.floor(diff/60)}h ${diff%60}min`
}
function fmtDataCurta(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

async function imprimir(pedido: Pedido) {
  const { imprimirComanda } = await import('@/lib/print/printService')
  imprimirComanda({
    numero_seq: pedido.numero_seq,
    created_at: pedido.created_at,
    clientes: pedido.clientes,
    enderecos: pedido.tipo_entrega === 'retirada'
      ? { logradouro: 'Retirada na Loja', numero: '', bairro: '' }
      : (pedido.enderecos ?? { logradouro: '', numero: '', bairro: '' }),
    itens_pedido: pedido.itens_pedido.map(i => ({
      nome_snapshot: i.nome_snapshot,
      quantidade: i.quantidade,
      preco_snapshot: i.preco_snapshot,
      subtotal: i.preco_snapshot * i.quantidade,
      observacao: i.observacao_item,
    })),
    subtotal: pedido.subtotal,
    taxa_entrega: pedido.taxa_entrega,
    total: pedido.total,
    pagamento: pedido.pagamento,
    troco: pedido.troco,
    observacoes: pedido.observacoes,
  })
}

// ─── Colunas do Kanban ───────────────────────────────────────────────────────
const COLUNAS_KANBAN = [
  { id: 'aguardando', label: 'Aguardando',  emoji: '🕐', cor: '#E8870A', bg: '#FFF8F0', borda: '#F5C070' },
  { id: 'em_preparo', label: 'Em Preparo',  emoji: '🍳', cor: '#185FA5', bg: '#EEF4FC', borda: '#B5D4F4' },
  { id: 'em_entrega', label: 'Em Entrega',  emoji: '🛵', cor: '#6B3FA0', bg: '#F5EFFC', borda: '#D4B5F4' },
  { id: 'entregue',   label: 'Entregue',    emoji: '✅', cor: '#0F6E56', bg: '#EEF8F4', borda: '#9FE1CB' },
  { id: 'recusado',   label: 'Recusado',    emoji: '❌', cor: '#B33A3A', bg: '#FEF2F2', borda: '#F09595' },
] as const

function getKanbanCol(p: Pedido): string {
  if (p.status_validacao === 'recusado') return 'recusado'
  if (p.status_validacao === 'pendente') return 'aguardando'
  return p.status_pedido === 'entregue' ? 'entregue'
    : p.status_pedido === 'em_entrega' ? 'em_entrega'
    : 'em_preparo'
}

export default function PedidosOnlinePage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<Aba>('aguardando')
  const [viewMode, setViewMode] = useState<ViewMode>('lista')
  const [verTodos, setVerTodos] = useState(false)
  const [modalRecusa, setModalRecusa] = useState<{ id: number; numero: number } | null>(null)
  const [motivoRecusa, setMotivoRecusa] = useState('')
  const [processando, setProcessando] = useState<number | null>(null)
  const [ocultarEntregues, setOcultarEntregues] = useState(true)
  const [lojaAberta, setLojaAberta] = useState<boolean | null>(null)
  const [togglingLoja, setTogglingLoja] = useState(false)

  const carregarPedidos = useCallback(async (todos = false) => {
    const supabase = createClient()
    let q = supabase
      .from('pedidos')
      .select(`
        id, numero_seq, status_pedido, status_validacao, motivo_recusa,
        created_at, subtotal, taxa_entrega, total, pagamento, troco, observacoes, tipo_entrega,
        clientes(nome, telefone),
        enderecos(logradouro, numero, bairro),
        itens_pedido(nome_snapshot, preco_snapshot, quantidade, observacao_item)
      `)
      .eq('origem', 'pwa')
      .order('created_at', { ascending: false })

    if (!todos) {
      const hoje = new Date().toISOString().slice(0, 10)
      q = q.gte('created_at', `${hoje}T00:00:00`)
    } else {
      q = q.limit(300)
    }

    const { data } = await q
    if (data) setPedidos(data as unknown as Pedido[])
    setLoading(false)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('configuracoes').select('pwa_ativo').single().then(({ data }) => {
      if (data) setLojaAberta(data.pwa_ativo ?? true)
    })
  }, [])

  async function toggleLoja() {
    if (lojaAberta === null) return
    setTogglingLoja(true)
    const novoValor = !lojaAberta
    const supabase = createClient()
    await supabase.from('configuracoes').update({ pwa_ativo: novoValor }).eq('id', 1)
    setLojaAberta(novoValor)
    setTogglingLoja(false)
  }

  useEffect(() => {
    carregarPedidos(verTodos)

    const supabase = createClient()
    const channel = supabase
      .channel('portal-pedidos-online')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pedidos', filter: 'origem=eq.pwa' }, () => carregarPedidos(verTodos))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pedidos', filter: 'origem=eq.pwa' }, () => carregarPedidos(verTodos))
      .subscribe()

    const timer = setInterval(() => carregarPedidos(verTodos), 60000)
    return () => { supabase.removeChannel(channel); clearInterval(timer) }
  }, [carregarPedidos, verTodos])

  const aguardando = pedidos.filter(p => p.status_validacao === 'pendente')
  const aceitos    = pedidos.filter(p => p.status_validacao === 'aceito')
  const recusados  = pedidos.filter(p => p.status_validacao === 'recusado')

  const entreguesOcultos = ocultarEntregues ? aceitos.filter(p => p.status_pedido === 'entregue').length : 0
  const aceitosVisiveis  = ocultarEntregues ? aceitos.filter(p => p.status_pedido !== 'entregue') : aceitos

  async function aceitar(id: number) {
    setProcessando(id)
    await fetch(`/api/pedidos-online/${id}/validacao`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'aceitar' }),
    })
    setProcessando(null)
    await carregarPedidos(verTodos)
  }

  async function recusar() {
    if (!modalRecusa) return
    setProcessando(modalRecusa.id)
    await fetch(`/api/pedidos-online/${modalRecusa.id}/validacao`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'recusar', motivoRecusa }),
    })
    setProcessando(null)
    setModalRecusa(null)
    setMotivoRecusa('')
    await carregarPedidos(verTodos)
  }

  async function avancarStatus(id: number, novoStatus: 'em_entrega' | 'entregue') {
    setProcessando(id)
    await fetch(`/api/pedidos-online/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }),
    })
    setProcessando(null)
    await carregarPedidos(verTodos)
  }

  // ─── Card (reutilizado em lista e kanban) ────────────────────────────────────
  function CardPedido({ pedido, modo, compact = false }: { pedido: Pedido; modo: 'aguardando' | 'aceito' | 'recusado'; compact?: boolean }) {
    return (
      <div style={{
        background: '#fff',
        border: `1px solid ${modo === 'aguardando' ? '#F5C070' : modo === 'recusado' ? '#F09595' : '#E0DDD5'}`,
        borderLeft: `4px solid ${modo === 'aguardando' ? '#E8870A' : modo === 'recusado' ? '#C0392B' : '#0F6E56'}`,
        borderRadius: 10,
        marginBottom: compact ? 8 : 12,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: compact ? '8px 12px' : '12px 16px', borderBottom: '1px solid #F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAF8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {modo === 'aguardando' && <span style={{ background: '#E8870A', color: '#fff', borderRadius: 6, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>NOVO</span>}
            <span style={{ fontWeight: 700, fontSize: compact ? 13 : 15 }}>#{pedido.numero_seq}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {verTodos && <span style={{ fontSize: 10, color: '#aaa' }}>{fmtDataCurta(pedido.created_at)}</span>}
            {!verTodos && <span style={{ fontSize: 11, color: '#888' }}>⏱ {fmtTempo(pedido.created_at)}</span>}
            <span style={{ fontWeight: 700, fontSize: compact ? 13 : 15, color: '#C0392B' }}>{fmtMoeda(pedido.total)}</span>
          </div>
        </div>

        {/* Corpo */}
        <div style={{ padding: compact ? '8px 12px' : '12px 16px' }}>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontWeight: 600, fontSize: compact ? 12 : 14 }}>{pedido.clientes?.nome}</div>
            {!compact && <div style={{ fontSize: 12, color: '#888' }}>{fmtTel(pedido.clientes?.telefone ?? '')}</div>}
          </div>

          <div style={{ marginBottom: 6 }}>
            {pedido.itens_pedido?.map((item, i) => (
              <div key={i} style={{ fontSize: compact ? 11 : 13, color: '#555', marginBottom: 2 }}>
                {item.quantidade}× {item.nome_snapshot}
                {item.observacao_item && <span style={{ color: '#888', fontStyle: 'italic' }}> — {item.observacao_item}</span>}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#888', marginBottom: compact ? 4 : 8 }}>
            {pedido.tipo_entrega === 'retirada' ? (
              <span style={{ background: '#E1F5EE', color: '#0F6E56', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>🏪 Retirada</span>
            ) : (
              <>📍 {pedido.enderecos?.logradouro}, {pedido.enderecos?.numero} — {pedido.enderecos?.bairro}</>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              background: pedido.pagamento === 'pix' ? '#E1F5EE' : pedido.pagamento === 'dinheiro' ? '#FDF3E3' : '#E6F1FB',
              color: pedido.pagamento === 'pix' ? '#0F6E56' : pedido.pagamento === 'dinheiro' ? '#B8600A' : '#185FA5',
              borderRadius: 6, padding: '2px 6px', fontSize: 10, fontWeight: 600,
            }}>
              {pedido.pagamento.toUpperCase()}
            </span>
            {pedido.troco != null && pedido.troco > 0 && (
              <span style={{ fontSize: 11, color: '#888' }}>
                Troco: {fmtMoeda(pedido.troco - pedido.total)}
              </span>
            )}
          </div>

          {pedido.observacoes && (
            <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic', marginTop: 4 }}>
              Obs: {pedido.observacoes}
            </div>
          )}

          {modo === 'recusado' && pedido.motivo_recusa && (
            <div style={{ marginTop: 6, fontSize: 11, color: '#B33A3A', background: '#FCEBEB', borderRadius: 6, padding: '4px 8px' }}>
              Motivo: {pedido.motivo_recusa}
            </div>
          )}
        </div>

        {/* Ações */}
        {modo === 'aguardando' && (
          <div style={{ padding: compact ? '6px 10px' : '10px 16px', borderTop: '1px solid #F5F3EF', display: 'flex', gap: 6 }}>
            <button
              onClick={() => aceitar(pedido.id)}
              disabled={processando === pedido.id}
              style={{ flex: 1, padding: compact ? '7px' : '10px', background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 8, color: '#0F6E56', fontWeight: 600, fontSize: compact ? 11 : 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              {processando === pedido.id ? '...' : '✓ Aceitar'}
            </button>
            <button
              onClick={() => imprimir(pedido)}
              style={{ padding: compact ? '7px 10px' : '10px 14px', background: '#F5F3EF', border: '1px solid #E0DDD5', borderRadius: 8, color: '#555', fontSize: compact ? 11 : 13, cursor: 'pointer', fontFamily: 'inherit' }}
              title="Imprimir comanda">
              🖨️
            </button>
            <button
              onClick={() => setModalRecusa({ id: pedido.id, numero: pedido.numero_seq })}
              style={{ flex: 1, padding: compact ? '7px' : '10px', background: '#FCEBEB', border: '1px solid #F09595', borderRadius: 8, color: '#B33A3A', fontWeight: 600, fontSize: compact ? 11 : 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✕ Recusar
            </button>
          </div>
        )}

        {modo === 'aceito' && (
          <div style={{ padding: compact ? '6px 10px' : '10px 16px', borderTop: '1px solid #F5F3EF', display: 'flex', gap: 6 }}>
            {pedido.status_pedido === 'em_preparo' && pedido.tipo_entrega === 'entrega' && (
              <button
                onClick={() => avancarStatus(pedido.id, 'em_entrega')}
                disabled={processando === pedido.id}
                style={{ flex: 1, padding: compact ? '7px' : '10px', background: '#EEF4FC', border: '1px solid #B5D4F4', borderRadius: 8, color: '#185FA5', fontWeight: 600, fontSize: compact ? 11 : 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                {processando === pedido.id ? '...' : '🛵 Saiu p/ entrega'}
              </button>
            )}
            {pedido.status_pedido === 'em_preparo' && pedido.tipo_entrega === 'retirada' && (
              <button
                onClick={() => avancarStatus(pedido.id, 'entregue')}
                disabled={processando === pedido.id}
                style={{ flex: 1, padding: compact ? '7px' : '10px', background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 8, color: '#0F6E56', fontWeight: 600, fontSize: compact ? 11 : 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                {processando === pedido.id ? '...' : '🏪 Confirmar retirada'}
              </button>
            )}
            {pedido.status_pedido === 'em_entrega' && (
              <button
                onClick={() => avancarStatus(pedido.id, 'entregue')}
                disabled={processando === pedido.id}
                style={{ flex: 1, padding: compact ? '7px' : '10px', background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 8, color: '#0F6E56', fontWeight: 600, fontSize: compact ? 11 : 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                {processando === pedido.id ? '...' : '✓✓ Confirmar entrega'}
              </button>
            )}
            {pedido.status_pedido === 'entregue' && (
              <span style={{ flex: 1, padding: compact ? '7px' : '10px', background: '#E1F5EE', borderRadius: 8, color: '#0F6E56', fontWeight: 600, fontSize: compact ? 11 : 13, textAlign: 'center' }}>
                {pedido.tipo_entrega === 'retirada' ? '✓ Retirado' : '✓ Entregue'}
              </span>
            )}
            <button
              onClick={() => imprimir(pedido)}
              style={{ padding: compact ? '7px 10px' : '10px 14px', background: '#F5F3EF', border: '1px solid #E0DDD5', borderRadius: 8, color: '#555', fontSize: compact ? 11 : 13, cursor: 'pointer', fontFamily: 'inherit' }}
              title="Imprimir comanda">
              🖨️
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── Header compartilhado ────────────────────────────────────────────────────
  const Header = (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        {/* Título + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#2C2C2A' }}>Pedidos Online</h1>
          {aguardando.length > 0 && (
            <span style={{ background: '#C0392B', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>
              {aguardando.length} novo{aguardando.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Controles direita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Toggle Hoje / Todos */}
          <div style={{ display: 'flex', background: '#F5F3EF', borderRadius: 8, padding: 3, gap: 2 }}>
            <button
              onClick={() => setVerTodos(false)}
              style={{
                padding: '6px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600,
                background: !verTodos ? '#fff' : 'transparent',
                color: !verTodos ? '#2C2C2A' : '#888',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: !verTodos ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              📅 Hoje
            </button>
            <button
              onClick={() => setVerTodos(true)}
              style={{
                padding: '6px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600,
                background: verTodos ? '#fff' : 'transparent',
                color: verTodos ? '#2C2C2A' : '#888',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: verTodos ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              📋 Todos
            </button>
          </div>

          {/* Toggle Lista / Kanban */}
          <div style={{ display: 'flex', background: '#F5F3EF', borderRadius: 8, padding: 3, gap: 2 }}>
            <button
              onClick={() => setViewMode('lista')}
              style={{
                padding: '6px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600,
                background: viewMode === 'lista' ? '#fff' : 'transparent',
                color: viewMode === 'lista' ? '#2C2C2A' : '#888',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: viewMode === 'lista' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              ☰ Lista
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600,
                background: viewMode === 'kanban' ? '#fff' : 'transparent',
                color: viewMode === 'kanban' ? '#2C2C2A' : '#888',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              ⊞ Kanban
            </button>
          </div>

          {/* Toggle loja aberta/fechada */}
          {lojaAberta !== null && (
            <button
              onClick={toggleLoja}
              disabled={togglingLoja}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 10, cursor: togglingLoja ? 'not-allowed' : 'pointer',
                background: lojaAberta ? '#E1F5EE' : '#FEF2F2',
                border: `1.5px solid ${lojaAberta ? '#0F6E56' : '#C0392B'}`,
                fontFamily: 'inherit', flexShrink: 0,
              }}>
              <div style={{
                width: 36, height: 20, borderRadius: 10, background: lojaAberta ? '#0F6E56' : '#ccc',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}>
                <span style={{
                  position: 'absolute', top: 2, left: lojaAberta ? 17 : 2,
                  width: 16, height: 16, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: lojaAberta ? '#0F6E56' : '#C0392B' }}>
                {togglingLoja ? '...' : lojaAberta ? 'Aberta' : 'Fechada'}
              </span>
            </button>
          )}
        </div>
      </div>
      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>
        Pedidos pelo app — atualiza em tempo real{verTodos ? ' · Mostrando todos os pedidos' : ' · Mostrando pedidos de hoje'}
      </p>
    </div>
  )

  // ─── Visão Kanban ─────────────────────────────────────────────────────────────
  if (viewMode === 'kanban') {
    const colunasData = COLUNAS_KANBAN.map(col => ({
      ...col,
      pedidos: pedidos.filter(p => getKanbanCol(p) === col.id),
    }))

    return (
      <div style={{ padding: '20px 24px', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        {Header}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Carregando...</div>
        ) : (
          <div style={{
            display: 'flex',
            gap: 12,
            flex: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: 16,
          }}>
            {colunasData.map(col => (
              <div key={col.id} style={{
                display: 'flex',
                flexDirection: 'column',
                width: 300,
                minWidth: 280,
                flexShrink: 0,
                background: '#F7F7F5',
                borderRadius: 12,
                border: `1px solid ${col.borda}`,
                overflow: 'hidden',
              }}>
                {/* Cabeçalho da coluna */}
                <div style={{
                  padding: '12px 14px',
                  background: col.cor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{col.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {col.label}
                    </span>
                  </div>
                  <span style={{
                    background: 'rgba(255,255,255,0.25)',
                    color: '#fff',
                    borderRadius: 20,
                    padding: '2px 9px',
                    fontSize: 12,
                    fontWeight: 700,
                    minWidth: 24,
                    textAlign: 'center',
                  }}>
                    {col.pedidos.length}
                  </span>
                </div>

                {/* Cards da coluna */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '10px 10px',
                }}>
                  {col.pedidos.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      color: '#bbb',
                      fontSize: 12,
                      padding: '32px 16px',
                      border: '2px dashed #E8E5E0',
                      borderRadius: 10,
                      marginTop: 4,
                    }}>
                      Sem pedidos
                    </div>
                  ) : col.pedidos.map(pedido => (
                    <CardPedido
                      key={pedido.id}
                      pedido={pedido}
                      modo={col.id === 'aguardando' ? 'aguardando' : col.id === 'recusado' ? 'recusado' : 'aceito'}
                      compact
                    />
                  ))}
                </div>

                {/* Rodapé com total da coluna */}
                {col.pedidos.length > 0 && (
                  <div style={{
                    padding: '8px 14px',
                    borderTop: `1px solid ${col.borda}`,
                    background: col.bg,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    flexShrink: 0,
                  }}>
                    <span style={{ color: '#888' }}>{col.pedidos.length} pedido{col.pedidos.length !== 1 ? 's' : ''}</span>
                    <span style={{ fontWeight: 700, color: col.cor }}>
                      {fmtMoeda(col.pedidos.reduce((s, p) => s + Number(p.total), 0))}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal recusa */}
        {modalRecusa && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 420 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>Recusar pedido #{modalRecusa.numero}</h3>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888' }}>Informe o motivo (opcional). O cliente será notificado.</p>
              <textarea
                style={{ width: '100%', border: '1px solid #E0DDD5', borderRadius: 10, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none', height: 80, outline: 'none', boxSizing: 'border-box' }}
                placeholder="Ex: Fora da área de entrega, cardápio esgotado..."
                value={motivoRecusa}
                onChange={e => setMotivoRecusa(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => { setModalRecusa(null); setMotivoRecusa('') }}
                  style={{ flex: 1, padding: 12, border: '1px solid #E0DDD5', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                  Cancelar
                </button>
                <button onClick={recusar} disabled={processando === modalRecusa.id}
                  style={{ flex: 1, padding: 12, background: '#FCEBEB', border: '1px solid #F09595', borderRadius: 10, color: '#B33A3A', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                  {processando === modalRecusa.id ? '...' : 'Confirmar recusa'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Visão Lista ──────────────────────────────────────────────────────────────
  const abas: { key: Aba; label: string; count: number }[] = [
    { key: 'aguardando', label: 'Aguardando', count: aguardando.length },
    { key: 'aceitos',    label: verTodos ? 'Aceitos' : 'Aceitos hoje', count: aceitos.length },
    { key: 'recusados',  label: 'Recusados',  count: recusados.length },
  ]

  const itensDaAba = abaAtiva === 'aguardando' ? aguardando : abaAtiva === 'aceitos' ? aceitosVisiveis : recusados

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      {Header}

      {/* Abas */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F5F3EF', borderRadius: 10, padding: 4 }}>
        {abas.map(aba => (
          <button
            key={aba.key}
            onClick={() => setAbaAtiva(aba.key)}
            style={{
              flex: 1, padding: '8px 12px',
              borderRadius: 8, border: 'none',
              background: abaAtiva === aba.key ? '#C0392B' : 'transparent',
              color: abaAtiva === aba.key ? '#fff' : '#888',
              fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}>
            {aba.label} {aba.count > 0 && `(${aba.count})`}
          </button>
        ))}
      </div>

      {/* Toggle entregues — só na aba aceitos */}
      {abaAtiva === 'aceitos' && aceitos.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button
            onClick={() => setOcultarEntregues(v => !v)}
            style={{ background: 'none', border: '1px solid #E0DDD5', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#666', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            {ocultarEntregues
              ? `👁 Mostrar entregues${entreguesOcultos > 0 ? ` (${entreguesOcultos})` : ''}`
              : '🙈 Ocultar entregues'}
          </button>
        </div>
      )}

      {/* Conteúdo */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Carregando...</div>
      ) : itensDaAba.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            {abaAtiva === 'aguardando' ? '🕐' : abaAtiva === 'aceitos' ? '✅' : '❌'}
          </div>
          {abaAtiva === 'aguardando'
            ? 'Nenhum pedido aguardando.'
            : abaAtiva === 'aceitos' && ocultarEntregues && entreguesOcultos > 0
              ? `Todos os pedidos aceitos foram entregues. Clique em "Mostrar entregues" para ver.`
              : `Nenhum pedido ${abaAtiva === 'aceitos' ? 'aceito' : 'recusado'}${verTodos ? '' : ' hoje'}.`}
        </div>
      ) : (
        itensDaAba.map(pedido => (
          <CardPedido
            key={pedido.id}
            pedido={pedido}
            modo={abaAtiva === 'aguardando' ? 'aguardando' : abaAtiva === 'aceitos' ? 'aceito' : 'recusado'}
          />
        ))
      )}

      {/* Modal de recusa */}
      {modalRecusa && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 420 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>Recusar pedido #{modalRecusa.numero}</h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888' }}>Informe o motivo (opcional). O cliente será notificado.</p>
            <textarea
              style={{ width: '100%', border: '1px solid #E0DDD5', borderRadius: 10, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none', height: 80, outline: 'none', boxSizing: 'border-box' }}
              placeholder="Ex: Fora da área de entrega, cardápio esgotado..."
              value={motivoRecusa}
              onChange={e => setMotivoRecusa(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => { setModalRecusa(null); setMotivoRecusa('') }}
                style={{ flex: 1, padding: 12, border: '1px solid #E0DDD5', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                Cancelar
              </button>
              <button onClick={recusar} disabled={processando === modalRecusa.id}
                style={{ flex: 1, padding: 12, background: '#FCEBEB', border: '1px solid #F09595', borderRadius: 10, color: '#B33A3A', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                {processando === modalRecusa.id ? '...' : 'Confirmar recusa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
