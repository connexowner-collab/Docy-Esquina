/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

// QZ Tray client-side print service
// Loaded dynamically to avoid SSR issues

declare global {
  interface Window {
    qz: any
  }
}

const COLS = 42

function center(text: string, cols = COLS): string {
  const pad = Math.max(0, Math.floor((cols - text.length) / 2))
  return ' '.repeat(pad) + text
}

function padEnd(text: string, len: number): string {
  return text.length >= len ? text.slice(0, len) : text + ' '.repeat(len - text.length)
}

function padStart(text: string, len: number): string {
  return text.length >= len ? text.slice(0, len) : ' '.repeat(len - text.length) + text
}

function separator(char = '=', cols = COLS): string {
  return char.repeat(cols)
}

async function loadQz(): Promise<any> {
  if (typeof window === 'undefined') throw new Error('Apenas client-side')
  if (window.qz) return window.qz
  // qz-tray must be loaded via CDN or bundled — here we import the npm package
  const qz = await import('qz-tray')
  window.qz = (qz as any).default ?? qz
  return window.qz
}

async function setupSigning(qz: any): Promise<void> {
  qz.security.setCertificatePromise(async (resolve: (cert: string) => void) => {
    // fetch the public certificate from the server if available
    resolve('-----BEGIN CERTIFICATE-----\nMIIBXzCCAQWgAwIBAgIUBqAqwjQ3E6bJABs07RmN7t5oGKkwCgYIKoZIzj0EAwIw\n-----END CERTIFICATE-----')
  })
  qz.security.setSignatureAlgorithm('SHA512')
  qz.security.setSignaturePromise((toSign: string) => {
    return async (resolve: (sig: string) => void, reject: (e: Error) => void) => {
      try {
        const res = await fetch('/api/print/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request: toSign }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Signing failed')
        resolve(data.signature)
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)))
      }
    }
  })
}

export async function connect(): Promise<void> {
  const qz = await loadQz()
  if (!qz.websocket.isActive()) {
    await setupSigning(qz)
    await qz.websocket.connect()
  }
}

export async function disconnect(): Promise<void> {
  const qz = await loadQz()
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect()
  }
}

export async function getStatus(): Promise<'connected' | 'disconnected'> {
  const qz = await loadQz()
  return qz.websocket.isActive() ? 'connected' : 'disconnected'
}

export async function getPrinters(): Promise<string[]> {
  const qz = await loadQz()
  const printers = await qz.printers.find()
  return Array.isArray(printers) ? printers : [printers]
}

type PedidoParaImprimir = {
  numero_seq: number
  created_at: string
  observacoes?: string | null
  pagamento: string
  subtotal: number
  taxa_entrega: number
  total: number
  troco?: number | null
  clientes: { nome: string; telefone: string }
  enderecos: { logradouro: string; numero: string; bairro: string; referencia?: string | null }
  itens_pedido: Array<{ nome_snapshot: string; quantidade: number; preco_snapshot: number; subtotal: number }>
}

export function buildComanda(pedido: PedidoParaImprimir, nomeEstabelecimento = 'DOCY ESQUINA', telefoneEstabelecimento = ''): string[] {
  const linhas: string[] = []

  // ESC/POS: init
  linhas.push('\x1B\x40') // initialize
  linhas.push('\x1B\x61\x01') // center align

  // Cabeçalho
  linhas.push('\x1B\x21\x20') // double height
  linhas.push(nomeEstabelecimento.toUpperCase() + '\n')
  linhas.push('\x1B\x21\x00') // normal
  if (telefoneEstabelecimento) linhas.push(telefoneEstabelecimento + '\n')
  linhas.push(separator() + '\n')

  // Pedido info
  linhas.push('\x1B\x61\x00') // left align
  const dataPedido = new Date(pedido.created_at).toLocaleString('pt-BR')
  linhas.push(`PEDIDO #${pedido.numero_seq}\n`)
  linhas.push(`${dataPedido}\n`)
  linhas.push(separator('-') + '\n')

  // Cliente
  linhas.push(`Cliente: ${pedido.clientes.nome}\n`)
  linhas.push(`Tel: ${pedido.clientes.telefone}\n`)
  linhas.push(`End: ${pedido.enderecos.logradouro}, ${pedido.enderecos.numero}\n`)
  linhas.push(`      ${pedido.enderecos.bairro}\n`)
  if (pedido.enderecos.referencia) linhas.push(`Ref: ${pedido.enderecos.referencia}\n`)
  linhas.push(separator('-') + '\n')

  // Itens
  linhas.push('ITEM                   QTD    TOTAL\n')
  linhas.push(separator('-') + '\n')
  for (const item of pedido.itens_pedido) {
    const nome = padEnd(item.nome_snapshot, 22)
    const qtd = padStart(String(item.quantidade), 3)
    const total = padStart(`R$${Number(item.subtotal).toFixed(2)}`, 9)
    linhas.push(`${nome}${qtd}${total}\n`)
  }
  linhas.push(separator('-') + '\n')

  // Totais
  const fmtValor = (v: number) => `R$ ${v.toFixed(2)}`
  linhas.push(`${padEnd('Subtotal:', COLS - 12)}${padStart(fmtValor(Number(pedido.subtotal)), 12)}\n`)
  linhas.push(`${padEnd('Taxa de entrega:', COLS - 12)}${padStart(fmtValor(Number(pedido.taxa_entrega)), 12)}\n`)
  linhas.push('\x1B\x21\x10') // emphasis
  linhas.push(`${padEnd('TOTAL:', COLS - 12)}${padStart(fmtValor(Number(pedido.total)), 12)}\n`)
  linhas.push('\x1B\x21\x00') // normal
  if (pedido.pagamento === 'dinheiro' && pedido.troco) {
    linhas.push(`${padEnd('Troco:', COLS - 12)}${padStart(fmtValor(Number(pedido.troco)), 12)}\n`)
  }
  linhas.push(separator('=') + '\n')

  // Pagamento
  const pagLabel: Record<string, string> = { pix: 'PIX', dinheiro: 'DINHEIRO', debito: 'CARTAO DEBITO', credito: 'CARTAO CREDITO' }
  linhas.push(center(`Pagamento: ${pagLabel[pedido.pagamento] ?? pedido.pagamento.toUpperCase()}`) + '\n')
  if (pedido.observacoes) linhas.push(`Obs: ${pedido.observacoes}\n`)
  linhas.push('\n')
  linhas.push(center('Obrigado pela preferencia!') + '\n')
  linhas.push('\n\n\n')
  linhas.push('\x1D\x56\x42\x00') // cut paper

  return linhas
}

type ResumoDiaParaImprimir = {
  totalPedidos: number
  faturamentoTotal: number
  ticketMedio: number
  taxaMediaEntrega: number
  porFormaPagamento: Record<string, { quantidade: number; total: number }>
}

export function buildComandaResumo(dados: ResumoDiaParaImprimir, nomeEstabelecimento = 'DOCY ESQUINA'): string[] {
  const linhas: string[] = []
  const pagLabel: Record<string, string> = { pix: 'Pix', dinheiro: 'Dinheiro', debito: 'Debito', credito: 'Credito' }
  const hoje = new Date().toLocaleDateString('pt-BR')

  linhas.push('\x1B\x40')
  linhas.push('\x1B\x61\x01')
  linhas.push('\x1B\x21\x20')
  linhas.push(nomeEstabelecimento.toUpperCase() + '\n')
  linhas.push('\x1B\x21\x00')
  linhas.push(center('RESUMO DO DIA') + '\n')
  linhas.push(center(hoje) + '\n')
  linhas.push(separator() + '\n')
  linhas.push('\x1B\x61\x00')
  linhas.push(`Total de Pedidos: ${dados.totalPedidos}\n`)
  linhas.push(`Faturamento:      R$ ${Number(dados.faturamentoTotal).toFixed(2)}\n`)
  linhas.push(`Ticket Medio:     R$ ${Number(dados.ticketMedio).toFixed(2)}\n`)
  linhas.push(`Taxa Media:       R$ ${Number(dados.taxaMediaEntrega).toFixed(2)}\n`)
  linhas.push(separator('-') + '\n')
  linhas.push('Por Forma de Pagamento:\n')
  for (const [forma, d] of Object.entries(dados.porFormaPagamento)) {
    if (d.quantidade > 0) {
      linhas.push(`  ${padEnd(pagLabel[forma] ?? forma, 12)} ${d.quantidade} pedidos  R$ ${d.total.toFixed(2)}\n`)
    }
  }
  linhas.push(separator('=') + '\n')
  linhas.push('\n\n\n')
  linhas.push('\x1D\x56\x42\x00')
  return linhas
}

export async function print(pedido: PedidoParaImprimir, printerName?: string, nomeEstabelecimento?: string, telefoneEstabelecimento?: string): Promise<void> {
  const qz = await loadQz()
  if (!qz.websocket.isActive()) await connect()
  const printer = printerName ?? await qz.printers.getDefault()
  const config = qz.configs.create(printer, { colorType: 'blackwhite', copies: 1 })
  const data = buildComanda(pedido, nomeEstabelecimento, telefoneEstabelecimento).map(line => ({
    type: 'raw', format: 'plain', data: line,
  }))
  await qz.print(config, data)
}

export async function printResumo(dados: ResumoDiaParaImprimir, printerName?: string, nomeEstabelecimento?: string): Promise<void> {
  const qz = await loadQz()
  if (!qz.websocket.isActive()) await connect()
  const printer = printerName ?? await qz.printers.getDefault()
  const config = qz.configs.create(printer, { colorType: 'blackwhite', copies: 1 })
  const data = buildComandaResumo(dados, nomeEstabelecimento).map(line => ({
    type: 'raw', format: 'plain', data: line,
  }))
  await qz.print(config, data)
}
