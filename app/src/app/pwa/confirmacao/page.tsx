'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function ConfirmacaoContent() {
  const router = useRouter()
  const params = useSearchParams()
  const pedidoId = params.get('id')
  const numeroPedido = params.get('num')
  const [clienteNome, setClienteNome] = useState('')
  const [animado, setAnimado] = useState(false)

  useEffect(() => {
    const c = localStorage.getItem('pwa_cliente')
    if (c) setClienteNome(JSON.parse(c).nome?.split(' ')[0] ?? '')
    setTimeout(() => setAnimado(true), 50)
  }, [])

  if (!pedidoId) {
    router.replace('/pwa')
    return null
  }

  return (
    <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      {/* Ícone de check animado */}
      <div style={{
        width: 80, height: 80,
        borderRadius: '50%',
        background: 'var(--pwa-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        transform: animado ? 'scale(1)' : 'scale(0.5)',
        opacity: animado ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 8px 24px -6px rgba(192,57,43,0.5)',
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M8 20L16 28L32 12" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: 'var(--pwa-ink)' }}>
        Pedido enviado! 🎉
      </h2>
      <p style={{ fontSize: 14, color: 'var(--pwa-muted)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Recebemos seu pedido, {clienteNome}!<br />Aguarde a confirmação do estabelecimento.
      </p>

      {/* Card do pedido */}
      <div style={{ background: 'var(--pwa-amber-bg)', border: '1px solid var(--pwa-amber-border)', borderRadius: 'var(--pwa-r-lg)', padding: '18px 24px', marginBottom: 24, width: '100%', maxWidth: 320 }}>
        <div style={{ fontSize: 12, color: 'var(--pwa-amber-ink)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          Número do pedido
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--pwa-amber-ink)', fontVariantNumeric: 'tabular-nums' }}>
          #{numeroPedido}
        </div>
        <div style={{ fontSize: 12, color: 'var(--pwa-amber-ink)', marginTop: 6, opacity: 0.8 }}>
          Acompanhe o status em tempo real
        </div>
      </div>

      {/* Botões */}
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="pwa-btn pwa-btn-primary"
          onClick={() => router.push(`/pwa/status/${pedidoId}`)}>
          Acompanhar pedido →
        </button>
        <button
          className="pwa-btn pwa-btn-outline"
          onClick={() => {
            sessionStorage.removeItem('pwa_cart')
            router.push('/pwa/cardapio')
          }}>
          Fazer novo pedido
        </button>
      </div>
    </div>
  )
}

export default function PwaConfirmacaoPage() {
  return (
    <Suspense fallback={<div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center' }}><div className="pwa-spinner" /></div>}>
      <ConfirmacaoContent />
    </Suspense>
  )
}
