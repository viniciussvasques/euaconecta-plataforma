import { NextRequest, NextResponse } from 'next/server'
import { protectionService } from '@/lib/protection-services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const itemType = searchParams.get('itemType')
    
    let services
    
    if (itemType) {
      services = await protectionService.getRecommendedForItem(itemType)
    } else if (category) {
      services = await protectionService.getByCategory(category)
    } else {
      services = await protectionService.getAllActive()
    }
    
    return NextResponse.json({
      success: true,
      data: services
    })
  } catch (error) {
    console.error('Erro ao buscar serviços de proteção:', error)
    
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
    if (!data.name || !data.code || !data.protectionType || !data.category) {
      return NextResponse.json(
        { success: false, error: 'Nome, código, tipo e categoria são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Criar serviço
    const service = await protectionService.create(data)
    
    return NextResponse.json({
      success: true,
      data: service
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar serviço de proteção:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
