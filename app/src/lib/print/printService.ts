'use client'

export type DadosPedido = {
  numero_seq: number
  created_at: string
  clientes: { nome: string; telefone: string }
  enderecos: { logradouro: string; numero: string; complemento?: string | null; bairro: string; referencia?: string | null }
  itens_pedido: { nome_snapshot: string; quantidade: number; preco_snapshot: number; subtotal: number; observacao?: string | null }[]
  subtotal: number
  taxa_entrega: number
  total: number
  pagamento: string
  pago?: boolean
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

const W = 36
const ITEM_W = 20
const QTD_W = 4
const TOTAL_W = 12 // ITEM_W + QTD_W + TOTAL_W = 36

function linha(esq: string, dir: string, total = W): string {
  const espaco = total - esq.length - dir.length
  return esq + ' '.repeat(Math.max(1, espaco)) + dir
}

function centralizar(texto: string, largura = W): string {
  const esp = Math.max(0, Math.floor((largura - texto.length) / 2))
  return ' '.repeat(esp) + texto
}

function wrapLine(text: string, indent: string): string[] {
  if (text.length <= W) return [text]
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const word of words) {
    const maxW = lines.length === 0 ? W : W - indent.length
    const test = cur ? cur + ' ' + word : word
    if (test.length <= maxW) { cur = test }
    else { if (cur) lines.push(cur); cur = word }
  }
  if (cur) lines.push(cur)
  return lines.map((line, i) => i === 0 ? line : indent + line)
}

function wrapItem(nome: string, qty: string, total: string): string[] {
  const words = nome.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const word of words) {
    const w = word.length > ITEM_W ? word.slice(0, ITEM_W) : word
    const test = cur ? cur + ' ' + w : w
    if (test.length <= ITEM_W) { cur = test }
    else { if (cur) lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  const indent = ' '.repeat(QTD_W)
  return lines.map((line, i) =>
    i === 0
      ? pad(qty, QTD_W) + pad(line, ITEM_W) + pad(total, TOTAL_W, true)
      : indent + pad(line, ITEM_W)
  )
}

function buildComandaHTML(pedido: DadosPedido): string {
  const SEP1 = '='.repeat(W)
  const SEP2 = '-'.repeat(W)
  const nome = (pedido.nomeEstabelecimento ?? 'DOCY ESQUINA').toUpperCase()
  const tel = pedido.telefoneEstabelecimento ?? ''

  const linhas: string[] = [
    centralizar(nome),
    tel ? centralizar(tel) : '',
    SEP1,
    linha(`PEDIDO #${String(pedido.numero_seq).padStart(4, '0')}`, fmtData(pedido.created_at)),
    SEP1,
    ...wrapLine(`CLIENTE: ${pedido.clientes.nome}`, '         '),
    `TEL: ${pedido.clientes.telefone}`,
    ...(pedido.enderecos.logradouro === 'Retirada na Loja'
      ? [`RETIRADA NA LOJA`]
      : [
          ...wrapLine(`END: ${pedido.enderecos.logradouro}, ${pedido.enderecos.numero}`, '     '),
          ...(pedido.enderecos.complemento ? wrapLine(`     ${pedido.enderecos.complemento}`, '     ') : []),
          ...wrapLine(`     ${pedido.enderecos.bairro}${pedido.enderecos.referencia ? ' — ' + pedido.enderecos.referencia : ''}`, '     '),
        ]
    ),
    SEP2,
    pad('QTD', QTD_W) + pad('ITEM', ITEM_W) + pad('TOTAL', TOTAL_W, true),
    SEP2,
    ...pedido.itens_pedido.flatMap(item => [
      ...wrapItem(item.nome_snapshot, String(item.quantidade) + 'x', fmtMoeda(item.subtotal)),
      ...(item.observacao ? wrapLine(`${' '.repeat(QTD_W)}> ${item.observacao}`, `${' '.repeat(QTD_W)}  `) : []),
    ]),
    SEP2,
    linha('Subtotal:', fmtMoeda(pedido.subtotal)),
    linha('Taxa de entrega:', fmtMoeda(pedido.taxa_entrega)),
    linha('TOTAL:', fmtMoeda(pedido.total)),
    ...(pedido.pagamento === 'dinheiro' && pedido.troco != null ? [
      linha('Recebido:', fmtMoeda(pedido.troco)),
      linha('Troco:', fmtMoeda(pedido.troco - pedido.total)),
    ] : []),
    SEP1,
    `Pagamento: ${pedido.pagamento.toUpperCase()}${pedido.pago ? ' - PAGO' : ''}`,
    ...(pedido.observacoes ? wrapLine(`OBS: ${pedido.observacoes}`, '     ') : []),
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
    <meta charset="utf-8">
    <style>
      @media print { body { margin: 0; } @page { margin: 3mm; size: 80mm auto; } }
      body { font-family: 'Courier New', monospace; font-size: 15px; font-weight: bold; line-height: 1.4; padding: 4px; width: 74mm; box-sizing: border-box; }
      div { white-space: pre; font-weight: bold; }
      .logo-wrap { text-align: center; margin-bottom: 6px; }
      .logo-wrap img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    </style></head><body>
    <div class="logo-wrap"><img src="${logoUrl}" alt="Logo" /></div>
    ${conteudo}</body></html>`
}

function buildResumoHTML(dados: DadosResumo): string {
  const SEP1 = '='.repeat(W)
  const SEP2 = '-'.repeat(W)
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
    <meta charset="utf-8">
    <style>
      @media print { body { margin: 0; } @page { margin: 3mm; size: 80mm auto; } }
      body { font-family: 'Courier New', monospace; font-size: 15px; font-weight: bold; line-height: 1.4; padding: 4px; width: 74mm; box-sizing: border-box; }
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

// ─── Comanda consolidada de mesa ─────────────────────────────────────────────

export type ItemMesa = {
  id: number
  nome_snapshot: string
  quantidade: number
  preco_snapshot: number
  observacao_item?: string | null
}

export type PedidoMesa = {
  id: number
  numero_seq: number
  total: number
  status_pedido: string
  created_at: string
  observacoes?: string | null
  itens_pedido: ItemMesa[]
}

export type DadosComandaMesa = {
  mesa_numero: number
  nome_cliente: string
  aberta_em: string
  pedidos: PedidoMesa[]
  nomeEstabelecimento?: string
}

function buildComandaMesaHTML(dados: DadosComandaMesa): string {
  const SEP1 = '='.repeat(W)
  const SEP2 = '-'.repeat(W)
  const nome = (dados.nomeEstabelecimento ?? 'DOCY ESQUINA').toUpperCase()
  const totalGeral = dados.pedidos.reduce((s, p) => s + Number(p.total), 0)

  const linhas: string[] = [
    centralizar(nome),
    SEP1,
    centralizar(`COMANDA — MESA ${dados.mesa_numero}`),
    `CLIENTE: ${dados.nome_cliente}`,
    `ABERTURA: ${fmtData(dados.aberta_em)}`,
    `IMPRESSAO: ${fmtData(new Date().toISOString())}`,
    SEP1,
  ]

  // Lista cada pedido com seus itens
  for (const pedido of dados.pedidos) {
    if (pedido.itens_pedido.length === 0) continue
    linhas.push(`PEDIDO #${String(pedido.numero_seq).padStart(4, '0')}`)
    linhas.push(SEP2)
    linhas.push(pad('QTD', QTD_W) + pad('ITEM', ITEM_W) + pad('TOTAL', TOTAL_W, true))
    linhas.push(SEP2)
    for (const item of pedido.itens_pedido) {
      const subtotal = Number(item.preco_snapshot) * item.quantidade
      linhas.push(...wrapItem(item.nome_snapshot, String(item.quantidade) + 'x', fmtMoeda(subtotal)))
      if (item.observacao_item) {
        linhas.push(...wrapLine(`${' '.repeat(QTD_W)}> ${item.observacao_item}`, `${' '.repeat(QTD_W)}  `))
      }
    }
    if (pedido.observacoes) {
      linhas.push(...wrapLine(`OBS: ${pedido.observacoes}`, '     '))
    }
    linhas.push(linha('Subtotal pedido:', fmtMoeda(Number(pedido.total))))
    linhas.push('')
  }

  linhas.push(SEP1)
  linhas.push(linha('TOTAL GERAL:', fmtMoeda(totalGeral)))
  linhas.push(SEP1)
  linhas.push(centralizar('Pagamento c/ o atendente'))
  linhas.push(centralizar(dados.nomeEstabelecimento ?? 'Docy Esquina'))
  linhas.push('')
  linhas.push('')
  linhas.push('')

  const conteudo = linhas
    .map(l => `<div>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`)
    .join('\n')

  const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/LOGO.png` : '/LOGO.png'

  return `<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <style>
      @media print { body { margin: 0; } @page { margin: 3mm; size: 80mm auto; } }
      body { font-family: 'Courier New', monospace; font-size: 15px; font-weight: bold; line-height: 1.4; padding: 4px; width: 74mm; box-sizing: border-box; }
      div { white-space: pre; font-weight: bold; }
      .logo-wrap { text-align: center; margin-bottom: 6px; }
      .logo-wrap img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; }
    </style></head><body>
    <div class="logo-wrap"><img src="${logoUrl}" alt="Logo" /></div>
    ${conteudo}</body></html>`
}

export function imprimirComandaMesa(dados: DadosComandaMesa): void {
  const html = buildComandaMesaHTML(dados)
  const janela = window.open('', '_blank', 'width=420,height=700')
  if (!janela) { alert('Permita pop-ups para imprimir a comanda.'); return }
  janela.document.write(html)
  janela.document.close()
  janela.focus()
  setTimeout(() => { janela.print(); janela.close() }, 400)
}
