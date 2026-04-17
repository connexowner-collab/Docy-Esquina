import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { lat_destino, lng_destino } = await request.json()

  if (!lat_destino || !lng_destino) {
    return NextResponse.json({ error: 'Coordenadas inválidas' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: config } = await supabase.from('configuracoes').select('*').single()

  if (!config?.lat_origem || !config?.lng_origem) {
    return NextResponse.json({ error: 'Endereço de origem não configurado' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${config.lat_origem},${config.lng_origem}&destinations=${lat_destino},${lng_destino}&key=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  const element = data.rows?.[0]?.elements?.[0]
  if (element?.status !== 'OK') {
    return NextResponse.json({ error: 'Endereço não encontrado' }, { status: 400 })
  }

  const distanciaKm = element.distance.value / 1000
  const foraCoberto = distanciaKm > config.km_maximo
  const taxa = Number(config.taxa_minima) + Math.max(0, distanciaKm - Number(config.km_base)) * Number(config.valor_por_km)

  return NextResponse.json({
    distancia_km: Math.round(distanciaKm * 100) / 100,
    taxa: Math.round(taxa * 100) / 100,
    fora_cobertura: foraCoberto,
  })
}
