'use client'

import { X, Package, Weight, DollarSign, Calendar, Store, Truck } from 'lucide-react'
import Image from 'next/image'

interface Package {
  id: string
  description?: string
  status: string
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
  createdAt: string
  updatedAt: string
  carrier?: string
  trackingIn?: string
  trackingPhoto?: string
  deliveryConfirmation?: boolean
  declaredValue?: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  packageCondition?: string
  notes?: string
  confirmedAt?: string
  confirmedBy?: string
  confirmedWeightGrams?: number
  confirmationPhoto?: string
}

interface PackageDetailsModalProps {
  package: Package
  onClose: () => void
}

export function PackageDetailsModal({ package: pkg, onClose }: PackageDetailsModalProps) {
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
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'RECEIVED':
        return 'bg-green-100 text-green-800'
      case 'READY_TO_SHIP':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente de Confirmação'
      case 'RECEIVED':
        return 'Recebido e Confirmado'
      case 'READY_TO_SHIP':
        return 'Pronto para Envio'
      case 'SHIPPED':
        return 'Enviado'
      default:
        return status
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes do Pacote
              </h2>
              <p className="text-sm text-gray-600">
                {pkg.description || 'Pacote sem descrição'}
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
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                {getStatusText(pkg.status)}
              </span>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <p className="text-sm text-gray-900">
                    {pkg.description || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loja
                  </label>
                  <div className="flex items-center">
                    <Store className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {pkg.store || 'Não informado'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do Pedido
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {pkg.orderNumber || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso
                  </label>
                  <div className="flex items-center">
                    <Weight className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatWeight(pkg.weightGrams)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço de Compra
                  </label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatPrice(pkg.purchasePrice)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Declarado
                  </label>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {pkg.declaredValue ? formatPrice(pkg.declaredValue) : 'Não informado'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transportadora
                  </label>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {pkg.carrier || 'Não informado'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {pkg.trackingIn || 'Não informado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dimensões */}
            {(pkg.lengthCm || pkg.widthCm || pkg.heightCm) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Dimensões</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comprimento
                    </label>
                    <p className="text-sm text-gray-900">
                      {pkg.lengthCm ? `${pkg.lengthCm}cm` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Largura
                    </label>
                    <p className="text-sm text-gray-900">
                      {pkg.widthCm ? `${pkg.widthCm}cm` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Altura
                    </label>
                    <p className="text-sm text-gray-900">
                      {pkg.heightCm ? `${pkg.heightCm}cm` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Condição e Observações */}
            {(pkg.packageCondition || pkg.notes) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Observações</h3>
                <div className="space-y-3">
                  {pkg.packageCondition && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condição do Pacote
                      </label>
                      <p className="text-sm text-gray-900">
                        {pkg.packageCondition}
                      </p>
                    </div>
                  )}
                  {pkg.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <p className="text-sm text-gray-900">
                        {pkg.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Foto do Tracking */}
            {pkg.trackingPhoto && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Foto do Tracking</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <Image
                    src={pkg.trackingPhoto}
                    alt="Foto do tracking"
                    width={400}
                    height={300}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Informações de Data */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Datas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Criado em
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatDate(pkg.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atualizado em
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {formatDate(pkg.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmação de Entrega */}
            {pkg.deliveryConfirmation !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmação de Entrega
                </label>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    pkg.deliveryConfirmation ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <p className="text-sm text-gray-900">
                    {pkg.deliveryConfirmation ? 'Confirmada' : 'Não confirmada'}
                  </p>
                </div>
              </div>
            )}

            {/* Confirmação de Recebimento */}
            {pkg.status === 'RECEIVED' && (pkg.confirmedAt || pkg.confirmedWeightGrams) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Confirmação de Recebimento</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  {pkg.confirmedWeightGrams && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso Confirmado
                      </label>
                      <div className="flex items-center">
                        <Weight className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">
                          {formatWeight(pkg.confirmedWeightGrams)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {pkg.confirmedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmado em
                      </label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">
                          {formatDate(pkg.confirmedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {pkg.confirmationPhoto && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Foto de Confirmação
                      </label>
                      <div className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
                        <Image
                          src={pkg.confirmationPhoto}
                          alt="Foto de confirmação"
                          width={400}
                          height={300}
                          className="max-w-full h-auto rounded-lg shadow-sm"
                          onError={(e) => {
                            console.error('Erro ao carregar imagem:', pkg.confirmationPhoto)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
