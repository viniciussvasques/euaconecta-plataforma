import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    const session = JSON.parse(sessionCookie.value)
    const updated = await NotificationService.markAsRead(id, session.userId)
    return NextResponse.json({ success: true, data: updated })
    } catch {
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}


