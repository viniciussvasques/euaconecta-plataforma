import { NextRequest, NextResponse } from 'next/server'
import { carrierService } from '@/lib/carriers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const carrier = await carrierService.getById(id)
    
    if (!carrier) {
      return NextResponse.json(
        { success: false, error: 'Transportadora não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: carrier
    })
  } catch (error) {
    console.error('Erro ao buscar transportadora:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    // Validar dados obrigatórios
    if (!data.name || !data.code) {
      return NextResponse.json(
        { success: false, error: 'Nome e código são obrigatórios' },
        { status: 400 }
      )
    }

    // Atualizar transportadora
    const carrier = await carrierService.update(id, data)
    
    return NextResponse.json({
      success: true,
      data: carrier
    })
  } catch (error) {
    console.error('Erro ao atualizar transportadora:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await carrierService.delete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Transportadora excluída com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar transportadora:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
