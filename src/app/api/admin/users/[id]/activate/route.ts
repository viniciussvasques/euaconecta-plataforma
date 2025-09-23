import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/auth/users'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const { action } = await request.json()
    if (!action || !['activate', 'deactivate'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Ação deve ser "activate" ou "deactivate"' },
        { status: 400 }
      )
    }

    // Verificar se usuário existe
    const targetUser = await UserService.getUserById(id)
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Executar ação
    const isActive = action === 'activate'
    const updatedUser = await UserService.updateUser(id, { isActive })

    console.log(`👤 ADMIN ACTION: Usuário ${targetUser.name} (${targetUser.email}) foi ${action === 'activate' ? 'ATIVADO' : 'DESATIVADO'}`)

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `Usuário ${action === 'activate' ? 'ativado' : 'desativado'} com sucesso!`
    })

  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}