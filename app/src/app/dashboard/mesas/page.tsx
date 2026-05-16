'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type ItemPedido = {
  id: number
  nome_snapshot: string
  quantidade: number
  preco_snapshot: number
  observacao_item?: string | null
}

type Pedido = {
  id: number
  numero_seq: number
  subtotal: number
  total: number
  pagamento: string
  observacoes?: string | null
  created_at: string
  status_pedido: string
  itens_pedido: ItemPedido[]
}

type Sessao = {
  id: number
  mesa_numero: number
  nome_cliente: string
  status: string
  aberta_em: string
  pedidos: Pedido[]
}

const PAG_LABELS: Record<string, string> = { pix: 'PIX', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito', pendente: 'A definir' }
const STATUS_COLORS: Record<string, string> = { pendente: '#E8870A', em_preparo: '#185FA5', em_entrega: '#6B3FA0', entregue: '#0F6E56', recusado: '#B33A3A' }
const STATUS_LABELS: Record<string, string> = { pendente: 'Aguardando', em_preparo: 'Em preparo', em_entrega: 'Em entrega', entregue: 'Entregue', recusado: 'Recusado' }

function fmtMoeda(v: number) { return `R$ ${Number(v).toFixed(2).replace('.', ',')}` }
function fmtTempo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'agora'
  if (diff < 60) return `${diff} min`
  const h = Math.floor(diff / 60), m = diff % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export default function MesasPage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [loading, setLoading] = useState(true)
  const [modalFechamento, setModalFechamento] = useState<Sessao | null>(null)
  const [pagamentoFechamento, setPagamentoFechamento] = useState<string>('pix')
  const [obsFechamento, setObsFechamento] = useState('')
  const [fechando, setFechando] = useState(false)
  const [sessoesFechadas, setSessoesFechadas] = useState<Sessao[]>([])
  const [verFechadas, setVerFechadas] = useState(false)
  const [loadingFechadas, setLoadingFechadas] = useState(false)

  const carregarSessoes = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/mesas/sessoes')
    const data = await res.json()
    setSessoes(data.sessoes ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    carregarSessoes()
    const supabase = createClient()
    const ch = supabase
      .channel('mesas-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos', filter: 'origem=eq.mesa' }, () => carregarSessoes())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessoes_mesa' }, () => carregarSessoes())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [carregarSessoes])

  async function fecharMesa() {
    if (!modalFechamento) return
    setFechando(true)
    await fetch(`/api/mesas/sessoes/${modalFechamento.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagamento: pagamentoFechamento, observacoes: obsFechamento }),
    })
    setFechando(false)
    setModalFechamento(null)
    setPagamentoFechamento('pix')
    setObsFechamento('')
    await carregarSessoes()
  }

  async function carregarFechadas() {
    setLoadingFechadas(true)
    const supabase = createClient()
    const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
    const { data } = await supabase
      .from('sessoes_mesa')
      .select(`
        id, mesa_numero, nome_cliente, status, aberta_em, fechada_em, pagamento,
        pedidos(id, numero_seq, subtotal, total, pagamento, created_at, status_pedido, itens_pedido(id, nome_snapshot, quantidade, preco_snapshot))
      `)
      .eq('status', 'fechada')
      .gte('fechada_em', `${hoje}T03:00:00.000Z`)
      .order('fechada_em', { ascending: false })
    setSessoesFechadas((data ?? []) as unknown as Sessao[])
    setLoadingFechadas(false)
  }

  const totalAberto = sessoes.reduce((s, sess) => s + sess.pedidos.reduce((ps, p) => ps + Number(p.total), 0), 0)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2C2C2A', margin: 0 }}>🍽️ Controle de Mesas</h1>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>
            {sessoes.length === 0 ? 'Nenhuma mesa aberta' : `${sessoes.length} mesa${sessoes.length > 1 ? 's' : ''} abertas · ${fmtMoeda(totalAberto)} em aberto`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setVerFechadas(!verFechadas); if (!verFechadas) carregarFechadas() }}
            style={{ padding: '9px 16px', background: '#fff', border: '1.5px solid #E0DDD5', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#555' }}
          >
            {verFechadas ? 'Ocultar fechadas' : '📋 Ver fechadas hoje'}
          </button>
          <button
            onClick={carregarSessoes}
            style={{ padding: '9px 16px', background: '#fff', border: '1.5px solid #E0DDD5', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#555' }}
          >
            ↻ Atualizar
          </button>
        </div>
      </div>

      {/* Mesas abertas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#aaa' }}>Carregando...</div>
      ) : sessoes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, border: '2px dashed #E0DDD5', borderRadius: 16, color: '#aaa' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
          <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Nenhuma mesa aberta</p>
          <p style={{ fontSize: 13 }}>As mesas aparecem aqui assim que um pedido é feito pelo QR Code</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 32 }}>
          {sessoes.map(sessao => {
            const totalSessao = sessao.pedidos.reduce((s, p) => s + Number(p.total), 0)
            const totalItens = sessao.pedidos.reduce((s, p) => s + p.itens_pedido.reduce((si, i) => si + i.quantidade, 0), 0)
            return (
              <div key={sessao.id} style={{ background: '#fff', border: '1.5px solid #E0DDD5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {/* Cabeçalho da mesa */}
                <div style={{ padding: '14px 16px', background: '#FEF2F2', borderBottom: '1px solid #E0DDD5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>🍽️</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: '#C0392B' }}>Mesa {sessao.mesa_numero}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{sessao.nome_cliente}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: '#0F6E56' }}>{fmtMoeda(totalSessao)}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>⏱ {fmtTempo(sessao.aberta_em)}</div>
                  </div>
                </div>

                {/* Lista de pedidos */}
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {sessao.pedidos.length === 0 ? (
                    <div style={{ padding: 16, textAlign: 'center', color: '#aaa', fontSize: 13 }}>Sem pedidos ainda</div>
                  ) : sessao.pedidos.map(pedido => (
                    <div key={pedido.id} style={{ padding: '10px 16px', borderBottom: '1px solid #F5F3EF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 12, color: '#C0392B' }}>#{pedido.numero_seq}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLORS[pedido.status_pedido] ?? '#888', background: '#f5f5f5', padding: '2px 6px', borderRadius: 5 }}>
                            {STATUS_LABELS[pedido.status_pedido] ?? pedido.status_pedido}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: 12 }}>{fmtMoeda(pedido.total)}</span>
                        </div>
                      </div>
                      {pedido.itens_pedido.map(item => (
                        <div key={item.id} style={{ fontSize: 12, color: '#555', marginBottom: 2 }}>
                          <span style={{ fontWeight: 600 }}>{item.quantidade}×</span> {item.nome_snapshot}
                          <span style={{ color: '#aaa', marginLeft: 6 }}>{fmtMoeda(item.preco_snapshot * item.quantidade)}</span>
                        </div>
                      ))}
                      {pedido.observacoes && <div style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic', marginTop: 4 }}>Obs: {pedido.observacoes}</div>}
                    </div>
                  ))}
                </div>

                {/* Resumo e botão fechar */}
                <div style={{ padding: '12px 16px', background: '#F7F7F5', borderTop: '1px solid #E0DDD5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#888' }}>{sessao.pedidos.length} pedido{sessao.pedidos.length !== 1 ? 's' : ''} · {totalItens} item{totalItens !== 1 ? 'ns' : ''}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#0F6E56' }}>{fmtMoeda(totalSessao)}</span>
                  </div>
                  <button
                    onClick={() => { setModalFechamento(sessao); setPagamentoFechamento('pix') }}
                    style={{ width: '100%', padding: '10px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    💳 Fechar Mesa — {fmtMoeda(totalSessao)}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sessões fechadas hoje */}
      {verFechadas && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1.2, margin: 0 }}>Fechadas hoje</p>
            <div style={{ flex: 1, height: 1, background: '#e8e8ee' }} />
          </div>
          {loadingFechadas ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#aaa' }}>Carregando...</div>
          ) : sessoesFechadas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#aaa', fontSize: 13 }}>Nenhuma mesa fechada hoje ainda</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {sessoesFechadas.map(sessao => {
                const totalSessao = sessao.pedidos.reduce((s, p) => s + Number(p.total), 0)
                return (
                  <div key={sessao.id} style={{ background: '#fff', border: '1px solid #E0DDD5', borderRadius: 12, opacity: 0.75, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px', background: '#F5F3EF', borderBottom: '1px solid #E0DDD5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#888' }}>Mesa {sessao.mesa_numero}</span>
                        <span style={{ color: '#aaa', fontSize: 12, marginLeft: 8 }}>{sessao.nome_cliente}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{fmtMoeda(totalSessao)}</div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <div style={{ fontSize: 10, color: '#aaa' }}>{PAG_LABELS[(sessao as any).pagamento] ?? (sessao as any).pagamento}</div>
                      </div>
                    </div>
                    <div style={{ padding: '8px 14px', fontSize: 12, color: '#888' }}>
                      {sessao.pedidos.length} pedido{sessao.pedidos.length !== 1 ? 's' : ''} · ✅ Fechada
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal fechar mesa */}
      {modalFechamento && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 440 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800 }}>
              🍽️ Fechar Mesa {modalFechamento.mesa_numero}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#888' }}>{modalFechamento.nome_cliente}</p>

            {/* Total */}
            <div style={{ background: '#F5F3EF', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{modalFechamento.pedidos.length} pedido{modalFechamento.pedidos.length !== 1 ? 's' : ''}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>
                  {modalFechamento.pedidos.reduce((s, p) => s + p.itens_pedido.reduce((si, i) => si + i.quantidade, 0), 0)} itens no total
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F6E56' }}>
                {fmtMoeda(modalFechamento.pedidos.reduce((s, p) => s + Number(p.total), 0))}
              </div>
            </div>

            {/* Forma de pagamento */}
            <p style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Forma de Pagamento Recebida</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              {[
                { v: 'pix', label: '💚 PIX' },
                { v: 'dinheiro', label: '💵 Dinheiro' },
                { v: 'credito', label: '💳 Crédito' },
                { v: 'debito', label: '💳 Débito' },
              ].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => setPagamentoFechamento(opt.v)}
                  style={{
                    padding: '12px 14px', borderRadius: 10,
                    border: `2px solid ${pagamentoFechamento === opt.v ? '#C0392B' : '#E0DDD5'}`,
                    background: pagamentoFechamento === opt.v ? '#FEF2F2' : '#fff',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Observações */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Observações (opcional)</label>
              <textarea
                style={{ width: '100%', border: '1px solid #E0DDD5', borderRadius: 10, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none', height: 60, outline: 'none', boxSizing: 'border-box' }}
                placeholder="Alguma nota sobre esse fechamento?"
                value={obsFechamento}
                onChange={e => setObsFechamento(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setModalFechamento(null); setObsFechamento('') }}
                style={{ flex: 1, padding: 12, border: '1px solid #E0DDD5', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}
              >
                Cancelar
              </button>
              <button
                onClick={fecharMesa}
                disabled={fechando}
                style={{ flex: 2, padding: 12, background: '#C0392B', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}
              >
                {fechando ? 'Fechando...' : `✓ Confirmar recebimento`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
