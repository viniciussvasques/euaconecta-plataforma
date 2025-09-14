const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUserAddress() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'viniciusvasqueslog@gmail.com' },
      include: {
        addresses: {
          where: { isDefault: true }
        }
      }
    })
    
    console.log('👤 Usuário:', user.name)
    console.log('📧 Email:', user.email)
    console.log('🏠 Endereços padrão:', user.addresses.length)
    
    if (user.addresses.length > 0) {
      const address = user.addresses[0]
      console.log('📍 Endereço padrão:')
      console.log(`   Nome: ${address.name}`)
      console.log(`   Endereço: ${address.line1}`)
      console.log(`   Cidade: ${address.city}, ${address.state} ${address.postalCode}`)
      console.log(`   País: ${address.country}`)
      console.log(`   Padrão: ${address.isDefault}`)
    } else {
      console.log('❌ Nenhum endereço padrão encontrado')
    }
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserAddress()
