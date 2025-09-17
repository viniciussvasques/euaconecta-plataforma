'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell, Check, ExternalLink } from 'lucide-react'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'
import Link from 'next/link'

interface NotificationItem {
  id: string
  title: string
  message: string
  status: string
  createdAt: string
  actionUrl?: string
  entityType?: string
  entityId?: string
  metadata?: string | Record<string, unknown>
  isUrgent?: boolean
  readAt?: string
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<NotificationItem[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount } = useRealtimeNotifications()

  const fetchUnread = async () => {
    try {
      const res = await fetch('/api/notifications/unread', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok && data.success) setCount(data.data.count)
    } catch {}
  }

  const fetchList = async () => {
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (res.ok && data.success) setItems(data.data)
    } catch {}
  }

  // Update count when realtime notifications change
  useEffect(() => {
    setCount(unreadCount)
  }, [unreadCount])

  // Initial fetch
  useEffect(() => {
    fetchUnread()
    fetchList()
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const toggleOpen = async () => {
    if (!open) await fetchList()
    setOpen(!open)
  }

  const markAll = async () => {
    await fetch('/api/notifications/unread', { method: 'POST' })
    setCount(0)
    await fetchList()
  }

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
    await fetchList()
  }

  const getNotificationUrl = (notification: { actionUrl?: string; entityType?: string; entityId?: string }) => {
    if (notification.actionUrl) {
      return notification.actionUrl
    }

    // Generate URL based on entity type
    if (notification.entityType && notification.entityId) {
      switch (notification.entityType) {
        case 'Package':
          return `/dashboard/packages/${notification.entityId}`
        case 'ConsolidationGroup':
          return `/dashboard/consolidations/${notification.entityId}`
        case 'Payment':
          return `/dashboard/payments`
        default:
          return '/dashboard'
      }
    }

    return '/dashboard'
  }

  const displayItems = notifications.length > 0 ? notifications : items

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggleOpen} className="p-2 text-gray-500 hover:text-gray-700 relative">
        <Bell className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] bg-red-600 text-white rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Notificações</span>
            </div>
            <button onClick={markAll} className="text-xs text-blue-600 hover:underline">
              Marcar todas como lidas
            </button>
          </div>
          <div className="max-h-96 overflow-auto">
            {displayItems.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">Nenhuma notificação</div>
            ) : (
              displayItems.map((n) => (
                <div key={n.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{n.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{n.message}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {n.actionUrl || n.entityType ? (
                        <Link href={getNotificationUrl(n)}>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </Link>
                      ) : null}
                      {n.status === 'PENDING' && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
