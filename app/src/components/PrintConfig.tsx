'use client'

import { useState } from 'react'

export default function PrintConfig() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [printers, setPrinters] = useState<string[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleConnect() {
    setStatus('connecting')
    setErrorMsg('')
    try {
      const { connect, getPrinters } = await import('@/lib/print/printService')
      await connect()
      const ps = await getPrinters()
      setPrinters(ps)
      setSelectedPrinter(ps[0] ?? '')
      setStatus('connected')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao conectar ao QZ Tray')
    }
  }

  async function handleDisconnect() {
    try {
      const { disconnect } = await import('@/lib/print/printService')
      await disconnect()
    } catch {}
    setStatus('idle')
    setPrinters([])
  }

  async function handleTesteImpressao() {
    if (!selectedPrinter) { alert('Selecione uma impressora'); return }
    try {
      const qz = (await import('qz-tray')) as { default?: unknown } & Record<string, unknown>
      const qzInstance = (qz.default ?? qz) as Record<string, unknown>
      const configs = qzInstance.configs as (printer: string) => unknown
      const config = configs(selectedPrinter)
      const print = qzInstance.print as (config: unknown, data: unknown[]) => Promise<void>
      await print(config, [{ type: 'raw', format: 'plain', data: 'TESTE DE IMPRESSAO\n\nDocy Esquina\n\n\n\n' }])
      alert('Teste enviado para a impressora!')
    } catch (err) {
      alert('Erro ao imprimir: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Impress&#xe3;o T&#xe9;rmica (QZ Tray)
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        O QZ Tray permite impress&#xe3;o direta em impressoras t&#xe9;rmicas ESC/POS via websocket local.
        Certifique-se de que o QZ Tray est&#xe1; rodando no computador.
      </p>

      {status === 'idle' && (
        <button
          onClick={handleConnect}
          className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Conectar ao QZ Tray
        </button>
      )}

      {status === 'connecting' && (
        <p className="text-sm text-gray-500">Conectando...</p>
      )}

      {status === 'error' && (
        <div>
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
            {errorMsg || 'Erro ao conectar. Verifique se o QZ Tray est\u00e1 aberto.'}
          </p>
          <button onClick={handleConnect} className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Tentar novamente
          </button>
        </div>
      )}

      {status === 'connected' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-green-700 font-medium">Conectado ao QZ Tray</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Impressora padr&#xe3;o</label>
            <select
              value={selectedPrinter}
              onChange={e => setSelectedPrinter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full max-w-xs"
            >
              {printers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleTesteImpressao}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition border border-gray-300"
            >
              Teste de Impress&#xe3;o
            </button>
            <button
              onClick={handleDisconnect}
              className="text-sm text-gray-500 hover:text-red-600 transition"
            >
              Desconectar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
