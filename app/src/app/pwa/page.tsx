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
  distancia_km?: number | null
  taxa_entrega?: number | null
}

type PedidoResumo = {
  id: number
  numero_seq: number
  status_pedido: string
  total: number
  created_at: string
  tipo_entrega: 'entrega' | 'retirada'
}

type Step = 'phone' | 'loading' | 'menu' | 'found' | 'not-found'

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Aguardando confirmação',
  em_preparo: 'Em preparo',
  em_entrega: 'Saiu para entrega',
  entregue: 'Entregue',
  recusado: 'Recusado',
}

const STATUS_COR: Record<string, string> = {
  pendente: '#B7800A',
  em_preparo: '#1A7A4A',
  em_entrega: '#1A5FA0',
  entregue: '#1A7A4A',
  recusado: '#C0392B',
}

const STATUS_BG: Record<string, string> = {
  pendente: '#FFF8E6',
  em_preparo: '#E8F9EF',
  em_entrega: '#E8F0FC',
  entregue: '#E8F9EF',
  recusado: '#FDECEA',
}

function isAtivo(status: string) {
  return status !== 'entregue' && status !== 'recusado'
}

export default function PwaIdentPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [rawDigits, setRawDigits] = useState('')
  const [step, setStep] = useState<Step>('phone')
  const [cliente, setCliente] = useState<ClienteData | null>(null)
  const [pedidos, setPedidos] = useState<PedidoResumo[]>([])
  const [selectedEnd, setSelectedEnd] = useState<number | null>(null)
  const [config, setConfig] = useState<{ aberto: boolean; nomeEstabelecimento: string; mensagemFechado: string } | null>(null)

  // Novo cliente (cadastro)
  const [novoNome, setNovoNome] = useState('')
  const [novoCep, setNovoCep] = useState('')
  const [novoLogradouro, setNovoLogradouro] = useState('')
  const [novoNumero, setNovoNumero] = useState('')
  const [novoBairro, setNovoBairro] = useState('')
  const [novoComplemento, setNovoComplemento] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [cadastrando, setCadastrando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  // Popup de frete
  const [fretePopup, setFretePopup] = useState<{ distancia_km: number | null; taxa: number | null; onConfirmar: () => void } | null>(null)

  // Adicionar endereço a cliente existente
  const [addingAddress, setAddingAddress] = useState(false)
  const [addCep, setAddCep] = useState('')
  const [addLogradouro, setAddLogradouro] = useState('')
  const [addNumero, setAddNumero] = useState('')
  const [addBairro, setAddBairro] = useState('')
  const [addComplemento, setAddComplemento] = useState('')
  const [addBuscandoCep, setAddBuscandoCep] = useState(false)
  const [addSalvando, setAddSalvando] = useState(false)
  const [addErro, setAddErro] = useState('')

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
        const ordersRes = await fetch(`/api/pwa/pedidos?clienteId=${data.clienteId}`)
        const ordersData = await ordersRes.json()
        setPedidos(ordersData.pedidos ?? [])
        setStep('menu')
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
    if (step === 'found' || step === 'menu') {
      if (digits.length < 10) {
        setStep('phone')
        setCliente(null)
        setPedidos([])
      } else {
        buscarCliente(digits)
      }
    } else {
      if (digits.length === 10 || digits.length === 11) {
        buscarCliente(digits)
      }
    }
  }

  async function buscarCep(cep: string, setLog: (v: string) => void, setBairro: (v: string) => void, setBuscando: (v: boolean) => void) {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setBuscando(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setLog(data.logradouro || '')
        setBairro(data.bairro || '')
      }
    } catch {}
    setBuscando(false)
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
          distancia_km: data.distancia_km ?? null,
          taxa_entrega: data.taxa ?? null,
        }],
      }

      // Mostra popup com taxa de entrega antes de ir ao cardápio
      setFretePopup({
        distancia_km: data.distancia_km ?? null,
        taxa: data.taxa ?? null,
        onConfirmar: () => {
          setFretePopup(null)
          continuarComCliente(clienteData, data.enderecoId)
        },
      })
    } catch {
      setErroForm('Erro de conexão')
    } finally {
      setCadastrando(false)
    }
  }

  async function handleAdicionarEndereco(e: React.FormEvent) {
    e.preventDefault()
    if (!addLogradouro || !addNumero || !addBairro) {
      setAddErro('Preencha rua, número e bairro')
      return
    }
    if (!cliente) return
    setAddSalvando(true)
    setAddErro('')
    try {
      const res = await fetch('/api/pwa/enderecos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: cliente.clienteId,
          logradouro: addLogradouro,
          numero: addNumero,
          complemento: addComplemento || null,
          bairro: addBairro,
          cep: addCep.replace(/\D/g, '') || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setAddErro(data.error || 'Erro ao salvar'); return }

      const novoEndereco: Endereco = {
        id: data.id,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || undefined,
        bairro: data.bairro,
        cep: data.cep || undefined,
        distancia_km: data.distancia_km ?? null,
        taxa_entrega: data.taxa_entrega ?? data.taxa ?? null,
      }
      const clienteAtualizado = { ...cliente, enderecos: [...cliente.enderecos, novoEndereco] }
      setCliente(clienteAtualizado)
      setSelectedEnd(novoEndereco.id)
      setAddingAddress(false)
      setAddCep(''); setAddLogradouro(''); setAddNumero(''); setAddBairro(''); setAddComplemento('')

      // Mostra popup com taxa de entrega
      if (data.distancia_km != null || data.taxa != null) {
        setFretePopup({
          distancia_km: data.distancia_km ?? null,
          taxa: data.taxa ?? null,
          onConfirmar: () => setFretePopup(null),
        })
      }
    } catch {
      setAddErro('Erro de conexão')
    } finally {
      setAddSalvando(false)
    }
  }

  // Fechado
  if (config && !config.aberto) {
    return (
      <div className="pwa-screen">
        <div className="pwa-hero" style={{ flex: 1, justifyContent: 'center' }}>
          <div className="pwa-hero-logo">
            <img src="/LOGO.png" alt="Logo" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} />
          </div>
          <h1>{config.nomeEstabelecimento}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
            {config.mensagemFechado}
          </p>
        </div>
      </div>
    )
  }

  const pedidosAtivos = pedidos.filter(p => isAtivo(p.status_pedido))
  const pedidosHistorico = pedidos.filter(p => !isAtivo(p.status_pedido))

  return (
    <div className="pwa-screen">

      {/* ── Popup de taxa de entrega ─────────────────────────────────────────── */}
      {fretePopup && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: '#fff', borderRadius: 24, padding: '28px 24px',
            textAlign: 'center', width: '100%', maxWidth: 340,
            animation: 'pwa-notif-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛵</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
              Taxa de entrega calculada
            </div>
            {fretePopup.distancia_km != null && (
              <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                Distância: <strong>{fretePopup.distancia_km.toFixed(1).replace('.', ',')} km</strong>
              </div>
            )}
            {fretePopup.taxa != null ? (
              <div style={{
                fontSize: 22, fontWeight: 800, color: '#C0530A',
                background: '#FFF4EC', borderRadius: 12, padding: '10px 20px',
                margin: '12px 0 20px',
              }}>
                R$ {fretePopup.taxa.toFixed(2).replace('.', ',')}
              </div>
            ) : (
              <div style={{ fontSize: 14, color: '#888', margin: '12px 0 20px' }}>
                Taxa calculada conforme distância
              </div>
            )}
            <button
              className="pwa-btn pwa-btn-primary"
              onClick={fretePopup.onConfirmar}
            >
              Entendido, ver cardápio →
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="pwa-hero">
        <div className="pwa-hero-logo">
          <img src="/LOGO.png" alt="Docy Esquina" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} />
        </div>
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

        {/* STEP: menu de opções */}
        {step === 'menu' && cliente && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div className="pwa-avatar">{cliente.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--pwa-ink)' }}>Olá, {cliente.nome.split(' ')[0]}! 👋</div>
                <div style={{ fontSize: 12, color: 'var(--pwa-muted)' }}>{formatPhone(rawDigits)}</div>
              </div>
              <button
                onClick={() => { setStep('phone'); setRawDigits(''); setPedidos([]); setTimeout(() => inputRef.current?.focus(), 100) }}
                style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--pwa-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, textDecoration: 'underline' }}
              >
                trocar
              </button>
            </div>

            {/* Pedidos em andamento */}
            {pedidosAtivos.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', margin: '0 0 8px' }}>
                  PEDIDO EM ANDAMENTO
                </p>
                {pedidosAtivos.map(p => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/pwa/status/${p.id}`)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      background: STATUS_BG[p.status_pedido] ?? '#F5F5F5',
                      border: `1.5px solid ${STATUS_COR[p.status_pedido] ?? '#ccc'}`,
                      borderRadius: 14, padding: '12px 14px', marginBottom: 8,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: 22 }}>
                      {p.status_pedido === 'pendente' ? '⏳' : p.status_pedido === 'em_preparo' ? '🍳' : '🛵'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: STATUS_COR[p.status_pedido] }}>
                        Pedido #{String(p.numero_seq).padStart(4, '0')}
                      </div>
                      <div style={{ fontSize: 12, color: STATUS_COR[p.status_pedido], opacity: 0.85 }}>
                        {STATUS_LABEL[p.status_pedido]}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pwa-ink-2)' }}>
                      R$ {Number(p.total).toFixed(2).replace('.', ',')}
                    </div>
                    <div style={{ fontSize: 16, color: STATUS_COR[p.status_pedido] }}>›</div>
                  </button>
                ))}
              </div>
            )}

            {/* Fazer novo pedido */}
            <button
              className="pwa-btn pwa-btn-primary"
              onClick={() => setStep('found')}
              style={{ marginBottom: pedidosHistorico.length > 0 ? 16 : 0 }}
            >
              🛒 Fazer novo pedido
            </button>

            {/* Histórico */}
            {pedidosHistorico.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', margin: '0 0 8px' }}>
                  HISTÓRICO
                </p>
                {pedidosHistorico.slice(0, 3).map(p => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/pwa/status/${p.id}`)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      background: '#FAFAF8', border: '1px solid #EFEDE6',
                      borderRadius: 12, padding: '10px 12px', marginBottom: 6,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--pwa-ink)' }}>
                        Pedido #{String(p.numero_seq).padStart(4, '0')}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--pwa-muted)' }}>
                        {new Date(p.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--pwa-ink-2)' }}>
                      R$ {Number(p.total).toFixed(2).replace('.', ',')}
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                      background: STATUS_BG[p.status_pedido] ?? '#eee',
                      color: STATUS_COR[p.status_pedido] ?? '#666',
                    }}>
                      {p.status_pedido === 'entregue' ? 'ENTREGUE' : 'RECUSADO'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* STEP: cliente encontrado — seleção de endereço */}
        {step === 'found' && cliente && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Escolha o endereço</h2>
            <p style={{ fontSize: 13, color: 'var(--pwa-muted)', margin: '0 0 14px' }}>
              Para onde devemos entregar?
            </p>

            {/* Campo de telefone editável */}
            <div
              className="pwa-phone-display"
              onClick={() => inputRef.current?.focus()}
              style={{ marginBottom: 16, fontSize: 15 }}
            >
              {formatPhone(rawDigits)}
              <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={rawDigits}
                onChange={e => handlePhoneChange(e.target.value)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
              />
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--pwa-muted)', fontWeight: 400 }}>toque para trocar</span>
            </div>

            {/* Endereços */}
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', marginBottom: 10 }}>
              ENDEREÇO DE ENTREGA
            </p>

            {cliente.enderecos.map(end => (
              <div
                key={end.id}
                className={`pwa-addr-card${selectedEnd === end.id ? ' selected' : ''}`}
                onClick={() => { setSelectedEnd(end.id); setAddingAddress(false) }}
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

            {/* Botão adicionar novo endereço */}
            {!addingAddress && (
              <button
                className="pwa-btn pwa-btn-ghost"
                style={{ marginTop: 8, fontSize: 13, color: 'var(--pwa-primary)' }}
                onClick={() => { setAddingAddress(true); setSelectedEnd(null) }}>
                + Adicionar novo endereço
              </button>
            )}

            {/* Formulário de novo endereço inline */}
            {addingAddress && (
              <form onSubmit={handleAdicionarEndereco} style={{ background: 'var(--pwa-bg-input)', borderRadius: 'var(--pwa-r-lg)', padding: '14px 14px 10px', marginTop: 10, border: '1px solid var(--pwa-border)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', margin: '0 0 12px' }}>NOVO ENDEREÇO</p>

                <div className="pwa-field">
                  <label>CEP</label>
                  <input
                    className="pwa-input"
                    value={addCep}
                    placeholder="00000-000"
                    inputMode="numeric"
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 8)
                      const fmt = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v
                      setAddCep(fmt)
                      if (v.length === 8) buscarCep(v, setAddLogradouro, setAddBairro, setAddBuscandoCep)
                    }}
                  />
                  {addBuscandoCep && <span style={{ fontSize: 11, color: 'var(--pwa-muted)' }}>Buscando endereço...</span>}
                </div>

                <div className="pwa-field">
                  <label>Rua / Avenida <span className="req">*</span></label>
                  <input className="pwa-input" value={addLogradouro} onChange={e => setAddLogradouro(e.target.value)} placeholder="Nome da rua" required />
                </div>

                <div className="pwa-input-row">
                  <div className="pwa-field">
                    <label>Número <span className="req">*</span></label>
                    <input className="pwa-input" value={addNumero} onChange={e => setAddNumero(e.target.value)} placeholder="123" required />
                  </div>
                  <div className="pwa-field">
                    <label>Bairro <span className="req">*</span></label>
                    <input className="pwa-input" value={addBairro} onChange={e => setAddBairro(e.target.value)} placeholder="Bairro" required />
                  </div>
                </div>

                <div className="pwa-field">
                  <label>Complemento</label>
                  <input className="pwa-input" value={addComplemento} onChange={e => setAddComplemento(e.target.value)} placeholder="Apto, bloco... (opcional)" />
                </div>

                {addErro && <p style={{ color: 'var(--pwa-red-ink)', fontSize: 13, marginBottom: 10 }}>{addErro}</p>}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="pwa-btn pwa-btn-ghost" style={{ flex: 1 }}
                    onClick={() => { setAddingAddress(false); setAddErro(''); setSelectedEnd(cliente.enderecos[0]?.id ?? null) }}>
                    Cancelar
                  </button>
                  <button type="submit" className="pwa-btn pwa-btn-primary" style={{ flex: 2 }} disabled={addSalvando}>
                    {addSalvando ? 'Salvando...' : 'Salvar endereço'}
                  </button>
                </div>
              </form>
            )}

            <button className="pwa-btn pwa-btn-primary" style={{ marginTop: 12 }}
              disabled={!selectedEnd}
              onClick={() => continuarComCliente(cliente, selectedEnd!)}>
              Continuar →
            </button>

            <button className="pwa-btn pwa-btn-ghost" style={{ marginTop: 6 }}
              onClick={() => setStep('menu')}>
              ← Voltar
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
              <div className="pwa-field">
                <label>Nome completo <span className="req">*</span></label>
                <input className="pwa-input" value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Seu nome" required />
              </div>

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
                    if (v.length === 8) buscarCep(v, setNovoLogradouro, setNovoBairro, setBuscandoCep)
                  }}
                />
                {buscandoCep && <span style={{ fontSize: 11, color: 'var(--pwa-muted)' }}>Buscando endereço...</span>}
              </div>

              <div className="pwa-field">
                <label>Rua / Avenida <span className="req">*</span></label>
                <input className="pwa-input" value={novoLogradouro} onChange={e => setNovoLogradouro(e.target.value)} placeholder="Nome da rua" required />
              </div>

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
