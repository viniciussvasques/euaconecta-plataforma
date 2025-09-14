'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Package, Check, Info, Truck, MapPin } from 'lucide-react'
import { PaymentModal } from './payment-modal'

interface Package {
  id: string
  description?: string
  status: string
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
}

interface ConsolidationBox {
  id: string
  name?: string
  status: string
  packages: Package[]
  currentWeightGrams: number
  consolidationFee: number
  storageFee: number
  boxSize?: string
}

interface Carrier {
  id: string
  name: string
  code: string
  hasApi: boolean
  isActive: boolean
}

interface FreightCalculation {
  weightGrams: number
  weightKg: string
  serviceType: string
  serviceInfo: {
    name: string
    description: string
    deliveryTime: string
  }
  pricing: {
    basePrice: number
    markupAmount: number
    subtotal: number
    floridaTax: number
    finalPrice: number
    breakdown: {
      abcFreight: number
      markupPercentage: number
      markupAmount: number
      processingFee: number
      subtotal: number
      floridaTaxRate: number
      floridaTax: number
    }
  }
}

interface Address {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface ConsolidateModalProps {
  box: ConsolidationBox
  onClose: () => void
  onSuccess: () => void
}

export function ConsolidateModal({ box, onClose, onSuccess }: ConsolidateModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    doubleBox: false,
    bubbleWrap: false,
    removeInvoice: false,
    customInstructions: '',
    serviceType: 'STANDARD' as 'STANDARD' | 'EXPRESS'
  })
  const [freightCalculation, setFreightCalculation] = useState<FreightCalculation | null>(null)
  const [calculatingFreight, setCalculatingFreight] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [consolidationId, setConsolidationId] = useState<string>('')

  // Tabela de pesos das caixas baseada no tamanho
  const BOX_WEIGHTS = {
    'XS': 50,    // 50g
    'S': 100,    // 100g
    'M': 150,    // 150g
    'L': 200,    // 200g
    'XL': 300,   // 300g
    'XXL': 500,  // 500g
    'XXXL': 800  // 800g
  }

  // Calcular peso total (caixa + pacotes + itens adicionais)
  const calculateTotalWeight = useCallback(() => {
    const boxWeight = BOX_WEIGHTS[box.boxSize as keyof typeof BOX_WEIGHTS] || 200
    const packagesWeight = box.packages.reduce((total, pkg) => total + (pkg.weightGrams || 0), 0)
    const additionalWeight = formData.doubleBox ? 100 : 0 // 100g para caixa dupla
    const bubbleWrapWeight = formData.bubbleWrap ? 50 : 0 // 50g para plástico bolha
    
    return boxWeight + packagesWeight + additionalWeight + bubbleWrapWeight
  }, [box.boxSize, box.packages, formData.doubleBox, formData.bubbleWrap])

  // Buscar endereços do usuário
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/addresses')
        const data = await response.json()
        
        if (data.success) {
          setAddresses(data.data)
          // Selecionar endereço padrão automaticamente
          const defaultAddress = data.data.find((addr: Address) => addr.isDefault)
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id)
          }
        }
      } catch {
        console.error('Erro ao buscar endereços:', error)
      }
    }

    const fetchCarriers = async () => {
      try {
        const response = await fetch('/api/carriers/active')
        const data = await response.json()
        
        if (data.success) {
          setCarriers(data.data)
          // Selecionar ABC automaticamente se disponível
          const abcCarrier = data.data.find((carrier: Carrier) => carrier.code === 'ABC')
          if (abcCarrier) {
            setSelectedCarrierId(abcCarrier.id)
          }
        }
      } catch {
        console.error('Erro ao buscar transportadoras:', error)
      }
    }

    fetchAddresses()
    fetchCarriers()
  }, [])

  // Calcular frete quando mudanças ocorrem
  useEffect(() => {
    const calculateFreight = async () => {
      if (!box.packages.length) return

      setCalculatingFreight(true)
      try {
        const totalWeight = calculateTotalWeight()
        
        const response = await fetch('/api/freight/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            weightGrams: totalWeight,
            serviceType: formData.serviceType,
            boxSize: box.boxSize,
            carrierId: selectedCarrierId
          })
        })

        const data = await response.json()
        
        if (data.success) {
          setFreightCalculation(data.data)
        } else {
          console.error('Erro ao calcular frete:', data.error)
        }
      } catch {
        console.error('Erro ao calcular frete:', error)
      } finally {
        setCalculatingFreight(false)
      }
    }

    calculateFreight()
  }, [formData.serviceType, formData.doubleBox, formData.bubbleWrap, box.packages, box.boxSize, selectedCarrierId, calculateTotalWeight])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!freightCalculation) {
      setError('Aguardando cálculo de frete...')
      return
    }

    if (!selectedAddressId) {
      setError('Selecione um endereço de entrega')
      return
    }

    if (!selectedCarrierId) {
      setError('Selecione uma transportadora')
      return
    }
    
    setError('')
    
    // Abrir modal de pagamento em vez de consolidar diretamente
    setConsolidationId(box.id)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/consolidation/${box.id}/consolidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extraProtection: formData.doubleBox ? ['DOUBLE_BOX'] : formData.bubbleWrap ? ['BUBBLE_WRAP'] : [],
          removeInvoice: formData.removeInvoice,
          customInstructions: formData.customInstructions,
          doubleBox: formData.doubleBox,
          bubbleWrap: formData.bubbleWrap,
          additionalItems: [],
          serviceType: formData.serviceType,
          freightCalculation: freightCalculation,
          deliveryAddressId: selectedAddressId,
          totalWeight: calculateTotalWeight()
        })
      })

      const data = await response.json()
      
      if (data.success) {
        onSuccess()
        onClose()
      } else {
        setError(data.error || 'Erro ao consolidar caixa')
      }
    } catch (error) {
      setError('Erro ao consolidar caixa')
    } finally {
      setLoading(false)
    }
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`
    }
    return `${grams}g`
  }

  const formatPrice = (price: number | string) => {
    const numPrice = Number(price) || 0
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  const calculateAdditionalCosts = () => {
    let total = 0
    if (formData.doubleBox) total += 5.00
    if (formData.bubbleWrap) total += 3.00
    return total
  }

  const calculateTotalCost = () => {
    const additionalCosts = calculateAdditionalCosts()
    const freightCost = freightCalculation?.pricing?.finalPrice || 0
    return Number(box.consolidationFee) + Number(box.storageFee) + additionalCosts + freightCost
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Consolidar Caixa - {box.name || 'Caixa sem nome'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {box.packages.length} pacotes • {formatWeight(box.currentWeightGrams)}
            </p>
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Informações da Caixa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Info className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-900">Informações da Caixa</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Taxa de Consolidação:</span>
                <span className="font-medium text-blue-900 ml-2">{formatPrice(box.consolidationFee)}</span>
              </div>
              <div>
                <span className="text-blue-700">Taxa de Armazenamento:</span>
                <span className="font-medium text-blue-900 ml-2">{formatPrice(box.storageFee)}</span>
              </div>
              <div>
                <span className="text-blue-700">Peso Total:</span>
                <span className="font-medium text-blue-900 ml-2">{formatWeight(calculateTotalWeight())}</span>
              </div>
              <div>
                <span className="text-blue-700">Tamanho da Caixa:</span>
                <span className="font-medium text-blue-900 ml-2">{box.boxSize || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Lista de Pacotes */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Pacotes na Caixa</h3>
            <div className="space-y-2">
              {box.packages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {pkg.description || 'Pacote sem descrição'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {pkg.store && <span>Loja: {pkg.store}</span>}
                      <span>{formatWeight(pkg.weightGrams)}</span>
                      <span>{formatPrice(pkg.purchasePrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário de Consolidação */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção de Endereço de Entrega */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço de Entrega
              </h3>
              
              {addresses.length === 0 ? (
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <p className="text-yellow-800 text-sm">
                    Você precisa cadastrar pelo menos um endereço de entrega nas suas configurações.
                  </p>
                  <a 
                    href="/dashboard/settings" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                  >
                    Ir para Configurações →
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{address.name}</h4>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Padrão
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <p>{address.line1}</p>
                            {address.line2 && <p>{address.line2}</p>}
                            <p>{address.city} - {address.state}</p>
                            <p>CEP: {address.postalCode.replace(/(\d{5})(\d{3})/, '$1-$2')}</p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <input
                            type="radio"
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seleção de Transportadora */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Transportadora
              </h3>
              
              {carriers.length === 0 ? (
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <p className="text-yellow-800 text-sm">
                    Nenhuma transportadora ativa encontrada. Entre em contato com o administrador.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {carriers.map((carrier) => (
                    <div
                      key={carrier.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCarrierId === carrier.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCarrierId(carrier.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{carrier.name}</h4>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {carrier.code}
                            </span>
                            {carrier.hasApi && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                API
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <p>Transportadora {carrier.hasApi ? 'com integração de API' : 'com tabela de preços local'}</p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <input
                            type="radio"
                            checked={selectedCarrierId === carrier.id}
                            onChange={() => setSelectedCarrierId(carrier.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seleção de Serviço de Frete */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Serviço de Frete
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.serviceType === 'STANDARD'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, serviceType: 'STANDARD' }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Packet Standard</h4>
                      <p className="text-sm text-gray-600">15-20 dias úteis</p>
                    </div>
                    <div className="text-right">
                      {calculatingFreight ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : freightCalculation && formData.serviceType === 'STANDARD' ? (
                        <span className="font-medium text-green-600">
                          {formatPrice(freightCalculation.pricing?.finalPrice || 0)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Calculando...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Express */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.serviceType === 'EXPRESS'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, serviceType: 'EXPRESS' }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Packet Express</h4>
                      <p className="text-sm text-gray-600">7-10 dias úteis</p>
                    </div>
                    <div className="text-right">
                      {calculatingFreight ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : freightCalculation && formData.serviceType === 'EXPRESS' ? (
                        <span className="font-medium text-green-600">
                          {formatPrice(freightCalculation.pricing?.finalPrice || 0)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Calculando...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhes do Frete */}
              {freightCalculation && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span className="font-medium">{freightCalculation.weightKg}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frete {freightCalculation.serviceInfo?.name || 'ABC'}:</span>
                      <span className="font-medium">{formatPrice(freightCalculation.pricing.finalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de Processamento:</span>
                      <span className="font-medium">{formatPrice(freightCalculation.pricing.breakdown?.processingFee || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Imposto FL (8.25%):</span>
                      <span className="font-medium">{formatPrice(freightCalculation.pricing.breakdown?.floridaTax || 0)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-1">
                      <span className="font-medium text-gray-900">Total do Frete:</span>
                      <span className="font-bold text-green-600">{formatPrice(freightCalculation.pricing?.finalPrice || 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Itens Adicionais */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Itens Adicionais</h3>
              
              <div className="space-y-4">
                {/* Caixa Dupla */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="doubleBox"
                      checked={formData.doubleBox}
                      onChange={(e) => setFormData(prev => ({ ...prev, doubleBox: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="doubleBox" className="ml-3">
                      <div className="font-medium text-gray-900">Caixa Dupla</div>
                      <div className="text-sm text-gray-500">Proteção extra para itens frágeis</div>
                    </label>
                  </div>
                  <div className="font-medium text-gray-900">$5.00</div>
                </div>

                {/* Plástico Bolha */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="bubbleWrap"
                      checked={formData.bubbleWrap}
                      onChange={(e) => setFormData(prev => ({ ...prev, bubbleWrap: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="bubbleWrap" className="ml-3">
                      <div className="font-medium text-gray-900">Plástico Bolha</div>
                      <div className="text-sm text-gray-500">Proteção adicional para todos os itens</div>
                    </label>
                  </div>
                  <div className="font-medium text-gray-900">$3.00</div>
                </div>

                {/* Remover Nota Fiscal */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="removeInvoice"
                      checked={formData.removeInvoice}
                      onChange={(e) => setFormData(prev => ({ ...prev, removeInvoice: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="removeInvoice" className="ml-3">
                      <div className="font-medium text-gray-900">Remover Nota Fiscal</div>
                      <div className="text-sm text-gray-500">Remover notas fiscais dos pacotes</div>
                    </label>
                  </div>
                  <div className="font-medium text-gray-900">Grátis</div>
                </div>
              </div>
            </div>

            {/* Instruções Personalizadas */}
            <div>
              <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                Instruções Personalizadas
              </label>
              <textarea
                id="customInstructions"
                value={formData.customInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, customInstructions: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Instruções especiais para o processamento desta caixa..."
              />
            </div>

            {/* Resumo de Custos */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Resumo de Custos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Consolidação:</span>
                  <span className="font-medium">{formatPrice(box.consolidationFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Armazenamento:</span>
                  <span className="font-medium">{formatPrice(box.storageFee)}</span>
                </div>
                {calculateAdditionalCosts() > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Itens Adicionais:</span>
                    <span className="font-medium">{formatPrice(calculateAdditionalCosts())}</span>
                  </div>
                )}
                {freightCalculation && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete ({freightCalculation.serviceInfo?.name || 'ABC Packet'}):</span>
                    <span className="font-medium">{formatPrice(freightCalculation.pricing?.finalPrice || 0)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total Final:</span>
                    <span className="text-green-600">{formatPrice(calculateTotalCost())}</span>
                  </div>
                </div>
                {freightCalculation && (
                  <div className="text-xs text-gray-500 mt-2">
                    * Entrega estimada: {freightCalculation.serviceInfo?.deliveryTime || '15-20 dias úteis'}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !freightCalculation}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Consolidando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Consolidar Caixa - {formatPrice(calculateTotalCost())}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={calculateTotalCost()}
          consolidationId={consolidationId}
          description={`Consolidação da caixa ${box.name || 'sem nome'}`}
        />
      )}
    </div>
  )
}
