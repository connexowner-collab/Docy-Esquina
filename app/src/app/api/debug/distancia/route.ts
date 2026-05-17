/**
 * Endpoint de diagnóstico — NÃO expor publicamente em produção final.
 * Uso: GET /api/debug/distancia?cep=08540000&logradouro=Av+X&numero=1001&bairro=Centro
 * Retorna todos os passos intermediários do cálculo de distância.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const cep = searchParams.get('cep') ?? undefined
  const logradouro = searchParams.get('logradouro') ?? undefined
  const numero = searchParams.get('numero') ?? undefined
  const bairro = searchParams.get('bairro') ?? undefined

  const supabase = await createClient()
  const { data: config } = await supabase
    .from('configuracoes')
    .select('lat_origem, lng_origem, cidade_origem, uf_origem')
    .single()

  const latOrigem = config?.lat_origem ? Number(config.lat_origem) : null
  const lngOrigem = config?.lng_origem ? Number(config.lng_origem) : null

  const debug: Record<string, unknown> = {
    google_api_key_configurada: !!GOOGLE_KEY,
    origem: { lat: latOrigem, lng: lngOrigem, cidade: config?.cidade_origem, uf: config?.uf_origem },
    entrada: { cep, logradouro, numero, bairro },
  }

  // 1. ViaCEP
  let cidadeResolvida: string | null = null
  let ufResolvida: string | null = null
  if (cep) {
    const digits = cep.replace(/\D/g, '')
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: AbortSignal.timeout(4000) })
      const d = await r.json()
      if (d && !d.erro) {
        cidadeResolvida = d.localidade
        ufResolvida = d.uf
        debug.viacep = { ok: true, cidade: cidadeResolvida, uf: ufResolvida, bairro_cep: d.bairro, logradouro_cep: d.logradouro }
      } else {
        debug.viacep = { ok: false, erro: 'CEP inválido ou não encontrado' }
      }
    } catch (e) {
      debug.viacep = { ok: false, erro: String(e) }
    }
  } else {
    debug.viacep = { ok: false, erro: 'CEP não informado' }
  }

  // 2. Endereço que será geocodificado
  const partes = [
    logradouro && numero ? `${logradouro}, ${numero}` : logradouro,
    bairro,
    cidadeResolvida,
    ufResolvida,
    'Brasil',
  ].filter(Boolean)
  const enderecoString = partes.join(', ')
  debug.endereco_para_geocodificar = enderecoString

  // 3. Geocodificação Google
  if (GOOGLE_KEY) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(enderecoString)}&region=br&language=pt-BR&key=${GOOGLE_KEY}`
      const r = await fetch(url, { signal: AbortSignal.timeout(6000) })
      const d = await r.json()
      if (d.status === 'OK' && d.results?.[0]) {
        const loc = d.results[0].geometry.location
        debug.geocodificacao_google = { ok: true, lat: loc.lat, lng: loc.lng, endereco_retornado: d.results[0].formatted_address }
      } else {
        debug.geocodificacao_google = { ok: false, status: d.status, erro: d.error_message }
      }
    } catch (e) {
      debug.geocodificacao_google = { ok: false, erro: String(e) }
    }
  } else {
    debug.geocodificacao_google = { ok: false, erro: 'GOOGLE_MAPS_API_KEY não configurada' }
  }

  // 4. Geocodificação Nominatim estruturado
  if (logradouro && cidadeResolvida) {
    try {
      const p = new URLSearchParams({ format: 'json', limit: '1', countrycodes: 'br' })
      p.set('street', numero ? `${numero} ${logradouro}` : logradouro)
      p.set('city', cidadeResolvida)
      if (ufResolvida) p.set('state', ufResolvida)
      const url = `https://nominatim.openstreetmap.org/search?${p.toString()}`
      const r = await fetch(url, { headers: { 'User-Agent': 'DocyEsquina/1.0' }, signal: AbortSignal.timeout(6000) })
      const d = await r.json()
      if (d?.[0]) {
        debug.geocodificacao_nominatim_estruturado = { ok: true, lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon), display_name: d[0].display_name }
      } else {
        debug.geocodificacao_nominatim_estruturado = { ok: false, erro: 'Não encontrado' }
      }
    } catch (e) {
      debug.geocodificacao_nominatim_estruturado = { ok: false, erro: String(e) }
    }
  }

  // 5. Geocodificação Nominatim livre
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoString)}&format=json&limit=1&countrycodes=br`
    const r = await fetch(url, { headers: { 'User-Agent': 'DocyEsquina/1.0' }, signal: AbortSignal.timeout(6000) })
    const d = await r.json()
    if (d?.[0]) {
      debug.geocodificacao_nominatim_livre = { ok: true, lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon), display_name: d[0].display_name }
    } else {
      debug.geocodificacao_nominatim_livre = { ok: false, erro: 'Não encontrado' }
    }
  } catch (e) {
    debug.geocodificacao_nominatim_livre = { ok: false, erro: String(e) }
  }

  // 6. Distância via Google Distance Matrix (usando coords do google se disponível)
  const geoGoogle = (debug.geocodificacao_google as { ok: boolean; lat?: number; lng?: number })
  if (GOOGLE_KEY && geoGoogle?.ok && geoGoogle.lat && latOrigem && lngOrigem) {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latOrigem},${lngOrigem}&destinations=${geoGoogle.lat},${geoGoogle.lng}&mode=driving&language=pt-BR&key=${GOOGLE_KEY}`
      const r = await fetch(url, { signal: AbortSignal.timeout(6000) })
      const d = await r.json()
      const el = d.rows?.[0]?.elements?.[0]
      if (el?.status === 'OK') {
        debug.distancia_google = { ok: true, km: el.distance.value / 1000, duracao: el.duration.text }
      } else {
        debug.distancia_google = { ok: false, status: el?.status }
      }
    } catch (e) {
      debug.distancia_google = { ok: false, erro: String(e) }
    }
  }

  // 7. Distância via OSRM
  if (geoGoogle?.ok && geoGoogle.lat && latOrigem && lngOrigem) {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${lngOrigem},${latOrigem};${geoGoogle.lng},${geoGoogle.lat}?overview=false`
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
      const d = await r.json()
      if (d?.routes?.[0]?.distance) {
        debug.distancia_osrm = { ok: true, km: d.routes[0].distance / 1000 }
      } else {
        debug.distancia_osrm = { ok: false, code: d?.code }
      }
    } catch (e) {
      debug.distancia_osrm = { ok: false, erro: String(e) }
    }
  }

  return NextResponse.json(debug, { status: 200 })
}
