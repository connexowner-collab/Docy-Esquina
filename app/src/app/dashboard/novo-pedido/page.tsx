'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { imprimirComanda } from '@/lib/print/printService'

// ─── Types ────────────────────────────────────────────────────────────────────
type Endereco = { id: number; logradouro: string; numero: string; complemento: string | null; bairro: string; referencia: string | null; lat: number | null; lng: number | null; distancia_km: number | null }
type Cliente = { id: number; nome: string; telefone: string; enderecos: Endereco[] }
type Categoria = { id: number; nome: string; ordem: number }
type ItemCardapio = { id: number; categoria_id: number; nome: string; descricao: string | null; preco: number; ativo: boolean; categorias: Categoria }
type ItemPedido = { item: ItemCardapio; quantidade: number; observacao?: string }
type Pagamento = 'dinheiro' | 'pix' | 'debito' | 'credito'
type PedidoCriado = { id: number; numero_seq: number; total: number; pagamento: string; troco?: number | null; clientes: Cliente; itens_pedido: Array<{ nome_snapshot: string; quantidade: number; preco_snapshot: number; observacao?: string | null }> }

type EnderecoForm = { logradouro: string; numero: string; complemento: string; bairro: string; referencia: string; distancia_km: string }
const emptyEnderecoForm: EnderecoForm = { logradouro: '', numero: '', complemento: '', bairro: '', referencia: '', distancia_km: '' }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTelefone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
function getInitials(nome: string): string {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}
function fmtMoeda(v: number): string {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}
function fmtData(): string {
  return new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
function Stepper({ etapa }: { etapa: number }) {
  const steps = ['Identificar\nCliente', 'Endereço de\nEntrega', 'Itens do\nPedido', 'Pagamento']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0 24px' }}>
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < etapa
        const active = num === etapa
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#C0392B' : active ? '#E8870A' : 'transparent',
                border: done || active ? 'none' : '1.5px solid #CCC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: done || active ? '#fff' : '#888',
                fontWeight: 700, fontSize: 13,
              }}>
                {done ? '\u2713' : num}
              </div>
              <span style={{
                fontSize: 11, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.3,
                color: active ? '#B8600A' : '#888',
                fontWeight: active ? 700 : 400,
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 64, height: 2, background: done ? '#C0392B' : '#CCC', margin: '0 6px', marginBottom: 22, flexShrink: 0 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Etapa 1 ──────────────────────────────────────────────────────────────────
function Etapa1({
  onClienteEncontrado,
  initialClienteId,
}: {
  onClienteEncontrado: (c: Cliente) => void
  initialClienteId: string | null
}) {
  const [tel, setTel] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [modalCadastro, setModalCadastro] = useState(false)
  const [cadastroForm, setCadastroForm] = useState({ nome: '', telefone: '' })
  const [enderecos, setEnderecos] = useState<EnderecoForm[]>([{ ...emptyEnderecoForm }])
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  const buscarCliente = useCallback(async (telefone: string) => {
    setBuscando(true)
    setNaoEncontrado(false)
    setClienteEncontrado(null)
    try {
      const res = await fetch(`/api/clientes?telefone=${encodeURIComponent(telefone.replace(/\D/g, ''))}`)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setClienteEncontrado(data[0])
      } else {
        setNaoEncontrado(true)
      }
    } catch {
      setNaoEncontrado(true)
    } finally {
      setBuscando(false)
    }
  }, [])

  useEffect(() => {
    if (initialClienteId) {
      fetch(`/api/clientes/${initialClienteId}`)
        .then(r => r.json())
        .then(d => { if (d?.id) setClienteEncontrado(d) })
        .catch(() => {})
    }
  }, [initialClienteId])

  function handleTelChange(v: string) {
    const formatted = formatTelefone(v)
    setTel(formatted)
    const digits = v.replace(/\D/g, '')
    if (digits.length === 11) buscarCliente(digits)
    else { setClienteEncontrado(null); setNaoEncontrado(false) }
  }

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault()
    if (!cadastroForm.nome || !cadastroForm.telefone) { setErroForm('Nome e telefone obrigatórios'); return }
    setSalvando(true)
    setErroForm('')
    try {
      const endFilled = enderecos.filter(en => en.logradouro && en.numero && en.bairro)
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: cadastroForm.nome, telefone: cadastroForm.telefone, enderecos: endFilled }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Erro ao cadastrar') }
      const novo: Cliente = await res.json()
      setClienteEncontrado(novo)
      setModalCadastro(false)
    } catch (err) {
      setErroForm(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Digite o telefone do cliente para identificar ou cadastrar</p>

      <div style={{ maxWidth: 420, width: '100%' }}>
        <input
          style={{
            width: '100%', textAlign: 'center', fontSize: 28, fontFamily: 'monospace',
            background: '#F5F5F5', border: '0.5px solid var(--border)', borderRadius: 12,
            padding: '14px 20px', outline: 'none', color: 'var(--text-primary)',
          }}
          value={tel}
          onChange={e => handleTelChange(e.target.value)}
          placeholder="(XX) XXXXX-XXXX"
          onFocus={e => (e.target.style.borderColor = '#C0392B')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {buscando && <p style={{ color: 'var(--text-muted)' }}>Buscando cliente...</p>}

      {clienteEncontrado && (
        <div style={{ maxWidth: 420, width: '100%', background: '#FDF3E3', border: '1px solid #E8870A', borderRadius: 12, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: '#C0392B', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>
              {getInitials(clienteEncontrado.nome)}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14 }}>{clienteEncontrado.nome}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatTelefone(clienteEncontrado.telefone)}</p>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => onClienteEncontrado(clienteEncontrado)}>
            Continuar com este cliente &rarr;
          </button>
        </div>
      )}

      {naoEncontrado && !clienteEncontrado && (
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: 13 }}>Cliente não encontrado para este telefone.</p>
          <button className="btn-outline" onClick={() => {
            setCadastroForm({ nome: '', telefone: tel })
            setEnderecos([{ ...emptyEnderecoForm }])
            setModalCadastro(true)
          }}>
            + Novo cadastro
          </button>
        </div>
      )}

      {modalCadastro && (
        <div className="modal-overlay" onClick={() => setModalCadastro(false)}>
          <div className="modal-card" style={{ maxWidth: 520 }} onClick={ev => ev.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Novo Cliente</h3>
            <form onSubmit={handleCadastrar}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Nome *</label>
                  <input className="input" placeholder="Nome completo" value={cadastroForm.nome} onChange={e => setCadastroForm(p => ({ ...p, nome: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Telefone *</label>
                  <input className="input" placeholder="(XX) XXXXX-XXXX" value={cadastroForm.telefone} onChange={e => setCadastroForm(p => ({ ...p, telefone: formatTelefone(e.target.value) }))} required />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Endereços</p>
                    <button type="button" className="btn-outline" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => setEnderecos(prev => [...prev, { ...emptyEnderecoForm }])}>
                      + Endereço
                    </button>
                  </div>
                  {enderecos.map((en, idx) => (
                    <div key={idx} style={{ background: '#F9F9F9', borderRadius: 8, padding: 12, marginBottom: 8, border: '0.5px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Endereço {idx + 1}</p>
                        {idx > 0 && (
                          <button type="button" style={{ background: 'none', border: 'none', color: '#A32D2D', cursor: 'pointer', fontSize: 12 }} onClick={() => setEnderecos(prev => prev.filter((_, i) => i !== idx))}>
                            Remover
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, marginBottom: 8 }}>
                        <input className="input" placeholder="Logradouro *" value={en.logradouro} onChange={e => setEnderecos(prev => prev.map((x, i) => i === idx ? { ...x, logradouro: e.target.value } : x))} />
                        <input className="input" placeholder="Número *" value={en.numero} onChange={e => setEnderecos(prev => prev.map((x, i) => i === idx ? { ...x, numero: e.target.value } : x))} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                        <input className="input" placeholder="Bairro *" value={en.bairro} onChange={e => setEnderecos(prev => prev.map((x, i) => i === idx ? { ...x, bairro: e.target.value } : x))} />
                        <input className="input" placeholder="Complemento" value={en.complemento} onChange={e => setEnderecos(prev => prev.map((x, i) => i === idx ? { ...x, complemento: e.target.value } : x))} />
                      </div>
                      <input className="input" placeholder="Referência" value={en.referencia} onChange={e => setEnderecos(prev => prev.map((x, i) => i === idx ? { ...x, referencia: e.target.value } : x))} />
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          className="input"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Distância em KM (ex: 3.5)"
                          value={en.distancia_km}
                          onChange={e => setEnderecos(prev => prev.map((x, i) => i === idx ? { ...x, distancia_km: e.target.value } : x))}
                          style={{ flex: 1 }}
                        />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>km da loja</span>
                      </div>
                    </div>
                  ))}
                </div>

                {erroForm && <p style={{ color: 'var(--badge-danger-text)', fontSize: 12, background: 'var(--badge-danger-bg)', padding: '8px 12px', borderRadius: 8 }}>{erroForm}</p>}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn-outline" onClick={() => setModalCadastro(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Cadastrar Cliente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Etapa 2 ──────────────────────────────────────────────────────────────────
function Etapa2({
  cliente,
  onEnderecoSelecionado,
}: {
  cliente: Cliente
  onEnderecoSelecionado: (endereco: Endereco, distanciaKm: number, taxaEntrega: number) => void
}) {
  const [selecionado, setSelecionado] = useState<number | null>(null)
  const [freteInfo, setFreteInfo] = useState<{ distancia_km: number; taxa: number; fora_cobertura: boolean } | null>(null)
  const [calculando, setCalculando] = useState(false)
  const [erroFrete, setErroFrete] = useState('')
  const [novoEnd, setNovoEnd] = useState(false)
  const [novoEndForm, setNovoEndForm] = useState({ ...emptyEnderecoForm })
  const [salvandoEnd, setSalvandoEnd] = useState(false)
  const [enderecos, setEnderecos] = useState<Endereco[]>(cliente.enderecos)

  async function calcularFrete(end: Endereco) {
    setCalculando(true)
    setErroFrete('')
    try {
      // Usa KM manual salvo no endereço se disponível; senão tenta coordenadas
      const body = end.distancia_km && end.distancia_km > 0
        ? { km_manual: end.distancia_km }
        : end.lat && end.lng
          ? { lat_destino: end.lat, lng_destino: end.lng }
          : null

      if (!body) {
        setFreteInfo(null)
        setErroFrete('Informe a distância em KM para calcular o frete.')
        return
      }

      const res = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao calcular frete')
      setFreteInfo(data)
    } catch (err) {
      setErroFrete(err instanceof Error ? err.message : 'Erro ao calcular frete')
      setFreteInfo(null)
    } finally {
      setCalculando(false)
    }
  }

  function selecionarEndereco(end: Endereco) {
    setSelecionado(end.id)
    calcularFrete(end)
  }

  async function salvarNovoEndereco(e: React.FormEvent) {
    e.preventDefault()
    setSalvandoEnd(true)
    try {
      const res = await fetch(`/api/clientes/${cliente.id}/enderecos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...novoEndForm,
          distancia_km: novoEndForm.distancia_km ? Number(novoEndForm.distancia_km) : null,
        }),
      })
      if (!res.ok) throw new Error('Erro ao salvar endereço')
      const novo: Endereco = await res.json()
      setEnderecos(prev => [...prev, novo])
      setNovoEnd(false)
      setNovoEndForm({ ...emptyEnderecoForm })
      selecionarEndereco(novo)
    } catch {
      alert('Erro ao salvar endereço')
    } finally {
      setSalvandoEnd(false)
    }
  }

  const endSelecionado = enderecos.find(e => e.id === selecionado)

  return (
    <div>
      {/* Banner cliente */}
      <div style={{ background: '#FDF3E3', border: '1px solid #E8870A', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#C0392B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
          {getInitials(cliente.nome)}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14 }}>{cliente.nome}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{formatTelefone(cliente.telefone)}</p>
        </div>
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>Selecione o endereço de entrega:</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        {enderecos.map(end => (
          <div
            key={end.id}
            onClick={() => selecionarEndereco(end)}
            style={{
              background: selecionado === end.id ? '#FDF3E3' : '#F5F5F5',
              border: selecionado === end.id ? '2px solid #E8870A' : '0.5px solid var(--border)',
              borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 13 }}>{end.logradouro}, {end.numero}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
              {end.bairro}{end.referencia ? ` · ${end.referencia}` : ''}
            </p>
            {end.distancia_km ? (
              <p style={{ fontSize: 11, color: '#E8870A', fontWeight: 600, marginTop: 2 }}>{end.distancia_km} km da loja</p>
            ) : (
              <p style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>KM não informado</p>
            )}
          </div>
        ))}

        <div
          onClick={() => setNovoEnd(true)}
          style={{ border: '1.5px dashed #CCC', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}
        >
          + Digitar outro endereço
        </div>
      </div>

      {calculando && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Calculando frete...</p>}
      {erroFrete && !calculando && (
        <p style={{ color: '#854F0B', fontSize: 13, background: '#FDF3E3', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>{erroFrete}</p>
      )}
      {freteInfo && (
        <p style={{ color: '#B8600A', fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
          {freteInfo.distancia_km.toFixed(1)} km &middot; Taxa estimada {fmtMoeda(freteInfo.taxa)}
          {freteInfo.fora_cobertura && <span style={{ color: '#A32D2D', marginLeft: 8 }}>(fora da área de cobertura)</span>}
        </p>
      )}

      {endSelecionado && (
        <button
          className="btn-primary"
          style={{ marginTop: 8 }}
          onClick={() => onEnderecoSelecionado(endSelecionado, freteInfo?.distancia_km ?? 0, freteInfo?.taxa ?? 0)}
        >
          Confirmar endereço &rarr;
        </button>
      )}

      {novoEnd && (
        <div className="modal-overlay" onClick={() => setNovoEnd(false)}>
          <div className="modal-card" style={{ maxWidth: 440 }} onClick={ev => ev.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Novo Endereço</h3>
            <form onSubmit={salvarNovoEndereco}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                  <input className="input" placeholder="Logradouro *" value={novoEndForm.logradouro} onChange={e => setNovoEndForm(p => ({ ...p, logradouro: e.target.value }))} required />
                  <input className="input" placeholder="Número *" value={novoEndForm.numero} onChange={e => setNovoEndForm(p => ({ ...p, numero: e.target.value }))} required />
                </div>
                <input className="input" placeholder="Bairro *" value={novoEndForm.bairro} onChange={e => setNovoEndForm(p => ({ ...p, bairro: e.target.value }))} required />
                <input className="input" placeholder="Complemento" value={novoEndForm.complemento} onChange={e => setNovoEndForm(p => ({ ...p, complemento: e.target.value }))} />
                <input className="input" placeholder="Referência" value={novoEndForm.referencia} onChange={e => setNovoEndForm(p => ({ ...p, referencia: e.target.value }))} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    className="input"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Distância em KM (ex: 3.5)"
                    value={novoEndForm.distancia_km}
                    onChange={e => setNovoEndForm(p => ({ ...p, distancia_km: e.target.value }))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>km da loja</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
                <button type="button" className="btn-outline" onClick={() => setNovoEnd(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={salvandoEnd}>{salvandoEnd ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Etapa 3 ──────────────────────────────────────────────────────────────────
function Etapa3({
  cliente,
  taxaEntrega,
  onContinuar,
}: {
  cliente: Cliente
  taxaEntrega: number
  onContinuar: (itens: ItemPedido[], subtotal: number, total: number, observacoes: string, taxaFinal: number) => void
}) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [itensCardapio, setItensCardapio] = useState<ItemCardapio[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null)
  const [busca, setBusca] = useState('')
  const [pedido, setPedido] = useState<ItemPedido[]>([])
  const [observacoes, setObservacoes] = useState('')
  const [taxaManual, setTaxaManual] = useState<string>(String(taxaEntrega.toFixed(2)))
  const [taxaEditada, setTaxaEditada] = useState(false)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/categorias').then(r => r.json()),
      fetch('/api/cardapio?ativo=true').then(r => r.json()),
    ]).then(([cats, its]) => {
      setCategorias(Array.isArray(cats) ? cats : [])
      setItensCardapio(Array.isArray(its) ? its : [])
      setLoading(false)
    })
  }, [])

  function addItem(item: ItemCardapio) {
    setPedido(prev => {
      const existing = prev.find(p => p.item.id === item.id)
      if (existing) return prev.map(p => p.item.id === item.id ? { ...p, quantidade: p.quantidade + 1 } : p)
      return [...prev, { item, quantidade: 1 }]
    })
  }

  function removeItem(itemId: number) {
    setPedido(prev => prev.flatMap(p => {
      if (p.item.id !== itemId) return [p]
      if (p.quantidade > 1) return [{ ...p, quantidade: p.quantidade - 1 }]
      return []
    }))
  }

  function deleteItem(itemId: number) {
    setPedido(prev => prev.filter(p => p.item.id !== itemId))
  }

  function updateObservacao(itemId: number, obs: string) {
    setPedido(prev => prev.map(p => p.item.id === itemId ? { ...p, observacao: obs } : p))
  }

  const subtotal = pedido.reduce((s, p) => s + Number(p.item.preco) * p.quantidade, 0)
  const taxaFinal = parseFloat(taxaManual) || 0
  const total = subtotal + taxaFinal

  const filtrado = itensCardapio.filter(i =>
    (filtroCategoria === null || i.categoria_id === filtroCategoria) &&
    (busca === '' || i.nome.toLowerCase().includes(busca.toLowerCase()))
  )

  function handleContinuar() {
    if (pedido.length === 0) { setErro('Adicione pelo menos um item ao pedido.'); return }
    setErro('')
    onContinuar(pedido, subtotal, total, observacoes, taxaFinal)
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Carregando cardápio...</p>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 20 }}>
      {/* Esquerda — Cardápio */}
      <div>
        {/* Chips + busca */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button className={filtroCategoria === null ? 'chip-active' : 'chip-inactive'} onClick={() => setFiltroCategoria(null)}>Todos</button>
          {categorias.map(c => (
            <button key={c.id} className={filtroCategoria === c.id ? 'chip-active' : 'chip-inactive'} onClick={() => setFiltroCategoria(c.id)}>{c.nome}</button>
          ))}
        </div>
        <input className="input" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar item..." style={{ marginBottom: 12 }} />

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="table-header">
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit.</th>
                <th style={{ padding: '8px 12px', textAlign: 'center', width: 40 }}>+</th>
              </tr>
            </thead>
            <tbody>
              {filtrado.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum item encontrado</td></tr>
              ) : filtrado.map(item => (
                <tr key={item.id} className="table-row-alt" style={{ borderBottom: '0.5px solid #eee' }}>
                  <td style={{ padding: '8px 12px', fontSize: 13 }}>
                    <p style={{ fontWeight: 500 }}>{item.nome}</p>
                    {item.descricao && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.descricao}</p>}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>
                    {fmtMoeda(Number(item.preco))}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <button
                      onClick={() => addItem(item)}
                      style={{ width: 24, height: 24, borderRadius: 8, background: '#C0392B', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Observações */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Observações do pedido</label>
          <textarea
            className="input"
            style={{ height: 72, resize: 'vertical' }}
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            placeholder="Ex: sem cebola, ponto da carne, etc."
          />
        </div>
      </div>

      {/* Direita — Resumo */}
      <div>
        <div style={{ background: '#FDF3E3', border: '1px solid #F5C070', borderRadius: 12, padding: 16, position: 'sticky', top: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Resumo do Pedido</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{cliente.nome}</p>

          {pedido.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>Nenhum item adicionado</p>
          ) : (
            <div style={{ marginTop: 12, marginBottom: 12 }}>
              {pedido.map(p => (
                <div key={p.item.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => removeItem(p.item.id)} style={{ width: 22, height: 22, borderRadius: 6, border: '0.5px solid #CCC', background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>-</button>
                      <span style={{ fontWeight: 700, fontSize: 13, minWidth: 20, textAlign: 'center' }}>{p.quantidade}</span>
                      <button onClick={() => addItem(p.item)} style={{ width: 22, height: 22, borderRadius: 6, background: '#C0392B', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>+</button>
                    </div>
                    <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.item.nome}</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{fmtMoeda(Number(p.item.preco) * p.quantidade)}</span>
                    <button onClick={() => deleteItem(p.item.id)} style={{ background: 'none', border: 'none', color: '#A32D2D', cursor: 'pointer', fontSize: 14 }}>&#xD7;</button>
                  </div>
                  <input
                    value={p.observacao ?? ''}
                    onChange={e => updateObservacao(p.item.id, e.target.value)}
                    placeholder="Obs: sem cebola..."
                    style={{ width: '100%', marginTop: 4, fontSize: 11, padding: '3px 7px', borderRadius: 6, border: '0.5px solid #E8C97A', background: '#FFFBF0', color: '#7A5500', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '0.5px solid #F5C070', paddingTop: 10, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <span>Subtotal</span><span>{fmtMoeda(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Taxa de entrega
                {taxaEditada && <span style={{ fontSize: 10, color: '#B8600A', background: '#FDF3E3', padding: '1px 5px', borderRadius: 4, border: '1px solid #E8870A' }}>editada</span>}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={taxaManual}
                onChange={e => { setTaxaManual(e.target.value); setTaxaEditada(true) }}
                style={{ width: 80, textAlign: 'right', background: 'transparent', border: '0.5px solid #E8870A', borderRadius: 6, padding: '2px 6px', fontSize: 13, color: '#B8600A' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700 }}>
              <span>Total</span><span style={{ color: '#C0392B' }}>{fmtMoeda(total)}</span>
            </div>
          </div>

          {erro && <p style={{ color: '#A32D2D', fontSize: 12, marginTop: 10 }}>{erro}</p>}

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: 14 }}
            onClick={handleContinuar}
          >
            Ir para pagamento &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Etapa 4 ──────────────────────────────────────────────────────────────────
function Etapa4({
  cliente,
  endereco,
  distanciaKm,
  taxaEntrega,
  itens,
  subtotal,
  total,
  observacoes,
  onConfirmado,
}: {
  cliente: Cliente
  endereco: Endereco
  distanciaKm: number
  taxaEntrega: number
  itens: ItemPedido[]
  subtotal: number
  total: number
  observacoes: string
  onConfirmado: (pedido: PedidoCriado) => void
}) {
  const [pagamento, setPagamento] = useState<Pagamento>('pix')
  const [valorRecebido, setValorRecebido] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState('')

  const troco = pagamento === 'dinheiro' && valorRecebido
    ? Math.max(0, parseFloat(valorRecebido) - total)
    : 0

  const instrucoes: Record<Pagamento, string> = {
    pix: 'O cliente fará o pagamento via Pix. Confirme o recebimento antes de sair para entrega.',
    dinheiro: 'Leve o troco exato se possível. O campo "Troco" é calculado automaticamente.',
    debito: 'Leve a maquininha de cartão débito. O pagamento é processado na entrega.',
    credito: 'Leve a maquininha de cartão crédito. O pagamento é processado na entrega.',
  }

  async function confirmarPedido() {
    if (pagamento === 'dinheiro') {
      const rec = parseFloat(valorRecebido)
      if (!valorRecebido || isNaN(rec)) { setErro('Informe o valor recebido'); return }
      if (rec < total) { setErro(`Valor recebido (${fmtMoeda(rec)}) menor que o total (${fmtMoeda(total)})`); return }
    }
    if (itens.length === 0) { setErro('Nenhum item no pedido'); return }
    setConfirmando(true)
    setErro('')
    try {
      const itensMapped = itens.map(p => ({
        item_cardapio_id: p.item.id,
        nome_snapshot: p.item.nome,
        preco_snapshot: Number(p.item.preco),
        quantidade: p.quantidade,
        subtotal: Number(p.item.preco) * p.quantidade,
        observacao: p.observacao || null,
      }))
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: cliente.id,
          endereco_id: endereco.id,
          distancia_km: distanciaKm,
          taxa_entrega: taxaEntrega,
          subtotal,
          total,
          pagamento,
          troco: pagamento === 'dinheiro' ? troco : null,
          observacoes: observacoes || null,
          itens: itensMapped,
        }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Erro ao confirmar pedido') }
      const pedidoCriado: PedidoCriado = await res.json()
      onConfirmado(pedidoCriado)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao confirmar pedido')
    } finally {
      setConfirmando(false)
    }
  }

  const pagamentoPills: { key: Pagamento; label: string }[] = [
    { key: 'dinheiro', label: 'Dinheiro' },
    { key: 'pix', label: 'Pix' },
    { key: 'debito', label: 'Débito' },
    { key: 'credito', label: 'Crédito' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 20 }}>
      <div>
        <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: 'var(--text-muted)' }}>Forma de Pagamento</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {pagamentoPills.map(p => (
            <button
              key={p.key}
              onClick={() => setPagamento(p.key)}
              style={{
                padding: '8px 20px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: pagamento === p.key ? '#FDF3E3' : '#F5F5F5',
                border: pagamento === p.key ? '1.5px solid #E8870A' : '0.5px solid var(--border)',
                color: pagamento === p.key ? '#B8600A' : 'var(--text-primary)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {pagamento === 'dinheiro' && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Valor Recebido (R$)</label>
              <input
                className="input"
                type="number"
                step="0.01"
                min={total}
                value={valorRecebido}
                onChange={e => setValorRecebido(e.target.value)}
                placeholder={total.toFixed(2)}
                style={{ width: 160 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Troco</label>
              <div style={{ height: 34, display: 'flex', alignItems: 'center', fontWeight: 700, color: troco > 0 ? '#0F6E56' : 'var(--text-primary)', fontSize: 15 }}>
                {fmtMoeda(troco)}
              </div>
            </div>
          </div>
        )}

        <div style={{ background: '#E6F1FB', border: '0.5px solid #B3D4F5', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          <p style={{ color: '#185FA5', fontSize: 13 }}>{instrucoes[pagamento]}</p>
        </div>

        {erro && <p style={{ color: 'var(--badge-danger-text)', fontSize: 12, background: 'var(--badge-danger-bg)', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>{erro}</p>}

        <button
          style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: confirmando ? 0.6 : 1 }}
          disabled={confirmando}
          onClick={confirmarPedido}
        >
          {confirmando ? 'Confirmando...' : 'Confirmar pedido'}
        </button>
      </div>

      {/* Resumo direita */}
      <div style={{ background: '#FDF3E3', border: '1px solid #F5C070', borderRadius: 12, padding: 16 }}>
        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Resumo</p>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{cliente.nome}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 1 }}>{formatTelefone(cliente.telefone)}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{endereco.logradouro}, {endereco.numero} — {endereco.bairro}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>PAGAMENTO</span>
          <span style={{ fontSize: 12, fontWeight: 700, background: '#fff', border: '1px solid #E8870A', color: '#B8600A', borderRadius: 6, padding: '2px 8px' }}>
            {pagamentoPills.find(p => p.key === pagamento)?.label ?? pagamento}
          </span>
        </div>
        <div style={{ borderTop: '0.5px solid #F5C070', paddingTop: 10 }}>
          {itens.map(p => (
            <div key={p.item.id} style={{ marginBottom: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{p.quantidade}x {p.item.nome}</span>
                <span>{fmtMoeda(Number(p.item.preco) * p.quantidade)}</span>
              </div>
              {p.observacao && <p style={{ margin: '2px 0 0 12px', fontSize: 11, color: '#7A5500', fontStyle: 'italic' }}>› {p.observacao}</p>}
            </div>
          ))}
          <div style={{ borderTop: '0.5px solid #F5C070', marginTop: 8, paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              <span>Subtotal</span><span>{fmtMoeda(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              <span>Taxa entrega</span><span>{fmtMoeda(taxaEntrega)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: troco > 0 ? 3 : 0 }}>
              <span>Total</span><span style={{ color: '#C0392B' }}>{fmtMoeda(total)}</span>
            </div>
            {troco > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3, color: 'var(--text-muted)' }}>
                  <span>Recebido</span><span>{fmtMoeda(total + troco)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#0F6E56' }}>
                  <span>Troco</span><span>{fmtMoeda(troco)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Confirmação ──────────────────────────────────────────────────────────────
function TelaConfirmacao({
  pedido, subtotal, taxaEntrega, endereco, observacoes, onNovoPedido,
}: {
  pedido: PedidoCriado
  subtotal: number
  taxaEntrega: number
  endereco: Endereco | null
  observacoes: string
  onNovoPedido: () => void
}) {
  function handleImprimir() {
    if (!endereco) return
    imprimirComanda({
      numero_seq: pedido.numero_seq,
      created_at: new Date().toISOString(),
      clientes: { nome: pedido.clientes.nome, telefone: pedido.clientes.telefone },
      enderecos: { logradouro: endereco.logradouro, numero: endereco.numero, bairro: endereco.bairro, referencia: endereco.referencia },
      itens_pedido: pedido.itens_pedido.map(it => ({
        nome_snapshot: it.nome_snapshot,
        quantidade: it.quantidade,
        preco_snapshot: it.preco_snapshot,
        subtotal: it.preco_snapshot * it.quantidade,
        observacao: it.observacao ?? null,
      })),
      subtotal,
      taxa_entrega: taxaEntrega,
      total: Number(pedido.total),
      pagamento: pedido.pagamento,
      troco: pedido.troco ?? null,
      observacoes: observacoes || null,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '40px 0' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#C0392B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
        &#x2713;
      </div>
      <p style={{ fontSize: 18, fontWeight: 700 }}>Pedido #{pedido.numero_seq} confirmado!</p>
      <div style={{ background: '#FDF3E3', border: '1px solid #E8870A', borderRadius: 12, padding: '16px 24px', minWidth: 320 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>{pedido.clientes?.nome}</p>
        {pedido.itens_pedido?.map((it, i) => (
          <p key={i} style={{ fontSize: 12, color: 'var(--text-muted)' }}>{it.quantidade}x {it.nome_snapshot}</p>
        ))}
        <div style={{ borderTop: '0.5px solid #E8870A', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>Total</span><span style={{ color: '#C0392B' }}>{fmtMoeda(Number(pedido.total))}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn-outline"
          onClick={handleImprimir}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Imprimir Comanda
        </button>
        <button className="btn-primary" onClick={onNovoPedido}>
          + Novo Pedido
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function NovoPedidoContent() {
  const searchParams = useSearchParams()
  const [etapa, setEtapa] = useState(1)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [endereco, setEndereco] = useState<Endereco | null>(null)
  const [distanciaKm, setDistanciaKm] = useState(0)
  const [taxaEntrega, setTaxaEntrega] = useState(0)
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [observacoes, setObservacoes] = useState('')
  const [pedidoConfirmado, setPedidoConfirmado] = useState<PedidoCriado | null>(null)
  const [seqDisplay, setSeqDisplay] = useState<number | null>(null)

  const initialClienteId = searchParams.get('clienteId')

  function resetar() {
    setEtapa(1); setCliente(null); setEndereco(null)
    setDistanciaKm(0); setTaxaEntrega(0); setItensPedido([])
    setSubtotal(0); setTotal(0); setObservacoes('')
    setPedidoConfirmado(null); setSeqDisplay(null)
  }

  return (
    <div>
      {/* Topbar vermelho */}
      <div style={{ background: '#C0392B', color: '#fff', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <span style={{ fontSize: 20 }}>&#x1F6F5;</span>
        <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>Docy Esquina &mdash; Novo Pedido</span>
        {seqDisplay && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 20, fontSize: 13 }}>#{seqDisplay}</span>}
        <span style={{ fontSize: 12, opacity: 0.85 }}>{fmtData()}</span>
      </div>

      {!pedidoConfirmado && <Stepper etapa={etapa} />}

      {pedidoConfirmado ? (
        <TelaConfirmacao
          pedido={pedidoConfirmado}
          subtotal={subtotal}
          taxaEntrega={taxaEntrega}
          endereco={endereco}
          observacoes={observacoes}
          onNovoPedido={resetar}
        />
      ) : etapa === 1 ? (
        <Etapa1
          initialClienteId={initialClienteId}
          onClienteEncontrado={c => { setCliente(c); setSeqDisplay(null); setEtapa(2) }}
        />
      ) : etapa === 2 && cliente ? (
        <Etapa2
          cliente={cliente}
          onEnderecoSelecionado={(end, dist, taxa) => {
            setEndereco(end); setDistanciaKm(dist); setTaxaEntrega(taxa); setEtapa(3)
          }}
        />
      ) : etapa === 3 && cliente ? (
        <Etapa3
          cliente={cliente}
          taxaEntrega={taxaEntrega}
          onContinuar={(its, sub, tot, obs, taxaFinal) => {
            setItensPedido(its); setSubtotal(sub); setTotal(tot)
            setObservacoes(obs); setTaxaEntrega(taxaFinal); setEtapa(4)
          }}
        />
      ) : etapa === 4 && cliente && endereco ? (
        <Etapa4
          cliente={cliente}
          endereco={endereco}
          distanciaKm={distanciaKm}
          taxaEntrega={taxaEntrega}
          itens={itensPedido}
          subtotal={subtotal}
          total={total}
          observacoes={observacoes}
          onConfirmado={p => { setPedidoConfirmado(p); setSeqDisplay(p.numero_seq) }}
        />
      ) : null}
    </div>
  )
}

export default function NovoPedidoPage() {
  return (
    <Suspense fallback={<p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Carregando...</p>}>
      <NovoPedidoContent />
    </Suspense>
  )
}
