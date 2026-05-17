'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { playSoundPorStatus, vibrar, mostrarNotificacaoBrowser, desbloquearAudio } from '@/lib/notificationSound'
import NotifPrompt from '@/components/pwa/NotifPrompt'

type StatusPedido = 'pendente' | 'em_preparo' | 'em_entrega' | 'entregue' | 'recusado'

type Pedido = {
  id: number
  numero_seq: number
  status_pedido: StatusPedido
  motivo_recusa?: string
  status_updated_at?: string
  created_at: string
  subtotal: number
  taxa_entrega: number
  total: number
  pagamento: string
  troco?: number | null
  tipo_entrega: 'entrega' | 'retirada'
  clientes: { nome: string; telefone: string }
  enderecos: { logradouro: string; numero: string; bairro: string } | null
  itens_pedido: { nome_snapshot: string; preco_snapshot: number; quantidade: number; observacao_item?: string }[]
}

type StepState = 'done' | 'active' | 'pending' | 'refused'

function getSteps(status: StatusPedido, tipo: 'entrega' | 'retirada'): StepState[] {
  if (tipo === 'retirada') {
    switch (status) {
      case 'pendente':    return ['done', 'active', 'pending']
      case 'em_preparo':  return ['done', 'done', 'active']
      case 'em_entrega':
      case 'entregue':    return ['done', 'done', 'done']
      case 'recusado':    return ['done', 'refused', 'pending']
    }
  }
  switch (status) {
    case 'pendente':    return ['done', 'active', 'pending', 'pending']
    case 'em_preparo':  return ['done', 'done', 'active', 'pending']
    case 'em_entrega':  return ['done', 'done', 'done', 'active']
    case 'entregue':    return ['done', 'done', 'done', 'done']
    case 'recusado':    return ['done', 'refused', 'pending', 'pending']
  }
}

const STEP_LABELS_ENTREGA = ['Enviado', 'Confirmado', 'Em preparo', 'Entregue']
const STEP_LABELS_RETIRADA = ['Enviado', 'Confirmado', 'Pronto p/ retirar']

const STATUS_INFO: Record<StatusPedido, { cor: string; titulo: string; texto: string; icone: string; tituloRetirada?: string; textoRetirada?: string; iconeRetirada?: string }> = {
  pendente:   { cor: 'amber', titulo: 'Aguardando confirmação', texto: 'Seu pedido foi recebido e está aguardando confirmação do estabelecimento.', icone: '⏳' },
  em_preparo: { cor: 'green', titulo: 'Pedido aceito! Em preparo', texto: 'Ótimo! Seu pedido foi confirmado e está sendo preparado com carinho.', icone: '✅' },
  em_entrega: { cor: 'blue',  titulo: 'Saiu para entrega!', texto: 'Seu pedido está a caminho. Fique de olho!', icone: '🛵' },
  entregue:   { cor: 'green', titulo: 'Entregue com sucesso!', texto: 'Bom apetite! Esperamos que você aproveite seu pedido.', icone: '✓✓', tituloRetirada: 'Pode vir buscar!', textoRetirada: 'Seu pedido está pronto. Venha retirar no balcão!' , iconeRetirada: '🏪' },
  recusado:   { cor: 'red',   titulo: 'Pedido recusado', texto: 'Infelizmente seu pedido não pôde ser aceito neste momento.', icone: '❌' },
}

function fmtMoeda(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}

function fmtTempo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'agora'
  if (diff < 60) return `${diff}min atrás`
  return `${Math.floor(diff / 60)}h atrás`
}

export default function PwaStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [tempoAtual, setTempoAtual] = useState(Date.now())
  const [notifBanner, setNotifBanner] = useState<{ icone: string; titulo: string; cor: string } | null>(null)
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('Docy Esquina')

  function dispararNotificacao(status: StatusPedido) {
    const info = STATUS_INFO[status]
    if (!info) return
    playSoundPorStatus(status)
    vibrar()
    setNotifBanner({ icone: info.icone, titulo: info.titulo, cor: info.cor })
    setTimeout(() => setNotifBanner(null), 5000)
    mostrarNotificacaoBrowser(`${info.icone} ${info.titulo}`, {
      body: info.texto,
      tag: `pedido-status-${status}`,
    })
  }

  useEffect(() => {
    // Buscar nome do estabelecimento
    fetch('/api/pwa/config').then(r => r.json()).then(d => { if (d?.nomeEstabelecimento) setNomeEstabelecimento(d.nomeEstabelecimento) }).catch(() => {})

    // Buscar snapshot inicial
    fetch(`/api/pwa/pedidos/${id}/status`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setErro(data.error); return }
        setPedido(data)
      })
      .catch(() => setErro('Erro ao carregar pedido'))
      .finally(() => setLoading(false))

    // Supabase Realtime — escutar atualizações do pedido
    const supabase = createClient()
    const channel = supabase
      .channel(`pwa-pedido-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pedidos',
        filter: `id=eq.${id}`,
      }, payload => {
        const novo = payload.new as { status_pedido: StatusPedido; motivo_recusa?: string; status_updated_at?: string }
        setPedido(prev => prev ? { ...prev, status_pedido: novo.status_pedido, motivo_recusa: novo.motivo_recusa, status_updated_at: novo.status_updated_at } : prev)
        dispararNotificacao(novo.status_pedido)
      })
      .subscribe()

    // Atualizar tempo a cada 30s
    const timer = setInterval(() => setTempoAtual(Date.now()), 30000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(timer)
    }
  }, [id])

  if (loading) {
    return (
      <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div className="pwa-spinner" />
        <span style={{ color: 'var(--pwa-muted)', fontSize: 14 }}>Carregando pedido...</span>
      </div>
    )
  }

  if (erro || !pedido) {
    return (
      <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <p style={{ color: 'var(--pwa-muted)' }}>{erro || 'Pedido não encontrado'}</p>
        <button className="pwa-btn pwa-btn-primary" style={{ maxWidth: 240, marginTop: 16 }} onClick={() => router.push('/pwa')}>Voltar ao início</button>
      </div>
    )
  }

  const status = pedido.status_pedido
  const tipo = pedido.tipo_entrega ?? 'entrega'
  const rawInfo = STATUS_INFO[status]
  const info = tipo === 'retirada'
    ? { cor: rawInfo.cor, titulo: rawInfo.tituloRetirada ?? rawInfo.titulo, texto: rawInfo.textoRetirada ?? rawInfo.texto, icone: rawInfo.iconeRetirada ?? rawInfo.icone }
    : rawInfo
  const steps = getSteps(status, tipo)
  const stepLabels = tipo === 'retirada' ? STEP_LABELS_RETIRADA : STEP_LABELS_ENTREGA

  const corBanner: Record<string, { bg: string; borda: string; texto: string }> = {
    amber: { bg: '#FFF8E6', borda: '#F5C070', texto: '#9A6700' },
    green: { bg: '#E8F9EF', borda: '#6AE0A0', texto: '#0F6E56' },
    blue:  { bg: '#E8F0FC', borda: '#7AB4F4', texto: '#185FA5' },
    red:   { bg: '#FDECEA', borda: '#F09595', texto: '#B33A3A' },
  }

  return (
    <div className="pwa-screen">
      {/* Solicita permissão de notificação na primeira vez */}
      <NotifPrompt />

      {/* Banner de notificação de status */}
      {notifBanner && (() => {
        const c = corBanner[notifBanner.cor] ?? corBanner.green
        return (
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
              background: c.bg, border: `2px solid ${c.borda}`,
              borderRadius: 24, padding: '32px 28px', textAlign: 'center',
              maxWidth: 320, width: '100%',
              boxShadow: '0 20px 60px -12px rgba(0,0,0,0.35)',
              animation: 'pwa-notif-pop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>{notifBanner.icone}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: c.texto, marginBottom: 8 }}>{notifBanner.titulo}</div>
              <div style={{ fontSize: 12, color: c.texto, opacity: 0.7 }}>Toque para fechar</div>
            </div>
          </div>
        )
      })()}

      {/* Hero vermelho */}
      <div style={{ background: 'var(--pwa-primary)', color: '#fff', padding: '52px 20px 24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{nomeEstabelecimento}</div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="pwa-live-dot" style={{ background: status === 'entregue' ? '#6BE5A1' : status === 'recusado' ? '#F09595' : '#6BE5A1' }} />
            Ao vivo
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Pedido #{pedido.numero_seq}</div>
        <div style={{ fontSize: 12, opacity: 0.78, marginTop: 4 }}>
          Feito {fmtTempo(pedido.created_at)} · {new Date(pedido.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 24px' }}>

        {/* Barra de progresso */}
        <div style={{ background: '#fff', margin: 12, borderRadius: 16, padding: '18px 16px 14px', boxShadow: '0 2px 8px -4px rgba(0,0,0,0.06)' }}>
          <div className="pwa-steps">
            {steps.map((s, i) => (
              <>
                <div key={`step-${i}`} className={`pwa-step ${s}`}>
                  <div className="pwa-step-dot">
                    {s === 'done' ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : s === 'refused' ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    ) : (
                      <span style={{ fontSize: 12 }}>{i + 1}</span>
                    )}
                  </div>
                  <div className="pwa-step-label">{stepLabels[i]}</div>
                </div>
                {i < steps.length - 1 && (
                  <div key={`line-${i}`} className={`pwa-step-line ${steps[i] === 'done' ? 'done' : ''}`} />
                )}
              </>
            ))}
          </div>
        </div>

        {/* Status box */}
        <div style={{ margin: '0 12px 12px' }}>
          <div className={`pwa-status-box ${info.cor}`}>
            <div style={{ fontSize: 28 }}>{info.icone}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{info.titulo}</div>
              <div style={{ fontSize: 13, lineHeight: 1.45, opacity: 0.85 }}>{info.texto}</div>
              {status === 'recusado' && pedido.motivo_recusa && (
                <div style={{ marginTop: 8, fontSize: 12, fontStyle: 'italic' }}>
                  Motivo: {pedido.motivo_recusa}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resumo do pedido */}
        <div style={{ background: '#fff', margin: '0 12px 12px', borderRadius: 14, padding: 14, border: '1px solid #EFEDE6' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', marginBottom: 10 }}>RESUMO</div>
          {pedido.itens_pedido.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, borderBottom: i < pedido.itens_pedido.length - 1 ? '1px solid #F2F0E8' : 'none' }}>
              <span style={{ color: 'var(--pwa-ink)' }}>{item.nome_snapshot} <span style={{ color: 'var(--pwa-muted)' }}>×{item.quantidade}</span></span>
              <span style={{ color: 'var(--pwa-ink-2)', fontVariantNumeric: 'tabular-nums' }}>{fmtMoeda(item.preco_snapshot * item.quantidade)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px dashed #E5E2DA', marginTop: 8, paddingTop: 8 }}>
            {tipo === 'entrega' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--pwa-muted)', marginBottom: 4 }}>
                <span>Taxa de entrega</span><span>{fmtMoeda(pedido.taxa_entrega)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, color: 'var(--pwa-ink-2)' }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--pwa-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmtMoeda(pedido.total)}</span>
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div style={{ background: '#fff', margin: '0 12px 12px', borderRadius: 14, padding: 14, border: '1px solid #EFEDE6' }}>
          {[
            tipo === 'retirada'
              ? { label: 'Retirada', value: 'No local — sem taxa de entrega' }
              : { label: 'Endereço', value: `${pedido.enderecos?.logradouro}, ${pedido.enderecos?.numero} — ${pedido.enderecos?.bairro}` },
            { label: 'Pagamento', value: pedido.pagamento === 'dinheiro' && pedido.troco
              ? `Dinheiro — Paga c/ ${fmtMoeda(pedido.troco)} (troco: ${fmtMoeda(pedido.troco - pedido.total)})`
              : pedido.pagamento.charAt(0).toUpperCase() + pedido.pagamento.slice(1) },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 12.5, borderBottom: '1px solid #F2F0E8' }}>
              <span style={{ color: 'var(--pwa-muted)' }}>{label}</span>
              <span style={{ color: 'var(--pwa-ink)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div style={{ padding: '0 12px' }}>
          {status !== 'entregue' && status !== 'recusado' && (
            <div style={{ textAlign: 'center', padding: '4px 0 12px' }}>
              <p style={{ fontSize: 12, color: 'var(--pwa-muted)', margin: '0 0 10px' }}>
                Esta página atualiza automaticamente em tempo real
              </p>
              <p style={{ fontSize: 12, color: '#0F6E56', fontWeight: 600, margin: 0 }}>
                🔔 Notificações ativas para este pedido
              </p>
            </div>
          )}
          <button
            className="pwa-btn pwa-btn-primary"
            onClick={() => { sessionStorage.removeItem('pwa_cart'); router.push('/pwa/cardapio') }}
          >
            {status === 'recusado' ? '🔄 Tentar fazer novo pedido' : '🛒 Fazer novo pedido'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button
              onClick={() => router.push('/pwa')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--pwa-muted)', textDecoration: 'underline', padding: '4px 8px' }}
            >
              ← voltar ao início
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
