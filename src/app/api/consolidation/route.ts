import { NextRequest, NextResponse } from 'next/server'
import { consolidationService } from '@/lib/consolidation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId é obrigatório' },
        { status: 400 }
      )
    }
    
    let consolidations
    if (status === 'pending') {
      consolidations = await consolidationService.getByStatus('PENDING')
    } else if (status === 'in_progress') {
      consolidations = await consolidationService.getByStatus('IN_PROGRESS')
    } else {
      consolidations = await consolidationService.getByUserId(userId)
    }
    
    return NextResponse.json({
      success: true,
      data: consolidations
    })
  } catch (error) {
    console.error('Erro ao buscar consolidações:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validar dados obrigatórios
    if (!data.consolidationType || !data.userId) {
      return NextResponse.json(
        { success: false, error: 'Tipo de consolidação e usuário são obrigatórios' },
        { status: 400 }
      )
    }
    
    // packageIds pode estar vazio (caixa vazia)
    if (!data.packageIds) {
      data.packageIds = []
    }
    
    // Criar consolidação
    const consolidation = await consolidationService.create(data)
    
    return NextResponse.json({
      success: true,
      data: consolidation
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar consolidação:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
