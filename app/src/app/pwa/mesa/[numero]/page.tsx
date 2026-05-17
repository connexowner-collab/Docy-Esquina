'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { desbloquearAudio, pedirPermissaoNotificacao } from '@/lib/notificationSound'

export default function PwaMesaPage() {
  const router = useRouter()
  const params = useParams()
  const numero = Number(params.numero)

  const [nome, setNome] = useState('')
  const [config, setConfig] = useState<{ aberto: boolean; nomeEstabelecimento: string; mensagemFechado: string } | null>(null)
  const [erro, setErro] = useState('')
  const [verificando, setVerificando] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Limpa dados de cliente e carrinho
    sessionStorage.removeItem('pwa_cart')
    localStorage.removeItem('pwa_cliente')
    localStorage.removeItem('pwa_endereco_id')

    // Carrega config do estabelecimento
    fetch('/api/pwa/config').then(r => r.json()).then(setConfig).catch(() => {})

    // Verifica se já existe sessão aberta para esta mesa (sem precisar de nome)
    fetch(`/api/mesas/sessoes/ativa?mesa=${numero}`)
      .then(r => r.json())
      .then(data => {
        if (data.sessao) {
          // Existe sessão aberta — restaura no sessionStorage e vai direto pra comanda
          sessionStorage.setItem('pwa_mesa', JSON.stringify({
            numero,
            nome: data.sessao.nome_cliente,
          }))
          router.replace(`/pwa/mesa/${numero}/comanda`)
        } else {
          // Mesa livre — mostra formulário de nome
          setCarregando(false)
        }
      })
      .catch(() => setCarregando(false))
  }, [numero, router])

  async function handleEntrar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setErro('Digite seu nome para continuar'); return }
    setVerificando(true)
    setErro('')

    // Gesto de usuário — desbloqueia áudio e solicita permissão de notificação
    desbloquearAudio()
    pedirPermissaoNotificacao().catch(() => {})

    sessionStorage.setItem('pwa_mesa', JSON.stringify({ numero, nome: nome.trim() }))
    router.push('/pwa/cardapio')
  }

  // Enquanto verifica sessão aberta, mostra spinner
  if (carregando) {
    return (
      <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="pwa-spinner" />
      </div>
    )
  }

  if (config && !config.aberto) {
    return (
      <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>{config.nomeEstabelecimento}</div>
        <div style={{ fontSize: 14, color: 'var(--pwa-muted)', textAlign: 'center' }}>{config.mensagemFechado}</div>
      </div>
    )
  }

  return (
    <div className="pwa-screen">
      {/* Hero */}
      <div className="pwa-hero">
        <div className="pwa-hero-logo">
          <img src="/LOGO.png" alt="Logo" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        </div>
        <h1>{config?.nomeEstabelecimento ?? 'Docy Esquina'}</h1>
        <div className="pwa-hero-status">
          <span className="pwa-live-dot" />
          Aberto agora
        </div>
      </div>

      {/* Sheet */}
      <div className="pwa-sheet">
        {/* Badge da mesa */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--pwa-primary-light)', border: '1.5px solid var(--pwa-primary)',
          borderRadius: 12, padding: '8px 16px', marginBottom: 20, alignSelf: 'center',
        }}>
          <span style={{ fontSize: 22 }}>🍽️</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--pwa-primary)' }}>Mesa {numero}</span>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: 'var(--pwa-ink)' }}>
          Bem-vindo!
        </h2>
        <p style={{ fontSize: 13, color: 'var(--pwa-muted)', margin: '0 0 22px' }}>
          Consumo no local · Sem taxa de entrega
        </p>

        <form onSubmit={handleEntrar}>
          <div className="pwa-field">
            <label>Seu nome <span className="req">*</span></label>
            <input
              className="pwa-input"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Como devemos chamar você?"
              autoFocus
              autoComplete="given-name"
            />
          </div>

          {erro && <p style={{ color: 'var(--pwa-red-ink)', fontSize: 13, marginBottom: 12 }}>{erro}</p>}

          <button className="pwa-btn pwa-btn-primary" type="submit" disabled={verificando}>
            {verificando ? 'Aguarde...' : '🛒 Abrir cardápio →'}
          </button>
        </form>
      </div>
    </div>
  )
}
