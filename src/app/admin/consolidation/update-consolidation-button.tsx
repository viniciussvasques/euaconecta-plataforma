'use client'

import { useState } from 'react'
import { ConsolidationGroupData } from '@/lib/consolidation/consolidation'

interface UpdateConsolidationButtonProps {
  consolidation: ConsolidationGroupData
  type: 'pending' | 'in_progress'
  onStatusUpdate?: (id: string, status: string) => void
}

export function UpdateConsolidationButton({ consolidation, type, onStatusUpdate }: UpdateConsolidationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [trackingCode, setTrackingCode] = useState('')

  const handleStatusUpdate = async (newStatus: 'IN_PROGRESS' | 'SHIPPED') => {
    // Validar se é para concluir e se tem código de rastreio
    if (newStatus === 'SHIPPED' && !trackingCode.trim()) {
      alert('Por favor, informe o código de rastreio para concluir a consolidação.')
      return
    }

    console.log('Iniciando atualização de status:', { consolidationId: consolidation.id, newStatus, trackingCode })
    setUpdating(true)

    try {
      const response = await fetch(`/api/consolidation/${consolidation.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          trackingCode: newStatus === 'SHIPPED' ? trackingCode : undefined
        }),
      })

      console.log('Resposta da API:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro da API:', errorData)
        throw new Error(errorData.error || 'Erro ao atualizar status')
      }

      const result = await response.json()
      console.log('Resultado da API:', result)

      // Chamar callback para atualizar a lista
      if (onStatusUpdate) {
        console.log('🔄 UpdateConsolidationButton: Chamando callback onStatusUpdate com:', {
          consolidationId: consolidation.id,
          newStatus
        })
        onStatusUpdate(consolidation.id, newStatus)
      }

      // Mostrar mensagem de sucesso
      alert('Status atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert(`Erro ao atualizar status da consolidação: ${(error as Error).message}`)
    } finally {
      setUpdating(false)
      setIsOpen(false)
    }
  }

  const getButtonText = () => {
    const currentStatus = consolidation.status
    if (currentStatus === 'PENDING') return 'Iniciar'
    if (currentStatus === 'IN_PROGRESS') return 'Concluir'
    return 'Atualizar'
  }

  const getButtonColor = () => {
    const currentStatus = consolidation.status
    if (currentStatus === 'PENDING') return 'bg-blue-600 hover:bg-blue-700'
    if (currentStatus === 'IN_PROGRESS') return 'bg-green-600 hover:bg-green-700'
    return 'bg-gray-600 hover:bg-gray-700'
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-3 py-1 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
      >
        {getButtonText()}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                {consolidation.status === 'PENDING' ? 'Iniciar Consolidação' : 'Concluir Consolidação'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {consolidation.status === 'PENDING'
                    ? 'Deseja iniciar o processo de consolidação para esta solicitação?'
                    : 'Deseja marcar esta consolidação como concluída?'
                  }
                </p>
                <div className="mt-3 text-left text-sm text-gray-600">
                  <p><strong>ID:</strong> {consolidation.id.slice(-8)}</p>
                  <p><strong>Pacotes:</strong> {consolidation.packages.length}</p>
                  <p><strong>Tipo:</strong> {consolidation.consolidationType === 'SIMPLE' ? 'Simple' : 'Repack'}</p>
                </div>

                {consolidation.status === 'IN_PROGRESS' && (
                  <div className="mt-4">
                    <label htmlFor="trackingCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Rastreio *
                    </label>
                    <input
                      type="text"
                      id="trackingCode"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      placeholder="Digite o código de rastreio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      O código de rastreio será exibido para o cliente após a conclusão.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-3 px-4 py-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Determinar o próximo status baseado no status atual
                    const currentStatus = consolidation.status
                    let nextStatus: 'IN_PROGRESS' | 'SHIPPED'

                    if (currentStatus === 'PENDING') {
                      nextStatus = 'IN_PROGRESS'
                    } else if (currentStatus === 'IN_PROGRESS') {
                      nextStatus = 'SHIPPED'
                    } else {
                      nextStatus = 'IN_PROGRESS' // fallback
                    }

                    console.log('🔄 UpdateConsolidationButton: Determinando próximo status:', {
                      currentStatus,
                      nextStatus,
                      type
                    })

                    handleStatusUpdate(nextStatus)
                  }}
                  disabled={updating}
                  className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${consolidation.status === 'PENDING' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {updating ? 'Atualizando...' : getButtonText()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
