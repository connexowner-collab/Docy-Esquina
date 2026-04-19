'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import PrintConfig from '@/components/PrintConfig'

type TaxaBairro = { id: number; bairro: string; taxa: number }

type Configuracao = {
  nome_estabelecimento: string
  telefone: string
  endereco_origem: string
  cep_origem: string
  numero_origem: string
  bairro_origem: string
  cidade_origem: string
  uf_origem: string
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
    cep_origem: '',
    numero_origem: '',
    bairro_origem: '',
    cidade_origem: '',
    uf_origem: '',
    lat_origem: null,
    lng_origem: null,
    taxa_minima: 5,
    km_base: 2,
    valor_por_km: 2,
    km_maximo: 15,
  })
  const [buscandoCepOrigem, setBuscandoCepOrigem] = useState(false)
  const [cepOrigemErro, setCepOrigemErro] = useState('')
  const [geocodificando, setGeocodificando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sliderKm, setSliderKm] = useState(8)
  const [taxasBairro, setTaxasBairro] = useState<TaxaBairro[]>([])
  const [bairrosDisponiveis, setBairrosDisponiveis] = useState<string[]>([])
  const [novoBairro, setNovoBairro] = useState('')
  const [novaTaxa, setNovaTaxa] = useState('')
  const [salvandoTaxa, setSalvandoTaxa] = useState(false)

  const fetchTaxasBairro = useCallback(async () => {
    const res = await fetch('/api/taxas-bairro')
    const data = await res.json()
    setTaxasBairro(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    supabase.from('configuracoes').select('*').single().then(({ data }) => {
      if (data) setForm(data)
      setLoading(false)
    })
    fetchTaxasBairro()
    supabase.from('enderecos').select('bairro').then(({ data }) => {
      const uniq = [...new Set((data ?? []).map((e: { bairro: string }) => e.bairro).filter(Boolean))].sort() as string[]
      setBairrosDisponiveis(uniq)
    })
  }, [fetchTaxasBairro])

  async function handleAddTaxa() {
    if (!novoBairro || !novaTaxa) return
    setSalvandoTaxa(true)
    await fetch('/api/taxas-bairro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bairro: novoBairro, taxa: parseFloat(novaTaxa) }),
    })
    setNovoBairro('')
    setNovaTaxa('')
    await fetchTaxasBairro()
    setSalvandoTaxa(false)
  }

  async function handleDeleteTaxa(bairro: string) {
    await fetch(`/api/taxas-bairro?bairro=${encodeURIComponent(bairro)}`, { method: 'DELETE' })
    await fetchTaxasBairro()
  }

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function buscarCepOrigem(cep: string) {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setBuscandoCepOrigem(true)
    setCepOrigemErro('')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) { setCepOrigemErro('CEP não encontrado'); return }
      setForm(p => ({
        ...p,
        endereco_origem: data.logradouro ?? p.endereco_origem,
        bairro_origem: data.bairro ?? p.bairro_origem,
        cidade_origem: data.localidade ?? p.cidade_origem,
        uf_origem: data.uf ?? p.uf_origem,
      }))
    } catch {
      setCepOrigemErro('Erro ao buscar CEP')
    } finally {
      setBuscandoCepOrigem(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    // Monta string completa para geocodificar com cidade e UF
    const partes = [form.endereco_origem, form.numero_origem, form.bairro_origem, form.cidade_origem, form.uf_origem].filter(Boolean)
    const enderecoCompleto = partes.join(', ')

    let lat = form.lat_origem
    let lng = form.lng_origem

    if (enderecoCompleto) {
      setGeocodificando(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoCompleto)}&format=json&limit=1&countrycodes=br`
        const res = await fetch(url, { headers: { 'User-Agent': 'DoxyEsquina/1.0' } })
        const data = await res.json()
        if (data?.[0]) {
          lat = parseFloat(data[0].lat)
          lng = parseFloat(data[0].lon)
        }
      } catch {}
      setGeocodificando(false)
    }

    await supabase.from('configuracoes').update({ ...form, lat_origem: lat, lng_origem: lng }).eq('id', 1)
    setForm(p => ({ ...p, lat_origem: lat, lng_origem: lng }))
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const taxaSimulada = Number(form.taxa_minima) + Math.max(0, sliderKm - Number(form.km_base)) * Number(form.valor_por_km)
  const taxaBase = Number(form.taxa_minima)
  const taxaAdicional = Math.max(0, sliderKm - Number(form.km_base)) * Number(form.valor_por_km)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#C0392B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Configurações do Estabelecimento</h1>
          <p style={{ fontSize: 14, color: '#888', margin: '6px 0 0' }}>
            Gerencie as informações principais, parâmetros logísticos e simule custos de entrega em tempo real.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: saving ? '#e08080' : '#C0392B', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {saving ? 'Salvando...' : success ? '✓ Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Dados do Estabelecimento */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, background: '#FEF2F2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: '#1a1a1a', textTransform: 'uppercase' }}>Dados do Estabelecimento</span>
              </div>

              <Field label="Nome do Estabelecimento" name="nome_estabelecimento" value={form.nome_estabelecimento} onChange={handle} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <Field label="Telefone de Contato" name="telefone" value={form.telefone} onChange={handle} />
                <Field label="CNPJ (Opcional)" name="cnpj" value="" onChange={() => {}} placeholder="00.000.000/0000-00" disabled />
              </div>
              {/* Endereço de Origem estruturado */}
              <div style={{ marginTop: 16, background: '#F9F9F9', borderRadius: 10, padding: 16, border: '0.5px solid #e8e8ee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#555' }}>Endereço do Estabelecimento</span>
                  {form.lat_origem && form.lng_origem && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0F6E56', background: '#E8F5E9', padding: '2px 7px', borderRadius: 10 }}>
                      ✓ Geocodificado
                    </span>
                  )}
                  {geocodificando && (
                    <span style={{ fontSize: 10, color: '#888' }}>Geocodificando...</span>
                  )}
                </div>

                {/* CEP */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 4 }}>
                    CEP <span style={{ fontWeight: 400, color: '#bbb' }}>(preenche endereço automaticamente)</span>
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      className="input"
                      placeholder="00000-000"
                      value={form.cep_origem ?? ''}
                      maxLength={9}
                      style={{ width: 150 }}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 8)
                        const fmt = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw
                        setForm(p => ({ ...p, cep_origem: fmt }))
                        setCepOrigemErro('')
                        if (raw.length === 8) buscarCepOrigem(fmt)
                      }}
                    />
                    {buscandoCepOrigem && <span style={{ fontSize: 11, color: '#888' }}>Buscando...</span>}
                    {cepOrigemErro && <span style={{ fontSize: 11, color: '#A32D2D' }}>{cepOrigemErro}</span>}
                  </div>
                </div>

                {/* Logradouro + Número */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 4 }}>Logradouro *</label>
                    <input className="input" name="endereco_origem" placeholder="Rua, Av..." value={form.endereco_origem} onChange={handle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 4 }}>Número *</label>
                    <input className="input" name="numero_origem" placeholder="123" value={form.numero_origem ?? ''} onChange={handle} />
                  </div>
                </div>

                {/* Bairro + Cidade + UF */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 4 }}>Bairro</label>
                    <input className="input" name="bairro_origem" placeholder="Bairro" value={form.bairro_origem ?? ''} onChange={handle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 4 }}>Cidade *</label>
                    <input className="input" name="cidade_origem" placeholder="São Paulo" value={form.cidade_origem ?? ''} onChange={handle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#777', marginBottom: 4 }}>UF *</label>
                    <input className="input" name="uf_origem" placeholder="SP" maxLength={2} value={form.uf_origem ?? ''} onChange={handle} />
                  </div>
                </div>
              </div>
            </div>

            {/* Parâmetros de Taxa de Entrega */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: '#1a1a1a', textTransform: 'uppercase' }}>Parâmetros de Taxa de Entrega</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <MetricCard
                  label="Taxa Mínima"
                  name="taxa_minima"
                  value={form.taxa_minima}
                  onChange={handle}
                  prefix="R$"
                  desc="Valor base para qualquer entrega"
                />
                <MetricCard
                  label="KM Base Incluso"
                  name="km_base"
                  value={form.km_base}
                  onChange={handle}
                  suffix="KM"
                  desc="Distância coberta pela taxa mínima"
                />
                <MetricCard
                  label="Valor por KM Adicional"
                  name="valor_por_km"
                  value={form.valor_por_km}
                  onChange={handle}
                  prefix="R$"
                  desc="Cobrado após exceder o KM base"
                />
                <MetricCard
                  label="Raio Máximo"
                  name="km_maximo"
                  value={form.km_maximo}
                  onChange={handle}
                  suffix="KM"
                  desc="Limite de cobertura logística"
                  highlight
                />
              </div>

              {/* Taxas fixas por bairro */}
              <div style={{ marginTop: 24, borderTop: '1.5px solid #f0f0f0', paddingTop: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: '#888', textTransform: 'uppercase', marginBottom: 14 }}>
                  Taxas Fixas por Bairro
                </div>

                {/* Form adicionar */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Bairro</label>
                    <select
                      value={novoBairro}
                      onChange={e => setNovoBairro(e.target.value)}
                      style={{ width: '100%', border: '1.5px solid #e8e8ee', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1a1a1a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="">Selecionar bairro...</option>
                      {bairrosDisponiveis.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: 130 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Taxa Fixa (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaTaxa}
                      onChange={e => setNovaTaxa(e.target.value)}
                      placeholder="0,00"
                      style={{ width: '100%', border: '1.5px solid #e8e8ee', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1a1a1a', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTaxa}
                    disabled={!novoBairro || !novaTaxa || salvandoTaxa}
                    style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: !novoBairro || !novaTaxa ? 'not-allowed' : 'pointer', opacity: !novoBairro || !novaTaxa ? 0.5 : 1, whiteSpace: 'nowrap' }}
                  >
                    {salvandoTaxa ? '...' : '+ Adicionar'}
                  </button>
                </div>

                {/* Lista existente */}
                {taxasBairro.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', padding: '12px 0' }}>Nenhuma taxa fixa configurada</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {taxasBairro.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: 10, padding: '10px 14px' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{t.bairro}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#2563EB' }}>R$ {Number(t.taxa).toFixed(2).replace('.', ',')}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteTaxa(t.bairro)}
                            style={{ background: 'none', border: 'none', color: '#A32D2D', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 4px' }}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Print config */}
            <PrintConfig />
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Delivery Simulator */}
            <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Simulador de Entrega</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Validação em tempo real</div>
                </div>
                <div style={{ width: 32, height: 32, background: '#C0392B', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
              </div>

              {/* Slider */}
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#666', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>Distância de Teste</div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={sliderKm}
                  onChange={e => setSliderKm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#C0392B', marginBottom: 6 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#666' }}>1 km</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#C0392B' }}>{sliderKm} km</span>
                  <span style={{ fontSize: 11, color: '#666' }}>25 km</span>
                </div>
              </div>

              {/* Calculated cost */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#666', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Custo Calculado</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, marginRight: 4, verticalAlign: 'middle' }}>R$</span>
                  {taxaSimulada.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#999' }}>Taxa Base ({form.km_base}km)</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ccc' }}>R$ {taxaBase.toFixed(2)}</span>
                </div>
                {taxaAdicional > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#999' }}>Adicional ({sliderKm - Number(form.km_base)}km × R$ {form.valor_por_km})</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ccc' }}>R$ {taxaAdicional.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map visualization */}
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ height: 180, background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #0d7377 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* Radar circles */}
                {[60, 110, 160].map((r, i) => (
                  <div key={i} style={{ position: 'absolute', width: r * 2, height: r * 2, border: '1px solid rgba(13,115,119,0.4)', borderRadius: '50%' }} />
                ))}
                {/* Pin */}
                <div style={{ position: 'absolute', top: '45%', left: '52%' }}>
                  <svg width="20" height="24" viewBox="0 0 24 28" fill="none"><path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 19 9 19s9-12.25 9-19c0-4.97-4.03-9-9-9z" fill="#C0392B"/><circle cx="12" cy="9" r="4" fill="#fff"/></svg>
                </div>
                {/* Badges */}
                <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 6 }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>AO VIVO</span>
                  <span style={{ background: '#C0392B', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>{form.km_maximo}KM LIMITE</span>
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Visualização Geográfica</div>
                <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                  Sua zona de entrega cobre aproximadamente {Math.round(Math.PI * Math.pow(Number(form.km_maximo), 2))} km² de área urbana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, value, onChange, placeholder = '', type = 'text', icon, disabled }: {
  label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; type?: string; icon?: React.ReactNode; disabled?: boolean
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.6, marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{ width: '100%', border: '1.5px solid #e8e8ee', borderRadius: 10, padding: icon ? '10px 40px 10px 14px' : '10px 14px', fontSize: 14, color: '#1a1a1a', outline: 'none', background: disabled ? '#f9f9f9' : '#fff', boxSizing: 'border-box' }}
        />
        {icon && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{icon}</span>}
      </div>
    </div>
  )
}

function MetricCard({ label, name, value, onChange, prefix, suffix, desc, highlight }: {
  label: string; name: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  prefix?: string; suffix?: string; desc?: string; highlight?: boolean
}) {
  return (
    <div style={{ background: '#fafafa', border: highlight ? '1.5px solid #FEE2E2' : '1.5px solid #f0f0f0', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: highlight ? '#C0392B' : '#888', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {prefix && <span style={{ fontSize: 14, color: '#888', fontWeight: 600 }}>{prefix}</span>}
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          step="0.01"
          style={{ fontSize: 24, fontWeight: 900, color: highlight ? '#C0392B' : '#1a1a1a', border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: 0 }}
        />
        {suffix && <span style={{ fontSize: 14, color: '#888', fontWeight: 600 }}>{suffix}</span>}
      </div>
      {desc && <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{desc}</div>}
    </div>
  )
}
