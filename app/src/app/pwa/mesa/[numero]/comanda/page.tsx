'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
  status_pedido: string
  status_validacao: string
  motivo_recusa?: string | null
  created_at: string
  observacoes?: string | null
  itens_pedido: ItemPedido[]
}

type Sessao = {
  id: number
  mesa_numero: number
  nome_cliente: string
  aberta_em: string
  pedidos: Pedido[]
}

function fmtMoeda(v: number) { return `R$ ${Number(v).toFixed(2).replace('.', ',')}` }
function fmtTempo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'agora'
  if (diff < 60) return `há ${diff} min`
  const h = Math.floor(diff / 60), m = diff % 60
  return m > 0 ? `há ${h}h ${m}min` : `há ${h}h`
}

function getStatusInfo(p: Pedido): { emoji: string; label: string; cor: string; bg: string } {
  if (p.status_validacao === 'recusado') return { emoji: '❌', label: 'Recusado', cor: '#B33A3A', bg: '#FEF2F2' }
  if (p.status_validacao === 'pendente') return { emoji: '⏳', label: 'Aguardando confirmação', cor: '#E8870A', bg: '#FFF8F0' }
  if (p.status_pedido === 'entregue') return { emoji: '✅', label: 'Servido', cor: '#0F6E56', bg: '#EEF8F4' }
  if (p.status_pedido === 'em_entrega') return { emoji: '✅', label: 'Pronto', cor: '#0F6E56', bg: '#EEF8F4' }
  return { emoji: '🍳', label: 'Em preparo', cor: '#185FA5', bg: '#EEF4FC' }
}

export default function ComandaPage() {
  const router = useRouter()
  const params = useParams()
  const numero = Number(params.numero)

  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [loading, setLoading] = useState(true)
  const [mesaNome, setMesaNome] = useState('')
  const [erro, setErro] = useState('')

  const carregarSessao = useCallback(async (nome: string) => {
    if (!nome) return
    try {
      const res = await fetch(`/api/mesas/sessoes/ativa?mesa=${numero}&nome=${encodeURIComponent(nome)}`)
      const data = await res.json()
      setSessao(data.sessao ?? null)
    } catch {
      setErro('Erro ao carregar comanda')
    } finally {
      setLoading(false)
    }
  }, [numero])

  useEffect(() => {
    const mesaRaw = sessionStorage.getItem('pwa_mesa')
    if (!mesaRaw) {
      router.replace(`/pwa/mesa/${numero}`)
      return
    }
    const mesa = JSON.parse(mesaRaw)
    if (mesa.numero !== numero) {
      router.replace(`/pwa/mesa/${numero}`)
      return
    }
    setMesaNome(mesa.nome)
    carregarSessao(mesa.nome)
  }, [numero, router, carregarSessao])

  // Atualiza a cada 30s automaticamente
  useEffect(() => {
    if (!mesaNome) return
    const interval = setInterval(() => carregarSessao(mesaNome), 30000)
    return () => clearInterval(interval)
  }, [mesaNome, carregarSessao])

  const totalGeral = sessao?.pedidos.reduce((s, p) => s + Number(p.total), 0) ?? 0
  const totalItens = sessao?.pedidos.reduce((s, p) => s + p.itens_pedido.reduce((si, i) => si + i.quantidade, 0), 0) ?? 0

  if (loading) {
    return (
      <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="pwa-spinner" />
      </div>
    )
  }

  return (
    <div className="pwa-screen">
      {/* Navbar */}
      <div className="pwa-navbar">
        <button onClick={() => router.push('/pwa/cardapio')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>🍽️ Mesa {numero}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Minha Comanda</div>
        </div>
        <button
          onClick={() => carregarSessao(mesaNome)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', padding: 0 }}
          title="Atualizar"
        >↻</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 120px' }}>

        {/* Cabeçalho da comanda */}
        <div style={{ background: '#FEF2F2', border: '1.5px solid #C0392B', borderRadius: 'var(--pwa-r-lg)', padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#C0392B' }}>Mesa {numero}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{mesaNome} · {sessao ? `${sessao.pedidos.length} pedido${sessao.pedidos.length !== 1 ? 's' : ''}` : 'Nenhum pedido'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#0F6E56' }}>{fmtMoeda(totalGeral)}</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>{totalItens} item{totalItens !== 1 ? 'ns' : ''}</div>
          </div>
        </div>

        {erro && <p style={{ color: 'var(--pwa-red-ink)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{erro}</p>}

        {!sessao || sessao.pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--pwa-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
            <p style={{ fontSize: 14 }}>Nenhum pedido ainda.<br />Adicione itens pelo cardápio!</p>
          </div>
        ) : (
          sessao.pedidos.map((pedido, idx) => {
            const status = getStatusInfo(pedido)
            return (
              <div key={pedido.id} style={{ background: '#fff', border: `1px solid ${status.bg === '#FEF2F2' ? '#F09595' : '#F0EDE6'}`, borderLeft: `4px solid ${status.cor}`, borderRadius: 'var(--pwa-r-md)', marginBottom: 12, overflow: 'hidden' }}>
                {/* Header do pedido */}
                <div style={{ padding: '10px 14px', background: status.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{status.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: status.cor }}>{status.label}</div>
                      <div style={{ fontSize: 10, color: '#aaa' }}>Pedido #{pedido.numero_seq} · {fmtTempo(pedido.created_at)}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#2C2C2A' }}>{fmtMoeda(pedido.total)}</div>
                </div>

                {/* Itens */}
                <div style={{ padding: '10px 14px' }}>
                  {pedido.itens_pedido.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, color: '#444' }}>
                      <span><span style={{ fontWeight: 600, color: 'var(--pwa-primary)' }}>{item.quantidade}×</span> {item.nome_snapshot}
                        {item.observacao_item && <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}> ({item.observacao_item})</span>}
                      </span>
                      <span style={{ color: '#888', whiteSpace: 'nowrap', marginLeft: 8 }}>{fmtMoeda(item.preco_snapshot * item.quantidade)}</span>
                    </div>
                  ))}
                  {pedido.observacoes && (
                    <div style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic', marginTop: 6, paddingTop: 6, borderTop: '1px solid #F0EDE6' }}>
                      Obs: {pedido.observacoes}
                    </div>
                  )}
                  {pedido.status_validacao === 'recusado' && pedido.motivo_recusa && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#B33A3A', background: '#FEF2F2', borderRadius: 6, padding: '6px 8px' }}>
                      Motivo: {pedido.motivo_recusa}
                    </div>
                  )}
                </div>

                {/* Botão acompanhar — só para pedidos em andamento */}
                {pedido.status_validacao !== 'recusado' && pedido.status_pedido !== 'entregue' && (
                  <div style={{ padding: '6px 14px 10px' }}>
                    <button
                      onClick={() => router.push(`/pwa/status/${pedido.id}`)}
                      style={{ width: '100%', padding: '8px', background: status.bg, border: `1px solid ${status.cor}`, borderRadius: 8, color: status.cor, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {status.emoji} Acompanhar pedido #{pedido.numero_seq}
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Total geral */}
        {sessao && sessao.pedidos.length > 0 && (
          <div style={{ background: '#1E1E1C', borderRadius: 'var(--pwa-r-lg)', padding: '16px', color: '#fff', marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, opacity: 0.7 }}>
              <span>{sessao.pedidos.length} pedido{sessao.pedidos.length !== 1 ? 's' : ''} · {totalItens} item{totalItens !== 1 ? 'ns' : ''}</span>
              <span style={{ fontSize: 11, color: '#aaa' }}>Mesa {numero}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Total da mesa</span>
              <span style={{ fontWeight: 800, fontSize: 22, color: '#6EE7B7' }}>{fmtMoeda(totalGeral)}</span>
            </div>
            <p style={{ fontSize: 11, color: '#666', margin: '10px 0 0', textAlign: 'center' }}>
              O pagamento é feito diretamente com o atendente
            </p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="pwa-bottom-bar">
        <button
          className="pwa-btn pwa-btn-primary"
          onClick={() => router.push('/pwa/cardapio')}
        >
          🛒 Pedir mais itens
        </button>
      </div>
    </div>
  )
}
