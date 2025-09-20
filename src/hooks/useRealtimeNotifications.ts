import { useEffect, useState, useCallback } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  status: string
  actionUrl?: string
  entityType?: string
  entityId?: string
  metadata?: string
  isUrgent: boolean
  createdAt: string
  readAt?: string
}

interface UseRealtimeNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<void>
  refreshNotifications: () => Promise<void>
}

export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar notificações iniciais
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setNotifications(data.data)
          setUnreadCount(data.data.filter((n: Notification) => !n.readAt).length)
        }
      }
    } catch (err) {
      console.error('Erro ao buscar notificações:', err)
      setError('Erro ao carregar notificações')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Marcar notificação como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, readAt: new Date().toISOString() }
              : notification
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
    }
  }, [])

  // Atualizar notificações
  const refreshNotifications = useCallback(async () => {
    setIsLoading(true)
    await fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    // Buscar notificações iniciais
    fetchNotifications()

    // Configurar SSE
    const eventSource = new EventSource('/api/notifications/stream')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'notification') {
          // Adicionar nova notificação
          setNotifications(prev => [data.data, ...prev])
          setUnreadCount(prev => prev + 1)
        } else if (data.type === 'ping') {
          // Manter conexão viva
          console.log('SSE ping recebido')
        }
      } catch (err) {
        console.error('Erro ao processar evento SSE:', err)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Erro na conexão SSE:', error)
      setError('Erro na conexão em tempo real')
    }

    eventSource.onopen = () => {
      console.log('Conexão SSE estabelecida')
      setError(null)
    }

    return () => {
      eventSource.close()
    }
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    refreshNotifications
  }
}










