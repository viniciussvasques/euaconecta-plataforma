const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function activateAdmin() {
  console.log('🔓 Ativando conta do administrador...')
  
  try {
    const admin = await prisma.user.update({
      where: { email: 'admin@euaconecta.com' },
      data: { 
        isActive: true,
        activationToken: null,
        activationTokenExpires: null
      }
    })
    
    console.log('✅ Conta do admin ativada:', admin.email)
    console.log('🔑 Login: admin@euaconecta.com')
    console.log('🔑 Senha: admin123')
  } catch (error) {
    console.error('❌ Erro ao ativar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

activateAdmin()
