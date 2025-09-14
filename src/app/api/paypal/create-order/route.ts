import { NextRequest, NextResponse } from 'next/server'
import { PaymentProviderService } from '@/lib/payment-providers'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação via cookie de sessão
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)
    if (!session.userId || !session.email) {
      return NextResponse.json(
        { success: false, error: 'Sessão inválida' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, currency, description } = body

    if (!amount || !currency) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Criar ordem no PayPal
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2),
          },
          description: description || 'Consolidação de Pacotes',
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/boxes?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/boxes?payment=cancelled`,
      },
    }

    const accessToken = await getPayPalAccessToken()
    
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()

    if (!response.ok) {
      throw new Error(`PayPal API Error: ${response.status} - ${order.message || order.error_description || 'Erro desconhecido'}`)
    }

    if (!order.id) {
      throw new Error('Erro ao criar ordem no PayPal - ID não retornado')
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
    })

  } catch (error) {
    console.error('Erro ao criar ordem PayPal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const paymentProviderService = new PaymentProviderService()
  const paypalProvider = await paymentProviderService.getByCode('PAYPAL')
  
  if (!paypalProvider || !paypalProvider.apiKey || !paypalProvider.apiSecret) {
    throw new Error('Credenciais do PayPal não configuradas no painel administrativo')
  }

  const clientId = paypalProvider.apiKey
  const clientSecret = paypalProvider.apiSecret

  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })
  
  const data = await response.json()
  
  if (!data.access_token) {
    throw new Error(`Erro ao obter access token: ${data.error_description || data.error || 'Erro desconhecido'}`)
  }
  
  return data.access_token
}
