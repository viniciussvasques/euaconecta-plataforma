import { NextRequest, NextResponse } from 'next/server'
import { addressService } from '@/lib/addresses'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    if (!session.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o endereço existe e pertence ao usuário
    const existingAddress = await addressService.getById(id)
    if (!existingAddress) {
      return NextResponse.json(
        { success: false, error: 'Endereço não encontrado' },
        { status: 404 }
      )
    }

    if (existingAddress.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const address = await addressService.setDefault(id)

    return NextResponse.json({
      success: true,
      data: address
    })
  } catch (error) {
    console.error('Erro ao definir endereço padrão:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
