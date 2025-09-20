const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixAdminSuite() {
  try {
    console.log('🔧 Corrigindo suite do admin...')

    // Buscar o admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@euaconecta.com' }
    })

    if (admin) {
      // Atualizar admin para remover suite
      const updatedAdmin = await prisma.user.update({
        where: { id: admin.id },
        data: {
          suiteNumber: null // Admin não deve ter suite
        }
      })

      console.log('✅ Admin corrigido:', {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        role: updatedAdmin.role,
        suiteNumber: updatedAdmin.suiteNumber
      })
    } else {
      console.log('❌ Admin não encontrado')
    }

  } catch (error) {
    console.error('❌ Erro ao corrigir admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAdminSuite()
