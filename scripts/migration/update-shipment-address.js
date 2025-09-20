const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateShipmentAddress() {
  try {
    console.log('🔍 Buscando envio para atualizar...')

    // Buscar o envio
    const shipment = await prisma.shipment.findUnique({
      where: { id: 'cmfjrj09r0001omagtso77m8f' },
      include: {
        user: true
      }
    })

    if (!shipment) {
      console.log('❌ Envio não encontrado')
      return
    }

    console.log('📦 Envio encontrado:', shipment.id)
    console.log('👤 Usuário:', shipment.user.name)

    // Buscar endereço padrão do usuário
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: shipment.userId,
        isDefault: true
      }
    })

    if (!defaultAddress) {
      console.log('❌ Endereço padrão não encontrado para o usuário')
      return
    }

    console.log('📍 Endereço padrão encontrado:')
    console.log(`   Nome: ${defaultAddress.name}`)
    console.log(`   Endereço: ${defaultAddress.line1}`)
    console.log(`   Cidade: ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.postalCode}`)

    // Atualizar o envio com o endereço correto
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        toName: defaultAddress.name,
        toLine1: defaultAddress.line1,
        toLine2: defaultAddress.line2 || '',
        toCity: defaultAddress.city,
        toState: defaultAddress.state,
        toPostalCode: defaultAddress.postalCode,
        toCountry: defaultAddress.country
      }
    })

    console.log('✅ Envio atualizado com sucesso!')
    console.log('📍 Novo endereço no envio:')
    console.log(`   Nome: ${updatedShipment.toName}`)
    console.log(`   Endereço: ${updatedShipment.toLine1}`)
    console.log(`   Cidade: ${updatedShipment.toCity}, ${updatedShipment.toState} ${updatedShipment.toPostalCode}`)
    
  } catch (error) {
    console.error('❌ Erro ao atualizar envio:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateShipmentAddress()
