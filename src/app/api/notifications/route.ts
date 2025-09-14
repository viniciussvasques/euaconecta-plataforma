import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    const session = JSON.parse(sessionCookie.value)
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
    const session = JSON.parse(sessionCookie.value)
    const body = await request.json()
    const notif = await NotificationService.create({ ...body, userId: body.userId || session.userId })
    return NextResponse.json({ success: true, data: notif })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}


