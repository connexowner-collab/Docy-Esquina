'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  playNewOrderAlert,
  mostrarNotificacaoBrowser,
  desbloquearAudio,
  pedirPermissaoNotificacao,
} from '@/lib/notificationSound'

/**
 * Componente sempre montado no layout do dashboard.
 * Monitora novos pedidos pendentes (pwa + mesa) via Realtime e polling 15s.
 * Quando detecta pedido novo: toca som, notificação browser, pisca título e
 * exibe banner fixo no topo — independente da página aberta.
 */
export default function NovosPedidosMonitor() {
  const [banner, setBanner] = useState(false)
  const [notifAtivada, setNotifAtivada] = useState(false)
  const knownIds = useRef<Set<number>>(new Set())
  const primeiraRef = useRef(true)
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      setNotifAtivada(true)
    }
  }, [])

  function dispararAlerta() {
    playNewOrderAlert()
    mostrarNotificacaoBrowser('🔔 Novo pedido!', {
      body: 'Um cliente fez um pedido. Acesse Pedidos Online.',
      tag: 'novo-pedido',
    })
    // Pisca o título da aba
    const titulo = document.title
    let flip = true
    const iv = setInterval(() => { document.title = flip ? '🔔 NOVO PEDIDO!' : titulo; flip = !flip }, 600)
    setTimeout(() => { clearInterval(iv); document.title = titulo }, 8000)
    // Banner topo
    setBanner(true)
    if (bannerTimer.current) clearTimeout(bannerTimer.current)
    bannerTimer.current = setTimeout(() => setBanner(false), 7000)
  }

  const verificar = useCallback(async () => {
    try {
      const supabase = createClient()
      const hoje = new Date().toISOString().slice(0, 10)
      const { data } = await supabase
        .from('pedidos')
        .select('id')
        .in('origem', ['pwa', 'mesa'])
        .eq('status_validacao', 'pendente')
        .gte('created_at', `${hoje}T00:00:00`)

      if (!data) return
      const novos = data.filter(p => !knownIds.current.has(p.id))
      knownIds.current = new Set(data.map(p => p.id))

      if (!primeiraRef.current && novos.length > 0) dispararAlerta()
      primeiraRef.current = false
    } catch { /* silencioso */ }
  }, [])

  useEffect(() => {
    verificar()
    const supabase = createClient()
    const ch = supabase
      .channel('monitor-global-pedidos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pedidos' }, verificar)
      .subscribe()
    const timer = setInterval(verificar, 15000)
    return () => { supabase.removeChannel(ch); clearInterval(timer) }
  }, [verificar])

  async function ativar() {
    desbloquearAudio()
    const p = await pedirPermissaoNotificacao()
    setNotifAtivada(p === 'granted')
  }

  return (
    <>
      {/* Banner fixo — aparece em qualquer página do dashboard */}
      {banner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: '#C0392B', color: '#fff',
          padding: '13px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🔔</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Novo pedido recebido!</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Acesse Pedidos Online para aceitar.</div>
          </div>
          <Link
            href="/dashboard/pedidos-online"
            onClick={() => setBanner(false)}
            style={{
              color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
              background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 8,
              flexShrink: 0,
            }}
          >
            Ver pedidos →
          </Link>
          <button
            onClick={() => setBanner(false)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0, flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Botão flutuante para ativar som/notificações (some após ativar) */}
      {!notifAtivada && (
        <button
          onClick={ativar}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 500,
            background: '#1a1a2e', color: '#fff',
            border: 'none', borderRadius: 12,
            padding: '11px 16px',
            fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            opacity: 0.9,
          }}
        >
          🔔 Ativar alertas sonoros
        </button>
      )}
    </>
  )
}
