'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type CartItem = { itemId: number; nome: string; preco: number; qty: number; observacao: string }
type Endereco = { id: number; logradouro: string; numero: string; bairro: string; complemento?: string; cep?: string; distancia_km?: number | null }
type Pagamento = 'pix' | 'dinheiro' | 'debito' | 'credito'
type MesaInfo = { numero: number; nome: string }

function fmtMoeda(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}

export default function PwaSacolaPage() {
  const router = useRouter()

  // Modo mesa
  const [mesaInfo, setMesaInfo] = useState<MesaInfo | null>(null)

  // Modo normal
  const [clienteId, setClienteId] = useState<number | null>(null)
  const [enderecoId, setEnderecoId] = useState<number | null>(null)
  const [endereco, setEndereco] = useState<Endereco | null>(null)
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'retirada'>('entrega')
  const [taxaEntregaBase, setTaxaEntregaBase] = useState(0)
  const [carregandoTaxa, setCarregandoTaxa] = useState(true)
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null)

  // Comuns
  const [cart, setCart] = useState<CartItem[]>([])
  const [pagamento, setPagamento] = useState<Pagamento>('pix')
  const [troco, setTroco] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const cartRaw = sessionStorage.getItem('pwa_cart')
    if (cartRaw) setCart(JSON.parse(cartRaw))

    // Verifica modo mesa primeiro
    const mesaRaw = sessionStorage.getItem('pwa_mesa')
    if (mesaRaw) {
      const mesa: MesaInfo = JSON.parse(mesaRaw)
      setMesaInfo(mesa)
      setCarregandoTaxa(false) // Mesa nunca tem taxa
      return
    }

    // Modo normal — cliente com endereço
    const clienteRaw = localStorage.getItem('pwa_cliente')
    const endId = localStorage.getItem('pwa_endereco_id')
    if (!clienteRaw || !endId) { router.replace('/pwa'); return }

    const c = JSON.parse(clienteRaw)
    setClienteId(c.clienteId)
    setEnderecoId(Number(endId))

    const end: Endereco | undefined = c.enderecos?.find((e: Endereco) => e.id === Number(endId))
    if (end) setEndereco(end)

    // Taxa de entrega: usa distancia_km salva no cadastro (sem recalcular)
    const calcularTaxa = async (end?: Endereco) => {
      setCarregandoTaxa(true)
      try {
        const body: Record<string, unknown> = {}
        if (end?.distancia_km != null && end.distancia_km > 0) {
          body.km_manual = end.distancia_km
          setDistanciaKm(end.distancia_km)
        } else if (end?.bairro) {
          body.bairro = end.bairro
        }
        if (Object.keys(body).length > 0) {
          const res = await fetch('/api/frete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
          if (res.ok) { const f = await res.json(); setTaxaEntregaBase(f.taxa ?? 0); return }
        }
        const cfg = await fetch('/api/pwa/config').then(r => r.json()).catch(() => ({ taxaMinima: 5 }))
        setTaxaEntregaBase(cfg.taxaMinima ?? 5)
      } catch {
        const cfg = await fetch('/api/pwa/config').then(r => r.json()).catch(() => ({ taxaMinima: 5 }))
        setTaxaEntregaBase(cfg.taxaMinima ?? 5)
      } finally {
        setCarregandoTaxa(false)
      }
    }

    calcularTaxa(end)
  }, [router])

  function saveCart(c: CartItem[]) { setCart(c); sessionStorage.setItem('pwa_cart', JSON.stringify(c)) }
  function changeQty(itemId: number, delta: number) {
    const updated = cart.map(i => i.itemId === itemId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    saveCart(updated)
  }

  const taxaEntrega = mesaInfo ? 0 : tipoEntrega === 'retirada' ? 0 : taxaEntregaBase
  const subtotal = cart.reduce((s, i) => s + i.preco * i.qty, 0)
  const total = subtotal + taxaEntrega

  async function handleConfirmar() {
    if (cart.length === 0) { setErro('Sua sacola está vazia'); return }
    setEnviando(true); setErro('')
    try {
      const body = mesaInfo
        ? {
            tipoEntrega: 'local',
            mesa: mesaInfo.numero,
            nome: mesaInfo.nome,
            itens: cart.map(i => ({ itemId: i.itemId, nome: i.nome, preco: i.preco, qty: i.qty, observacao: i.observacao })),
            pagamento,
            troco: pagamento === 'dinheiro' && troco ? Number(troco.replace(',', '.')) : null,
            observacoes: observacoes || null,
            subtotal, taxaEntrega: 0, total,
          }
        : {
            clienteId,
            enderecoId: tipoEntrega === 'retirada' ? null : enderecoId,
            tipoEntrega,
            itens: cart.map(i => ({ itemId: i.itemId, nome: i.nome, preco: i.preco, qty: i.qty, observacao: i.observacao })),
            pagamento,
            troco: pagamento === 'dinheiro' && troco ? Number(troco.replace(',', '.')) : null,
            observacoes: observacoes || null,
            subtotal, taxaEntrega, total,
          }

      const res = await fetch('/api/pwa/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setErro(data.error || 'Erro ao confirmar pedido'); return }

      sessionStorage.removeItem('pwa_cart')
      // pwa_mesa é mantido para permitir novos pedidos na mesma sessão de mesa
      router.push(`/pwa/confirmacao?id=${data.pedidoId}&num=${data.numeroPedido}${mesaInfo ? `&mesa=${mesaInfo.numero}&nome=${encodeURIComponent(mesaInfo.nome)}` : ''}`)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (cart.length === 0 && (clienteId || mesaInfo)) {
    return (
      <div className="pwa-screen" style={{ alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
        <p style={{ color: 'var(--pwa-muted)', textAlign: 'center', marginBottom: 20 }}>Sua sacola está vazia</p>
        <button className="pwa-btn pwa-btn-primary" style={{ maxWidth: 300 }} onClick={() => router.push('/pwa/cardapio')}>Ver cardápio</button>
      </div>
    )
  }

  return (
    <div className="pwa-screen">
      <div className="pwa-navbar">
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 600 }}>Sacola</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 120px' }}>

        {/* Badge Mesa */}
        {mesaInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--pwa-primary-light)', border: '1.5px solid var(--pwa-primary)', borderRadius: 'var(--pwa-r-lg)', padding: '12px 16px', marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>🍽️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--pwa-primary)' }}>Mesa {mesaInfo.numero}</div>
              <div style={{ fontSize: 12, color: 'var(--pwa-muted)' }}>Consumo no local · Sem taxa de entrega</div>
            </div>
          </div>
        )}

        {/* Tipo de entrega — só modo normal */}
        {!mesaInfo && (
          <div style={{ background: '#fff', borderRadius: 'var(--pwa-r-lg)', border: '1px solid #F0EDE6', padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', marginBottom: 12 }}>COMO DESEJA RECEBER?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {([{ v: 'entrega', label: '🛵 Entrega' }, { v: 'retirada', label: '🏪 Retirada no local' }] as const).map(opt => (
                <button key={opt.v} onClick={() => setTipoEntrega(opt.v)} style={{
                  padding: '12px 14px', borderRadius: 'var(--pwa-r-md)',
                  border: `2px solid ${tipoEntrega === opt.v ? 'var(--pwa-primary)' : 'var(--pwa-border)'}`,
                  background: tipoEntrega === opt.v ? 'var(--pwa-primary-light)' : '#fff',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--pwa-ink)',
                }}>{opt.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Itens */}
        <div style={{ background: '#fff', borderRadius: 'var(--pwa-r-lg)', border: '1px solid #F0EDE6', marginBottom: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0EDE6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)' }}>ITENS DO PEDIDO</div>
          {cart.map(item => (
            <div key={item.itemId} style={{ padding: '12px 16px', borderBottom: '1px solid #F8F6F2', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.nome}</div>
                {item.observacao && <div style={{ fontSize: 11, color: 'var(--pwa-muted)', marginTop: 2 }}>Obs: {item.observacao}</div>}
                <div style={{ fontSize: 13, color: 'var(--pwa-primary)', fontWeight: 600, marginTop: 4 }}>{fmtMoeda(item.preco * item.qty)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => changeQty(item.itemId, -1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--pwa-border)', background: '#fff', fontSize: 16, cursor: 'pointer' }}>−</button>
                <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => changeQty(item.itemId, 1)} style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--pwa-primary)', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Endereço — só entrega normal */}
        {!mesaInfo && tipoEntrega === 'entrega' && endereco && (
          <div style={{ background: '#fff', borderRadius: 'var(--pwa-r-lg)', border: '1px solid #F0EDE6', padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', marginBottom: 8 }}>ENDEREÇO DE ENTREGA</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{endereco.logradouro}, {endereco.numero}</div>
            <div style={{ fontSize: 12, color: 'var(--pwa-muted)' }}>{endereco.bairro}{endereco.complemento ? ` — ${endereco.complemento}` : ''}</div>
          </div>
        )}

        {/* Pagamento */}
        <div style={{ background: '#fff', borderRadius: 'var(--pwa-r-lg)', border: '1px solid #F0EDE6', padding: '14px 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)', marginBottom: 12 }}>PAGAMENTO</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {([
              { v: 'pix', label: '💚 Pix', bg: 'var(--pwa-green-bg)', border: 'var(--pwa-green-border)' },
              { v: 'dinheiro', label: '💵 Dinheiro', bg: 'var(--pwa-amber-bg)', border: 'var(--pwa-amber-border)' },
              { v: 'credito', label: '💳 Crédito', bg: 'var(--pwa-blue-bg)', border: 'var(--pwa-blue-border)' },
              { v: 'debito', label: '💳 Débito', bg: 'var(--pwa-blue-bg)', border: 'var(--pwa-blue-border)' },
            ] as const).map(opt => (
              <button key={opt.v} onClick={() => setPagamento(opt.v as Pagamento)} style={{
                padding: '12px 14px', borderRadius: 'var(--pwa-r-md)',
                border: `2px solid ${pagamento === opt.v ? 'var(--pwa-primary)' : opt.border}`,
                background: pagamento === opt.v ? 'var(--pwa-primary-light)' : opt.bg,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--pwa-ink)',
              }}>{opt.label}</button>
            ))}
          </div>
          {pagamento === 'dinheiro' && (
            <div className="pwa-field" style={{ marginTop: 12, marginBottom: 0 }}>
              <label>Troco para quanto? <span style={{ fontWeight: 400, color: 'var(--pwa-muted)', fontSize: 11 }}>(valor que você vai pagar)</span></label>
              <input className="pwa-input" placeholder="Ex: 100,00" inputMode="decimal" value={troco} onChange={e => setTroco(e.target.value)} />
              {(() => {
                const pago = Number(troco.replace(',', '.')), trocoVal = pago - total
                if (pago > 0 && trocoVal > 0) return (
                  <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', background: 'var(--pwa-amber-bg)', border: '1px solid var(--pwa-amber-border)', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 13, color: '#B7800A' }}>Troco a receber:</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#B7800A' }}>{fmtMoeda(trocoVal)}</span>
                  </div>
                )
                if (pago > 0 && trocoVal <= 0 && troco !== '') return <p style={{ fontSize: 12, color: 'var(--pwa-red-ink)', marginTop: 6 }}>Valor menor que o total ({fmtMoeda(total)})</p>
                return null
              })()}
            </div>
          )}
        </div>

        {/* Observações */}
        <div className="pwa-field" style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pwa-muted)' }}>OBSERVAÇÕES GERAIS</label>
          <textarea className="pwa-input" style={{ height: 72, resize: 'none', paddingTop: 12 }} placeholder="Alguma observação para o pedido todo?" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
        </div>

        {/* Totais */}
        <div style={{ background: '#1E1E1C', borderRadius: 'var(--pwa-r-lg)', padding: '16px', color: '#fff', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, opacity: 0.8 }}>
            <span>Subtotal</span><span>{fmtMoeda(subtotal)}</span>
          </div>
          {mesaInfo ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12, opacity: 0.7 }}>
              <span>Consumo no local</span><span style={{ color: '#6EE7B7' }}>Sem taxa 🍽️</span>
            </div>
          ) : tipoEntrega === 'entrega' ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12, opacity: 0.8 }}>
              <span>Taxa de entrega{distanciaKm ? ` (${distanciaKm.toFixed(1).replace('.', ',')} km)` : ''}</span>
              <span>{carregandoTaxa ? '...' : fmtMoeda(taxaEntrega)}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12, opacity: 0.7 }}>
              <span>Retirada no local</span><span style={{ color: '#6EE7B7' }}>Grátis</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 20 }}>{fmtMoeda(total)}</span>
          </div>
        </div>

        {erro && <p style={{ color: 'var(--pwa-red-ink)', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{erro}</p>}
      </div>

      <div className="pwa-bottom-bar">
        <button className="pwa-btn pwa-btn-primary" onClick={handleConfirmar} disabled={enviando || cart.length === 0 || (!mesaInfo && carregandoTaxa)}>
          {enviando ? 'Confirmando...' : (!mesaInfo && carregandoTaxa) ? 'Calculando taxa...' : `Confirmar pedido — ${fmtMoeda(total)}`}
        </button>
      </div>
    </div>
  )
}
