'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavItem = { href: string; label: string; exact?: boolean; badge?: boolean; icon: React.ReactNode }

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Painel',
    exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    ),
  },
  {
    href: '/dashboard/novo-pedido',
    label: 'Pedidos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
    ),
  },
  {
    href: '/dashboard/pedidos-online',
    label: 'Pedidos Online',
    badge: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
    ),
  },
  {
    href: '/dashboard/cardapio',
    label: 'Cardápio',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
    ),
  },
  {
    href: '/dashboard/historico',
    label: 'Histórico',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    ),
  },
  {
    href: '/dashboard/clientes',
    label: 'Clientes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
    ),
  },
  {
    href: '/dashboard/mesas',
    label: 'Controle Mesas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M13 11h8a2 2 0 012 2v7a2 2 0 01-2 2h-8a2 2 0 01-2-2v-7a2 2 0 012-2z"/><path d="M17 11V8a2 2 0 00-4 0v3"/></svg>
    ),
  },
  {
    href: '/dashboard/qrcodes',
    label: 'QR Mesas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="4" height="4" rx="0.5"/><rect x="19" y="19" width="2" height="2"/><rect x="19" y="13" width="2" height="4"/><rect x="13" y="19" width="4" height="2"/></svg>
    ),
  },
  {
    href: '/dashboard/configuracoes',
    label: 'Configurações',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
    ),
  },
]

export default function Sidebar({ nomeEstabelecimento }: { nomeEstabelecimento: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [pedidosPendentes, setPedidosPendentes] = useState(0)
  const [pwaAberto, setPwaAberto] = useState<boolean | null>(null)
  const [togglingPwa, setTogglingPwa] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const hoje = new Date().toISOString().slice(0, 10)

    const fetchCount = async () => {
      const { count } = await supabase
        .from('pedidos')
        .select('id', { count: 'exact', head: true })
        .eq('origem', 'pwa')
        .eq('status_validacao', 'pendente')
        .gte('created_at', `${hoje}T00:00:00`)
      setPedidosPendentes(count ?? 0)
    }

    fetchCount()

    const channel = supabase
      .channel('sidebar-pedidos-badge')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos', filter: 'origem=eq.pwa' }, fetchCount)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Carrega estado inicial do PWA
  useEffect(() => {
    const supabase = createClient()
    supabase.from('configuracoes').select('pwa_ativo').single().then(({ data }) => {
      if (data) setPwaAberto(data.pwa_ativo ?? true)
    })
  }, [])

  async function togglePwa() {
    if (pwaAberto === null || togglingPwa) return
    setTogglingPwa(true)
    const novoEstado = !pwaAberto
    const supabase = createClient()
    await supabase.from('configuracoes').update({ pwa_ativo: novoEstado }).eq('id', 1)
    setPwaAberto(novoEstado)
    setTogglingPwa(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <img src="/LOGO.png" alt={nomeEstabelecimento} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 45%' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>{nomeEstabelecimento}</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#888', letterSpacing: 1.5, marginTop: 2, textTransform: 'uppercase' }}>Painel Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: active ? '#C0392B' : '#7a7a9a',
                background: active ? 'rgba(192,57,43,0.08)' : 'transparent',
                borderLeft: active ? '3px solid #C0392B' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && pedidosPendentes > 0 && (
                <span style={{ background: '#C0392B', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>
                  {pedidosPendentes}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Botão abrir/fechar PWA */}
        <button
          onClick={togglePwa}
          disabled={pwaAberto === null || togglingPwa}
          style={{
            width: '100%',
            background: pwaAberto ? '#0F6E56' : '#C0392B',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '11px 0',
            fontSize: 12,
            fontWeight: 700,
            cursor: pwaAberto === null || togglingPwa ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 8,
            opacity: togglingPwa ? 0.7 : 1,
            transition: 'background 0.25s, opacity 0.15s',
          }}
        >
          {togglingPwa ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'pwa-spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/><path d="M21 12a9 9 0 00-9-9"/></svg>
              Aguarde...
            </>
          ) : pwaAberto ? (
            <>
              {/* ícone check — aberto */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
              PWA Aberto — Fechar
            </>
          ) : (
            <>
              {/* ícone X — fechado */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              PWA Fechado — Abrir
            </>
          )}
        </button>

        {/* Support */}
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#666', cursor: 'pointer', textTransform: 'uppercase' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          Suporte
        </button>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#666', cursor: 'pointer', textTransform: 'uppercase' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sair
        </button>
      </div>
    </aside>
  )
}
