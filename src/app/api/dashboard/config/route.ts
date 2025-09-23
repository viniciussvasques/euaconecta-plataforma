import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { defaultCustomization } from '@/lib/config/system-customization'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Buscar as configurações de personalização
    const customData = await prisma.systemCustomization.findFirst({
      where: { 
        key: 'dashboard_config',
        isActive: true
      }
    })

    // Se não encontrar, retorna o valor padrão
    if (!customData) {
      const defaultDashboardConfig = {
        banner: defaultCustomization.clientDashboard.banner,
        introduction: defaultCustomization.clientDashboard.introduction
      }

      return NextResponse.json({
        success: true,
        data: defaultDashboardConfig
      })
    }

    // Retorna os dados encontrados
    return NextResponse.json({
      success: true,
      data: customData.value
    })
  } catch (error) {
    console.error('Erro ao buscar configurações do dashboard:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao buscar configurações do dashboard'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verificar se o usuário está autenticado como admin
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Não autorizado'
      }, { status: 403 })
    }

    // Obter dados do corpo da requisição
    const data = await request.json()

    // Validar dados
    if (!data || typeof data !== 'object') {
      return NextResponse.json({
        success: false,
        message: 'Dados inválidos'
      }, { status: 400 })
    }

    // Buscar configuração existente
    const existingConfig = await prisma.systemCustomization.findFirst({
      where: { 
        key: 'dashboard_config'
      }
    })

    // Se existir, atualiza, senão cria nova
    if (existingConfig) {
      await prisma.systemCustomization.update({
        where: { id: existingConfig.id },
        data: {
          value: data,
          updatedAt: new Date()
        }
      })
    } else {
      await prisma.systemCustomization.create({
        data: {
          key: 'dashboard_config',
          value: data,
          description: 'Configurações do dashboard do cliente',
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Configurações do dashboard atualizadas com sucesso'
    })
  } catch (error) {
    console.error('Erro ao salvar configurações do dashboard:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno ao salvar configurações'
    }, { status: 500 })
  }
}