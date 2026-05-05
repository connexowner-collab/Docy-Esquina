'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Item = { id: number; nome: string; descricao?: string; preco: number; categoria_id: number }
type Categoria = { id: number; nome: string; itens: Item[] }
type CartItem = { itemId: number; nome: string; preco: number; qty: number; observacao: string }

function fmtMoeda(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}

export default function PwaCardapioPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [catAtiva, setCatAtiva] = useState<number | null>(null)
  const [busca, setBusca] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [modalItem, setModalItem] = useState<Item | null>(null)
  const [modalQty, setModalQty] = useState(1)
  const [modalObs, setModalObs] = useState('')
  const [clienteNome, setClienteNome] = useState('')

  useEffect(() => {
    const c = localStorage.getItem('pwa_cliente')
    if (!c) { router.replace('/pwa'); return }
    setClienteNome(JSON.parse(c).nome?.split(' ')[0] ?? '')

    const cartSaved = sessionStorage.getItem('pwa_cart')
    if (cartSaved) setCart(JSON.parse(cartSaved))

    fetch('/api/pwa/cardapio')
      .then(r => r.json())
      .then((data: Categoria[]) => {
        setCategorias(data)
        if (data.length > 0) setCatAtiva(data[0].id)
      })
      .finally(() => setLoading(false))
  }, [router])

  const saveCart = useCallback((c: CartItem[]) => {
    setCart(c)
    sessionStorage.setItem('pwa_cart', JSON.stringify(c))
  }, [])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.preco, 0)

  const itensFiltrados = useMemo(() => {
    const pool = catAtiva
      ? (categorias.find(c => c.id === catAtiva)?.itens ?? [])
      : categorias.flatMap(c => c.itens)
    if (!busca.trim()) return pool
    const q = busca.toLowerCase()
    return pool.filter(i => i.nome.toLowerCase().includes(q) || i.descricao?.toLowerCase().includes(q))
  }, [categorias, catAtiva, busca])

  function qtyInCart(itemId: number) {
    return cart.find(i => i.itemId === itemId)?.qty ?? 0
  }

  function openModal(item: Item) {
    const existing = cart.find(i => i.itemId === item.id)
    setModalItem(item)
    setModalQty(existing?.qty ?? 1)
    setModalObs(existing?.observacao ?? '')
  }

  function addToCart() {
    if (!modalItem) return
    const updated = cart.filter(i => i.itemId !== modalItem.id)
    if (modalQty > 0) {
      updated.push({ itemId: modalItem.id, nome: modalItem.nome, preco: modalItem.preco, qty: modalQty, observacao: modalObs })
    }
    saveCart(updated)
    setModalItem(null)
  }

  function quickAdd(item: Item) {
    const existing = cart.find(i => i.itemId === item.id)
    if (existing) {
      saveCart(cart.map(i => i.itemId === item.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      saveCart([...cart, { itemId: item.id, nome: item.nome, preco: item.preco, qty: 1, observacao: '' }])
    }
  }

  function quickRemove(item: Item) {
    const existing = cart.find(i => i.itemId === item.id)
    if (!existing) return
    if (existing.qty === 1) {
      saveCart(cart.filter(i => i.itemId !== item.id))
    } else {
      saveCart(cart.map(i => i.itemId === item.id ? { ...i, qty: i.qty - 1 } : i))
    }
  }

  if (loading) {
    return (
      <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="pwa-spinner" />
      </div>
    )
  }

  return (
    <div className="pwa-screen" style={{ paddingBottom: cartCount > 0 ? 90 : 0 }}>
      {/* Navbar */}
      <div className="pwa-navbar">
        <div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Olá, {clienteNome}!</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Cardápio</div>
        </div>
        {cartCount > 0 && (
          <button
            onClick={() => router.push('/pwa/sacola')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 20, padding: '7px 14px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            🛒 {cartCount} · {fmtMoeda(cartTotal)}
          </button>
        )}
      </div>

      {/* Busca */}
      <div style={{ padding: '12px 16px 0', background: '#fff' }}>
        <input
          className="pwa-input"
          placeholder="🔍 Buscar item..."
          value={busca}
          onChange={e => { setBusca(e.target.value); if (e.target.value) setCatAtiva(null) }}
          style={{ background: 'var(--pwa-bg-input)' }}
        />
      </div>

      {/* Chips de categoria */}
      {!busca && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 16px', background: '#fff', scrollbarWidth: 'none' }}>
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`pwa-chip ${catAtiva === cat.id ? 'active' : 'inactive'}`}
              onClick={() => setCatAtiva(cat.id)}>
              {cat.nome}
            </button>
          ))}
        </div>
      )}

      {/* Lista de itens */}
      <div style={{ flex: 1, padding: '8px 16px 16px', overflowY: 'auto' }}>
        {itensFiltrados.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--pwa-muted)', padding: '40px 0' }}>Nenhum item encontrado</p>
        )}
        {itensFiltrados.map(item => {
          const qty = qtyInCart(item.id)
          return (
            <div key={item.id} style={{ background: '#fff', borderRadius: 'var(--pwa-r-md)', padding: '14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 14, border: '1px solid #F0EDE6' }}>
              <div
                style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--pwa-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, cursor: 'pointer' }}
                onClick={() => openModal(item)}>
                🍔
              </div>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => openModal(item)}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.nome}</div>
                {item.descricao && <div style={{ fontSize: 12, color: 'var(--pwa-muted)', marginBottom: 4 }}>{item.descricao}</div>}
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--pwa-primary)' }}>{fmtMoeda(item.preco)}</div>
              </div>
              {/* Controles de qty */}
              {qty > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => quickRemove(item)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--pwa-primary)', background: '#fff', color: 'var(--pwa-primary)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => quickAdd(item)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--pwa-primary)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              ) : (
                <button onClick={() => quickAdd(item)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--pwa-primary)', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom bar da sacola */}
      {cartCount > 0 && (
        <div className="pwa-bottom-bar">
          <button className="pwa-btn pwa-btn-primary" onClick={() => router.push('/pwa/sacola')}>
            <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 12, padding: '2px 8px', fontSize: 13 }}>{cartCount}</span>
            Ver sacola — {fmtMoeda(cartTotal)}
          </button>
        </div>
      )}

      {/* Modal de detalhe do item */}
      {modalItem && (
        <div className="pwa-modal-overlay" onClick={() => setModalItem(null)}>
          <div className="pwa-modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--pwa-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 14px' }}>🍔</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{modalItem.nome}</h3>
            {modalItem.descricao && <p style={{ fontSize: 13, color: 'var(--pwa-muted)', textAlign: 'center', margin: '0 0 16px' }}>{modalItem.descricao}</p>}
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--pwa-primary)', textAlign: 'center', marginBottom: 20 }}>{fmtMoeda(modalItem.preco)}</div>

            {/* Qty controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
              <button onClick={() => setModalQty(q => Math.max(0, q - 1))} style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--pwa-border)', background: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontSize: 24, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{modalQty}</span>
              <button onClick={() => setModalQty(q => q + 1)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--pwa-primary)', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>

            {/* Observação */}
            <div className="pwa-field">
              <label>Observação</label>
              <input className="pwa-input" value={modalObs} onChange={e => setModalObs(e.target.value)} placeholder="Sem cebola, sem molho..." />
            </div>

            <button className="pwa-btn pwa-btn-primary" onClick={addToCart} disabled={modalQty === 0}>
              {modalQty === 0 ? 'Remover da sacola' : `Adicionar — ${fmtMoeda(modalItem.preco * modalQty)}`}
            </button>
            <button className="pwa-btn pwa-btn-ghost" style={{ marginTop: 6 }} onClick={() => setModalItem(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
