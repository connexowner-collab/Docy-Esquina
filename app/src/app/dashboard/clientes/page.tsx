'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Endereco = {
  id: number
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
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  referencia: string
  distancia_km: string
}

const emptyEndereco: EnderecoForm = { logradouro: '', numero: '', complemento: '', bairro: '', referencia: '', distancia_km: '' }

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
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [selecionado, setSelecionado] = useState<Cliente | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [clienteForm, setClienteForm] = useState({ nome: '', telefone: '' })
  const [enderecos, setEnderecos] = useState<EnderecoForm[]>([{ ...emptyEndereco }])
  const [saving, setSaving] = useState(false)
  const [clientePage, setClientePage] = useState(1)
  const [formError, setFormError] = useState('')
  const buscaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchClientes = useCallback(async (q: string) => {
    setLoading(true)
    const url = q ? `/api/clientes?telefone=${encodeURIComponent(q)}` : '/api/clientes'
    const res = await fetch(url)
    const data = await res.json()
    setClientes(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchClientes('') }, [fetchClientes])

  function handleBusca(v: string) {
    setBusca(v)
    setClientePage(1)
    if (buscaTimer.current) clearTimeout(buscaTimer.current)
    buscaTimer.current = setTimeout(() => fetchClientes(v), 400)
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
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--border)' }}>
            <input
              className="input"
              value={busca}
              onChange={e => handleBusca(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
            />
          </div>
          {loading ? (
            <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>Buscando...</p>
          ) : clientes.length === 0 ? (
            <p style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>
              {busca ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.'}
            </p>
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

              <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
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
            </div>
          )}
        </div>
      </div>

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
