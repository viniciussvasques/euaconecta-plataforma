import { prisma } from './database/prisma'

export interface NotificationData {
  userId: string
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP'
  title: string
  message: string
  data?: Record<string, unknown>
  sendEmail?: boolean
}

export class NotificationService {
  // Criar notificação
  async createNotification(data: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          status: 'PENDING'
        }
      })

      // Enviar email se solicitado
      if (data.sendEmail) {
        const user = await prisma.user.findUnique({
          where: { id: data.userId }
        })

        if (user) {
          // TODO: Implementar sendStatusNotification
          console.log('Enviando notificação para:', user.email, data.title)
        }
      }

      return notification
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
      throw error
    }
  }

  // Buscar notificações do usuário
  async getUserNotifications(userId: string, limit: number = 10) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  // Marcar notificação como lida
  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'READ' }
    })
  }

  // Marcar todas as notificações como lidas
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        status: 'PENDING'
      },
      data: { status: 'READ' }
    })
  }

  // Contar notificações não lidas
  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        status: 'PENDING'
      }
    })
  }

  // Notificações específicas do sistema
  async notifyPaymentSuccess(userId: string, amount: number, method: string, consolidationId: string) {
    return await this.createNotification({
      userId,
      type: 'EMAIL',
      title: 'Pagamento Confirmado',
      message: `Seu pagamento de US$ ${amount.toFixed(2)} via ${method} foi processado com sucesso.`,
      data: { amount, method, consolidationId },
      sendEmail: true
    })
  }

  async notifyPaymentFailed(userId: string, amount: number, method: string, consolidationId: string) {
    return await this.createNotification({
      userId,
      type: 'EMAIL',
      title: 'Pagamento Falhou',
      message: `Seu pagamento de US$ ${amount.toFixed(2)} via ${method} não foi processado. Tente novamente.`,
      data: { amount, method, consolidationId },
      sendEmail: true
    })
  }

  async notifyPackageReceived(userId: string, packageId: string, trackingNumber: string) {
    return await this.createNotification({
      userId,
      type: 'EMAIL',
      title: 'Pacote Recebido',
      message: `Seu pacote com tracking ${trackingNumber} foi recebido em nosso depósito.`,
      data: { packageId, trackingNumber },
      sendEmail: true
    })
  }

  async notifyPackageShipped(userId: string, consolidationId: string, trackingNumber: string) {
    return await this.createNotification({
      userId,
      type: 'EMAIL',
      title: 'Pacote Enviado',
      message: `Sua consolidação foi enviada! Código de rastreamento: ${trackingNumber}`,
      data: { consolidationId, trackingNumber },
      sendEmail: true
    })
  }

  async notifyConsolidationReady(userId: string, consolidationId: string) {
    return await this.createNotification({
      userId,
      type: 'EMAIL',
      title: 'Consolidação Pronta',
      message: 'Sua consolidação está pronta para envio. Faça o pagamento para prosseguir.',
      data: { consolidationId },
      sendEmail: true
    })
  }
}

export const notificationService = new NotificationService()
