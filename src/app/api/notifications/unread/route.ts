import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    const session = JSON.parse(sessionCookie.value)
    const count = await NotificationService.countUnread(session.userId)
    return NextResponse.json({ success: true, data: { count } })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    const session = JSON.parse(sessionCookie.value)
    await NotificationService.markAllAsRead(session.userId)
    return NextResponse.json({ success: true })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}


