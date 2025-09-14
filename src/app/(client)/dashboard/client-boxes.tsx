'use client'

import { useState, useEffect } from 'react'

interface ClientBoxesProps {
  userId: string
}

interface Box {
  id: string
  consolidationType: string
  status: string
  currentWeightGrams: number
  packages: Array<{
    id: string
    description?: string
  }>
  consolidationFee: number
  storageFee: number
  openedAt: string
  closedAt?: string
}

export function ClientBoxes({ userId }: ClientBoxesProps) {
  const [boxes, setBoxes] = useState<Box[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await fetch(`/api/consolidation?userId=${userId}&limit=5`)
        const data = await response.json()
        
        if (response.ok && data.success) {
          setBoxes(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar caixas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBoxes()
  }, [userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'READY_TO_SHIP':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Aberta'
      case 'PENDING':
        return 'Pendente'
      case 'READY_TO_SHIP':
        return 'Pronta para Envio'
      case 'SHIPPED':
        return 'Enviada'
      default:
        return 'Desconhecido'
    }
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`
    }
    return `${grams} g`
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Minhas Caixas</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📋 Minhas Caixas</h3>
        <a
          href="/dashboard/boxes"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Ver todas
        </a>
      </div>

      {boxes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-gray-500">Nenhuma caixa ainda</p>
          <p className="text-sm text-gray-400 mt-1">
            Suas caixas aparecerão aqui quando forem criadas
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {boxes.map((box) => (
            <div key={box.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    Caixa #{box.id.slice(-6)}
                  </h4>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tipo:</span>{' '}
                      {box.consolidationType === 'SIMPLE' ? 'Simples' : 'Repack'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Pacotes:</span> {box.packages.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Peso:</span> {formatWeight(box.currentWeightGrams)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Taxa:</span> {formatCurrency(box.consolidationFee)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {box.status === 'OPEN' ? 'Aberta em:' : 'Fechada em:'}
                      </span>{' '}
                      {new Date(box.openedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(box.status)}`}>
                    {getStatusLabel(box.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
