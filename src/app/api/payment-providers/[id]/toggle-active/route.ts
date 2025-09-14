import { NextRequest, NextResponse } from 'next/server'
import { PaymentProviderService } from '@/lib/payment-providers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const paymentProviderService = new PaymentProviderService()
    
    // Buscar o provedor atual
    const provider = await paymentProviderService.getById(id)
    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provedor de pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Alternar status
    const updatedProvider = await paymentProviderService.update(id, {
      isActive: !provider.isActive
    })

    return NextResponse.json({
      success: true,
      provider: updatedProvider
    })
  } catch (error) {
    console.error('Erro ao alterar status do provedor:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
