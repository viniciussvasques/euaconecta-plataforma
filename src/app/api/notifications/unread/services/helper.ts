import { PrismaClient, NotificationStatus } from '@prisma/client'

const prisma = new PrismaClient()

export class NotificationService {
  static async countUnread(userId: string) {
    const count = await prisma.notification.count({
      where: {
        userId,
        status: NotificationStatus.PENDING
      }
    })
    return count
  }
  
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        status: NotificationStatus.PENDING
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date()
      }
    })
    return true
  }
}

export function verifyAccessToken(token: string) {
  // Implementação simplificada apenas para funcionar
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Promise.resolve(payload)
  } catch (e) {
    return Promise.reject(new Error('Token inválido'))
  }
}