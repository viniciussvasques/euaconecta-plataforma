import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/auth/users'
import { SuiteManager } from '@/lib/utils/suite-manager'
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
    if (!action || !['generate-suite'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Ação deve ser "generate-suite"' },
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

    let result: any = null
    let message = ''

    switch (action) {
      case 'generate-suite':
        // Gerar número de suíte
        if (targetUser.role !== 'CLIENT') {
          return NextResponse.json(
            { success: false, error: 'Apenas clientes podem ter número de suíte' },
            { status: 400 }
          )
        }

        if (targetUser.suiteNumber) {
          return NextResponse.json(
            { success: false, error: 'Usuário já possui número de suíte' },
            { status: 400 }
          )
        }

        const newSuiteNumber = await SuiteManager.getNextSuiteNumber()
        
        // Atualizar diretamente no banco
        await prisma.user.update({
          where: { id },
          data: { suiteNumber: newSuiteNumber }
        })

        console.log(`🏠 ADMIN ACTION: Suite #${newSuiteNumber} gerada para ${targetUser.name} (${targetUser.email})`)
        message = `Suite #${newSuiteNumber} gerada com sucesso`
        result = await UserService.getUserById(id) // Retornar usuário atualizado
        break
    }

    return NextResponse.json({
      success: true,
      data: result,
      message
    })

  } catch (error) {
    console.error('Erro ao executar ação administrativa:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}