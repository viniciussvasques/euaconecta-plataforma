import { prisma } from '../src/lib/database/prisma'
import { defaultCustomization } from '../src/lib/config/system-customization'

const CONFIG_KEY = 'system_customization'

async function migrateCustomization() {
  try {
    console.log('Iniciando migração da configuração...')

    // Verificar se já existe registro com a chave CONFIG_KEY
    const existingRecord = await prisma.systemCustomization.findUnique({
      where: { key: CONFIG_KEY }
    })
    
    if (existingRecord) {
      console.log(`Registro com chave ${CONFIG_KEY} já existe. Atualizando...`)
      await prisma.systemCustomization.update({
        where: { key: CONFIG_KEY },
        data: {
          value: defaultCustomization as any,
          updatedAt: new Date()
        }
      })
      console.log(`Registro com chave ${CONFIG_KEY} atualizado com sucesso.`)
    } else {
      console.log(`Criando novo registro com chave ${CONFIG_KEY}...`)
      await prisma.systemCustomization.create({
        data: {
          key: CONFIG_KEY,
          value: defaultCustomization as any,
          description: 'Configurações padrão do sistema',
          isActive: true,
          version: 1
        }
      })
      console.log(`Novo registro com chave ${CONFIG_KEY} criado com sucesso.`)
    }

    // Confirmar dados salvos
    const savedRecord = await prisma.systemCustomization.findUnique({
      where: { key: CONFIG_KEY }
    })
    
    console.log(`Configuração salva:`, savedRecord ? 'Encontrada' : 'Não encontrada')
    
  } catch (error) {
    console.error('Erro durante a migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateCustomization()