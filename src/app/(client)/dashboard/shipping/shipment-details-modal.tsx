'use client'

import { useState, useEffect } from 'react'
import { X, Package, MapPin, Calendar, DollarSign, Truck, Eye, ExternalLink } from 'lucide-react'
import { defaultTheme } from '@/lib/design-system'

interface ShipmentDetails {
  id: string
  status: string
  outboundCarrier: string
  trackingOut?: string
  estimatedDeliveryDate?: string
  actualDeliveryDate?: string
  shippingCostCents?: number
  insuranceCostCents?: number
  customsDutyCents?: number
  totalWeightGrams: number
  toName: string
  toLine1: string
  toLine2?: string
  toCity: string
  toState: string
  toPostalCode: string
  toCountry: string
  toPhone?: string
  toEmail?: string
  paymentProvider?: string
  paymentStatus?: string
  paymentAmount?: string
  notes?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    suiteNumber?: number
  }
  packages: Array<{
    id: string
    description?: string
    status: string
    weightGrams: number
    purchasePrice?: string
    store?: string
    orderNumber?: string
    carrier?: string
    declaredValue?: string
    packageType?: string
    lengthCm?: number
    widthCm?: number
    heightCm?: number
    consolidationGroup?: {
      id: string
      consolidationType: string
      status: string
      trackingCode?: string
      customInstructions?: string
      extraProtection: string[]
      removeInvoice: boolean
      beforePhotos: string[]
      afterPhotos: string[]
      consolidationFee: string
      storageFee: string
      finalWeightGrams?: number
      openedAt?: string
      closedAt?: string
    }
  }>
  carrier?: {
    id: string
    name: string
    code: string
  }
}

interface ShipmentDetailsModalProps {
  shipmentId: string | null
  isOpen: boolean
  onClose: () => void
}

export function ShipmentDetailsModal({ shipmentId, isOpen, onClose }: ShipmentDetailsModalProps) {
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && shipmentId) {
      fetchShipmentDetails()
    }
  }, [isOpen, shipmentId])

  const fetchShipmentDetails = async () => {
    if (!shipmentId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/shipments/${shipmentId}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setShipment(data.data)
      } else {
        setError(data.error || 'Erro ao carregar detalhes do envio')
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do envio:', error)
      setError('Erro ao carregar detalhes do envio')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Rascunho'
      case 'IN_TRANSIT':
        return 'Em Trânsito'
      case 'DELIVERED':
        return 'Entregue'
      case 'CANCELLED':
        return 'Cancelado'
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

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`
    }
    return `${grams} g`
  }

  const handleTrackShipment = () => {
    if (shipment?.trackingOut) {
      const timestamp = Date.now()
      window.open(`https://www.abcpacket.com/rastreamento.php?tracker=${shipment.trackingOut}&v=${timestamp}`, '_blank')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Detalhes do Envio
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando detalhes...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="text-red-600 mb-2">❌</div>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchShipmentDetails}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {shipment && !loading && !error && (
              <div className="space-y-6">
                {/* Status e Informações Básicas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Envio</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Truck className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <span className="text-sm text-gray-600">Transportadora</span>
                            <p className="font-medium text-gray-900">{shipment.outboundCarrier}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 mr-3 flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(shipment.status).includes('blue') ? 'bg-blue-500' : getStatusColor(shipment.status).includes('green') ? 'bg-green-500' : getStatusColor(shipment.status).includes('red') ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Status</span>
                            <p className="font-medium text-gray-900">{getStatusText(shipment.status)}</p>
                          </div>
                        </div>
                        {shipment.trackingOut && (
                          <div className="flex items-center">
                            <Package className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <span className="text-sm text-gray-600">Código de Rastreamento</span>
                              <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                {shipment.trackingOut}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-500 mr-3" />
                          <div>
                            <span className="text-sm text-gray-600">Peso Total</span>
                            <p className="font-medium text-gray-900">{formatWeight(shipment.totalWeightGrams)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço de Entrega</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{shipment.toName}</p>
                            <p className="text-sm text-gray-600">{shipment.toLine1}</p>
                            {shipment.toLine2 && (
                              <p className="text-sm text-gray-600">{shipment.toLine2}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              {shipment.toCity}, {shipment.toState} {shipment.toPostalCode}
                            </p>
                            <p className="text-sm text-gray-600">{shipment.toCountry}</p>
                            {shipment.toPhone && (
                              <p className="text-sm text-gray-600">Tel: {shipment.toPhone}</p>
                            )}
                            {shipment.toEmail && (
                              <p className="text-sm text-gray-600">Email: {shipment.toEmail}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custos e Datas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Custos */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Custos</h3>
                    <div className="space-y-3">
                      {shipment.shippingCostCents && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-sm text-gray-600">Frete</span>
                          </div>
                          <span className="font-medium text-gray-900">{formatCurrency(shipment.shippingCostCents)}</span>
                        </div>
                      )}
                      {shipment.insuranceCostCents && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-blue-500 mr-3" />
                            <span className="text-sm text-gray-600">Seguro</span>
                          </div>
                          <span className="font-medium text-gray-900">{formatCurrency(shipment.insuranceCostCents)}</span>
                        </div>
                      )}
                      {shipment.customsDutyCents && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-yellow-500 mr-3" />
                            <span className="text-sm text-gray-600">Taxa</span>
                          </div>
                          <span className="font-medium text-gray-900">{formatCurrency(shipment.customsDutyCents)}</span>
                        </div>
                      )}
                      {shipment.paymentAmount && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-purple-500 mr-3" />
                            <span className="text-sm font-medium text-gray-900">Total Pago</span>
                          </div>
                          <span className="font-bold text-lg text-gray-900">${shipment.paymentAmount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Datas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <span className="text-sm text-gray-600">Criado em</span>
                          <p className="font-medium text-gray-900">{new Date(shipment.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      {shipment.estimatedDeliveryDate && (
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-orange-500 mr-3" />
                          <div>
                            <span className="text-sm text-gray-600">Previsão de Entrega</span>
                            <p className="font-medium text-gray-900">{new Date(shipment.estimatedDeliveryDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      )}
                      {shipment.actualDeliveryDate && (
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-green-500 mr-3" />
                          <div>
                            <span className="text-sm text-gray-600">Entregue em</span>
                            <p className="font-medium text-gray-900">{new Date(shipment.actualDeliveryDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pacotes */}
                {shipment.packages.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pacotes no Envio</h3>
                    <div className="space-y-4">
                      {shipment.packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-lg">
                              {pkg.description || 'Pacote sem descrição'}
                            </h4>
                            <div className="flex items-center">
                              <Package className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-600">
                                {formatWeight(pkg.weightGrams)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            {pkg.store && (
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">Loja:</span>
                                <span className="font-medium text-gray-900">{pkg.store}</span>
                              </div>
                            )}
                            {pkg.orderNumber && (
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">Pedido:</span>
                                <span className="font-medium text-gray-900">{pkg.orderNumber}</span>
                              </div>
                            )}
                            {pkg.purchasePrice && (
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">Preço:</span>
                                <span className="font-medium text-gray-900">${pkg.purchasePrice}</span>
                              </div>
                            )}
                            {pkg.declaredValue && (
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">Valor Declarado:</span>
                                <span className="font-medium text-gray-900">${pkg.declaredValue}</span>
                              </div>
                            )}
                          </div>

                          {pkg.consolidationGroup && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-900">Consolidação:</span>
                                <span className="ml-2 text-sm text-gray-600">{getConsolidationTypeText(pkg.consolidationGroup.consolidationType)}</span>
                              </div>
                              {pkg.consolidationGroup.customInstructions && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Instruções:</span> {pkg.consolidationGroup.customInstructions}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notas */}
                {shipment.notes && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Notas</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {shipment.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Última atualização:</span> {shipment ? new Date(shipment.updatedAt).toLocaleString('pt-BR') : ''}
            </div>
            <div className="flex space-x-3">
              {shipment?.trackingOut && (
                <button
                  onClick={handleTrackShipment}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Rastrear Envio
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
