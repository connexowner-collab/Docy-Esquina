'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-mail ou senha inválidos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 24px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Docy Esquina</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', width: '100%', maxWidth: 860, display: 'flex', overflow: 'hidden', minHeight: 480 }}>

          {/* Left panel — kitchen photo */}
          <div style={{
            flex: '0 0 44%',
            position: 'relative',
            backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 32,
          }}>
            {/* Dark overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 100%)', borderRadius: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.3, margin: '0 0 10px' }}>
                Precision in every detail,<br />excellence in every service.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                Experience the next generation of culinary management.<br />Designed for the masters of the kitchen.
              </p>
            </div>
          </div>

          {/* Right panel — form */}
          <div style={{ flex: 1, padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#C0392B', margin: '0 0 2px' }}>Docy Esquina</h1>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: 1.5, margin: '0 0 20px', textTransform: 'uppercase' }}>Management Portal</p>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>Seja bem-vindo</h2>
              <p style={{ fontSize: 13, color: '#777', margin: 0 }}>Acesse sua conta para gerenciar sua cozinha.</p>
            </div>

            <form onSubmit={handleLogin}>
              {/* E-mail */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' }}>
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="nome@docyesquina.com"
                  style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = '#fafafa' }}
                />
              </div>

              {/* Senha */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    Senha
                  </label>
                  <a href="#" style={{ fontSize: 12, color: '#C0392B', fontWeight: 600, textDecoration: 'none' }}>
                    Esqueceu a senha?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#1a1a1a', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = '#C0392B'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = '#fafafa' }}
                />
              </div>

              {/* Remember me */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: '#C0392B', cursor: 'pointer' }}
                />
                <label htmlFor="remember" style={{ fontSize: 13, color: '#555', cursor: 'pointer' }}>
                  Lembrar-me neste dispositivo
                </label>
              </div>

              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                  <p style={{ color: '#DC2626', fontSize: 13, margin: 0 }}>{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#e08080' : '#C0392B',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '13px 0',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.background = '#A93226' }}
                onMouseLeave={e => { if (!loading) (e.target as HTMLButtonElement).style.background = '#C0392B' }}
              >
                {loading ? 'Entrando...' : <>Entrar <span style={{ fontSize: 16 }}>→</span></>}
              </button>

              {/* Contact admin */}
              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
                Precisa de acesso?{' '}
                <a href="mailto:admin@docyesquina.com" style={{ color: '#C0392B', fontWeight: 600, textDecoration: 'none' }}>
                  Contate o administrador
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e5e5', background: '#fff', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#aaa' }}>© 2024 Docy Esquina Culinary Management. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms of Service', 'Contact Support'].map(link => (
            <a key={link} href="#" style={{ fontSize: 12, color: '#aaa', textDecoration: 'none' }}>{link}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
