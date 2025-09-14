'use client'

import { useState, useEffect } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

interface StripeCheckoutProps {
  amount: number
  currency: string
  description: string
  consolidationId?: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function StripeCheckout({ amount, currency, description, consolidationId, onSuccess, onError }: StripeCheckoutProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [loading, setLoading] = useState(false)
  const [stripeConfig, setStripeConfig] = useState<{apiKey?: string} | null>(null)

  // Buscar configurações do Stripe do banco de dados
  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const response = await fetch('/api/payment-providers')
        const data = await response.json()
        
        if (data.success) {
          const stripeProvider = data.providers.find((p: { code: string; apiKey?: string }) => p.code === 'STRIPE')
          if (stripeProvider) {
            setStripeConfig({
              apiKey: stripeProvider.apiKey
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar config Stripe:', error)
      }
    }

    fetchStripeConfig()
  }, [])

  useEffect(() => {
    const initializeStripe = async () => {
      if (!stripeConfig?.apiKey) {
        onError('Credenciais do Stripe não configuradas. Configure no painel administrativo.')
        return
      }

      const stripeInstance = await loadStripe(stripeConfig.apiKey)
      setStripe(stripeInstance)
    }
    
    if (stripeConfig) {
      initializeStripe()
    }
  }, [stripeConfig, onError])

  const handleCheckout = async () => {
    if (!stripe) {
      onError('Stripe não foi carregado')
      return
    }

    setLoading(true)

    try {
      // Criar sessão de checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Converter para centavos
          currency,
          description,
          consolidationId,
        }),
      })

      const { sessionId } = await response.json()

      if (!sessionId) {
        throw new Error('Erro ao criar sessão de checkout')
      }

      // Redirecionar para o Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        onError(error.message || 'Erro desconhecido')
      } else {
        // Se não há erro, o usuário será redirecionado
        // A confirmação será feita via webhook ou no retorno
        console.log('Redirecionando para Stripe Checkout...')
      }
    } catch (error) {
      console.error('Erro no checkout Stripe:', error)
      onError('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!stripeConfig?.apiKey) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">Credenciais do Stripe não configuradas</p>
      </div>
    )
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={!stripe || loading}
      className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Processando...</span>
        </>
      ) : (
        <>
          <span>💳</span>
          <span>Pagar com Stripe</span>
        </>
      )}
    </button>
  )
}
