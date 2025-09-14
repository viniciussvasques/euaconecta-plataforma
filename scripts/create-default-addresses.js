const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createDefaultAddresses() {
  try {
    console.log('🔍 Verificando usuários sem endereço padrão...')

    // Buscar todos os usuários
    const users = await prisma.user.findMany({
      where: {
        role: 'CLIENT'
      }
    })

    console.log(`📊 Encontrados ${users.length} usuários clientes`)

    for (const user of users) {
      // Verificar se o usuário tem endereço padrão
      const defaultAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          isDefault: true
        }
      })

      if (!defaultAddress) {
        console.log(`⚠️  Usuário ${user.name} (${user.email}) não tem endereço padrão`)
        
        // Criar endereço padrão
        const address = await prisma.address.create({
          data: {
            userId: user.id,
            name: 'Endereço Principal',
            line1: 'Endereço não informado',
            line2: '',
            city: 'Cidade',
            state: 'Estado',
            postalCode: '00000-000',
            country: 'BR',
            isDefault: true
          }
        })

        console.log(`✅ Endereço padrão criado para ${user.name}: ${address.id}`)
      } else {
        console.log(`✅ Usuário ${user.name} já tem endereço padrão`)
      }
    }

    console.log('🎉 Verificação concluída!')
    
  } catch (error) {
    console.error('❌ Erro ao verificar/criar endereços:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultAddresses()
