'use client'

import { useEffect, useState, useCallback } from 'react'

type Categoria = { id: number; nome: string; ordem: number }
type ItemCardapio = {
  id: number
  categoria_id: number
  nome: string
  descricao: string | null
  preco: number
  ativo: boolean
  categorias: Categoria
}

type ModalItemState = {
  open: boolean
  editing: ItemCardapio | null
}

const emptyItem = { categoria_id: 0, nome: '', descricao: '', preco: '' }

export default function CardapioPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [itens, setItens] = useState<ItemCardapio[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalItem, setModalItem] = useState<ModalItemState>({ open: false, editing: null })
  const [modalCategoria, setModalCategoria] = useState(false)
  const [itemForm, setItemForm] = useState(emptyItem)
  const [catForm, setCatForm] = useState('')
  const [savingItem, setSavingItem] = useState(false)
  const [savingCat, setSavingCat] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [catRes, itensRes] = await Promise.all([
      fetch('/api/categorias'),
      fetch('/api/cardapio'),
    ])
    const cats = await catRes.json()
    const its = await itensRes.json()
    setCategorias(Array.isArray(cats) ? cats : [])
    setItens(Array.isArray(its) ? its : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const itensFiltrados = filtroCategoria
    ? itens.filter(i => i.categoria_id === filtroCategoria)
    : itens

  const itensPorCategoria = categorias.map(cat => ({
    categoria: cat,
    itens: itensFiltrados.filter(i => i.categoria_id === cat.id),
  })).filter(g => g.itens.length > 0)

  function openNovoItem() {
    setItemForm({ ...emptyItem, categoria_id: categorias[0]?.id ?? 0 })
    setError('')
    setModalItem({ open: true, editing: null })
  }

  function openEditItem(item: ItemCardapio) {
    setItemForm({
      categoria_id: item.categoria_id,
      nome: item.nome,
      descricao: item.descricao ?? '',
      preco: String(item.preco),
    })
    setError('')
    setModalItem({ open: true, editing: item })
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault()
    if (!itemForm.nome || !itemForm.categoria_id || !itemForm.preco) {
      setError('Preencha todos os campos obrigatórios')
      return
    }
    setSavingItem(true)
    setError('')
    try {
      const payload = {
        categoria_id: Number(itemForm.categoria_id),
        nome: itemForm.nome,
        descricao: itemForm.descricao || null,
        preco: parseFloat(itemForm.preco),
        ativo: modalItem.editing?.ativo ?? true,
      }
      const url = modalItem.editing ? `/api/cardapio/${modalItem.editing.id}` : '/api/cardapio'
      const method = modalItem.editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Erro ao salvar')
      }
      setModalItem({ open: false, editing: null })
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar item')
    } finally {
      setSavingItem(false)
    }
  }

  async function handleToggleStatus(item: ItemCardapio) {
    setTogglingId(item.id)
    try {
      const res = await fetch(`/api/cardapio/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !item.ativo }),
      })
      if (!res.ok) throw new Error('Erro ao alterar status')
      await fetchData()
    } catch {
      alert('Erro ao alterar status do item')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleSaveCategoria(e: React.FormEvent) {
    e.preventDefault()
    if (!catForm.trim()) return
    setSavingCat(true)
    try {
      const ordemMax = categorias.length > 0 ? Math.max(...categorias.map(c => c.ordem)) + 1 : 0
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: catForm.trim(), ordem: ordemMax }),
      })
      if (!res.ok) throw new Error('Erro ao criar categoria')
      setCatForm('')
      setModalCategoria(false)
      await fetchData()
    } catch {
      alert('Erro ao criar categoria')
    } finally {
      setSavingCat(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <p style={{ color: 'var(--text-muted)' }}>Carregando cardápio...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Cardápio</h1>
          <p style={{ fontSize: 14, color: '#888', margin: '6px 0 0' }}>Gerencie itens e categorias do seu cardápio</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setCatForm(''); setModalCategoria(true) }} style={{ background: '#fff', color: '#1a1a1a', border: '1.5px solid #e8e8ee', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            + Categoria
          </button>
          <button onClick={openNovoItem} disabled={categorias.length === 0} style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: categorias.length === 0 ? 'not-allowed' : 'pointer', opacity: categorias.length === 0 ? 0.5 : 1 }}>
            + Novo Item
          </button>
        </div>
      </div>

      {/* Chips de categoria */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          className={filtroCategoria === null ? 'chip-active' : 'chip-inactive'}
          onClick={() => setFiltroCategoria(null)}
        >
          Todos ({itens.length})
        </button>
        {categorias.map(cat => (
          <button
            key={cat.id}
            className={filtroCategoria === cat.id ? 'chip-active' : 'chip-inactive'}
            onClick={() => setFiltroCategoria(cat.id)}
          >
            {cat.nome} ({itens.filter(i => i.categoria_id === cat.id).length})
          </button>
        ))}
      </div>

      {/* Tabela por categoria */}
      {itensPorCategoria.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
          {categorias.length === 0
            ? 'Crie uma categoria primeiro para adicionar itens ao cardápio.'
            : 'Nenhum item encontrado. Clique em "+ Novo Item" para começar.'}
        </div>
      ) : (
        itensPorCategoria.map(({ categoria, itens: catItens }) => (
          <div key={categoria.id} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, marginTop: 16 }}>
              {categoria.nome}
            </p>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="table-header">
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left' }}>Descrição</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Preço</th>
                    <th style={{ padding: '10px 16px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '10px 16px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {catItens.map((item, idx) => (
                    <tr key={item.id} className="table-row-alt" style={{ borderBottom: '0.5px solid #eee' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 500 }}>{item.nome}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--text-muted)', fontSize: 12 }}>
                        {item.descricao ?? '—'}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600 }}>
                        R$ {Number(item.preco).toFixed(2).replace('.', ',')}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <span className={`badge ${item.ativo ? 'badge-green' : 'badge-gray'}`}>
                          {item.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            className="btn-outline"
                            style={{ fontSize: 12, padding: '4px 10px' }}
                            onClick={() => openEditItem(item)}
                          >
                            Editar
                          </button>
                          <button
                            className={item.ativo ? 'btn-danger' : 'btn-success'}
                            disabled={togglingId === item.id}
                            onClick={() => handleToggleStatus(item)}
                          >
                            {togglingId === item.id ? '...' : item.ativo ? 'Inativar' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Modal Novo/Editar Item */}
      {modalItem.open && (
        <div className="modal-overlay" onClick={() => setModalItem({ open: false, editing: null })}>
          <div className="modal-card" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
              {modalItem.editing ? 'Editar Item' : 'Novo Item do Cardápio'}
            </h3>
            <form onSubmit={handleSaveItem}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                    Nome *
                  </label>
                  <input
                    className="input"
                    value={itemForm.nome}
                    onChange={e => setItemForm(p => ({ ...p, nome: e.target.value }))}
                    placeholder="Ex: Coxinha de Frango"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                    Categoria *
                  </label>
                  <select
                    className="input"
                    value={itemForm.categoria_id}
                    onChange={e => setItemForm(p => ({ ...p, categoria_id: Number(e.target.value) }))}
                    required
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                    Descrição
                  </label>
                  <textarea
                    className="input"
                    style={{ height: 72, resize: 'vertical' }}
                    value={itemForm.descricao}
                    onChange={e => setItemForm(p => ({ ...p, descricao: e.target.value }))}
                    placeholder="Descrição opcional do item..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                    Preço (R$) *
                  </label>
                  <input
                    className="input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemForm.preco}
                    onChange={e => setItemForm(p => ({ ...p, preco: e.target.value }))}
                    placeholder="0,00"
                    required
                  />
                </div>
                {error && (
                  <p style={{ color: 'var(--badge-danger-text)', fontSize: 12, background: 'var(--badge-danger-bg)', padding: '8px 12px', borderRadius: 8 }}>
                    {error}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn-outline" onClick={() => setModalItem({ open: false, editing: null })}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={savingItem}>
                  {savingItem ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Categoria */}
      {modalCategoria && (
        <div className="modal-overlay" onClick={() => setModalCategoria(false)}>
          <div className="modal-card" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Nova Categoria</h3>
            <form onSubmit={handleSaveCategoria}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                  Nome da Categoria *
                </label>
                <input
                  className="input"
                  value={catForm}
                  onChange={e => setCatForm(e.target.value)}
                  placeholder="Ex: Salgados, Doces, Bebidas..."
                  required
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-outline" onClick={() => setModalCategoria(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={savingCat}>
                  {savingCat ? 'Salvando...' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
