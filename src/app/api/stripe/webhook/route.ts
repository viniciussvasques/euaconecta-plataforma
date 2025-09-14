import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email'

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

      // Atualizar status do pagamento no banco
      await prisma.payment.updateMany({
        where: {
          intentId: session.id,
        },
        data: {
          status: 'failed',
        },
      })

      console.log('Payment expired:', session.id)
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
