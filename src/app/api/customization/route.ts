import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

export async function GET() {
  try {
    const config = await configService.getSystemConfig()
    
    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Erro ao buscar configurações de personalização:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados básicos
    if (!body.brandIdentity?.companyName) {
      return NextResponse.json(
        { success: false, error: 'Nome da empresa é obrigatório' },
        { status: 400 }
      )
    }

    // Salvar configurações usando o serviço
    const success = await configService.saveSystemConfig(body)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Configurações salvas com sucesso'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar configurações' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Erro ao salvar configurações de personalização:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}