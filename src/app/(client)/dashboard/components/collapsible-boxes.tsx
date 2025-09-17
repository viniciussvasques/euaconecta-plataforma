'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Box } from 'lucide-react'

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

export function CollapsibleBoxes({ userId }: ClientBoxesProps) {
  const [boxes, setBoxes] = useState<Box[]>([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await fetch(`/api/consolidation?userId=${userId}&limit=3`)
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Box className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Minhas Caixas</h3>
            <p className="text-sm text-gray-500">
              {boxes.length} caixa{boxes.length !== 1 ? 's' : ''} ativa{boxes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard/boxes"
            className="text-sm text-purple-600 hover:text-purple-500 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Ver todas
          </a>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6">
          {boxes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Box className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-gray-500 mb-2">Nenhuma caixa ainda</p>
              <p className="text-sm text-gray-400">
                Suas caixas aparecerão aqui quando forem criadas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {boxes.map((box) => (
                <div key={box.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        Caixa #{box.id.slice(-6)}
                      </h4>
                      <div className="mt-2 space-y-1">
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
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(box.status)}`}>
                        {getStatusLabel(box.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
