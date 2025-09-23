import { PrismaClient } from '@prisma/client'
import { defaultCustomization } from '../src/lib/config/system-customization'

// Script para corrigir as configurações de personalização do sistema

async function main() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Verificando configurações de customização no banco de dados...')
    
    // Verificar se existe o registro system_config
    const existingConfig = await prisma.systemCustomization.findUnique({
      where: { key: 'system_config' }
    })
    
    if (!existingConfig) {
      console.log('⚠️ Registro de configuração não encontrado. Criando com valores padrão...')
      
      // Criar registro com configuração padrão
      await prisma.systemCustomization.create({
        data: {
          key: 'system_config',
          value: defaultCustomization as any,
          description: 'Configurações gerais do sistema',
          isActive: true,
          version: 1
        }
      })
      
      console.log('✅ Configurações padrão criadas com sucesso!')
    } else {
      console.log('🔄 Atualizando configurações existentes...')
      
      // Mesclar configurações existentes com padrão para garantir todos os campos
      const currentValue = existingConfig.value as any
      const updatedValue = {
        ...defaultCustomization,
        ...currentValue,
        // Garantir que landingPage tenha todos os campos necessários
        landingPage: {
          ...defaultCustomization.landingPage,
          ...(currentValue.landingPage || {})
        },
        // Garantir que contact e socialMedia tenham todos os campos
        contact: {
          ...defaultCustomization.contact,
          ...(currentValue.contact || {})
        },
        socialMedia: {
          ...defaultCustomization.socialMedia,
          ...(currentValue.socialMedia || {})
        }
      }
      
      // Atualizar registro
      await prisma.systemCustomization.update({
        where: { key: 'system_config' },
        data: {
          value: updatedValue as any,
          version: existingConfig.version + 1,
          updatedAt: new Date()
        }
      })
      
      console.log('✅ Configurações atualizadas com sucesso!')
    }
    
    // Verificar configuração atualizada
    const finalConfig = await prisma.systemCustomization.findUnique({
      where: { key: 'system_config' }
    })
    
    console.log('📊 Configuração atual:')
    console.log('- Versão:', finalConfig?.version)
    console.log('- Última atualização:', finalConfig?.updatedAt)
    
    const valueObj = finalConfig?.value as any
    console.log('- Contato definido:', valueObj?.contact?.phone ? '✅ Sim' : '❌ Não')
    console.log('- LandingPage definida:', valueObj?.landingPage?.hero?.title ? '✅ Sim' : '❌ Não')
    console.log('- Redes sociais definidas:', valueObj?.socialMedia?.whatsapp ? '✅ Sim' : '❌ Não')
    
  } catch (error) {
    console.error('❌ Erro ao verificar/atualizar configurações:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch(e => {
    console.error('❌ Erro na execução do script:', e)
    process.exit(1)
  })