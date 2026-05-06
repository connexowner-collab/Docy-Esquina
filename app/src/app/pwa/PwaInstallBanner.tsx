'use client'

import { useEffect, useState } from 'react'

type InstallEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Registrar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Não mostrar se já está instalado (modo standalone)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true
    if (standalone) return

    // Não mostrar se já foi dispensado
    if (localStorage.getItem('pwa_install_dismissed') === '1') return

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream
    setIsIOS(iOS)

    if (iOS) {
      // Mostrar guia iOS após 4s na primeira visita
      const t = setTimeout(() => setShow(true), 4000)
      return () => clearTimeout(t)
    }

    // Android/Chrome: capturar o evento nativo
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as InstallEvent)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('pwa_install_dismissed', '1')
    setShow(false)
    setPrompt(null)
  }

  async function handleInstall() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') dismiss()
    setPrompt(null)
    setShow(false)
  }

  if (!show) return null

  // Banner Android / Chrome
  if (prompt) {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: '#fff',
        borderTop: '1px solid #EFEDE6',
        borderRadius: '16px 16px 0 0',
        padding: '18px 20px',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', gap: 14,
        maxWidth: 560, margin: '0 auto',
      }}>
        <img src="/LOGO.png" alt="Docy Esquina" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1E1E1C' }}>Instalar Docy Esquina</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Acesso rápido pela tela inicial</div>
        </div>
        <button
          onClick={handleInstall}
          style={{
            background: '#C0392B', color: '#fff', border: 'none',
            borderRadius: 10, padding: '10px 18px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', flexShrink: 0,
          }}
        >
          Instalar
        </button>
        <button
          onClick={dismiss}
          style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 20, cursor: 'pointer', padding: 4, lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    )
  }

  // Guia iOS / Safari
  if (isIOS) {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: '#fff',
        borderTop: '1px solid #EFEDE6',
        borderRadius: '16px 16px 0 0',
        padding: '20px 20px 32px',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <img src="/LOGO.png" alt="Docy Esquina" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1E1E1C' }}>Adicionar à Tela Inicial</div>
            <div style={{ fontSize: 12, color: '#888' }}>Acesso rápido, como um app</div>
          </div>
          <button
            onClick={dismiss}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#aaa', fontSize: 22, cursor: 'pointer', padding: 4, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          {[
            { n: '1', icon: '⎋', text: 'Toque no botão Compartilhar na barra do Safari' },
            { n: '2', icon: '＋', text: 'Role e toque em "Adicionar à Tela Inicial"' },
            { n: '3', icon: '✓', text: 'Confirme tocando em "Adicionar"' },
          ].map(step => (
            <div key={step.n} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#F5F3EF', border: '1px solid #EFEDE6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, margin: '0 auto 6px',
              }}>
                {step.icon}
              </div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.4 }}>{step.text}</div>
            </div>
          ))}
        </div>

        <button
          onClick={dismiss}
          style={{
            width: '100%', marginTop: 18,
            background: '#F5F3EF', border: 'none', borderRadius: 10,
            padding: '12px', fontSize: 14, fontWeight: 600,
            color: '#555', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Entendi
        </button>
      </div>
    )
  }

  return null
}
