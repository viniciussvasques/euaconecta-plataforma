import { NextRequest, NextResponse } from 'next/server'
import { PaymentProviderService } from '@/lib/payment-providers'
import { prisma } from '@/lib/prisma'

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
    const { 
      amount, 
      currency, 
      providerId, 
      consolidationId
    } = body

    // Validar dados
    if (!amount || !providerId || !consolidationId) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Buscar provedor de pagamento
    const paymentProviderService = new PaymentProviderService()
    const provider = await paymentProviderService.getById(providerId)
    
    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provedor de pagamento não encontrado' },
        { status: 404 }
      )
    }

    if (!provider.isActive) {
      return NextResponse.json(
        { success: false, error: 'Provedor de pagamento inativo' },
        { status: 400 }
      )
    }

    // Calcular valor final com taxas
    const fixedFee = provider.fees.fixed
    const percentageFee = (amount * provider.fees.percentage) / 100
    const finalAmount = amount + fixedFee + percentageFee

    // Criar registro de pagamento
    const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const payment = await prisma.payment.create({
      data: {
        userId: session.userId,
        providerId,
        providerCode: provider.code,
        intentId: paymentIntentId,
        currency: currency || 'USD',
        amountCents: Math.round(finalAmount * 100), // Converter para centavos
        status: 'pending'
      }
    })

    // Gerar client secret baseado no provedor
    let clientSecret = ''
    
    if (provider.code === 'STRIPE') {
      // Implementar Stripe Payment Intent
      clientSecret = `pi_${payment.intentId}_secret_${Math.random().toString(36).substr(2, 9)}`
    } else if (provider.code === 'PAYPAL') {
      // Implementar PayPal Order
      clientSecret = `paypal_${payment.intentId}_${Math.random().toString(36).substr(2, 9)}`
    } else if (provider.code === 'PIX') {
      // Implementar PIX
      clientSecret = `pix_${payment.intentId}_${Math.random().toString(36).substr(2, 9)}`
    } else if (provider.code === 'BOLETO') {
      // Implementar Boleto
      clientSecret = `boleto_${payment.intentId}_${Math.random().toString(36).substr(2, 9)}`
    }

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: payment.intentId,
        amount: finalAmount,
        currency: currency || 'USD',
        status: 'requires_payment_method'
      },
      clientSecret,
      payment: {
        id: payment.id,
        amount: finalAmount,
        provider: provider.name,
        fees: {
          fixed: fixedFee,
          percentage: percentageFee
        }
      }
    })

  } catch (error) {
    console.error('Erro ao criar intenção de pagamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
