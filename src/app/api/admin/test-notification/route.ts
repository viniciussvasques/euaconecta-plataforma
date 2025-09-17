import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { NotificationService } from '@/lib/notifications'
import { sendNotificationToUser } from '@/lib/notifications-sse'
import { prisma } from '@/lib/prisma'

function hasIsUrgent(n: unknown): n is { isUrgent?: boolean } {
  return typeof n === 'object' && n !== null && 'isUrgent' in (n as Record<string, unknown>)
}

export async function POST(request: NextRequest) {
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

    const { title, message, actionUrl, entityType, entityId } = await request.json()

    // Get a test user (first client user)
    const testUser = await prisma.user.findFirst({
      where: { role: 'CLIENT' }
    })

    if (!testUser) {
      return NextResponse.json({ success: false, error: 'Nenhum usuário cliente encontrado para teste' }, { status: 404 })
    }

    // Create notification
    const notification = await NotificationService.create({
      userId: testUser.id,
      type: 'IN_APP',
      title: title || 'Teste de Notificação',
      message: message || 'Esta é uma notificação de teste!',
      actionUrl: actionUrl || '/dashboard',
      entityType: entityType || 'Test',
      entityId: entityId || 'test-123',
      metadata: {
        testNotification: true,
        sentBy: userId,
        timestamp: new Date().toISOString()
      }
    })

    // Send real-time notification (SSE expects serializable NotificationData)
    sendNotificationToUser(testUser.id, {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      status: notification.status,
      actionUrl: notification.actionUrl || undefined,
      entityType: notification.entityType || undefined,
      entityId: notification.entityId || undefined,
      metadata: notification.metadata || undefined,
      isUrgent: hasIsUrgent(notification) ? notification.isUrgent ?? false : false,
      readAt: notification.readAt ? notification.readAt.toISOString() : undefined,
      createdAt: notification.createdAt.toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Notificação de teste enviada com sucesso',
      notification: {
        id: notification.id,
        userId: testUser.id,
        userEmail: testUser.email
      }
    })
  } catch (error) {
    console.error('Erro ao enviar notificação de teste:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
