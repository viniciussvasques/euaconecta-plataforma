'use client'

import { useEffect, useState, useRef } from 'react'

interface NotificationItem {
  id: string
  title: string
  message: string
  status: 'PENDING' | 'SENT' | 'FAILED' | 'READ'
  createdAt: string
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<NotificationItem[]>([])
  const ref = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    fetchUnread()
    const t = setInterval(fetchUnread, 15000)
    return () => clearInterval(t)
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

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggleOpen} className="p-2 text-gray-500 hover:text-gray-700 relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5A2.5 2.5 0 012 17V7a2 2 0 012-2h16a2 2 0 012 2v10a2.5 2.5 0 01-2.5 2.5h-15z" />
        </svg>
        {count > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] bg-red-600 text-white rounded-full flex items-center justify-center">{count}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="text-sm font-medium text-gray-700">Notificações</span>
            <button onClick={markAll} className="text-xs text-blue-600 hover:underline">Marcar todas como lidas</button>
          </div>
          <div className="max-h-96 overflow-auto">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">Nenhuma notificação</div>
            ) : (
              items.map((n) => (
                <div key={n.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{n.message}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('pt-BR')}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}


