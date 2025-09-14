'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const processPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        const paymentStatus = searchParams.get('payment')
        
        if (paymentStatus === 'cancelled') {
          setStatus('error')
          setMessage('Pagamento cancelado pelo usuário')
          return
        }

        if (!sessionId) {
          setStatus('error')
          setMessage('ID da sessão não encontrado')
          return
        }

        // Buscar informações da sessão do Stripe
        const response = await fetch(`/api/stripe/check-session?session_id=${sessionId}`)
        const data = await response.json()

        if (data.success && data.session.payment_status === 'paid') {
          // Confirmar pagamento no sistema
          const confirmResponse = await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: sessionId,
              consolidationId: data.session.metadata?.consolidationId || ''
            })
          })

          const confirmData = await confirmResponse.json()

          if (confirmData.success) {
            setStatus('success')
            setMessage('Pagamento confirmado com sucesso!')
            
            // Redirecionar após 3 segundos
            setTimeout(() => {
              router.push('/dashboard/boxes')
            }, 3000)
          } else {
            setStatus('error')
            setMessage('Erro ao confirmar pagamento: ' + confirmData.error)
          }
        } else {
          setStatus('error')
          setMessage('Pagamento não foi processado corretamente')
        }
      } catch (error) {
        console.error('Erro ao processar pagamento:', error)
        setStatus('error')
        setMessage('Erro interno do servidor')
      }
    }

    processPayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Processando Pagamento
            </h1>
            <p className="text-gray-600">
              Aguarde enquanto confirmamos seu pagamento...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirecionando para o dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erro no Pagamento
            </h1>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <button
              onClick={() => router.push('/dashboard/boxes')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  )
}
