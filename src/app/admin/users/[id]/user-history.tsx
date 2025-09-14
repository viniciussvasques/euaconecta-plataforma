'use client'

import { useState, useEffect } from 'react'

interface UserHistoryProps {
  userId: string
}

interface HistoryItem {
  id: string
  type: 'package' | 'consolidation' | 'payment' | 'shipment'
  title: string
  description: string
  status: string
  date: string
  amount?: number
}

export function UserHistory({ userId }: UserHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'package' | 'consolidation' | 'payment' | 'shipment'>('all')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/history`)
        const data = await response.json()
        if (data.success) {
          setHistory(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [userId])

  const filteredHistory = history.filter(item => 
    filter === 'all' || item.type === filter
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'package': return '📦'
      case 'consolidation': return '📋'
      case 'payment': return '💰'
      case 'shipment': return '🚚'
      default: return '📄'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'package': return 'Pacote'
      case 'consolidation': return 'Consolidação'
      case 'payment': return 'Pagamento'
      case 'shipment': return 'Envio'
      default: return 'Item'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received':
      case 'completed':
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Carregando histórico...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold text-gray-900">📋 Histórico Completo</h3>
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'package', label: 'Pacotes' },
            { key: 'consolidation', label: 'Consolidações' },
            { key: 'payment', label: 'Pagamentos' },
            { key: 'shipment', label: 'Envios' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as "package" | "shipment" | "payment" | "consolidation" | "all")}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === filterOption.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Histórico */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum item encontrado no histórico
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(item.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <span className="text-xs text-gray-500">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {item.amount && (
                        <span className="text-sm font-medium text-green-600">
                          ${item.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumo */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Resumo do Histórico</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total de itens:</span>
            <span className="ml-2 font-medium text-gray-900">{history.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Pacotes:</span>
            <span className="ml-2 font-medium text-gray-900">
              {history.filter(h => h.type === 'package').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Consolidações:</span>
            <span className="ml-2 font-medium text-gray-900">
              {history.filter(h => h.type === 'consolidation').length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Pagamentos:</span>
            <span className="ml-2 font-medium text-gray-900">
              {history.filter(h => h.type === 'payment').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
