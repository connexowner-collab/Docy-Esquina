'use client'

export type DadosPedido = {
  numero_seq: number
  created_at: string
  clientes: { nome: string; telefone: string }
  enderecos: { logradouro: string; numero: string; bairro: string; referencia?: string | null }
  itens_pedido: { nome_snapshot: string; quantidade: number; preco_snapshot: number; subtotal: number }[]
  subtotal: number
  taxa_entrega: number
  total: number
  pagamento: string
  troco?: number | null
  observacoes?: string | null
  nomeEstabelecimento?: string
  telefoneEstabelecimento?: string
}

export type DadosResumo = {
  data: string
  totalPedidos: number
  faturamentoTotal: number
  ticketMedio: number
  taxaMediaEntrega: number
  porFormaPagamento: Record<string, { quantidade: number; total: number }>
  nomeEstabelecimento?: string
}

function fmtMoeda(v: number): string {
  return `R$ ${Number(v).toFixed(2).replace('.', ',')}`
}

function fmtData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function pad(str: string, len: number, right = false): string {
  const s = String(str).slice(0, len)
  return right ? s.padStart(len) : s.padEnd(len)
}

function linha(esq: string, dir: string, total = 42): string {
  const espaco = total - esq.length - dir.length
  return esq + ' '.repeat(Math.max(1, espaco)) + dir
}

function centralizar(texto: string, largura = 42): string {
  const esp = Math.max(0, Math.floor((largura - texto.length) / 2))
  return ' '.repeat(esp) + texto
}

function buildComandaHTML(pedido: DadosPedido): string {
  const SEP1 = '='.repeat(42)
  const SEP2 = '-'.repeat(42)
  const nome = (pedido.nomeEstabelecimento ?? 'DOCY ESQUINA').toUpperCase()
  const tel = pedido.telefoneEstabelecimento ?? ''

  const linhas: string[] = [
    centralizar(nome),
    tel ? centralizar(tel) : '',
    SEP1,
    linha(`PEDIDO #${String(pedido.numero_seq).padStart(4, '0')}`, fmtData(pedido.created_at)),
    SEP1,
    `CLIENTE: ${pedido.clientes.nome}`,
    `TEL: ${pedido.clientes.telefone}`,
    `END: ${pedido.enderecos.logradouro}, ${pedido.enderecos.numero}`,
    `     ${pedido.enderecos.bairro}${pedido.enderecos.referencia ? ' — ' + pedido.enderecos.referencia : ''}`,
    SEP2,
    pad('ITEM', 24) + pad('QTD', 5) + pad('TOTAL', 13, true),
    SEP2,
    ...pedido.itens_pedido.map(item => {
      const nomeItem = pad(item.nome_snapshot, 24)
      const qty = pad(String(item.quantidade) + 'x', 5)
      const total = pad(fmtMoeda(item.subtotal), 13, true)
      return nomeItem + qty + total
    }),
    SEP2,
    linha('Subtotal:', fmtMoeda(pedido.subtotal)),
    linha('Taxa de entrega:', fmtMoeda(pedido.taxa_entrega)),
    linha('TOTAL:', fmtMoeda(pedido.total)),
    ...(pedido.pagamento === 'dinheiro' && pedido.troco != null ? [
      linha('Recebido:', fmtMoeda(pedido.total + pedido.troco)),
      linha('Troco:', fmtMoeda(pedido.troco)),
    ] : []),
    SEP1,
    `Pagamento: ${pedido.pagamento.toUpperCase()}`,
    ...(pedido.observacoes ? [`OBS: ${pedido.observacoes}`] : []),
    SEP1,
    centralizar('Obrigado pela preferencia!'),
    centralizar(pedido.nomeEstabelecimento ?? 'Docy Esquina'),
    '', '', '',
  ]

  const conteudo = linhas
    .filter(l => l !== '')
    .map(l => `<div>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`)
    .join('\n')

  const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/LOGO.png` : '/LOGO.png'

  return `<!DOCTYPE html><html><head>
    <style>
      @media print { body { margin: 0; } @page { margin: 3mm; size: 80mm auto; } }
      body { font-family: 'Courier New', monospace; font-size: 13px; font-weight: bold; line-height: 1.4; padding: 4px; width: 74mm; box-sizing: border-box; }
      div { white-space: pre; font-weight: bold; }
      .logo-wrap { text-align: center; margin-bottom: 6px; }
      .logo-wrap img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    </style></head><body>
    <div class="logo-wrap"><img src="${logoUrl}" alt="Logo" /></div>
    ${conteudo}</body></html>`
}

function buildResumoHTML(dados: DadosResumo): string {
  const SEP1 = '='.repeat(42)
  const SEP2 = '-'.repeat(42)
  const nome = (dados.nomeEstabelecimento ?? 'DOCY ESQUINA').toUpperCase()
  const dataFmt = new Date(dados.data + 'T12:00:00').toLocaleDateString('pt-BR')
  const pagLabels: Record<string, string> = { pix: 'PIX', dinheiro: 'DINHEIRO', debito: 'DEBITO', credito: 'CREDITO' }

  const pagLinhas = Object.entries(dados.porFormaPagamento)
    .filter(([, v]) => v.quantidade > 0)
    .map(([k, v]) => linha(`${pagLabels[k] ?? k.toUpperCase()}: ${v.quantidade} ped.`, fmtMoeda(v.total)))

  const linhas = [
    centralizar(nome),
    centralizar('RESUMO DO DIA'),
    centralizar(dataFmt),
    SEP1,
    linha('Pedidos:', String(dados.totalPedidos)),
    linha('Faturamento:', fmtMoeda(dados.faturamentoTotal)),
    linha('Ticket Medio:', fmtMoeda(dados.ticketMedio)),
    linha('Taxa Media:', fmtMoeda(dados.taxaMediaEntrega)),
    SEP2,
    ...pagLinhas,
    SEP1,
    centralizar(`Impresso: ${new Date().toLocaleString('pt-BR')}`),
    '', '', '',
  ]

  const conteudo = linhas
    .map(l => `<div>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`)
    .join('\n')

  const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/LOGO.png` : '/LOGO.png'

  return `<!DOCTYPE html><html><head>
    <style>
      @media print { body { margin: 0; } @page { margin: 3mm; size: 80mm auto; } }
      body { font-family: 'Courier New', monospace; font-size: 13px; font-weight: bold; line-height: 1.4; padding: 4px; width: 74mm; box-sizing: border-box; }
      div { white-space: pre; font-weight: bold; }
      .logo-wrap { text-align: center; margin-bottom: 6px; }
      .logo-wrap img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    </style></head><body>
    <div class="logo-wrap"><img src="${logoUrl}" alt="Logo" /></div>
    ${conteudo}</body></html>`
}

export function imprimirComanda(pedido: DadosPedido): void {
  const html = buildComandaHTML(pedido)
  const janela = window.open('', '_blank', 'width=420,height=700')
  if (!janela) { alert('Permita pop-ups para imprimir a comanda.'); return }
  janela.document.write(html)
  janela.document.close()
  janela.focus()
  setTimeout(() => { janela.print(); janela.close() }, 400)
}

export function imprimirResumo(dados: DadosResumo): void {
  const html = buildResumoHTML(dados)
  const janela = window.open('', '_blank', 'width=420,height=700')
  if (!janela) { alert('Permita pop-ups para imprimir o resumo.'); return }
  janela.document.write(html)
  janela.document.close()
  janela.focus()
  setTimeout(() => { janela.print(); janela.close() }, 400)
}
