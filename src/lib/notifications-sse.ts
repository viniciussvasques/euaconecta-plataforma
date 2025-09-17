import { NextRequest } from 'next/server'

export interface NotificationData {
  id: string
  userId: string
  type: string
  title: string
  message: string
  status: string
  actionUrl?: string
  entityType?: string
  entityId?: string
  metadata?: string | Record<string, unknown>
  isUrgent?: boolean
  readAt?: string
  createdAt: string
}

const connections = new Set<ReadableStreamDefaultController>()

export function handleSSEConnection(request: NextRequest): Response {
  const stream = new ReadableStream({
    start(controller) {
      connections.add(controller)

      const data = JSON.stringify({
        type: 'connection',
        message: 'Conexão estabelecida',
        timestamp: new Date().toISOString()
      })
      controller.enqueue(`data: ${data}\n\n`)

      const pingInterval = setInterval(() => {
        try {
          const pingData = JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })
          controller.enqueue(`data: ${pingData}\n\n`)
        } catch {
          clearInterval(pingInterval)
          connections.delete(controller)
        }
      }, 30000)

      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval)
        connections.delete(controller)
        try {
          controller.close()
        } catch {
          // noop
        }
      })
    },
    cancel(controller) {
      connections.delete(controller)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}

export function sendNotificationToAll(notification: NotificationData) {
  const data = JSON.stringify({
    type: 'notification',
    data: notification,
    timestamp: new Date().toISOString()
  })

  connections.forEach(controller => {
    try {
      controller.enqueue(`data: ${data}\n\n`)
    } catch {
      connections.delete(controller)
    }
  })
}

export function sendNotificationToUser(userId: string, notification: NotificationData) {
  const data = JSON.stringify({
    type: 'notification',
    userId,
    data: notification,
    timestamp: new Date().toISOString()
  })

  connections.forEach(controller => {
    try {
      controller.enqueue(`data: ${data}\n\n`)
    } catch {
      connections.delete(controller)
    }
  })
}
