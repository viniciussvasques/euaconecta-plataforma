'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ToggleActiveButton } from './toggle-active-button'
import { ConfigureCredentialsButton } from './configure-credentials-button'
import { Plus, CreditCard, Smartphone, DollarSign, Barcode } from 'lucide-react'

interface PaymentProvider {
  id: string
  name: string
  code: string
  description?: string
  isActive: boolean
  hasApi: boolean
  apiKey?: string
  apiSecret?: string
  apiUrl?: string
  supportedCurrencies: string[]
  supportedCountries: string[]
  fees: {
    fixed: number
    percentage: number
  }
  createdAt: string
  updatedAt: string
}

export function PaymentProviderList() {
  const [providers, setProviders] = useState<PaymentProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payment-providers')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers || [])
      } else {
        setError('Erro ao carregar provedores de pagamento')
      }
      } catch {
      setError('Erro ao carregar provedores de pagamento')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = () => {
    fetchProviders()
  }

  const handleCredentialsSaved = () => {
    fetchProviders()
  }

  const getProviderIcon = (code: string) => {
    switch (code) {
      case 'stripe':
        return <CreditCard className="h-5 w-5" />
      case 'paypal':
        return <Smartphone className="h-5 w-5" />
      case 'pix':
        return <DollarSign className="h-5 w-5" />
      case 'boleto':
        return <Barcode className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando provedores...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <Button 
          onClick={fetchProviders}
          className="mt-2 bg-red-600 hover:bg-red-700 text-white"
        >
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Provedores de Pagamento
          </h2>
          <p className="text-sm text-gray-600">
            {providers.length} provedores configurados
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Provedor
        </Button>
      </div>

      {/* Lista de provedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  provider.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getProviderIcon(provider.code)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-500">{provider.code.toUpperCase()}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                provider.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {provider.isActive ? 'Ativo' : 'Inativo'}
              </div>
            </div>

            {provider.description && (
              <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
            )}

            {/* Informações de API */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">API Configurada:</span>
                <span className={`font-medium ${
                  provider.hasApi ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {provider.hasApi ? 'Sim' : 'Não'}
                </span>
              </div>
              {provider.hasApi && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Credenciais:</span>
                  <span className={`font-medium ${
                    provider.apiKey ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {provider.apiKey ? 'Configuradas' : 'Não configuradas'}
                  </span>
                </div>
              )}
            </div>

            {/* Taxas */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Taxas</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa fixa:</span>
                  <span className="font-medium">{formatPrice(provider.fees.fixed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa percentual:</span>
                  <span className="font-medium">{provider.fees.percentage}%</span>
                </div>
              </div>
            </div>

            {/* Moedas e países suportados */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Suporte</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-600">Moedas: </span>
                  <span className="font-medium">{provider.supportedCurrencies.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Países: </span>
                  <span className="font-medium">{provider.supportedCountries.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex space-x-2">
              <ToggleActiveButton
                provider={provider}
                onToggle={handleToggleActive}
              />
              <ConfigureCredentialsButton
                provider={provider}
                onCredentialsSaved={handleCredentialsSaved}
              />
            </div>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum provedor de pagamento
          </h3>
          <p className="text-gray-600 mb-4">
            Adicione provedores de pagamento para permitir que os clientes paguem suas consolidações.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Provedor
          </Button>
        </div>
      )}
    </div>
  )
}
