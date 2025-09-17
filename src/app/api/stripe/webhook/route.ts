import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email'
import { EventService, SystemEvent } from '@/lib/events'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook signature missing' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Processar eventos de pagamento
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Atualizar status do pagamento no banco
      await prisma.payment.updateMany({
        where: {
          intentId: session.id,
        },
        data: {
          status: 'succeeded',
          receiptUrl: (session as Stripe.Checkout.Session & { receipt_url?: string }).receipt_url || null,
        },
      })

      // Buscar dados do usuário para enviar email
      const payment = await prisma.payment.findFirst({
        where: { intentId: session.id },
        include: {
          user: true
        }
      })

      if (payment?.user) {
        // Emitir evento de pagamento bem-sucedido
        await EventService.emit(SystemEvent.PAYMENT_SUCCEEDED, {
          userId: payment.userId,
          entityType: 'Payment',
          entityId: payment.id,
          metadata: {
            amount: payment.amountCents,
            provider: 'stripe',
            currency: payment.currency
          }
        })

        // Enviar email de confirmação
        await EmailService.sendMail({
          to: payment.user.email,
          subject: '✅ Pagamento Confirmado - Euaconecta',
          html: EmailService.paymentConfirmationEmail(
            payment.user.name,
            Number(payment.amountCents) / 100,
            'Cartão de Crédito/Débito',
            payment.id
          )
        })
      }

      console.log('Payment succeeded:', session.id)
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session

      // Buscar dados do pagamento antes de atualizar
      const payment = await prisma.payment.findFirst({
        where: { intentId: session.id },
        include: { user: true }
      })

      // Atualizar status do pagamento no banco
      await prisma.payment.updateMany({
        where: {
          intentId: session.id,
        },
        data: {
          status: 'failed',
        },
      })

      // Emitir evento de pagamento falhado
      if (payment?.user) {
        await EventService.emit(SystemEvent.PAYMENT_FAILED, {
          userId: payment.userId,
          entityType: 'Payment',
          entityId: payment.id,
          metadata: {
            amount: payment.amountCents,
            provider: 'stripe',
            currency: payment.currency,
            reason: 'session_expired'
          }
        })
      }

      console.log('Payment expired:', session.id)
    }

    // Processar eventos de SetupIntent (para salvar métodos de pagamento)
    if (event.type === 'setup_intent.created') {
      const setupIntent = event.data.object as Stripe.SetupIntent

      console.log('SetupIntent created:', setupIntent.id)
      // Aqui você pode adicionar lógica para salvar informações do método de pagamento
      // Por exemplo, salvar o payment_method_id no banco de dados do usuário
    }

    if (event.type === 'setup_intent.succeeded') {
      const setupIntent = event.data.object as Stripe.SetupIntent

      console.log('SetupIntent succeeded:', setupIntent.id)
      // Método de pagamento foi salvo com sucesso
      // Aqui você pode atualizar o status no banco de dados
    }

    if (event.type === 'setup_intent.setup_failed') {
      const setupIntent = event.data.object as Stripe.SetupIntent

      console.log('SetupIntent failed:', setupIntent.id)
      // Falha ao salvar método de pagamento
      // Aqui você pode registrar o erro ou notificar o usuário
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
