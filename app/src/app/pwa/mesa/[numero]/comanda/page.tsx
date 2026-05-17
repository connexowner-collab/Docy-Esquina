'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { playSoundPorStatus, vibrar, pedirPermissaoNotificacao, mostrarNotificacaoBrowser, desbloquearAudio } from '@/lib/notificationSound'
import NotifPrompt from '@/components/pwa/NotifPrompt'

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

type NotifBanner = { emoji: string; label: string; cor: string; bg: string; borda: string }

function fmtMoeda(v: number) { return `R$ ${Number(v).toFixed(2).replace('.', ',')}` }
function fmtTempo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'agora'
  if (diff < 60) return `há ${diff} min`
  const h = Math.floor(diff / 60), m = diff % 60
  return m > 0 ? `há ${h}h ${m}min` : `há ${h}h`
}

const STATUS_MESA: Record<string, { emoji: string; label: string; cor: string; bg: string; borda: string }> = {
  aguardando: { emoji: '⏳', label: 'Aguardando confirmação', cor: '#E8870A', bg: '#FFF8F0', borda: '#F5C070' },
  em_preparo: { emoji: '🍳', label: 'Em preparo',             cor: '#185FA5', bg: '#EEF4FC', borda: '#B5D4F4' },
  em_entrega: { emoji: '🛎️', label: 'Pronto! Chegando na mesa', cor: '#6B3FA0', bg: '#F5EFFC', borda: '#D4B5F4' },
  entregue:   { emoji: '✅', label: 'Servido',                cor: '#0F6E56', bg: '#EEF8F4', borda: '#9FE1CB' },
  recusado:   { emoji: '❌', label: 'Recusado',               cor: '#B33A3A', bg: '#FEF2F2', borda: '#F09595' },
}

function getStatusKey(p: Pedido): string {
  if (p.status_validacao === 'recusado') return 'recusado'
  if (p.status_validacao === 'pendente') return 'aguardando'
  if (p.status_pedido === 'entregue')   return 'entregue'
  if (p.status_pedido === 'em_entrega') return 'em_entrega'
  return 'em_preparo'
}

export default function ComandaPage() {
  const router = useRouter()
  const params = useParams()
  const numero = Number(params.numero)

  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [loading, setLoading] = useState(true)
  const [mesaNome, setMesaNome] = useState('')
  const [erro, setErro] = useState('')
  const [notifBanner, setNotifBanner] = useState<NotifBanner | null>(null)

  const carregarSessao = useCallback(async () => {
    try {
      const res = await fetch(`/api/mesas/sessoes/ativa?mesa=${numero}`)
      const data = await res.json()
      setSessao(data.sessao ?? null)
    } catch {
      setErro('Erro ao carregar comanda')
    } finally {
      setLoading(false)
    }
  }, [numero])

  function dispararNotificacao(numeroPedido: number, statusPedido: string, statusValidacao: string) {
    const key = statusValidacao === 'recusado' ? 'recusado'
      : statusValidacao === 'pendente' ? 'aguardando'
      : statusPedido === 'entregue' ? 'entregue'
      : statusPedido === 'em_entrega' ? 'em_entrega'
      : 'em_preparo'

    // Não notifica quando ainda está aguardando (recém enviado)
    if (key === 'aguardando') return

    const info = STATUS_MESA[key]
    playSoundPorStatus(statusPedido as 'pendente' | 'em_preparo' | 'em_entrega' | 'entregue' | 'recusado')
    vibrar()
    setNotifBanner(info)
    setTimeout(() => setNotifBanner(null), 5000)
    mostrarNotificacaoBrowser(`${info.emoji} Pedido #${numeroPedido}`, {
      body: info.label,
      tag: `mesa-pedido-${numeroPedido}-${key}`,
    })
  }

  useEffect(() => {
    const mesaRaw = sessionStorage.getItem('pwa_mesa')
    if (!mesaRaw) { router.replace(`/pwa/mesa/${numero}`); return }
    const mesa = JSON.parse(mesaRaw)
    if (mesa.numero !== numero) { router.replace(`/pwa/mesa/${numero}`); return }
    setMesaNome(mesa.nome)
    carregarSessao()
  }, [numero, router, carregarSessao])

  // Desbloqueia áudio na primeira interação do usuário com a página (iOS/Android)
  useEffect(() => {
    const unlock = () => {
      desbloquearAudio()
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('click', unlock)
    window.addEventListener('touchstart', unlock)
    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [])

  // Realtime — escuta UPDATE em pedidos
  // IMPORTANTE: sem REPLICA IDENTITY FULL na tabela, filtros server-side em UPDATE não funcionam.
  // Por isso assinamos SEM filtro e filtramos client-side pelo mesa_numero.
  useEffect(() => {
    if (!numero) return
    const supabase = createClient()
    const channel = supabase
      .channel(`pwa-mesa-comanda-${numero}`)
      // UPDATE: sem filtro server-side → filtra client-side
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pedidos',
      }, payload => {
        const novo = payload.new as { id: number; status_pedido: string; status_validacao: string; motivo_recusa?: string; numero_seq: number; mesa_numero?: number }
        // Ignora pedidos de outras mesas
        if (novo.mesa_numero !== numero) return
        // Atualiza só o pedido que mudou, sem recarregar tudo
        setSessao(prev => {
          if (!prev) return prev
          return {
            ...prev,
            pedidos: prev.pedidos.map(p =>
              p.id === novo.id
                ? { ...p, status_pedido: novo.status_pedido, status_validacao: novo.status_validacao, motivo_recusa: novo.motivo_recusa ?? null }
                : p
            ),
          }
        })
        dispararNotificacao(novo.numero_seq, novo.status_pedido, novo.status_validacao)
      })
      // INSERT: filtro server-side funciona sem REPLICA IDENTITY FULL
      // Recarrega a sessão quando outro dispositivo na mesma mesa faz um pedido
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'pedidos',
        filter: `mesa_numero=eq.${numero}`,
      }, () => {
        carregarSessao()
      })
      .subscribe()

    // Polling a cada 30s como fallback caso o realtime falhe
    const interval = setInterval(carregarSessao, 30000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero, carregarSessao])

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

      {/* Solicita permissão de notificação na primeira vez */}
      <NotifPrompt />

      {/* Banner de notificação */}
      {notifBanner && (
        <div
          onClick={() => setNotifBanner(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div style={{
            background: notifBanner.bg,
            border: `2px solid ${notifBanner.borda}`,
            borderRadius: 24, padding: '32px 28px', textAlign: 'center',
            maxWidth: 320, width: '100%',
            boxShadow: '0 20px 60px -12px rgba(0,0,0,0.35)',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>{notifBanner.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: notifBanner.cor, marginBottom: 8 }}>{notifBanner.label}</div>
            <div style={{ fontSize: 12, color: notifBanner.cor, opacity: 0.7 }}>Toque para fechar</div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="pwa-navbar">
        <button onClick={() => router.push('/pwa/cardapio')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>🍽️ Mesa {numero}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Minha Comanda</div>
        </div>
        <button
          onClick={carregarSessao}
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

        {erro &&<p style={{ color: 'var(--pwa-red-ink)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{erro}</p>}

        {!sessao || sessao.pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--pwa-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
            <p style={{ fontSize: 14 }}>Nenhum pedido ainda.<br />Adicione itens pelo cardápio!</p>
          </div>
        ) : (
          sessao.pedidos.map(pedido => {
            const key = getStatusKey(pedido)
            const status = STATUS_MESA[key]
            return (
              <div key={pedido.id} style={{ background: '#fff', border: `1px solid ${status.borda}`, borderLeft: `4px solid ${status.cor}`, borderRadius: 'var(--pwa-r-md)', marginBottom: 12, overflow: 'hidden' }}>
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
                      <span>
                        <span style={{ fontWeight: 600, color: 'var(--pwa-primary)' }}>{item.quantidade}×</span> {item.nome_snapshot}
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

                {/* Barra de progresso do pedido */}
                {pedido.status_validacao !== 'recusado' && (
                  <div style={{ padding: '8px 14px 12px', borderTop: '1px solid #F0EDE6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      {(['aguardando', 'em_preparo', 'em_entrega', 'entregue'] as const).map((s, i) => {
                        const ativo = key === s
                        const feito = ['aguardando', 'em_preparo', 'em_entrega', 'entregue'].indexOf(key) > i
                        return (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                              background: feito ? STATUS_MESA[s].cor : ativo ? STATUS_MESA[s].cor : '#E0DDD5',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11,
                            }}>
                              {feito ? <span style={{ color: '#fff', fontSize: 10 }}>✓</span>
                                : ativo ? <span style={{ color: '#fff' }}>{STATUS_MESA[s].emoji}</span>
                                : <span style={{ color: '#aaa', fontSize: 9 }}>{i + 1}</span>}
                            </div>
                            {i < 3 && (
                              <div style={{ flex: 1, height: 2, background: feito ? STATUS_MESA[s].cor : '#E0DDD5', margin: '0 2px' }} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      {['Enviado', 'Confirmado', 'Preparando', 'Servido'].map((l, i) => (
                        <div key={l} style={{ fontSize: 9, color: '#aaa', textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center', flex: i < 3 ? 1 : 'none' }}>{l}</div>
                      ))}
                    </div>
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

        {/* Indicador tempo real */}
        <p style={{ fontSize: 11, color: 'var(--pwa-muted)', textAlign: 'center', marginTop: 16 }}>
          <span className="pwa-live-dot" style={{ display: 'inline-block', marginRight: 4, background: '#0F6E56' }} />
          Atualizando em tempo real
        </p>
      </div>

      {/* Bottom bar */}
      <div className="pwa-bottom-bar">
        <button className="pwa-btn pwa-btn-primary" onClick={() => router.push('/pwa/cardapio')}>
          🛒 Pedir mais itens
        </button>
      </div>
    </div>
  )
}
