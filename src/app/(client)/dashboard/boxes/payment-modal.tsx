'use client'

import { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import { StripeCheckout } from '@/components/stripe-checkout'
import { PayPalCheckout } from '@/components/paypal-checkout'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  amount: number
  consolidationId: string
  description: string
}

interface PaymentProvider {
  id: string
  name: string
  code: string
  description?: string
  isActive: boolean
  hasApi: boolean
  supportedCurrencies: string[]
  supportedCountries: string[]
  fees: {
    fixed: number
    percentage: number
  }
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount, 
  consolidationId, 
  description 
}: PaymentModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [providers, setProviders] = useState<PaymentProvider[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingProviders, setLoadingProviders] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchPaymentProviders()
    }
  }, [isOpen])

  const fetchPaymentProviders = async () => {
    try {
      setLoadingProviders(true)
      const response = await fetch('/api/payment-providers/active')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers || [])
        // Selecionar PayPal por padrão se disponível
        const paypalProvider = data.providers?.find((p: PaymentProvider) => p.code === 'PAYPAL')
        if (paypalProvider) {
          setSelectedProvider(paypalProvider.id)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar provedores de pagamento:', error)
    } finally {
      setLoadingProviders(false)
    }
  }

  const calculateFinalAmount = (provider: PaymentProvider) => {
    const fixedFee = provider.fees.fixed
    const percentageFee = (amount * provider.fees.percentage) / 100
    return amount + fixedFee + percentageFee
  }

  // Função de pagamento removida - será implementada pelos componentes específicos

  const handlePaymentSuccess = () => {
    setLoading(false)
    onSuccess()
  }

  const handlePaymentError = (error: string) => {
    setLoading(false)
    alert(error)
  }

  const getProviderIcon = (code: string) => {
    switch (code) {
      case 'STRIPE':
        return <CreditCard className="h-6 w-6" />
      case 'PAYPAL':
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
        )
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Finalizar Pagamento
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Valor total: <span className="font-semibold text-green-600">{formatPrice(amount)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">

          {/* Seleção de Provedor */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              🏦 Escolha a forma de pagamento
            </h3>
            
            {loadingProviders ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 text-lg">Carregando opções...</span>
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💳</div>
                <p className="text-gray-600 text-lg">Nenhuma forma de pagamento disponível</p>
                <p className="text-gray-500 text-sm mt-2">Entre em contato com o suporte</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {providers
                  .filter(provider => provider.code === 'PAYPAL' || provider.code === 'STRIPE')
                  .map((provider) => {
                    const finalAmount = calculateFinalAmount(provider)
                    const isSelected = selectedProvider === provider.id
                    
                    return (
                      <div
                        key={provider.id}
                        className={`p-6 cursor-pointer transition-all duration-300 rounded-xl border-2 ${
                          isSelected 
                            ? provider.code === 'PAYPAL'
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' 
                              : 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedProvider(provider.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${
                            isSelected 
                              ? provider.code === 'PAYPAL' 
                                ? 'bg-blue-100' 
                                : 'bg-purple-100'
                              : 'bg-gray-100'
                          }`}>
                            {getProviderIcon(provider.code)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-bold text-lg text-gray-900">
                                {provider.code === 'PAYPAL' ? 'PayPal' : 'Cartão de Crédito/Débito'}
                              </h4>
                              {isSelected && (
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  provider.code === 'PAYPAL' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  ✓ Selecionado
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {provider.code === 'PAYPAL' 
                                ? 'Pague com sua conta PayPal ou cartão' 
                                : 'Visa, Mastercard, American Express'
                              }
                            </p>
                            <div className="font-bold text-xl text-gray-900">
                              {formatPrice(finalAmount)}
                              {finalAmount !== amount && (
                                <span className="text-sm text-gray-500 ml-1">(incl. taxas)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-base text-gray-900 mb-3 flex items-center">
              📋 Resumo do Pagamento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-600 text-xs">Valor da consolidação</div>
                <div className="font-semibold text-lg">{formatPrice(amount)}</div>
              </div>
              {selectedProvider && (() => {
                const provider = providers.find(p => p.id === selectedProvider)
                if (!provider) return null
                const finalAmount = calculateFinalAmount(provider)
                const totalFees = finalAmount - amount
                
                if (totalFees > 0) {
                  return (
                    <div className="text-center">
                      <div className="text-gray-600 text-xs">Taxas de pagamento</div>
                      <div className="font-semibold text-orange-600 text-lg">{formatPrice(totalFees)}</div>
                    </div>
                  )
                }
                return null
              })()}
              <div className="text-center">
                <div className="text-gray-600 text-xs">Total a pagar</div>
                <div className="font-bold text-2xl text-green-600">
                  {selectedProvider ? (() => {
                    const provider = providers.find(p => p.id === selectedProvider)
                    return provider ? formatPrice(calculateFinalAmount(provider)) : formatPrice(amount)
                  })() : formatPrice(amount)}
                </div>
              </div>
            </div>
          </div>

          {/* Componentes de Pagamento */}
          {selectedProvider && (() => {
            const provider = providers.find(p => p.id === selectedProvider)
            if (!provider) return null

            const finalAmount = calculateFinalAmount(provider)

            if (provider.code === 'STRIPE') {
              return (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Pagamento com Cartão
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Visa, Mastercard, American Express e outros
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                    <StripeCheckout
                      amount={finalAmount}
                      currency="USD"
                      description={description}
                      consolidationId={consolidationId}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>
              )
            }

            if (provider.code === 'PAYPAL') {
              return (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                      <span className="text-white font-bold text-sm">PP</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        Pagamento com PayPal
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Pague com segurança usando sua conta PayPal
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                    <div className="max-w-md mx-auto">
                      <PayPalCheckout
                        amount={finalAmount}
                        currency="USD"
                        description={description}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  </div>
                </div>
              )
            }


            return null
          })()}

        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            {/* Botões de pagamento são gerenciados pelos componentes específicos */}
          </div>
        </div>
      </div>
    </div>
  )
}
