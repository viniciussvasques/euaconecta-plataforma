import { NextRequest, NextResponse } from 'next/server'
import { CarrierService } from '@/lib/carriers'

const carrierService = new CarrierService()

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { apiKey, apiSecret, apiUrl, hasApi } = body

    // Validar dados
    if (hasApi && (!apiKey || !apiSecret || !apiUrl)) {
      return NextResponse.json(
        { error: 'API Key, Secret e URL são obrigatórios quando a API está habilitada' },
        { status: 400 }
      )
    }

    // Atualizar credenciais da transportadora
    const updatedCarrier = await carrierService.updateCredentials(id, {
      apiKey: apiKey || null,
      apiSecret: apiSecret || null,
      apiUrl: apiUrl || null,
      hasApi: Boolean(hasApi)
    })

    if (!updatedCarrier) {
      return NextResponse.json(
        { error: 'Transportadora não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedCarrier
    })

  } catch (error) {
    console.error('Erro ao atualizar credenciais:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
