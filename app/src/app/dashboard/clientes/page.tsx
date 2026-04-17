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
}

type Cliente = {
  id: number
  nome: string
  telefone: string
  created_at: string
  enderecos: Endereco[]
}

type EnderecoForm = {
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  referencia: string
}

const emptyEndereco: EnderecoForm = { logradouro: '', numero: '', complemento: '', bairro: '', referencia: '' }

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
          logradouro: e.logradouro,
          numero: e.numero,
          complemento: e.complemento ?? '',
          bairro: e.bairro,
          referencia: e.referencia ?? '',
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
        const updated: Cliente = await res.json()
        setClientes(prev => prev.map(c => c.id === updated.id ? updated : c))
        setSelecionado(updated)
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
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Clientes</h2>
        <button className="btn-primary" onClick={openNovoCliente}>+ Novo Cliente</button>
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
                {clientes.map(cliente => {
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
                Endere&#xE7;os
              </p>
              {!clienteDetalhe.enderecos?.length ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Nenhum endere&#xE7;o cadastrado.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {clienteDetalhe.enderecos.map(end => (
                    <div key={end.id} style={{ background: '#F5F5F5', borderRadius: 8, padding: '10px 12px' }}>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{end.logradouro}, {end.numero}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {end.bairro}{end.referencia ? ` · ${end.referencia}` : ''}
                      </p>
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

                {!editando && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Endere&#xE7;os
                      </p>
                      <button type="button" className="btn-outline" style={{ fontSize: 11, padding: '3px 8px' }} onClick={addEndereco}>
                        + Endere&#xE7;o
                      </button>
                    </div>
                    {enderecos.map((en, idx) => (
                      <div key={idx} style={{ background: '#F9F9F9', borderRadius: 8, padding: 12, marginBottom: 8, border: '0.5px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Endere&#xE7;o {idx + 1}</p>
                          {idx > 0 && (
                            <button type="button" style={{ background: 'none', border: 'none', color: '#A32D2D', cursor: 'pointer', fontSize: 12 }} onClick={() => removeEndereco(idx)}>
                              Remover
                            </button>
                          )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, marginBottom: 8 }}>
                          <input className="input" placeholder="Logradouro *" value={en.logradouro} onChange={e => updateEndereco(idx, 'logradouro', e.target.value)} />
                          <input className="input" placeholder="N&#xFA;mero *" value={en.numero} onChange={e => updateEndereco(idx, 'numero', e.target.value)} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <input className="input" placeholder="Bairro *" value={en.bairro} onChange={e => updateEndereco(idx, 'bairro', e.target.value)} />
                          <input className="input" placeholder="Complemento" value={en.complemento} onChange={e => updateEndereco(idx, 'complemento', e.target.value)} />
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <input className="input" placeholder="Refer&#xEA;ncia" value={en.referencia} onChange={e => updateEndereco(idx, 'referencia', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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
                  {saving ? 'Salvando...' : editando ? 'Salvar Altera&#xE7;&#xF5;es' : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
