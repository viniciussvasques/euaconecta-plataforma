import { NextRequest, NextResponse } from 'next/server'
import { PaymentProviderService } from '@/lib/payment-providers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { hasApi, apiKey, apiSecret, apiUrl } = body

    const paymentProviderService = new PaymentProviderService()
    
    // Verificar se o provedor existe
    const provider = await paymentProviderService.getById(id)
    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provedor de pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar credenciais
    const updatedProvider = await paymentProviderService.updateCredentials(id, {
      hasApi,
      apiKey: apiKey || null,
      apiSecret: apiSecret || null,
      apiUrl: apiUrl || null
    })

    return NextResponse.json({
      success: true,
      provider: updatedProvider
    })
  } catch (error) {
    console.error('Erro ao atualizar credenciais:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
