import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications'
import { verifyAccessToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    let userId: string | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      userId = String(payload.sub || '')
    } catch {
      try { userId = JSON.parse(sessionCookie.value)?.userId || null } catch {}
    }
    if (!userId) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    const count = await NotificationService.countUnread(userId)
    return NextResponse.json({ success: true, data: { count } })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    let userId: string | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      userId = String(payload.sub || '')
    } catch {
      try { userId = JSON.parse(sessionCookie.value)?.userId || null } catch {}
    }
    if (!userId) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    await NotificationService.markAllAsRead(userId)
    return NextResponse.json({ success: true })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
