'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function formatPhone(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

type ClienteData = {
  clienteId: number
  nome: string
  telefone: string
  enderecos: Endereco[]
}

type Endereco = {
  id: number
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  referencia?: string
  cep?: string
}

type Step = 'phone' | 'loading' | 'found' | 'not-found' | 'new-client' | 'address'

export default function PwaIdentPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [rawDigits, setRawDigits] = useState('')
  const [step, setStep] = useState<Step>('phone')
  const [cliente, setCliente] = useState<ClienteData | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<number | null>(null)
  const [novoEnd, setNovoEnd] = useState<boolean>(false)
  const [config, setConfig] = useState<{ aberto: boolean; nomeEstabelecimento: string; mensagemFechado: string } | null>(null)

  // Novo cliente
  const [novoNome, setNovoNome] = useState('')
  const [novoCep, setNovoCep] = useState('')
  const [novoLogradouro, setNovoLogradouro] = useState('')
  const [novoNumero, setNovoNumero] = useState('')
  const [novoBairro, setNovoBairro] = useState('')
  const [novoComplemento, setNovoComplemento] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [cadastrando, setCadastrando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  useEffect(() => {
    fetch('/api/pwa/config').then(r => r.json()).then(setConfig).catch(() => {})
  }, [])

  async function buscarCliente(digits: string) {
    setStep('loading')
    try {
      const res = await fetch(`/api/pwa/clientes?telefone=${digits}`)
      const data = await res.json()
      if (res.ok && data.encontrado) {
        setCliente(data)
        setSelectedEnd(data.enderecos?.[0]?.id ?? null)
        setStep('found')
      } else {
        setStep('not-found')
      }
    } catch {
      setStep('not-found')
    }
  }

  function handlePhoneChange(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 11)
    setRawDigits(digits)
    if (digits.length === 10 || digits.length === 11) {
      buscarCliente(digits)
    }
  }

  async function buscarCep(cep: string) {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setBuscandoCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setNovoLogradouro(data.logradouro || '')
        setNovoBairro(data.bairro || '')
      }
    } catch {}
    setBuscandoCep(false)
  }

  function salvarClienteLocal(data: ClienteData) {
    localStorage.setItem('pwa_cliente', JSON.stringify(data))
  }

  function continuarComCliente(c: ClienteData, endId: number) {
    salvarClienteLocal(c)
    localStorage.setItem('pwa_endereco_id', String(endId))
    router.push('/pwa/cardapio')
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault()
    if (!novoNome.trim() || !novoLogradouro || !novoBairro || !novoNumero) {
      setErroForm('Preencha todos os campos obrigatórios')
      return
    }
    setCadastrando(true)
    setErroForm('')
    try {
      const res = await fetch('/api/pwa/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoNome,
          telefone: rawDigits,
          enderecos: [{
            logradouro: novoLogradouro,
            numero: novoNumero,
            complemento: novoComplemento || null,
            bairro: novoBairro,
            cep: novoCep.replace(/\D/g, '') || null,
          }],
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErroForm(data.error || 'Erro ao cadastrar'); return }

      const clienteData: ClienteData = {
        clienteId: data.clienteId,
        nome: novoNome,
        telefone: rawDigits,
        enderecos: [{
          id: data.enderecoId,
          logradouro: novoLogradouro,
          numero: novoNumero,
          complemento: novoComplemento || undefined,
          bairro: novoBairro,
          cep: novoCep || undefined,
        }],
      }
      continuarComCliente(clienteData, data.enderecoId)
    } catch {
      setErroForm('Erro de conexão')
    } finally {
      setCadastrando(false)
    }
  }

  // Fechado
  if (config && !config.aberto) {
    return (
      <div className="pwa-screen">
        <div className="pwa-hero" style={{ flex: 1, justifyContent: 'center' }}>
          <div className="pwa-hero-logo">🍔</div>
          <h1>{config.nomeEstabelecimento}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
            {config.mensagemFechado}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pwa-screen">
      {/* Hero */}
      <div className="pwa-hero">
        <div className="pwa-hero-logo">🍔</div>
        <h1>{config?.nomeEstabelecimento ?? 'Docy Esquina'}</h1>
        <div className="pwa-hero-status">
          <span className="pwa-live-dot" />
          Aberto agora
        </div>
      </div>

      {/* Sheet */}
      <div className="pwa-sheet">

        {/* STEP: digitar telefone */}
        {(step === 'phone' || step === 'loading') && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px', color: 'var(--pwa-ink)' }}>
              Qual é o seu número?
            </h2>
            <p style={{ fontSize: 13, color: 'var(--pwa-muted)', margin: '0 0 20px' }}>
              Vamos identificar ou cadastrar você rapidinho
            </p>

            {/* Campo de telefone — teclado nativo do celular */}
            <div
              className={`pwa-phone-display${!rawDigits ? ' empty' : ''}`}
              onClick={() => inputRef.current?.focus()}
            >
              {rawDigits ? formatPhone(rawDigits) : 'Digite seu telefone'}
              <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={rawDigits}
                onChange={e => handlePhoneChange(e.target.value)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                autoFocus
              />
            </div>

            {step === 'loading' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 0' }}>
                <div className="pwa-spinner" />
                <span style={{ color: 'var(--pwa-muted)', fontSize: 14 }}>Buscando...</span>
              </div>
            )}

            {rawDigits.length > 0 && rawDigits.length < 10 && (
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--pwa-muted)', marginTop: 8 }}>
                DDD + número ({rawDigits.length}/10-11 dígitos)
              </p>
            )}
          </>
        )}

        {/* STEP: cliente encontrado */}
        {step === 'found' && cliente && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Olá, {cliente.nome.split(' ')[0]}! 👋</h2>
            <p style={{ fontSize: 13, color: 'var(--pwa-muted)', margin: '0 0 18px' }}>
              Identificamos sua conta. Escolha o endereço de entrega.
            </p>

            {/* Box cliente */}
            <div style={{ background: 'var(--pwa-amber-bg)', border: '1px solid var(--pwa-amber-border)', borderRadius: 'var(--pwa-r-lg)', padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className="pwa-avatar">{cliente.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{cliente.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--pwa-muted)' }}>{formatPhone(cliente.telefone)}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'var(--pwa-green-bg)', color: 'var(--pwa-green-ink)' }}>
                CLIENTE
              </span>
            </div>

            {/* Endereços */}
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', marginBottom: 10 }}>
              ENDEREÇO DE ENTREGA
            </p>

            {cliente.enderecos.map(end => (
              <div
                key={end.id}
                className={`pwa-addr-card${selectedEnd === end.id ? ' selected' : ''}`}
                onClick={() => { setSelectedEnd(end.id); setNovoEnd(false) }}
              >
                <div className="radio" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pwa-ink)' }}>
                    {end.logradouro}, {end.numero}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--pwa-muted)' }}>{end.bairro}</div>
                  {end.complemento && <div style={{ fontSize: 11, color: 'var(--pwa-muted)' }}>{end.complemento}</div>}
                </div>
              </div>
            ))}

            <button className="pwa-btn pwa-btn-primary" style={{ marginTop: 8 }}
              disabled={!selectedEnd}
              onClick={() => continuarComCliente(cliente, selectedEnd!)}>
              Continuar →
            </button>

            <button className="pwa-btn pwa-btn-ghost" style={{ marginTop: 8 }}
              onClick={() => { setStep('phone'); setRawDigits(''); setCliente(null); setTimeout(() => inputRef.current?.focus(), 100) }}>
              Não sou eu
            </button>
          </>
        )}

        {/* STEP: não encontrado */}
        {step === 'not-found' && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Primeira vez aqui? 🎉</h2>
            <p style={{ fontSize: 13, color: 'var(--pwa-muted)', margin: '0 0 18px' }}>
              Não encontramos esse número. Vamos criar sua conta rapidinho!
            </p>

            <div style={{ background: 'var(--pwa-blue-bg)', border: '1px solid var(--pwa-blue-border)', borderRadius: 'var(--pwa-r-lg)', padding: '12px 14px', marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--pwa-blue-ink)' }}>Número digitado</div>
              <div style={{ fontSize: 15, color: 'var(--pwa-blue-ink)', fontWeight: 500 }}>{formatPhone(rawDigits)}</div>
            </div>

            <form onSubmit={handleCadastrar}>
              {/* Nome */}
              <div className="pwa-field">
                <label>Nome completo <span className="req">*</span></label>
                <input className="pwa-input" value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Seu nome" required />
              </div>

              {/* CEP */}
              <div className="pwa-field">
                <label>CEP</label>
                <input
                  className="pwa-input"
                  value={novoCep}
                  placeholder="00000-000"
                  inputMode="numeric"
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 8)
                    const fmt = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v
                    setNovoCep(fmt)
                    if (v.length === 8) buscarCep(v)
                  }}
                />
                {buscandoCep && <span style={{ fontSize: 11, color: 'var(--pwa-muted)' }}>Buscando endereço...</span>}
              </div>

              {/* Logradouro */}
              <div className="pwa-field">
                <label>Rua / Avenida <span className="req">*</span></label>
                <input className="pwa-input" value={novoLogradouro} onChange={e => setNovoLogradouro(e.target.value)} placeholder="Nome da rua" required />
              </div>

              {/* Número + Bairro */}
              <div className="pwa-input-row">
                <div className="pwa-field">
                  <label>Número <span className="req">*</span></label>
                  <input className="pwa-input" value={novoNumero} onChange={e => setNovoNumero(e.target.value)} placeholder="123" required />
                </div>
                <div className="pwa-field">
                  <label>Bairro <span className="req">*</span></label>
                  <input className="pwa-input" value={novoBairro} onChange={e => setNovoBairro(e.target.value)} placeholder="Bairro" required />
                </div>
              </div>

              {/* Complemento */}
              <div className="pwa-field">
                <label>Complemento</label>
                <input className="pwa-input" value={novoComplemento} onChange={e => setNovoComplemento(e.target.value)} placeholder="Apto, bloco... (opcional)" />
              </div>

              {erroForm && <p style={{ color: 'var(--pwa-red-ink)', fontSize: 13, marginBottom: 12 }}>{erroForm}</p>}

              <button className="pwa-btn pwa-btn-primary" type="submit" disabled={cadastrando}>
                {cadastrando ? 'Cadastrando...' : 'Criar conta e pedir →'}
              </button>
            </form>

            <button className="pwa-btn pwa-btn-ghost" style={{ marginTop: 8 }}
              onClick={() => { setStep('phone'); setRawDigits(''); setTimeout(() => inputRef.current?.focus(), 100) }}>
              ← Voltar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
