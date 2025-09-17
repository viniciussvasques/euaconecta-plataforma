import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const sessionCookie = request.cookies.get('session')?.value
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
    }

    let userId: string
    try {
      const payload = await verifyAccessToken(sessionCookie)
      userId = String(payload.sub)
    } catch {
      // Fallback to legacy JSON cookie
      try {
        const legacy = JSON.parse(sessionCookie)
        userId = legacy?.userId
      } catch {
        return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
    }

    const resolvedParams = await params
    const notificationId = resolvedParams.id

    // Mark notification as read
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: userId // Ensure user can only mark their own notifications
      },
      data: {
        status: 'READ',
        readAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
