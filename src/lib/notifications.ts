/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/database/prisma'
import { NotificationType, NotificationStatus, UserRole } from '@prisma/client'

export type CreateNotificationInput = {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  isUrgent?: boolean
  expiresAt?: Date | null
  actionUrl?: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
}

export class NotificationService {
  static async create(input: CreateNotificationInput) {
    // Verificar se já existe uma notificação similar recente (últimos 5 minutos)
    const recentNotification = await prisma.notification.findFirst({
      where: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // 5 minutos atrás
        }
      }
    })

    if (recentNotification) {
      console.log('Notificação duplicada evitada:', input.title)
      return recentNotification
    }

    return prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        status: 'PENDING',
        isUrgent: Boolean(input.isUrgent),
        expiresAt: input.expiresAt ?? null,
        actionUrl: input.actionUrl,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    })
  }

  static async listForUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }

  static async markAsRead(id: string, _userId: string) {
    return prisma.notification.update({
      where: { id },
      data: { status: 'READ', readAt: new Date() },
    })
  }

  static async countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, status: { in: [NotificationStatus.PENDING, NotificationStatus.SENT] } } })
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, status: { in: [NotificationStatus.PENDING, NotificationStatus.SENT] } },
      data: { status: NotificationStatus.READ, readAt: new Date() },
    })
  }

  static async notifyAdmins(input: Omit<CreateNotificationInput, 'userId'>) {
    const admins = await prisma.user.findMany({ where: { role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR] } }, select: { id: true } })
    if (admins.length === 0) return []
    return prisma.$transaction(
      admins.map((a) =>
        prisma.notification.create({
          data: {
            userId: a.id,
            type: input.type,
            title: input.title,
            message: input.message,
            status: 'PENDING',
            isUrgent: Boolean(input.isUrgent),
            expiresAt: input.expiresAt ?? null,
            actionUrl: input.actionUrl,
            entityType: input.entityType,
            entityId: input.entityId,
            metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          },
        })
      )
    )
  }
}

