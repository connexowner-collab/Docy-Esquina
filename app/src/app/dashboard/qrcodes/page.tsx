'use client'

import { useState, useEffect } from 'react'

const NUM_MESAS = 6
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://docy-esquina.vercel.app'

function qrUrl(mesa: number, baseUrl: string) {
  const mesaUrl = `${baseUrl}/pwa/mesa/${mesa}`
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(mesaUrl)}`
}

export default function QRCodesPage() {
  const [baseUrl, setBaseUrl] = useState('https://docy-esquina.vercel.app')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  function imprimirTodos() {
    window.print()
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #qr-area, #qr-area * { visibility: visible !important; }
          #qr-area { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
          .qr-card { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <div>
        {/* Header */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#2C2C2A' }}>QR Codes das Mesas</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
              Imprima e coloque em cada mesa. O cliente escaneia e faz o pedido direto pelo celular.
            </p>
          </div>
          <button
            onClick={imprimirTodos}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', background: '#C0392B', color: '#fff',
              border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            🖨️ Imprimir todos
          </button>
        </div>

        {/* Grid de QR Codes */}
        <div id="qr-area" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {Array.from({ length: NUM_MESAS }, (_, i) => i + 1).map(mesa => (
            <div
              key={mesa}
              className="qr-card"
              style={{
                background: '#fff',
                border: '1.5px solid #E0DDD5',
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {/* Badge mesa */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FEF2F2', border: '1.5px solid #C0392B',
                borderRadius: 10, padding: '6px 16px',
              }}>
                <span style={{ fontSize: 20 }}>🍽️</span>
                <span style={{ fontWeight: 800, fontSize: 20, color: '#C0392B' }}>Mesa {mesa}</span>
              </div>

              {/* QR Code */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl(mesa, baseUrl)}
                alt={`QR Code Mesa ${mesa}`}
                width={200}
                height={200}
                style={{ borderRadius: 8, border: '1px solid #E0DDD5' }}
              />

              {/* URL */}
              <div style={{
                fontSize: 10, color: '#aaa', textAlign: 'center',
                wordBreak: 'break-all', maxWidth: 200,
              }}>
                {baseUrl}/pwa/mesa/{mesa}
              </div>

              {/* Instrução */}
              <div style={{
                fontSize: 11, color: '#888', textAlign: 'center',
                background: '#F7F7F5', borderRadius: 8, padding: '8px 12px', width: '100%',
                boxSizing: 'border-box',
              }}>
                📱 Escaneie para fazer seu pedido
              </div>

              {/* Botão individual de impressão (no-print) */}
              <button
                className="no-print"
                onClick={() => {
                  const w = window.open('', '_blank')
                  if (!w) return
                  w.document.write(`
                    <html><head><title>Mesa ${mesa}</title></head>
                    <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:sans-serif;">
                      <div style="text-align:center;padding:32px;border:2px solid #C0392B;border-radius:20px;max-width:300px">
                        <div style="font-size:28px;font-weight:800;color:#C0392B;margin-bottom:12px">🍽️ Mesa ${mesa}</div>
                        <img src="${qrUrl(mesa, baseUrl)}" width="220" height="220" style="border-radius:8px" />
                        <div style="margin-top:12px;font-size:11px;color:#aaa;">${baseUrl}/pwa/mesa/${mesa}</div>
                        <div style="margin-top:8px;font-size:13px;color:#888;">📱 Escaneie para fazer seu pedido</div>
                      </div>
                    </body></html>
                  `)
                  w.document.close()
                  w.focus()
                  setTimeout(() => { w.print(); w.close() }, 500)
                }}
                style={{
                  width: '100%', padding: '8px', background: '#F5F3EF',
                  border: '1px solid #E0DDD5', borderRadius: 8, color: '#555',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                🖨️ Imprimir mesa {mesa}
              </button>
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="no-print" style={{
          marginTop: 28, padding: 16, background: '#EEF4FC', border: '1px solid #B5D4F4',
          borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div style={{ fontSize: 13, color: '#185FA5', lineHeight: 1.6 }}>
            <strong>Como funciona:</strong> O cliente escaneia o QR code com o celular → informa o nome →
            faz o pedido pelo cardápio digital → o pedido chega no painel com <strong>🍽️ Mesa X</strong>, sem taxa de entrega.
          </div>
        </div>
      </div>
    </>
  )
}
