'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShipmentDetailsModal } from './shipment-details-modal'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
}

interface Shipment {
  id: string
  outboundCarrier: string
  trackingOut?: string
  status: string
  estimatedDeliveryDate?: string
  actualDeliveryDate?: string
  shippingCostCents?: number
  insuranceCostCents?: number
  customsDutyCents?: number
  notes?: string
  createdAt: string
  packages: Array<{
    id: string
    description?: string
    status: string
    consolidationGroup?: {
      id: string
      consolidationType: string
      status: string
    }
  }>
}

export function ClientShippingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
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

  const fetchShipments = useCallback(async (forceRefresh = false) => {
    if (!user) return

    if (forceRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const params = new URLSearchParams({
        userId: user.id,
        ...(filter !== 'all' && { status: filter })
      })

      // Adicionar timestamp para evitar cache quando forçar atualização
      if (forceRefresh) {
        params.append('_t', Date.now().toString())
      }

      const response = await fetch(`/api/shipments?${params}`, {
        cache: forceRefresh ? 'no-store' : 'default',
        headers: {
          'Cache-Control': forceRefresh ? 'no-cache' : 'default'
        }
      })
      const data = await response.json()

      if (response.ok && data.success) {
        setShipments(data.data)
      } else {
        console.error('Erro ao carregar envios:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar envios:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user, filter])

  useEffect(() => {
    if (user) {
      fetchShipments()
    }
  }, [user, filter, fetchShipments])

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchShipments(true) // Força atualização
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [user, fetchShipments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'IN_TRANSIT':
        return 'Em Trânsito'
      case 'DELIVERED':
        return 'Entregue'
      case 'CANCELLED':
        return 'Cancelado'
      case 'DRAFT':
        return 'Rascunho'
      case 'PROCESSING':
        return 'Processando'
      default:
        return status
    }
  }

  const getConsolidationTypeText = (type: string) => {
    switch (type) {
      case 'STANDARD':
        return 'Padrão'
      case 'EXPRESS':
        return 'Expresso'
      case 'ECONOMY':
        return 'Econômico'
      case 'SIMPLE':
        return 'Simples'
      default:
        return type
    }
  }

  const handleViewDetails = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId)
    setIsDetailsModalOpen(true)
  }

  const handleTrackShipment = (trackingCode: string) => {
    const timestamp = Date.now()
    window.open(`https://www.abcpacket.com/rastreamento.php?tracker=${trackingCode}&v=${timestamp}`, '_blank')
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedShipmentId(null)
  }

  const filteredShipments = shipments

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando envios...</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Envios</h1>
            <p className="mt-2 text-gray-600">
              Acompanhe o status dos seus envios e rastreie suas entregas.
            </p>
          </div>
          <button
            onClick={() => fetchShipments(true)}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Atualizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </>
            )}
          </button>
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
              <option value="in_transit">Em Trânsito</option>
              <option value="delivered">Entregues</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Envios */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Envios ({filteredShipments.length})
          </h2>
        </div>

        {filteredShipments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum envio encontrado
            </h3>
            <p className="text-gray-500">
              {filter !== 'all'
                ? 'Tente ajustar os filtros.'
                : 'Você ainda não tem envios registrados.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Envio {shipment.outboundCarrier}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {getStatusText(shipment.status)}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Transportadora:</span> {shipment.outboundCarrier}
                      </div>
                      <div>
                        <span className="font-medium">Rastreamento:</span> {
                          shipment.trackingOut ? (
                            <button
                              onClick={() => {
                                const timestamp = Date.now()
                                window.open(`https://www.abcpacket.com/rastreamento.php?tracker=${shipment.trackingOut}&v=${timestamp}`, '_blank')
                              }}
                              className="text-blue-600 hover:text-blue-800 underline font-mono"
                            >
                              {shipment.trackingOut}
                            </button>
                          ) : (
                            'Não disponível'
                          )
                        }
                      </div>
                      <div>
                        <span className="font-medium">Tipo:</span> {
                          shipment.packages.length > 0 && shipment.packages[0].consolidationGroup
                            ? getConsolidationTypeText(shipment.packages[0].consolidationGroup.consolidationType)
                            : 'N/A'
                        }
                      </div>
                    </div>

                    {/* Custos */}
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Custos:</span>
                      {shipment.shippingCostCents && (
                        <span className="ml-2">Frete: ${(shipment.shippingCostCents / 100).toFixed(2)}</span>
                      )}
                      {shipment.insuranceCostCents && (
                        <span className="ml-2">Seguro: ${(shipment.insuranceCostCents / 100).toFixed(2)}</span>
                      )}
                      {shipment.customsDutyCents && (
                        <span className="ml-2">Taxa: ${(shipment.customsDutyCents / 100).toFixed(2)}</span>
                      )}
                    </div>

                    {/* Datas */}
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Criado em:</span> {new Date(shipment.createdAt).toLocaleDateString('pt-BR')}
                      {shipment.estimatedDeliveryDate && (
                        <span className="ml-4">
                          <span className="font-medium">Previsão:</span> {new Date(shipment.estimatedDeliveryDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {shipment.actualDeliveryDate && (
                        <span className="ml-4">
                          <span className="font-medium">Entregue em:</span> {new Date(shipment.actualDeliveryDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>

                    {/* Pacotes */}
                    {shipment.packages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Pacotes no Envio:</h4>
                        <div className="space-y-1">
                          {shipment.packages.map((pkg) => (
                            <div key={pkg.id} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                              {pkg.description || 'Pacote sem descrição'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notas */}
                    {shipment.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Notas:</h4>
                        <p className="text-sm text-gray-600">{shipment.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-shrink-0 space-y-2">
                    <button
                      onClick={() => handleViewDetails(shipment.id)}
                      className="block w-full text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Ver Detalhes
                    </button>

                    {shipment.trackingOut && (
                      <button
                        onClick={() => handleTrackShipment(shipment.trackingOut!)}
                        className="block w-full text-green-600 hover:text-green-500 text-sm font-medium"
                      >
                        Rastrear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <ShipmentDetailsModal
        shipmentId={selectedShipmentId}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </div>
  )
}
