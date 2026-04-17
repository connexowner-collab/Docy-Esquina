import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { request: toSign } = body

  if (!toSign) {
    return NextResponse.json({ error: 'Campo request é obrigatório' }, { status: 400 })
  }

  const privateKey = process.env.QZTRAY_PRIVATE_KEY
  if (!privateKey) {
    return NextResponse.json({ error: 'QZTRAY_PRIVATE_KEY não configurada' }, { status: 500 })
  }

  try {
    const sign = crypto.createSign('RSA-SHA512')
    sign.update(toSign)
    const signature = sign.sign(privateKey, 'base64')
    return NextResponse.json({ signature })
  } catch {
    return NextResponse.json({ error: 'Erro ao assinar requisição' }, { status: 500 })
  }
}
