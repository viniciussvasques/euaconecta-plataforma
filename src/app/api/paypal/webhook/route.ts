import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar se é um evento de pagamento aprovado
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = body.resource
      const orderId = resource.custom_id
      
      if (!orderId) {
        console.log('Order ID not found in PayPal webhook')
        return NextResponse.json({ error: 'Order ID not found' }, { status: 400 })
      }

      // Buscar o pagamento no banco
      const payment = await prisma.payment.findFirst({
        where: { 
          intentId: orderId,
          providerCode: 'PAYPAL'
        },
        include: {
          user: true
        }
      })

      if (payment) {
        // Atualizar status do pagamento
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'succeeded',
            receiptUrl: resource.links?.find((link: { rel: string; href: string }) => link.rel === 'self')?.href
          }
        })

        // Enviar email de confirmação
        if (payment.user) {
          await EmailService.sendMail({
            to: payment.user.email,
            subject: '✅ Pagamento Confirmado - Euaconecta',
            html: EmailService.paymentConfirmationEmail(
              payment.user.name,
              Number(payment.amountCents) / 100,
              'PayPal',
              payment.id
            )
          })
        }

        console.log('PayPal payment succeeded:', orderId)
      } else {
        console.log('Payment not found for order ID:', orderId)
      }
    }

    // Verificar se é um evento de pagamento cancelado
    if (body.event_type === 'PAYMENT.CAPTURE.DENIED') {
      const resource = body.resource
      const orderId = resource.custom_id
      
      if (orderId) {
        await prisma.payment.updateMany({
          where: { 
            intentId: orderId,
            providerCode: 'PAYPAL'
          },
          data: {
            status: 'failed'
          }
        })

        console.log('PayPal payment failed:', orderId)
      }
    }

    // Verificar se é um evento de pagamento cancelado pelo usuário
    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const resource = body.resource
      const orderId = resource.id
      
      console.log('PayPal order approved:', orderId)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
