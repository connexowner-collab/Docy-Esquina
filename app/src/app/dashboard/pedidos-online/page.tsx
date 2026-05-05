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
  clientes: { nome: string; telefone: string }
  enderecos: { logradouro: string; numero: string; bairro: string }
  itens_pedido: { nome_snapshot: string; preco_snapshot: number; quantidade: number; observacao_item?: string }[]
}

type Aba = 'aguardando' | 'aceitos' | 'recusados'

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

export default function PedidosOnlinePage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<Aba>('aguardando')
  const [modalRecusa, setModalRecusa] = useState<{ id: number; numero: number } | null>(null)
  const [motivoRecusa, setMotivoRecusa] = useState('')
  const [processando, setProcessando] = useState<number | null>(null)
  const [tempoAtual, setTempoAtual] = useState(Date.now())

  const carregarPedidos = useCallback(async () => {
    const supabase = createClient()
    const hoje = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('pedidos')
      .select(`
        id, numero_seq, status_pedido, status_validacao, motivo_recusa,
        created_at, subtotal, taxa_entrega, total, pagamento, troco, observacoes,
        clientes(nome, telefone),
        enderecos(logradouro, numero, bairro),
        itens_pedido(nome_snapshot, preco_snapshot, quantidade, observacao_item)
      `)
      .eq('origem', 'pwa')
      .gte('created_at', `${hoje}T00:00:00`)
      .order('created_at', { ascending: false })

    if (data) setPedidos(data as unknown as Pedido[])
    setLoading(false)
  }, [])

  useEffect(() => {
    carregarPedidos()

    // Realtime — novos pedidos chegando
    const supabase = createClient()
    const channel = supabase
      .channel('portal-pedidos-online')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'pedidos',
        filter: 'origem=eq.pwa',
      }, () => carregarPedidos())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pedidos',
        filter: 'origem=eq.pwa',
      }, () => carregarPedidos())
      .subscribe()

    const timer = setInterval(() => setTempoAtual(Date.now()), 30000)
    return () => { supabase.removeChannel(channel); clearInterval(timer) }
  }, [carregarPedidos])

  // Separar por aba
  const aguardando = pedidos.filter(p => p.status_validacao === 'pendente')
  const aceitos = pedidos.filter(p => p.status_validacao === 'aceito')
  const recusados = pedidos.filter(p => p.status_validacao === 'recusado')

  async function aceitar(id: number) {
    setProcessando(id)
    await fetch(`/api/pedidos-online/${id}/validacao`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'aceitar' }),
    })
    setProcessando(null)
    await carregarPedidos()
  }

  async function recusar() {
    if (!modalRecusa) return
    setProcessando(modalRecusa.id)
    await fetch(`/api/pedidos-online/${modalRecusa.id}/validacao`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'recusar', motivoRecusa }),
    })
    setProcessando(null)
    setModalRecusa(null)
    setMotivoRecusa('')
    await carregarPedidos()
  }

  async function avancarStatus(id: number, novoStatus: 'em_entrega' | 'entregue') {
    setProcessando(id)
    await fetch(`/api/pedidos-online/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }),
    })
    setProcessando(null)
    await carregarPedidos()
  }

  function CardPedido({ pedido, modo }: { pedido: Pedido; modo: 'aguardando' | 'aceito' | 'recusado' }) {
    return (
      <div style={{
        background: '#fff',
        border: `1px solid ${modo === 'aguardando' ? '#F5C070' : modo === 'recusado' ? '#F09595' : '#E0DDD5'}`,
        borderLeft: `4px solid ${modo === 'aguardando' ? '#E8870A' : modo === 'recusado' ? '#C0392B' : '#0F6E56'}`,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAF8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {modo === 'aguardando' && <span style={{ background: '#E8870A', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>NOVO</span>}
            <span style={{ fontWeight: 700, fontSize: 15 }}>Pedido #{pedido.numero_seq}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#888' }}>⏱ {fmtTempo(pedido.created_at)}</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#C0392B' }}>{fmtMoeda(pedido.total)}</span>
          </div>
        </div>

        {/* Corpo */}
        <div style={{ padding: '12px 16px' }}>
          {/* Cliente */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{pedido.clientes?.nome}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{fmtTel(pedido.clientes?.telefone ?? '')}</div>
          </div>

          {/* Itens */}
          <div style={{ marginBottom: 10 }}>
            {pedido.itens_pedido?.map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>
                {item.quantidade}× {item.nome_snapshot}
                {item.observacao_item && <span style={{ color: '#888', fontStyle: 'italic' }}> — {item.observacao_item}</span>}
              </div>
            ))}
          </div>

          {/* Endereço */}
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
            📍 {pedido.enderecos?.logradouro}, {pedido.enderecos?.numero} — {pedido.enderecos?.bairro}
          </div>

          {/* Pagamento */}
          <div style={{ display: 'flex', gap: 8, marginBottom: pedido.observacoes ? 8 : 0 }}>
            <span style={{ background: pedido.pagamento === 'pix' ? '#E1F5EE' : pedido.pagamento === 'dinheiro' ? '#FDF3E3' : '#E6F1FB', color: pedido.pagamento === 'pix' ? '#0F6E56' : pedido.pagamento === 'dinheiro' ? '#B8600A' : '#185FA5', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
              {pedido.pagamento.toUpperCase()}
            </span>
            {pedido.troco && <span style={{ fontSize: 12, color: '#888' }}>Troco p/ {fmtMoeda(pedido.troco)}</span>}
          </div>

          {pedido.observacoes && (
            <div style={{ fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 6 }}>
              Obs: {pedido.observacoes}
            </div>
          )}

          {modo === 'recusado' && pedido.motivo_recusa && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#B33A3A', background: '#FCEBEB', borderRadius: 6, padding: '6px 10px' }}>
              Motivo: {pedido.motivo_recusa}
            </div>
          )}
        </div>

        {/* Ações */}
        {modo === 'aguardando' && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #F5F3EF', display: 'flex', gap: 8 }}>
            <button
              onClick={() => aceitar(pedido.id)}
              disabled={processando === pedido.id}
              style={{ flex: 1, padding: '10px', background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 8, color: '#0F6E56', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              {processando === pedido.id ? '...' : '✓ Aceitar pedido'}
            </button>
            <button
              onClick={() => setModalRecusa({ id: pedido.id, numero: pedido.numero_seq })}
              style={{ flex: 1, padding: '10px', background: '#FCEBEB', border: '1px solid #F09595', borderRadius: 8, color: '#B33A3A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✕ Recusar
            </button>
          </div>
        )}

        {modo === 'aceito' && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #F5F3EF', display: 'flex', gap: 8 }}>
            {pedido.status_pedido === 'em_preparo' && (
              <button
                onClick={() => avancarStatus(pedido.id, 'em_entrega')}
                disabled={processando === pedido.id}
                style={{ flex: 1, padding: '10px', background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 8, color: '#185FA5', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                {processando === pedido.id ? '...' : '🛵 Saiu para entrega'}
              </button>
            )}
            {pedido.status_pedido === 'em_entrega' && (
              <button
                onClick={() => avancarStatus(pedido.id, 'entregue')}
                disabled={processando === pedido.id}
                style={{ flex: 1, padding: '10px', background: '#E1F5EE', border: '1px solid #9FE1CB', borderRadius: 8, color: '#0F6E56', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                {processando === pedido.id ? '...' : '✓✓ Confirmar entrega'}
              </button>
            )}
            {pedido.status_pedido === 'entregue' && (
              <span style={{ flex: 1, padding: '10px', background: '#E1F5EE', borderRadius: 8, color: '#0F6E56', fontWeight: 600, fontSize: 13, textAlign: 'center' }}>
                ✓ Entregue
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  const abas: { key: Aba; label: string; count: number }[] = [
    { key: 'aguardando', label: 'Aguardando', count: aguardando.length },
    { key: 'aceitos', label: 'Aceitos hoje', count: aceitos.length },
    { key: 'recusados', label: 'Recusados', count: recusados.length },
  ]

  const itensDaAba = { aguardando, aceitos, recusados }[abaAtiva] as Pedido[]

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2C2C2A' }}>Pedidos Online</h1>
          {aguardando.length > 0 && (
            <span style={{ background: '#C0392B', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>
              {aguardando.length} novo{aguardando.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
          Pedidos recebidos pelo app do cliente — atualiza em tempo real
        </p>
      </div>

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

      {/* Conteúdo */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Carregando...</div>
      ) : itensDaAba.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            {abaAtiva === 'aguardando' ? '🕐' : abaAtiva === 'aceitos' ? '✅' : '❌'}
          </div>
          {abaAtiva === 'aguardando' ? 'Nenhum pedido aguardando. Quando um cliente fizer um pedido pelo app, aparecerá aqui.' : `Nenhum pedido ${abaAtiva === 'aceitos' ? 'aceito' : 'recusado'} hoje.`}
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
