import { NextResponse } from 'next/server'
import { getTransporter } from '@/lib/email/email'

export async function GET() {
  try {
    const transporter = getTransporter()
    const ok = await transporter.verify()
    return NextResponse.json({ success: true, data: { verified: ok } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao verificar SMTP'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}












































