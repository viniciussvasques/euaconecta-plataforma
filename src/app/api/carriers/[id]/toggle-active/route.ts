import { NextRequest, NextResponse } from 'next/server'
import { carrierService } from '@/lib/carriers'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: carrierId } = await params

    if (!carrierId) {
      return NextResponse.json({ success: false, error: 'ID da transportadora é obrigatório' }, { status: 400 })
    }

    const updatedCarrier = await carrierService.toggleActive(carrierId)

    if (!updatedCarrier) {
      return NextResponse.json({ success: false, error: 'Transportadora não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedCarrier,
      message: `Transportadora ${updatedCarrier.isActive ? 'ativada' : 'desativada'} com sucesso`
    })
  } catch (error) {
    console.error('Erro ao alterar status da transportadora:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
