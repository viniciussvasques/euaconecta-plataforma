'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestNotificationsPage() {
  const [sending, setSending] = useState(false)

  const sendTestNotification = async () => {
    setSending(true)
    try {
      const response = await fetch('/api/admin/test-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Teste de Notificação',
          message: 'Esta é uma notificação de teste enviada em tempo real!',
          actionUrl: '/dashboard',
          entityType: 'Test',
          entityId: 'test-123'
        })
      })

      if (response.ok) {
        alert('Notificação de teste enviada!')
      } else {
        alert('Erro ao enviar notificação de teste')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao enviar notificação de teste')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Teste de Notificações em Tempo Real
        </h1>
        <p className="text-gray-600 mt-1">
          Use esta página para testar o sistema de notificações em tempo real
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Enviar Notificação de Teste</h2>
        <p className="text-gray-600 mb-4">
          Clique no botão abaixo para enviar uma notificação de teste que será recebida em tempo real.
        </p>

        <Button
          onClick={sendTestNotification}
          disabled={sending}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {sending ? 'Enviando...' : 'Enviar Notificação de Teste'}
        </Button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Como Testar:</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Abra o dashboard do cliente em outra aba</li>
            <li>Clique no botão acima</li>
            <li>A notificação deve aparecer instantaneamente no cliente</li>
            <li>Clique na notificação para testar o link</li>
          </ol>
        </div>
      </div>
    </div>
  )
}











