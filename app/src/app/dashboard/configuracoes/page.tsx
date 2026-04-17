'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import PrintConfig from '@/components/PrintConfig'

type Configuracao = {
  nome_estabelecimento: string
  telefone: string
  endereco_origem: string
  lat_origem: number | null
  lng_origem: number | null
  taxa_minima: number
  km_base: number
  valor_por_km: number
  km_maximo: number
}

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [form, setForm] = useState<Configuracao>({
    nome_estabelecimento: '',
    telefone: '',
    endereco_origem: '',
    lat_origem: null,
    lng_origem: null,
    taxa_minima: 5,
    km_base: 2,
    valor_por_km: 2,
    km_maximo: 15,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.from('configuracoes').select('*').single().then(({ data }) => {
      if (data) setForm(data)
      setLoading(false)
    })
  }, [])

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    await supabase.from('configuracoes').update(form).eq('id', 1)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const taxaSimulada = form.taxa_minima + Math.max(0, 5 - form.km_base) * form.valor_por_km

  if (loading) return <p className="text-gray-500">Carregando...</p>

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações do Estabelecimento</h2>

      <form onSubmit={handleSave} className="space-y-6 bg-white rounded-2xl shadow p-6">

        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Dados do Estabelecimento</h3>
          <div className="space-y-3">
            <Field label="Nome" name="nome_estabelecimento" value={form.nome_estabelecimento} onChange={handle} />
            <Field label="Telefone" name="telefone" value={form.telefone} onChange={handle} />
            <Field label="Endereço de origem (para cálculo de frete)" name="endereco_origem" value={form.endereco_origem} onChange={handle} placeholder="Rua, número, bairro, cidade" />
          </div>
        </section>

        <hr />

        <section>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Parâmetros de Taxa de Entrega</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Taxa mínima (R$)" name="taxa_minima" value={String(form.taxa_minima)} onChange={handle} type="number" />
            <Field label="KM base incluso" name="km_base" value={String(form.km_base)} onChange={handle} type="number" />
            <Field label="Valor por KM adicional (R$)" name="valor_por_km" value={String(form.valor_por_km)} onChange={handle} type="number" />
            <Field label="KM máximo coberto" name="km_maximo" value={String(form.km_maximo)} onChange={handle} type="number" />
          </div>

          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
            Simulação para 5 km: <strong>R$ {taxaSimulada.toFixed(2)}</strong>
            <span className="text-blue-500 ml-2">— fórmula: taxa_min + max(0, km − km_base) × valor/km</span>
          </div>
        </section>

        {success && (
          <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm">
            Configurações salvas com sucesso!
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>

      <PrintConfig />
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder = '' }: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={type === 'number' ? '0.01' : undefined}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  )
}
