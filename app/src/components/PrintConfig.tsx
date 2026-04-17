'use client'

export default function PrintConfig() {
  async function handleTeste() {
    const { imprimirComanda } = await import('@/lib/print/printService')
    imprimirComanda({
      numero_seq: 1,
      created_at: new Date().toISOString(),
      clientes: { nome: 'TESTE IMPRESSORA', telefone: '(00) 00000-0000' },
      enderecos: { logradouro: 'Rua Teste', numero: '123', bairro: 'Bairro Teste' },
      itens_pedido: [{ nome_snapshot: 'Item de Teste', quantidade: 1, preco_snapshot: 10, subtotal: 10 }],
      subtotal: 10,
      taxa_entrega: 5,
      total: 15,
      pagamento: 'pix',
      nomeEstabelecimento: 'Docy Esquina',
    })
  }

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Impressão Térmica
      </h3>

      <div style={{ background: 'var(--badge-green-bg)', border: '0.5px solid #9FE1CB', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
        <p style={{ color: 'var(--badge-green-text)', fontSize: 13, fontWeight: 600, margin: 0 }}>
          ✓ Impressão via diálogo nativo do Windows
        </p>
        <p style={{ color: '#555', fontSize: 12, marginTop: 4, marginBottom: 0 }}>
          Ao confirmar um pedido, o Windows abrirá o diálogo de impressão.
          Selecione sua impressora térmica (ex: POS-80, EPSON TM-T20) e clique em Imprimir.
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        A comanda é formatada em 80mm (fonte Courier New, 42 colunas) — compatível com qualquer impressora térmica padrão.
        Não requer instalação de software adicional.
      </p>

      <button
        onClick={handleTeste}
        className="btn-outline"
        style={{ fontSize: 13 }}
      >
        🖨️ Imprimir página de teste
      </button>
    </div>
  )
}
