import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json()
    if (!to) return NextResponse.json({ success: false, error: 'Destinatário obrigatório' }, { status: 400 })

    await sendMail(to, 'Teste de SMTP - EuaConecta', '<p>Teste de envio de email via SMTP configurado.</p>')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha no envio'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}




























