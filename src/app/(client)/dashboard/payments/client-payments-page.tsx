'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
}

interface Payment {
  id: string
  amountCents: number
  currency: string
  provider: string
  intentId: string
  receiptUrl?: string
  status: string
  createdAt: string
  updatedAt: string
}

export function ClientPaymentsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (response.ok && data.success) {
          setUser(data.data)
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        router.push('/auth/login')
      }
    }

    fetchUser()
  }, [router])

  const fetchPayments = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        userId: user.id,
        ...(filter !== 'all' && { status: filter })
      })

      const response = await fetch(`/api/payments?${params}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setPayments(data.data)
      } else {
        console.error('Erro ao carregar pagamentos:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
    } finally {
      setLoading(false)
    }
  }, [user, filter])

  useEffect(() => {
    if (user) {
      fetchPayments()
    }
  }, [user, filter, fetchPayments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'succeeded':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'succeeded':
        return 'Aprovado'
      case 'failed':
        return 'Falhou'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getProviderText = (provider: string) => {
    switch (provider) {
      case 'stripe':
        return 'Stripe'
      case 'paypal':
        return 'PayPal'
      case 'pix':
        return 'PIX'
      case 'boleto':
        return 'Boleto'
      default:
        return provider
    }
  }

  const filteredPayments = payments

  // Calcular estatísticas
  const totalPaid = payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + p.amountCents, 0)

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amountCents, 0)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pagamentos...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
        <p className="mt-2 text-gray-600">
          Acompanhe seus pagamentos e histórico financeiro.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pago</p>
              <p className="text-2xl font-bold text-green-600">
                ${(totalPaid / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendente</p>
              <p className="text-2xl font-bold text-yellow-600">
                ${(pendingAmount / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Pagamentos</p>
              <p className="text-2xl font-bold text-blue-600">
                {payments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="succeeded">Aprovados</option>
              <option value="failed">Falharam</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Pagamentos */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Histórico de Pagamentos ({filteredPayments.length})
          </h2>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pagamento encontrado
            </h3>
            <p className="text-gray-500">
              {filter !== 'all' 
                ? 'Tente ajustar os filtros.'
                : 'Você ainda não tem pagamentos registrados.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Pagamento #{payment.id.slice(-8)}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Valor:</span> ${(payment.amountCents / 100).toFixed(2)} {payment.currency}
                      </div>
                      <div>
                        <span className="font-medium">Provedor:</span> {getProviderText((payment as { providerCode?: string }).providerCode || payment.provider)}
                      </div>
                      <div>
                        <span className="font-medium">ID da Transação:</span> {payment.intentId || 'N/A'}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Criado em:</span> {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                      {(payment as { updatedAt?: string }).updatedAt && (payment as { updatedAt?: string }).updatedAt !== payment.createdAt && (
                        <span className="ml-4">
                          <span className="font-medium">Atualizado em:</span> {new Date(payment.updatedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>

                    {/* Receipt URL */}
                    {payment.receiptUrl && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Comprovante:</h4>
                        <a 
                          href={payment.receiptUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 text-sm"
                        >
                          Ver Comprovante
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-shrink-0 space-y-2">
                    <button
                      onClick={() => {
                        // TODO: Implementar visualização detalhada
                        alert('Funcionalidade de detalhes em desenvolvimento')
                      }}
                      className="block w-full text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Ver Detalhes
                    </button>
                    
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => {
                          // TODO: Implementar retry de pagamento
                          alert('Funcionalidade de retry em desenvolvimento')
                        }}
                        className="block w-full text-yellow-600 hover:text-yellow-500 text-sm font-medium"
                      >
                        Tentar Novamente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
