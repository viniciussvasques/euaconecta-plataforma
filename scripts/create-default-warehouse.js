const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createDefaultWarehouse() {
  try {
    // Verificar se já existe um armazém padrão
    const existingDefault = await prisma.warehouseAddress.findFirst({
      where: { isDefault: true }
    })

    if (existingDefault) {
      console.log('✅ Já existe um armazém padrão configurado:', existingDefault.name)
      return
    }

    // Criar armazém padrão
    const warehouse = await prisma.warehouseAddress.create({
      data: {
        name: 'Warehouse FL',
        line1: '1234 Main Street',
        line2: 'Suite 100',
        city: 'Miami',
        state: 'FL',
        postalCode: '33101',
        country: 'US',
        isDefault: true,
        instructions: 'Sempre use sua suíte para identificação dos pacotes. Este é o endereço padrão para todos os clientes.'
      }
    })

    console.log('✅ Armazém padrão criado com sucesso:')
    console.log(`   Nome: ${warehouse.name}`)
    console.log(`   Endereço: ${warehouse.line1}, ${warehouse.line2}`)
    console.log(`   Cidade: ${warehouse.city}, ${warehouse.state} ${warehouse.postalCode}`)
    console.log(`   País: ${warehouse.country}`)
    console.log(`   Padrão: ${warehouse.isDefault ? 'Sim' : 'Não'}`)
    
  } catch (error) {
    console.error('❌ Erro ao criar armazém padrão:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultWarehouse()
