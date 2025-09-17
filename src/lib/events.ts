/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NotificationService } from './notifications'
import { NotificationType } from '@prisma/client'

// Tipos de eventos do sistema
export enum SystemEvent {
  // Pacotes
  PACKAGE_CREATED = 'PACKAGE_CREATED',
  PACKAGE_RECEIVED = 'PACKAGE_RECEIVED',
  PACKAGE_WEIGHED = 'PACKAGE_WEIGHED',
  PACKAGE_READY_TO_SHIP = 'PACKAGE_READY_TO_SHIP',
  PACKAGE_SHIPPED = 'PACKAGE_SHIPPED',

  // Consolidação
  CONSOLIDATION_CREATED = 'CONSOLIDATION_CREATED',
  CONSOLIDATION_OPENED = 'CONSOLIDATION_OPENED',
  CONSOLIDATION_IN_PROGRESS = 'CONSOLIDATION_IN_PROGRESS',
  CONSOLIDATION_READY_TO_SHIP = 'CONSOLIDATION_READY_TO_SHIP',
  CONSOLIDATION_SHIPPED = 'CONSOLIDATION_SHIPPED',
  CONSOLIDATION_CANCELLED = 'CONSOLIDATION_CANCELLED',

  // Pagamentos
  PAYMENT_CREATED = 'PAYMENT_CREATED',
  PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',

  // Armazenamento
  STORAGE_WARNING = 'STORAGE_WARNING',
  STORAGE_OVERDUE = 'STORAGE_OVERDUE',

  // Sistema
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',

  // Suporte
  SUPPORT_TICKET_CREATED = 'SUPPORT_TICKET_CREATED',
  SUPPORT_TICKET_UPDATED = 'SUPPORT_TICKET_UPDATED',
  SUPPORT_TICKET_RESOLVED = 'SUPPORT_TICKET_RESOLVED'
}

// Interface para dados do evento
export interface EventData {
  userId?: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
  isUrgent?: boolean
  actionUrl?: string
}

// Configuração de eventos e suas notificações
const EVENT_CONFIGS = {
  [SystemEvent.PACKAGE_CREATED]: {
    title: 'Pacote registrado',
    message: (data: EventData) => `Seu pacote "${data.metadata?.description || 'Novo pacote'}" foi registrado e aguarda confirmação.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/packages/${data.entityId}` : '/dashboard/packages'
  },

  [SystemEvent.PACKAGE_RECEIVED]: {
    title: 'Pacote confirmado',
    message: (data: EventData) => `Seu pacote foi confirmado e pesado (${data.metadata?.weight || 'N/A'}g).`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/packages/${data.entityId}` : '/dashboard/packages'
  },

  [SystemEvent.PACKAGE_WEIGHED]: {
    title: 'Pacote pesado',
    message: (data: EventData) => `Seu pacote foi pesado: ${data.metadata?.weight || 'N/A'}g.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/packages/${data.entityId}` : '/dashboard/packages'
  },

  [SystemEvent.PACKAGE_READY_TO_SHIP]: {
    title: 'Pacote pronto para envio',
    message: (data: EventData) => `Seu pacote está pronto para envio. Você pode consolidá-lo ou enviá-lo individualmente.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/packages/${data.entityId}` : '/dashboard/packages'
  },

  [SystemEvent.PACKAGE_SHIPPED]: {
    title: 'Pacote enviado',
    message: (data: EventData) => `Seu pacote foi enviado! Código de rastreamento: ${data.metadata?.trackingCode || 'N/A'}`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/packages/${data.entityId}` : '/dashboard/packages'
  },

  [SystemEvent.CONSOLIDATION_CREATED]: {
    title: 'Caixa de consolidação criada',
    message: (data: EventData) => `Uma nova caixa de consolidação foi criada para seus pacotes.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/consolidations/${data.entityId}` : '/dashboard/consolidations'
  },

  [SystemEvent.CONSOLIDATION_OPENED]: {
    title: 'Caixa aberta',
    message: (data: EventData) => `Sua caixa de consolidação foi aberta e está recebendo pacotes.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/consolidations/${data.entityId}` : '/dashboard/consolidations'
  },

  [SystemEvent.CONSOLIDATION_IN_PROGRESS]: {
    title: 'Consolidação em andamento',
    message: (data: EventData) => `Sua caixa está sendo consolidada. Em breve estará pronta para envio.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/consolidations/${data.entityId}` : '/dashboard/consolidations'
  },

  [SystemEvent.CONSOLIDATION_READY_TO_SHIP]: {
    title: 'Caixa pronta para envio',
    message: (data: EventData) => `Sua caixa consolidada está pronta para envio!`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/consolidations/${data.entityId}` : '/dashboard/consolidations'
  },

  [SystemEvent.CONSOLIDATION_SHIPPED]: {
    title: 'Caixa enviada',
    message: (data: EventData) => `Sua caixa consolidada foi enviada! Código de rastreamento: ${data.metadata?.trackingCode || 'N/A'}`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/consolidations/${data.entityId}` : '/dashboard/consolidations'
  },

  [SystemEvent.CONSOLIDATION_CANCELLED]: {
    title: 'Consolidação cancelada',
    message: (data: EventData) => `Sua caixa de consolidação foi cancelada.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/consolidations/${data.entityId}` : '/dashboard/consolidations'
  },

  [SystemEvent.PAYMENT_CREATED]: {
    title: 'Pagamento criado',
    message: (data: EventData) => `Um pagamento foi criado no valor de $${(Number(data.metadata?.amount) || 0) / 100}.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => '/dashboard/payments'
  },

  [SystemEvent.PAYMENT_SUCCEEDED]: {
    title: 'Pagamento confirmado',
    message: (data: EventData) => `Seu pagamento de $${(Number(data.metadata?.amount) || 0) / 100} foi confirmado com sucesso!`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => '/dashboard/payments'
  },

  [SystemEvent.PAYMENT_FAILED]: {
    title: 'Pagamento falhou',
    message: (data: EventData) => `Seu pagamento de $${(Number(data.metadata?.amount) || 0) / 100} falhou. Verifique os dados e tente novamente.`,
    type: NotificationType.IN_APP,
    isUrgent: true,
    actionUrl: (data: EventData) => '/dashboard/payments'
  },

  [SystemEvent.PAYMENT_REFUNDED]: {
    title: 'Pagamento reembolsado',
    message: (data: EventData) => `Seu pagamento de $${(Number(data.metadata?.amount) || 0) / 100} foi reembolsado.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => '/dashboard/payments'
  },

  [SystemEvent.STORAGE_WARNING]: {
    title: 'Aviso de armazenamento',
    message: (data: EventData) => `Seus pacotes estão há ${data.metadata?.days || 0} dias no armazenamento. Considere consolidá-los em breve.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => '/dashboard/packages'
  },

  [SystemEvent.STORAGE_OVERDUE]: {
    title: 'Armazenamento vencido',
    message: (data: EventData) => `Seus pacotes estão há ${data.metadata?.days || 0} dias no armazenamento. Taxas de armazenamento serão aplicadas.`,
    type: NotificationType.IN_APP,
    isUrgent: true,
    actionUrl: (data: EventData) => '/dashboard/packages'
  },

  [SystemEvent.SUPPORT_TICKET_CREATED]: {
    title: 'Ticket de suporte criado',
    message: (data: EventData) => `Seu ticket de suporte "${data.metadata?.title || 'Novo ticket'}" foi criado.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/support/${data.entityId}` : '/dashboard/support'
  },

  [SystemEvent.SUPPORT_TICKET_UPDATED]: {
    title: 'Ticket atualizado',
    message: (data: EventData) => `Seu ticket de suporte foi atualizado: ${data.metadata?.status || 'Status alterado'}.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/support/${data.entityId}` : '/dashboard/support'
  },

  [SystemEvent.SUPPORT_TICKET_RESOLVED]: {
    title: 'Ticket resolvido',
    message: (data: EventData) => `Seu ticket de suporte foi resolvido.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => data.entityId ? `/dashboard/support/${data.entityId}` : '/dashboard/support'
  },
  SYSTEM_MAINTENANCE: {
    title: 'Manutenção do Sistema',
    message: (data: EventData) => `O sistema estará em manutenção.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => '/dashboard'
  },
  SYSTEM_UPDATE: {
    title: 'Atualização do Sistema',
    message: (data: EventData) => `O sistema foi atualizado.`,
    type: NotificationType.IN_APP,
    actionUrl: (data: EventData) => '/dashboard'
  }
}

// Classe principal do sistema de eventos
export class EventService {
  // Emitir um evento do sistema
  static async emit(event: SystemEvent, data: EventData) {
    try {
      const config = EVENT_CONFIGS[event]
      if (!config) {
        console.warn(`Configuração não encontrada para o evento: ${event}`)
        return
      }

      // Se não há userId, não podemos criar notificação
      if (!data.userId) {
        console.warn(`Evento ${event} emitido sem userId`)
        return
      }

      // Criar notificação
      const notification = await NotificationService.create({
        userId: data.userId,
        type: config.type,
        title: config.title,
        message: typeof config.message === 'function' ? config.message(data) : config.message,
        actionUrl: typeof config.actionUrl === 'function' ? config.actionUrl(data) : config.actionUrl,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata ? data.metadata : undefined,
        isUrgent: (config as any).isUrgent || data.isUrgent || false
      })

      // Enviar via SSE se disponível
      try {
        const { sendNotificationToUser } = await import('@/lib/notifications-sse')
        sendNotificationToUser(data.userId, {
          ...notification,
          actionUrl: notification.actionUrl || undefined,
          entityType: notification.entityType || undefined,
          entityId: notification.entityId || undefined,
          metadata: notification.metadata || undefined,
          readAt: notification.readAt ? notification.readAt.toISOString() : undefined,
          createdAt: notification.createdAt.toISOString()
        })
      } catch (error) {
        console.warn('Erro ao enviar notificação via SSE:', error)
      }

      return notification
    } catch (error) {
      console.error(`Erro ao emitir evento ${event}:`, error)
      throw error
    }
  }

  // Emitir evento para múltiplos usuários
  static async emitToUsers(event: SystemEvent, userIds: string[], data: Omit<EventData, 'userId'>) {
    const promises = userIds.map(userId =>
      this.emit(event, { ...data, userId })
    )

    return Promise.allSettled(promises)
  }

  // Emitir evento para administradores
  static async emitToAdmins(event: SystemEvent, data: Omit<EventData, 'userId'>) {
    try {
      const { prisma } = await import('@/lib/prisma')
      const admins = await prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'SUPER_ADMIN', 'OPERATOR']
          }
        },
        select: { id: true }
      })

      const userIds = admins.map(admin => admin.id)
      return this.emitToUsers(event, userIds, data)
    } catch (error) {
      console.error('Erro ao emitir evento para admins:', error)
      throw error
    }
  }
}
