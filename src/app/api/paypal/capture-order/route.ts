import { NextRequest, NextResponse } from 'next/server'
import { PaymentProviderService } from '@/lib/payment-providers'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email'

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
    let userId: string | null = null
    let email: string | null = null
    try {
      const payload = await (await import('@/lib/jwt')).verifyAccessToken(sessionCookie.value)
      userId = String(payload.sub || '')
      email = String((payload as unknown as { email?: string }).email || '')
    } catch {
      try {
        const legacy = JSON.parse(sessionCookie.value) as { userId?: string; email?: string }
        userId = legacy.userId || null
        email = legacy.email || null
      } catch {}
    }
    if (!userId || !email) {
      return NextResponse.json(
        { success: false, error: 'Sessão inválida' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'ID da ordem não fornecido' },
        { status: 400 }
      )
    }

    // Capturar pagamento no PayPal
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getPayPalAccessToken()}`,
      },
    })

    const captureData = await response.json()

    if (captureData.status !== 'COMPLETED') {
      throw new Error('Pagamento não foi completado')
    }

    // Buscar o pagamento no banco e atualizar status
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
          receiptUrl: captureData.links?.find((link: { rel: string; href: string }) => link.rel === 'self')?.href
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
    }

    return NextResponse.json({
      success: true,
      captureId: captureData.id,
      status: captureData.status,
    })

  } catch (error) {
    console.error('Erro ao capturar pagamento PayPal:', error)
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
  return data.access_token
}
