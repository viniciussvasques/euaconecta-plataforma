'use client'

import { X, Package, Weight, DollarSign, Calendar, MapPin, Truck, Box } from 'lucide-react'

interface Package {
  id: string
  description?: string
  status: string
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
  createdAt: string
}

interface ConsolidationBox {
  id: string
  name?: string
  status: string
  packages: Package[]
  consolidationType: string
  consolidationFee: number
  customInstructions?: string
  createdAt: string
  updatedAt: string
  boxSize?: string
  finalWeightGrams?: number
  trackingCode?: string
  deliveryAddressId?: string
  deliveryAddress?: {
    id: string
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

interface BoxDetailsModalProps {
  box: ConsolidationBox
  onClose: () => void
}

export function BoxDetailsModal({ box, onClose }: BoxDetailsModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)}kg`
    }
    return `${grams}g`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'READY_TO_SHIP':
        return 'bg-purple-100 text-purple-800'
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Aberta'
      case 'PENDING':
        return 'Pendente'
      case 'IN_PROGRESS':
        return 'Em Progresso'
      case 'READY_TO_SHIP':
        return 'Pronta para Envio'
      case 'SHIPPED':
        return 'Enviada'
      case 'DELIVERED':
        return 'Entregue'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'SIMPLE':
        return 'Simples'
      case 'REPACK':
        return 'Repack'
      default:
        return type
    }
  }

  const totalWeight = box.packages.reduce((sum, pkg) => sum + pkg.weightGrams, 0)
  const totalValue = box.packages.reduce((sum, pkg) => sum + pkg.purchasePrice, 0)

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <Box className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes da Caixa
              </h2>
              <p className="text-sm text-gray-600">
                {box.name || `Caixa #${box.id.slice(-8)}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Status e Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(box.status)}`}>
                    {getStatusText(box.status)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Consolidação
                  </label>
                  <p className="text-sm text-gray-900">
                    {getTypeText(box.consolidationType)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamanho da Caixa
                  </label>
                  <p className="text-sm text-gray-900">
                    {box.boxSize || 'Não especificado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de Consolidação
                  </label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatPrice(box.consolidationFee)}
                    </p>
                  </div>
                </div>

                {box.trackingCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Rastreamento
                    </label>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900 font-mono">
                        {box.trackingCode}
                      </p>
                      <button
                        onClick={() => {
                          // Abrir link de rastreamento da ABC Packet
                          const timestamp = Date.now()
                          window.open(`https://www.abcpacket.com/rastreamento.php?tracker=${box.trackingCode}&v=${timestamp}`, '_blank')
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        Rastrear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso Total dos Pacotes
                  </label>
                  <div className="flex items-center">
                    <Weight className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatWeight(totalWeight)}
                    </p>
                  </div>
                </div>

                {box.finalWeightGrams && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso Final (com caixa)
                    </label>
                    <div className="flex items-center">
                      <Weight className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">
                        {formatWeight(box.finalWeightGrams)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Total dos Pacotes
                  </label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatPrice(totalValue)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Pacotes
                  </label>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {box.packages.length} pacote{box.packages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruções Personalizadas */}
            {box.customInstructions && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Instruções Personalizadas</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900">
                    {box.customInstructions}
                  </p>
                </div>
              </div>
            )}

            {/* Endereço de Entrega */}
            {box.deliveryAddress && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Endereço de Entrega</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {box.deliveryAddress.name}
                      </p>
                      <p className="text-sm text-gray-700">
                        {box.deliveryAddress.line1}
                      </p>
                      {box.deliveryAddress.line2 && (
                        <p className="text-sm text-gray-700">
                          {box.deliveryAddress.line2}
                        </p>
                      )}
                      <p className="text-sm text-gray-700">
                        {box.deliveryAddress.city}, {box.deliveryAddress.state} {box.deliveryAddress.postalCode}
                      </p>
                      <p className="text-sm text-gray-700">
                        {box.deliveryAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de Pacotes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Pacotes na Caixa ({box.packages.length})
              </h3>
              <div className="space-y-3">
                {box.packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {pkg.description || 'Pacote sem descrição'}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          {pkg.store && <span>Loja: {pkg.store}</span>}
                          <span className="flex items-center">
                            <Weight className="h-3 w-3 mr-1" />
                            {formatWeight(pkg.weightGrams)}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {formatPrice(pkg.purchasePrice)}
                          </span>
                        </div>
                        {pkg.orderNumber && (
                          <p className="text-xs text-gray-400 mt-1">
                            Pedido: {pkg.orderNumber}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          pkg.status === 'RECEIVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pkg.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações de Data */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Datas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Criada em
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatDate(box.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atualizada em
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatDate(box.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
