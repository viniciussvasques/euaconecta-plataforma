import { NextRequest, NextResponse } from 'next/server'
import { ConsolidationService } from '@/lib/consolidation'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { packageId } = await request.json()

    if (!id || !packageId) {
      return NextResponse.json(
        { success: false, error: 'ID da consolidação e ID do pacote são obrigatórios' },
        { status: 400 }
      )
    }

    const consolidationService = new ConsolidationService()
    const result = await consolidationService.removePackageFromBox(id, packageId)

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Erro ao remover pacote da caixa' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Pacote removido da caixa com sucesso'
    })
  } catch (error) {
    console.error('Erro ao remover pacote da caixa:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
