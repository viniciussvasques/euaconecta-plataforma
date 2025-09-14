import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PaymentProviderService } from '@/lib/payment-providers'
import { prisma } from '@/lib/prisma'

let stripe: Stripe | null = null

async function getStripeInstance(): Promise<Stripe> {
  if (stripe) return stripe

  const paymentProviderService = new PaymentProviderService()
  const stripeProvider = await paymentProviderService.getByCode('STRIPE')
  
  if (!stripeProvider || !stripeProvider.apiSecret) {
    throw new Error('Credenciais do Stripe não configuradas no painel administrativo')
  }

  stripe = new Stripe(stripeProvider.apiSecret, {
    apiVersion: '2025-08-27.basil',
  })

  return stripe
}

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
    const { amount, currency, description, consolidationId } = body

    if (!amount || !currency || !consolidationId) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Criar registro de pagamento no banco
    const paymentIntentId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const payment = await prisma.payment.create({
      data: {
        userId: session.userId,
        providerCode: 'STRIPE',
        intentId: paymentIntentId,
        currency: currency || 'USD',
        amountCents: Math.round(amount), // Já vem em centavos
        status: 'pending'
      }
    })

    // Criar sessão de checkout do Stripe
    const stripeInstance = await getStripeInstance()
    const checkoutSession = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: description || 'Consolidação de Pacotes',
            },
            unit_amount: amount, // Já em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/boxes/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/boxes?payment=cancelled`,
      customer_email: session.email,
      metadata: {
        userId: session.userId,
        consolidationId: consolidationId || '',
        paymentId: payment.id,
        description: description || 'Consolidação de Pacotes',
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
    })

  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
