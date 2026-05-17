'use client'

import { useEffect, useState } from 'react'
import { desbloquearAudio, pedirPermissaoNotificacao } from '@/lib/notificationSound'

/**
 * Modal bottom-sheet que solicita permissão de notificação ao usuário.
 * Deve ser renderizado nas páginas de acompanhamento (comanda e status de entrega).
 *
 * - Só aparece se a permissão ainda não foi definida ('default').
 * - O clique no botão é o gesto de usuário necessário para o iOS aceitar requestPermission().
 * - Também desbloqueia o contexto de áudio para sons de notificação.
 */
export default function NotifPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'default') {
      // Pequeno delay para não disputar com animações de entrada da página
      const t = setTimeout(() => setShow(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  if (!show) return null

  async function ativar() {
    desbloquearAudio()
    await pedirPermissaoNotificacao()
    setShow(false)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'flex-end',
        animation: 'pwa-slide-up 0.25s ease',
      }}
      onClick={() => setShow(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          width: '100%',
          borderRadius: '20px 20px 0 0',
          padding: '28px 24px 44px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Alça visual */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#ddd', margin: '0 auto 20px' }} />

        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>🔔</div>

        <h3 style={{
          margin: '0 0 8px', textAlign: 'center',
          fontSize: 20, fontWeight: 800, color: '#1E1E1C',
        }}>
          Ativar notificações
        </h3>

        <p style={{
          margin: '0 0 24px', textAlign: 'center',
          fontSize: 14, color: '#666', lineHeight: 1.6,
        }}>
          Você será avisado quando seu pedido for confirmado, estiver pronto e a cada atualização de status — mesmo com o app em segundo plano.
        </p>

        <button
          onClick={ativar}
          style={{
            width: '100%', padding: '15px',
            background: '#C0392B', color: '#fff',
            border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer', marginBottom: 10,
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px -4px rgba(192,57,43,0.45)',
          }}
        >
          🔔 Sim, quero ser notificado
        </button>

        <button
          onClick={() => setShow(false)}
          style={{
            width: '100%', padding: '12px',
            background: 'transparent', color: '#aaa',
            border: 'none', borderRadius: 14,
            fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Agora não
        </button>
      </div>
    </div>
  )
}
