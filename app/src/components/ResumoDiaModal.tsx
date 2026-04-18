'use client'

import { useEffect, useState } from 'react'

type ResumoDia = {
  totalPedidos: number
  faturamentoTotal: number
  ticketMedio: number
  taxaMediaEntrega: number
  variacao: { pedidos: number | null; faturamento: number | null }
  porFormaPagamento: Record<string, { quantidade: number; total: number }>
}

function fmtMoeda(v: number): string {
  return `R$ ${Number(v).toFixed(2).replace('.', ',')}`
}

function VariacaoChip({ value }: { value: number | null }) {
  if (value === null) return null
  const cor = value >= 0 ? '#0F6E56' : '#A32D2D'
  const bg = value >= 0 ? '#E1F5EE' : '#FCEBEB'
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: cor, background: bg, padding: '2px 6px', borderRadius: 6, marginLeft: 6 }}>
      {value >= 0 ? '+' : ''}{value}%
    </span>
  )
}

const pagamentoBadge: Record<string, string> = {
  pix: 'badge-green', dinheiro: 'badge-amber', debito: 'badge-blue', credito: 'badge-blue',
}
const pagamentoLabel: Record<string, string> = {
  pix: 'Pix', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito',
}

const STORAGE_KEY = 'docy_resumo_suprimido'

export default function ResumoDiaModal() {
  const [open, setOpen] = useState(false)
  const [resumo, setResumo] = useState<ResumoDia | null>(null)
  const [naoExibirHoje, setNaoExibirHoje] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const suprimido = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (suprimido === today) { setLoading(false); return }

    fetch('/api/pedidos/resumo-dia')
      .then(r => r.json())
      .then(data => {
        setResumo(data)
        if (data.totalPedidos > 0) setOpen(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleFechar() {
    if (naoExibirHoje) {
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(STORAGE_KEY, today)
    }
    setOpen(false)
  }

  function handleImprimir() {
    if (!resumo) return
    const linhas = [
      'RESUMO DO DIA',
      '==========================================',
      `Total de Pedidos: ${resumo.totalPedidos}`,
      `Faturamento: ${fmtMoeda(resumo.faturamentoTotal)}`,
      `Ticket Médio: ${fmtMoeda(resumo.ticketMedio)}`,
      `Taxa Média Entrega: ${fmtMoeda(resumo.taxaMediaEntrega)}`,
      '',
      'Por Forma de Pagamento:',
      ...Object.entries(resumo.porFormaPagamento).map(
        ([forma, d]) => `  ${pagamentoLabel[forma] ?? forma}: ${d.quantidade} pedidos — ${fmtMoeda(d.total)}`
      ),
      '==========================================',
    ]
    const win = window.open('', '_blank', 'width=400,height=500')
    if (win) {
      win.document.write(`<pre style="font-family:monospace;font-size:13px;padding:16px">${linhas.join('\n')}</pre>`)
      win.document.close()
      win.print()
    }
  }

  if (loading || !open || !resumo) return null

  return (
    <div className="modal-overlay" style={{ zIndex: 100 }}>
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Resumo do Dia</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Pedidos</p>
            <p style={{ fontSize: 20, fontWeight: 700 }}>
              {resumo.totalPedidos}
              <VariacaoChip value={resumo.variacao.pedidos} />
            </p>
          </div>
          <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Faturamento</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F6E56' }}>
              {fmtMoeda(resumo.faturamentoTotal)}
              <VariacaoChip value={resumo.variacao.faturamento} />
            </p>
          </div>
          <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Ticket Médio</p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{fmtMoeda(resumo.ticketMedio)}</p>
          </div>
          <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Taxa Média</p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>{fmtMoeda(resumo.taxaMediaEntrega)}</p>
          </div>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Por Forma de Pagamento</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {Object.entries(resumo.porFormaPagamento).map(([forma, dados]) => (
            dados.quantidade > 0 && (
              <div key={forma} className={`badge ${pagamentoBadge[forma] ?? 'badge-gray'}`} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '6px 10px', borderRadius: 8 }}>
                <span style={{ fontWeight: 700 }}>{pagamentoLabel[forma] ?? forma}</span>
                <span style={{ fontSize: 11 }}>{dados.quantidade} pedido{dados.quantidade !== 1 ? 's' : ''} &middot; {fmtMoeda(dados.total)}</span>
              </div>
            )
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, cursor: 'pointer', fontSize: 13 }}>
          <input
            type="checkbox"
            checked={naoExibirHoje}
            onChange={e => setNaoExibirHoje(e.target.checked)}
            style={{ width: 15, height: 15 }}
          />
          Não exibir hoje
        </label>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={handleImprimir}>Imprimir Resumo</button>
          <button className="btn-primary" onClick={handleFechar}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
