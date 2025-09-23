import { NextRequest, NextResponse } from 'next/server'
import { defaultCustomization } from '@/lib/config/system-customization'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Chave usada para armazenar a configuração no banco de dados
const CONFIG_KEY = 'system_customization'

export async function GET() {
  try {
    let config = defaultCustomization

    // Buscar configuração do banco de dados
    try {
      const record = await prisma.systemCustomization.findUnique({
        where: { key: CONFIG_KEY }
      })
      
      if (record && record.value) {
        // Converter o valor do banco de dados para o tipo correto
        const dbValue = record.value as Record<string, unknown>
        config = { ...defaultCustomization, ...dbValue }
      }
    } catch (error) {
      console.error('Erro ao buscar configuração do banco de dados:', error)
    }

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

    try {
      // Verificar se já existe registro com a chave definida
      const existingRecord = await prisma.systemCustomization.findUnique({
        where: { key: CONFIG_KEY }
      })
      
      if (existingRecord) {
        // Atualizar registro existente
        await prisma.systemCustomization.update({
          where: { key: CONFIG_KEY },
          data: {
            value: body,
            updatedAt: new Date()
          }
        })
      } else {
        // Criar novo registro
        await prisma.systemCustomization.create({
          data: {
            key: CONFIG_KEY,
            value: body,
            description: 'Configurações padrão do sistema',
            isActive: true,
            version: 1
          }
        })
      }
      
      console.log('Configurações salvas com sucesso no banco de dados')
      
      return NextResponse.json({
        success: true,
        message: 'Configurações salvas com sucesso'
      })
    } catch (error) {
      console.error('Erro ao salvar configuração no banco de dados:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar no banco de dados' },
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
