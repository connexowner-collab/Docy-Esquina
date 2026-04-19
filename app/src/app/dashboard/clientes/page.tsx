'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Endereco = {
  id: number
  cep?: string | null
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  referencia: string | null
  lat: number | null
  lng: number | null
  distancia_km: number | null
}

type Cliente = {
  id: number
  nome: string
  telefone: string
  created_at: string
  enderecos: Endereco[]
}

type EnderecoForm = {
  id?: number
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  referencia: string
  distancia_km: string
}

const emptyEndereco: EnderecoForm = { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', referencia: '', distancia_km: '' }

function formatTelefone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  return v
}

function getInitials(nome: string): string {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const PAGE_SIZE = 20

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroTel, setFiltroTel] = useState('')
  const [sugestoesNome, setSugestoesNome] = useState<string[]>([])
  const [sugestoesTel, setSugestoesTel] = useState<string[]>([])
  const [showSugNome, setShowSugNome] = useState(false)
  const [showSugTel, setShowSugTel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selecionado, setSelecionado] = useState<Cliente | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [clienteForm, setClienteForm] = useState({ nome: '', telefone: '' })
  const [enderecos, setEnderecos] = useState<EnderecoForm[]>([{ ...emptyEndereco }])
  const [saving, setSaving] = useState(false)
  const [clientePage, setClientePage] = useState(1)
  const [formError, setFormError] = useState('')
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  async function handleExcluirCliente() {
    if (!selecionado) return
    setExcluindo(true)
    try {
      const res = await fetch(`/api/clientes/${selecionado.id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Erro ao excluir') }
      setClientes(prev => prev.filter(c => c.id !== selecionado.id))
      setSelecionado(null)
      setConfirmandoExclusao(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir cliente')
    } finally {
      setExcluindo(false)
    }
  }
  const [buscandoCep, setBuscandoCep] = useState<number | null>(null)
  const [cepErro, setCepErro] = useState<Record<number, string>>({})

  async function buscarCep(idx: number, cep: string) {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setBuscandoCep(idx)
    setCepErro(prev => ({ ...prev, [idx]: '' }))
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) { setCepErro(prev => ({ ...prev, [idx]: 'CEP não encontrado' })); return }
      setEnderecos(prev => prev.map((en, i) => i !== idx ? en : {
        ...en,
        logradouro: data.logradouro ?? en.logradouro,
        bairro: data.bairro ?? en.bairro,
        complemento: en.complemento || (data.complemento ?? ''),
      }))
    } catch {
      setCepErro(prev => ({ ...prev, [idx]: 'Erro ao buscar CEP' }))
    } finally {
      setBuscandoCep(null)
    }
  }
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const todosClientes = useRef<Cliente[]>([])

  const fetchClientes = useCallback(async (nome: string, tel: string, inicial = false) => {
    if (inicial) setLoading(true)
    const params = new URLSearchParams()
    if (nome) params.set('nome', nome)
    if (tel) params.set('telefone', tel)
    const res = await fetch(`/api/clientes?${params}`)
    const data = await res.json()
    const lista = Array.isArray(data) ? data : []
    setClientes(lista)
    if (!nome && !tel) todosClientes.current = lista
    if (inicial) setLoading(false)
  }, [])

  useEffect(() => { fetchClientes('', '', true) }, [fetchClientes])

  function handleFiltroNome(v: string) {
    setFiltroNome(v)
    setClientePage(1)
    const sug = v.length >= 1
      ? [...new Set(todosClientes.current.map(c => c.nome).filter(n => n.toLowerCase().includes(v.toLowerCase())))].slice(0, 8)
      : []
    setSugestoesNome(sug)
    setShowSugNome(sug.length > 0)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => fetchClientes(v, filtroTel), 350)
  }

  function handleFiltroTel(v: string) {
    setFiltroTel(v)
    setClientePage(1)
    const digits = v.replace(/\D/g, '')
    const sug = digits.length >= 2
      ? [...new Set(todosClientes.current.map(c => c.telefone).filter(t => t.includes(digits)))].slice(0, 8).map(t => formatTelefone(t))
      : []
    setSugestoesTel(sug)
    setShowSugTel(sug.length > 0)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => fetchClientes(filtroNome, v), 350)
  }

  function aplicarSugestaoNome(nome: string) {
    setFiltroNome(nome)
    setShowSugNome(false)
    fetchClientes(nome, filtroTel)
  }

  function aplicarSugestaoTel(tel: string) {
    setFiltroTel(tel)
    setShowSugTel(false)
    fetchClientes(filtroNome, tel)
  }

  function limparFiltros() {
    setFiltroNome(''); setFiltroTel('')
    setShowSugNome(false); setShowSugTel(false)
    fetchClientes('', '', true)
  }

  function openNovoCliente() {
    setEditando(null)
    setClienteForm({ nome: '', telefone: '' })
    setEnderecos([{ ...emptyEndereco }])
    setFormError('')
    setModalOpen(true)
  }

  function openEditarCliente(cliente: Cliente) {
    setEditando(cliente)
    setClienteForm({ nome: cliente.nome, telefone: formatTelefone(cliente.telefone) })
    setEnderecos(cliente.enderecos.length > 0
      ? cliente.enderecos.map(e => ({
          id: e.id,
          cep: e.cep ?? '',
          logradouro: e.logradouro,
          numero: e.numero,
          complemento: e.complemento ?? '',
          bairro: e.bairro,
          referencia: e.referencia ?? '',
          distancia_km: e.distancia_km != null ? String(e.distancia_km) : '',
        }))
      : [{ ...emptyEndereco }]
    )
    setFormError('')
    setModalOpen(true)
  }

  async function handleSaveCliente(e: React.FormEvent) {
    e.preventDefault()
    if (!clienteForm.nome || !clienteForm.telefone) {
      setFormError('Nome e telefone são obrigatórios')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const enderecosFilled = enderecos.filter(en => en.logradouro && en.numero && en.bairro)
      if (editando) {
        const res = await fetch(`/api/clientes/${editando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: clienteForm.nome, telefone: clienteForm.telefone }),
        })
        if (!res.ok) throw new Error((await res.json()).error || 'Erro ao atualizar')

        // Atualiza endereços existentes e adiciona novos
        await Promise.all(enderecosFilled.map(en => {
          const payload = {
            logradouro: en.logradouro,
            numero: en.numero,
            complemento: en.complemento || null,
            bairro: en.bairro,
            referencia: en.referencia || null,
            distancia_km: en.distancia_km ? Number(en.distancia_km) : null,
          }
          if (en.id) {
            return fetch(`/api/clientes/${editando.id}/enderecos/${en.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          } else {
            return fetch(`/api/clientes/${editando.id}/enderecos`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          }
        }))

        // Recarrega cliente atualizado
        const refreshed = await fetch(`/api/clientes/${editando.id}`).then(r => r.json())
        setClientes(prev => prev.map(c => c.id === refreshed.id ? refreshed : c))
        setSelecionado(refreshed)
      } else {
        const res = await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: clienteForm.nome, telefone: clienteForm.telefone, enderecos: enderecosFilled }),
        })
        if (!res.ok) {
          const d = await res.json()
          throw new Error(d.error === 'Telefone já cadastrado' ? 'Telefone já cadastrado para outro cliente' : d.error || 'Erro ao criar cliente')
        }
        const novo: Cliente = await res.json()
        setClientes(prev => [novo, ...prev])
        setSelecionado(novo)
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar cliente')
    } finally {
      setSaving(false)
    }
  }

  function addEndereco() {
    setEnderecos(prev => [...prev, { ...emptyEndereco }])
  }

  function updateEndereco(idx: number, field: keyof EnderecoForm, value: string) {
    setEnderecos(prev => prev.map((en, i) => i === idx ? { ...en, [field]: value } : en))
  }

  function removeEndereco(idx: number) {
    setEnderecos(prev => prev.filter((_, i) => i !== idx))
  }

  const clienteDetalhe = selecionado
    ? clientes.find(c => c.id === selecionado.id) ?? selecionado
    : null

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Clientes</h1>
          <p style={{ fontSize: 14, color: '#888', margin: '6px 0 0' }}>Gerencie sua base de clientes e endereços</p>
        </div>
        <button onClick={openNovoCliente} style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          + Novo Cliente
        </button>
      </div>

      {/* Grid 2fr 1fr */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Painel esquerdo */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Barra de filtros */}
          <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--border)', background: '#fafafa', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#aaa', pointerEvents: 'none' }}>👤</span>
              <input
                value={filtroNome}
                onChange={e => handleFiltroNome(e.target.value)}
                onFocus={() => sugestoesNome.length > 0 && setShowSugNome(true)}
                onBlur={() => setTimeout(() => setShowSugNome(false), 150)}
                placeholder="Buscar por nome..."
                style={{ width: '100%', padding: '8px 10px 8px 30px', fontSize: 13, borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              />
              {showSugNome && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.12)', zIndex: 200, maxHeight: 220, overflowY: 'auto', marginTop: 2 }}>
                  {sugestoesNome.map(s => (
                    <div key={s} onMouseDown={() => aplicarSugestaoNome(s)}
                      style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', borderBottom: '0.5px solid #f0f0f0' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    >{s}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#aaa', pointerEvents: 'none' }}>📞</span>
              <input
                value={filtroTel}
                onChange={e => handleFiltroTel(e.target.value)}
                onFocus={() => sugestoesTel.length > 0 && setShowSugTel(true)}
                onBlur={() => setTimeout(() => setShowSugTel(false), 150)}
                placeholder="Buscar por telefone..."
                style={{ width: '100%', padding: '8px 10px 8px 30px', fontSize: 13, borderRadius: 8, border: '1px solid #e0e0e0', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              />
              {showSugTel && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.12)', zIndex: 200, maxHeight: 220, overflowY: 'auto', marginTop: 2 }}>
                  {sugestoesTel.map(s => (
                    <div key={s} onMouseDown={() => aplicarSugestaoTel(s)}
                      style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', borderBottom: '0.5px solid #f0f0f0' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                    >{s}</div>
                  ))}
                </div>
              )}
            </div>
            {(filtroNome || filtroTel) && (
              <button onClick={limparFiltros} style={{ fontSize: 12, padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', color: '#666', whiteSpace: 'nowrap', flexShrink: 0 }}>
                ✕ Limpar
              </button>
            )}
          </div>

          {loading ? (
            <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>Carregando...</p>
          ) : clientes.length === 0 && !filtroNome && !filtroTel ? (
            <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>Nenhum cliente cadastrado ainda.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="table-header">
                  <th style={{ padding: '10px 16px', textAlign: 'left' }}>Cliente</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left' }}>Telefone</th>
                  <th style={{ padding: '10px 16px', textAlign: 'center' }}>Endereços</th>
                  <th style={{ padding: '10px 16px', textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Nenhum cliente encontrado para os filtros aplicados.</td></tr>
                )}
                {clientes.slice((clientePage - 1) * PAGE_SIZE, clientePage * PAGE_SIZE).map(cliente => {
                  const selected = selecionado?.id === cliente.id
                  return (
                    <tr
                      key={cliente.id}
                      className="table-row-alt"
                      style={{
                        borderBottom: '0.5px solid #eee',
                        background: selected ? '#F5F5F5' : undefined,
                        borderLeft: selected ? '2px solid #E8870A' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelecionado(cliente)}
                    >
                      <td style={{ padding: '10px 16px', fontWeight: 500 }}>{cliente.nome}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>
                        {formatTelefone(cliente.telefone)}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {cliente.enderecos?.length ?? 0}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <button
                          className="btn-outline"
                          style={{ fontSize: 12, padding: '4px 10px' }}
                          onClick={ev => { ev.stopPropagation(); setSelecionado(cliente) }}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {/* Paginação */}
          {(() => {
            const totalPages = Math.ceil(clientes.length / PAGE_SIZE)
            if (totalPages <= 1) return null
            return (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '12px 0', alignItems: 'center', borderTop: '0.5px solid var(--border)' }}>
                <button className="btn-outline" style={{ padding: '4px 9px' }} disabled={clientePage <= 1} onClick={() => setClientePage(p => p - 1)}>«</button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const p = totalPages <= 7 ? i + 1 : clientePage <= 4 ? i + 1 : clientePage + i - 3
                  if (p < 1 || p > totalPages) return null
                  return (
                    <button key={p} onClick={() => setClientePage(p)} style={{ padding: '4px 9px', borderRadius: 8, border: '0.5px solid var(--border)', background: p === clientePage ? '#C0392B' : '#fff', color: p === clientePage ? '#fff' : 'var(--text-primary)', cursor: 'pointer', fontSize: 13 }}>{p}</button>
                  )
                })}
                <button className="btn-outline" style={{ padding: '4px 9px' }} disabled={clientePage >= totalPages} onClick={() => setClientePage(p => p + 1)}>»</button>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{clientes.length} clientes</span>
              </div>
            )
          })()}
        </div>

        {/* Painel direito */}
        <div className="card" style={{ minHeight: 400 }}>
          {!clienteDetalhe ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--text-muted)', gap: 8 }}>
              <span style={{ fontSize: 32 }}>&#x1F465;</span>
              <p style={{ fontSize: 13 }}>Selecione um cliente para ver detalhes</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: '#C0392B', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}>
                  {getInitials(clienteDetalhe.nome)}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{clienteDetalhe.nome}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatTelefone(clienteDetalhe.telefone)}</p>
                </div>
              </div>

              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 0.5 }}>
                Endereços
              </p>
              {!clienteDetalhe.enderecos?.length ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Nenhum endereço cadastrado.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {clienteDetalhe.enderecos.map(end => (
                    <div key={end.id} style={{ background: '#F5F5F5', borderRadius: 8, padding: '10px 12px' }}>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{end.logradouro}, {end.numero}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {end.bairro}{end.referencia ? ` · ${end.referencia}` : ''}
                      </p>
                      {end.distancia_km ? (
                        <p style={{ fontSize: 11, color: '#E8870A', fontWeight: 600, marginTop: 2 }}>{end.distancia_km} km da loja</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-outline" style={{ flex: 1 }} onClick={() => openEditarCliente(clienteDetalhe)}>
                    Editar
                  </button>
                  <button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => router.push(`/dashboard/novo-pedido?clienteId=${clienteDetalhe.id}`)}
                  >
                    Novo Pedido
                  </button>
                </div>
                <button
                  onClick={() => setConfirmandoExclusao(true)}
                  style={{ width: '100%', background: 'none', border: '1px solid #A32D2D', borderRadius: 8, padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#A32D2D', cursor: 'pointer' }}
                >
                  Excluir Cliente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Confirmação Exclusão */}
      {confirmandoExclusao && selecionado && (
        <div className="modal-overlay" onClick={() => setConfirmandoExclusao(false)}>
          <div className="modal-card" style={{ maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Excluir cliente?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
              Você está prestes a excluir <strong>{selecionado.nome}</strong>.
            </p>
            <p style={{ fontSize: 12, color: '#A32D2D', marginBottom: 24 }}>
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn-outline" style={{ minWidth: 100 }} onClick={() => setConfirmandoExclusao(false)}>
                Cancelar
              </button>
              <button
                disabled={excluindo}
                onClick={handleExcluirCliente}
                style={{ minWidth: 100, background: '#A32D2D', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: excluindo ? 'not-allowed' : 'pointer', opacity: excluindo ? 0.7 : 1 }}
              >
                {excluindo ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo/Editar Cliente */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: 520 }} onClick={ev => ev.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
              {editando ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            <form onSubmit={handleSaveCliente}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                    Nome *
                  </label>
                  <input
                    className="input"
                    value={clienteForm.nome}
                    onChange={e => setClienteForm(p => ({ ...p, nome: e.target.value }))}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                    Telefone *
                  </label>
                  <input
                    className="input"
                    value={clienteForm.telefone}
                    onChange={e => setClienteForm(p => ({ ...p, telefone: formatTelefone(e.target.value) }))}
                    placeholder="(XX) XXXXX-XXXX"
                    required
                  />
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Endereços
                      </p>
                      <button type="button" className="btn-outline" style={{ fontSize: 11, padding: '3px 8px' }} onClick={addEndereco}>
                        + Endereço
                      </button>
                    </div>
                    {enderecos.map((en, idx) => (
                      <div key={idx} style={{ background: '#F9F9F9', borderRadius: 8, padding: 12, marginBottom: 8, border: '0.5px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Endereço {idx + 1}</p>
                          {idx > 0 && (
                            <button type="button" style={{ background: 'none', border: 'none', color: '#A32D2D', cursor: 'pointer', fontSize: 12 }} onClick={() => removeEndereco(idx)}>
                              Remover
                            </button>
                          )}
                        </div>

                        {/* CEP */}
                        <div style={{ marginBottom: 8 }}>
                          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                            CEP <span style={{ fontWeight: 400, color: '#bbb' }}>(opcional — preenche endereço automaticamente)</span>
                          </label>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: 140 }}>
                              <input
                                className="input"
                                placeholder="00000-000"
                                value={en.cep}
                                maxLength={9}
                                onChange={e => {
                                  const raw = e.target.value.replace(/\D/g, '').slice(0, 8)
                                  const fmt = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw
                                  updateEndereco(idx, 'cep', fmt)
                                  setCepErro(prev => ({ ...prev, [idx]: '' }))
                                  if (raw.length === 8) buscarCep(idx, raw)
                                }}
                              />
                            </div>
                            {buscandoCep === idx && (
                              <span style={{ fontSize: 11, color: '#888' }}>Buscando...</span>
                            )}
                            {cepErro[idx] && (
                              <span style={{ fontSize: 11, color: '#A32D2D' }}>{cepErro[idx]}</span>
                            )}
                            {!buscandoCep && !cepErro[idx] && en.logradouro && en.cep?.replace(/\D/g, '').length === 8 && (
                              <span style={{ fontSize: 11, color: '#0F6E56' }}>✓ Endereço encontrado</span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, marginBottom: 8 }}>
                          <input className="input" placeholder="Logradouro *" value={en.logradouro} onChange={e => updateEndereco(idx, 'logradouro', e.target.value)} />
                          <input className="input" placeholder="Número *" value={en.numero} onChange={e => updateEndereco(idx, 'numero', e.target.value)} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <input className="input" placeholder="Bairro *" value={en.bairro} onChange={e => updateEndereco(idx, 'bairro', e.target.value)} />
                          <input className="input" placeholder="Complemento" value={en.complemento} onChange={e => updateEndereco(idx, 'complemento', e.target.value)} />
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <input className="input" placeholder="Referência" value={en.referencia} onChange={e => updateEndereco(idx, 'referencia', e.target.value)} />
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            className="input"
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Distância em KM (ex: 3.5)"
                            value={en.distancia_km}
                            onChange={e => updateEndereco(idx, 'distancia_km', e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>km da loja</span>
                        </div>
                      </div>
                    ))}
                  </div>

                {formError && (
                  <p style={{ color: 'var(--badge-danger-text)', fontSize: 12, background: 'var(--badge-danger-bg)', padding: '8px 12px', borderRadius: 8 }}>
                    {formError}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn-outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
