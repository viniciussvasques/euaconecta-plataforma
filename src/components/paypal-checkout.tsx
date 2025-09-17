'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface PayPalCheckoutProps {
  amount: number
  currency: string
  description: string
  onSuccess: () => void
  onError: (error: string) => void
}

interface PayPalWindow extends Window {
  paypal?: {
    Buttons: (config: PayPalButtonConfig) => PayPalButtonInstance
    FUNDING: {
      PAYPAL: string
      CREDIT: string
      CARD: string
      PAYLATER: string
    }
  }
}

interface PayPalButtonConfig {
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }) => Promise<void>
  onError: (err: Error) => void
  onCancel: (data: { orderID: string }) => void
  style?: {
    layout?: 'vertical' | 'horizontal'
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
    shape?: 'rect' | 'pill'
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment'
    height?: number
    tagline?: boolean
  }
  fundingSource?: string
}

interface PayPalButtonInstance {
  render: (selector: string) => void
  isEligible: () => boolean
}

export function PayPalCheckout({ amount, currency, description, onSuccess, onError }: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paypalConfig, setPaypalConfig] = useState<{apiKey?: string} | null>(null)
  const paypalRef = useRef<HTMLDivElement>(null)
  const buttonsRendered = useRef(false)


  // Buscar configurações do PayPal do banco de dados
  useEffect(() => {
    const fetchPayPalConfig = async () => {
      try {
        const response = await fetch('/api/payment-providers')
        const data = await response.json()

        if (data.success) {
          const paypalProvider = data.providers.find((p: { code: string; apiKey?: string }) => p.code === 'PAYPAL')

          if (paypalProvider) {
            setPaypalConfig({
              apiKey: paypalProvider.apiKey
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar config PayPal:', error)
      }
    }

    fetchPayPalConfig()
  }, [])

  useEffect(() => {
    const loadPayPalSDK = async () => {
      try {
        // Verificar se o PayPal já está carregado
        if ((window as PayPalWindow).paypal) {
          setPaypalLoaded(true)
          return
        }

        // Verificar se temos as credenciais configuradas
        if (!paypalConfig?.apiKey) {
          setError('Credenciais do PayPal não configuradas. Configure no painel administrativo.')
          return
        }

        // Carregar o SDK do PayPal com credenciais do banco
        const script = document.createElement('script')
        script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.apiKey}&currency=${currency}&intent=capture&components=buttons,funding-eligibility`
        script.async = true

        script.onload = () => {
          setPaypalLoaded(true)
          setError(null)
        }

        script.onerror = () => {
          setError('Erro ao carregar PayPal SDK')
          onError('Erro ao carregar PayPal SDK')
        }

        document.head.appendChild(script)
      } catch {
        setError('Erro ao inicializar PayPal')
        onError('Erro ao inicializar PayPal')
      }
    }

    if (paypalConfig) {
      loadPayPalSDK()
    }
  }, [currency, onError, paypalConfig])

  const createOrder = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
        }),
      })

      const data = await response.json()

      if (!data.success || !data.orderId) {
        throw new Error(data.error || 'Erro ao criar ordem no PayPal')
      }

      return data.orderId
    } catch (err) {
      console.error('Erro ao criar ordem:', err)
      throw new Error('Erro ao criar ordem de pagamento')
    }
  }, [amount, currency, description])

  const onApprove = useCallback(async (data: { orderID: string }): Promise<void> => {
    try {
      setLoading(true)

      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar pagamento')
      }

      // Pagamento bem-sucedido
      onSuccess()
    } catch (err) {
      console.error('Erro ao capturar pagamento:', err)
      onError('Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }, [onSuccess, onError])

  const handlePayPalError = useCallback((err: Error) => {
    console.error('Erro no PayPal:', err)
    onError('Erro no pagamento PayPal')
  }, [onError])

  const onCancel = useCallback((data: { orderID: string }) => {
    console.log('Pagamento cancelado:', data.orderID)
    onError('Pagamento cancelado pelo usuário')
  }, [onError])

  useEffect(() => {
    if (paypalLoaded && paypalRef.current && !buttonsRendered.current) {
      const paypal = (window as PayPalWindow).paypal
      if (!paypal) {
        return
      }

      // Limpar container anterior
      paypalRef.current.innerHTML = ''

      // Configurações dos botões
      const buttonConfig: PayPalButtonConfig = {
        createOrder,
        onApprove,
        onError: handlePayPalError,
        onCancel,
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45,
          tagline: false,
        },
      }

      // Renderizar apenas o botão principal do PayPal
      const paypalButton = paypal.Buttons({
        ...buttonConfig,
        style: {
          ...buttonConfig.style,
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45,
        },
      })

      if (paypalRef.current) {
        try {
          paypalButton.render(paypalRef.current as unknown as string)
        } catch (error) {
          console.error('Erro ao renderizar botão PayPal:', error)
        }
      }

      buttonsRendered.current = true
    }
  }, [paypalLoaded, amount, currency, description, createOrder, handlePayPalError, onApprove, onCancel])

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Processando pagamento...</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      ) : !paypalLoaded ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando PayPal...</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div ref={paypalRef} className="w-full min-h-[50px] flex justify-center"></div>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Pagamento seguro processado pelo PayPal
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
