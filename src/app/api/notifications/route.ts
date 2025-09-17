import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications'
import { verifyAccessToken } from '@/lib/jwt'
type MinimalSession = { userId: string; role: string }

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || '') , role: String((payload as unknown as { role?: string }).role || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session?.userId) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    const notifications = await NotificationService.listForUser(session.userId)
    return NextResponse.json({ success: true, data: notifications })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || ''), role: String((payload as unknown as { role?: string }).role || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session?.userId) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    const body = await request.json()
    const notif = await NotificationService.create({ ...body, userId: body.userId || session.userId })
    return NextResponse.json({ success: true, data: notif })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
