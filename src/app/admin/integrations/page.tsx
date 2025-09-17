'use client'

import { useState, useEffect } from 'react'

interface PaymentProvider {
  id: string
  name: string
  code: string
  isActive: boolean
  hasApi: boolean
  apiKey?: string
  apiSecret?: string
}

export default function IntegrationsPage() {
  const [minioStatus, setMinioStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [minioMessage, setMinioMessage] = useState('')
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([])
  const [loadingProviders, setLoadingProviders] = useState(true)

  useEffect(() => {
    fetchPaymentProviders()
  }, [])

  const fetchPaymentProviders = async () => {
    try {
      setLoadingProviders(true)
      const response = await fetch('/api/payment-providers')
      if (response.ok) {
        const data = await response.json()
        setPaymentProviders(data.providers || [])
      }
    } catch (error) {
      console.error('Erro ao carregar provedores de pagamento:', error)
    } finally {
      setLoadingProviders(false)
    }
  }

  const getProviderStatus = (code: string) => {
    const provider = paymentProviders.find(p => p.code.toLowerCase() === code.toLowerCase())
    if (!provider) return { status: 'Não configurado', color: 'bg-yellow-100 text-yellow-800' }

    if (provider.isActive && provider.apiKey) {
      return { status: 'Conectado', color: 'bg-green-100 text-green-800' }
    } else if (provider.isActive && !provider.apiKey) {
      return { status: 'Ativo sem credenciais', color: 'bg-orange-100 text-orange-800' }
    } else {
      return { status: 'Inativo', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const testMinIO = async () => {
    setMinioStatus('testing')
    setMinioMessage('')

    try {
      const response = await fetch('/api/admin/minio/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMinioStatus('success')
        setMinioMessage(data.message)
      } else {
        setMinioStatus('error')
        setMinioMessage(data.message || 'Falha na conexão com MinIO')
      }
    } catch {
      setMinioStatus('error')
      setMinioMessage('Erro ao testar conexão com MinIO')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
        <p className="mt-2 text-sm text-gray-700">Gerencie integrações como Stripe, ShipStation, S3/MinIO e Webhooks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stripe */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Stripe</h2>
            {loadingProviders ? (
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${getProviderStatus('STRIPE').color}`}>
                {getProviderStatus('STRIPE').status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">Pagamentos e faturamento</p>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <strong>Status:</strong> {loadingProviders ? 'Carregando...' : getProviderStatus('STRIPE').status}
            </div>
            <div className="text-xs text-gray-500">
              <strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_APP_URL}/api/stripe/webhook
            </div>
            <div className="text-xs text-gray-500">
              <strong>Eventos:</strong> checkout.session.completed, checkout.session.expired, setup_intent.*
            </div>
          </div>
        </div>

        {/* PayPal */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">PayPal</h2>
            {loadingProviders ? (
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${getProviderStatus('PAYPAL').color}`}>
                {getProviderStatus('PAYPAL').status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">Pagamentos via PayPal</p>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <strong>Status:</strong> {loadingProviders ? 'Carregando...' : getProviderStatus('PAYPAL').status}
            </div>
            <div className="text-xs text-gray-500">
              <strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_APP_URL}/api/paypal/webhook
            </div>
            <div className="text-xs text-gray-500">
              <strong>Eventos:</strong> PAYMENT.CAPTURE.*, CHECKOUT.ORDER.*, BILLING.SUBSCRIPTION.*
            </div>
          </div>
        </div>

        {/* ShipStation */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">ShipStation</h2>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Não configurado
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">Cotações e etiquetas de envio</p>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <strong>Status:</strong> Aguardando configuração
            </div>
            <div className="text-xs text-gray-500">
              <strong>API:</strong> ShipStation REST API
            </div>
          </div>
        </div>

        {/* MinIO */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">MinIO</h2>
            <span className={`px-2 py-1 text-xs rounded-full ${
              minioStatus === 'success' ? 'bg-green-100 text-green-800' :
              minioStatus === 'error' ? 'bg-red-100 text-red-800' :
              minioStatus === 'testing' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {minioStatus === 'success' ? 'Conectado' :
               minioStatus === 'error' ? 'Erro' :
               minioStatus === 'testing' ? 'Testando...' :
               'Não testado'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">Armazenamento de arquivos e imagens</p>

          <div className="space-y-3">
            <div className="text-xs text-gray-500">
              <strong>Endpoint:</strong> {process.env.NEXT_PUBLIC_S3_ENDPOINT || 'http://localhost:9000'}
            </div>
            <div className="text-xs text-gray-500">
              <strong>Bucket:</strong> euaconecta-files
            </div>

            {minioMessage && (
              <div className={`text-xs p-2 rounded ${
                minioStatus === 'success' ? 'bg-green-50 text-green-700' :
                minioStatus === 'error' ? 'bg-red-50 text-red-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {minioMessage}
              </div>
            )}

            <button
              onClick={testMinIO}
              disabled={minioStatus === 'testing'}
              className="w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {minioStatus === 'testing' ? 'Testando...' : 'Testar Conexão'}
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Webhooks</h2>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Configurado
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">Eventos de entrada e saída</p>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <strong>Stripe:</strong> {process.env.NEXT_PUBLIC_APP_URL}/api/stripe/webhook
            </div>
            <div className="text-xs text-gray-500">
              <strong>PayPal:</strong> {process.env.NEXT_PUBLIC_APP_URL}/api/paypal/webhook
            </div>
            <div className="text-xs text-gray-500">
              <strong>ShipStation:</strong> Aguardando configuração
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
