import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Recuperar a configuração salva ou usar um padrão
    let record = await prisma.systemCustomization.findUnique({ where: { key: 'analytics_config' } })
    
    // Configuração padrão se não existir
    const defaultValue = {
      enabled: true,
      googleAnalyticsId: "",
      hotjarId: "",
      facebookPixelId: "",
      linkedinTagId: "",
      customScripts: []
    }

    if (!record) {
      record = await prisma.systemCustomization.create({ data: { key: 'analytics_config', value: defaultValue, description: 'Analytics settings' } })
    }

    return NextResponse.json({ success: true, data: record.value })
  } catch (error) {
    console.error("Erro ao recuperar configurações de analytics:", error)
    return NextResponse.json({ success: false, error: "Erro ao recuperar configurações de analytics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validar os dados (simplificado)
    if (typeof data !== 'object') {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no banco
    const saved = await prisma.systemCustomization.upsert({
      where: { key: 'analytics_config' },
      update: { value: data },
      create: { 
        key: 'analytics_config', 
        value: data,
        description: 'Analytics settings'
      }
    })

    return NextResponse.json({ success: true, data: saved.value })
  } catch (error) {
    console.error("Erro ao salvar configurações de analytics:", error)
    return NextResponse.json({ success: false, error: "Erro ao salvar configurações" }, { status: 500 })
  }
}
