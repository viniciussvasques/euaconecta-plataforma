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

interface HistoryItem {
  id: string
  type: 'package' | 'consolidation' | 'payment' | 'shipment'
  title: string
  description: string
  status?: string
  date: string
  amount?: number
}

export function ClientHistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
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

  const fetchHistory = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '100'
      })

      const response = await fetch(`/api/users/${user.id}/history?${params}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setHistory(data.data)
      } else {
        console.error('Erro ao carregar histórico:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user, filter, fetchHistory])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'package':
        return '📦'
      case 'consolidation':
        return '📋'
      case 'payment':
        return '💰'
      case 'shipment':
        return '🚢'
      default:
        return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'package':
        return 'bg-blue-100 text-blue-800'
      case 'consolidation':
        return 'bg-green-100 text-green-800'
      case 'payment':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipment':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'package':
        return 'Pacote'
      case 'consolidation':
        return 'Consolidação'
      case 'payment':
        return 'Pagamento'
      case 'shipment':
        return 'Envio'
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED':
      case 'succeeded':
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'READY_TO_SHIP':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'SHIPPED':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredHistory = history.filter(item => {
    if (filter !== 'all' && item.type !== filter) return false
    if (!searchTerm) return true
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Agrupar por data
  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = new Date(item.date).toLocaleDateString('pt-BR')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
    return groups
  }, {} as Record<string, HistoryItem[]>)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando histórico...</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Histórico</h1>
        <p className="mt-2 text-gray-600">
          Acompanhe toda a sua atividade na plataforma.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por Tipo */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Tipo
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="package">Pacotes</option>
              <option value="consolidation">Consolidações</option>
              <option value="payment">Pagamentos</option>
              <option value="shipment">Envios</option>
            </select>
          </div>

          {/* Busca */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar no histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Atividade ({filteredHistory.length} itens)
          </h2>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Você ainda não tem atividade registrada.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{date}</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                          {getTypeIcon(item.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {getTypeText(item.type)}
                          </span>
                          {item.status && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleTimeString('pt-BR')}
                          </p>
                          {item.amount && (
                            <p className="text-sm font-medium text-green-600">
                              ${item.amount.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
