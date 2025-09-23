import { NextResponse } from 'next/server'
import { withDb } from '@/lib/database/prisma-client'
import { withDatabaseConnection } from '@/lib/database/middleware'
import { defaultCustomization } from '@/lib/config/system-customization'

export const GET = withDatabaseConnection(async () => {
  return withDb(async (prisma) => {
    try {
      // Buscar customização do banco de dados (tenta system_config primeiro)
      const record = await prisma.systemCustomization.findUnique({
        where: { key: 'system_config' }
      })
      
      // Buscar também a configuração alternativa (system_customization)
      const altRecord = !record ? await prisma.systemCustomization.findUnique({
        where: { key: 'system_customization' }
      }) : null
      
      // Obter todas as chaves de configuração disponíveis
      const allKeys = await prisma.systemCustomization.findMany({
        select: { key: true }
      })
      
      return NextResponse.json({
        success: true,
        default: defaultCustomization,
        config: record ? record.value : (altRecord ? altRecord.value : null),
        found: !!(record || altRecord),
        lastUpdated: record?.updatedAt || altRecord?.updatedAt,
        availableKeys: allKeys.map((k: { key: string }) => k.key)
      })
    } catch (error) {
      console.error('Erro ao verificar configurações:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao buscar configurações',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }, { status: 500 })
    }
  })
})