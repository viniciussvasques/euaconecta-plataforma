// Teste de registro
require('dotenv').config()
const { prisma } = require('../src/lib/prisma')
const crypto = require('crypto')

async function testRegister() {
  try {
    console.log('Testando registro...')
    
    const name = 'Teste Usuario'
    const email = 'teste@exemplo.com'
    const password = '123456'
    
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('Email já existe, deletando...')
      await prisma.user.delete({ where: { email } })
    }
    
    // Criar usuário
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'CLIENT',
        suiteNumber: 9999,
        permissions: ['view_own_packages', 'view_own_consolidations', 'create_consolidations'],
        canManageUsers: false,
        canManageConsolidations: false,
        canManagePackages: false,
        canManageCarriers: false,
        canViewFinancials: false,
        canManageSettings: false,
        isActive: false
      }
    })
    
    console.log('✅ Usuário criado:', newUser.id)
    
    // Gerar token de ativação
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
    
    await prisma.user.update({
      where: { id: newUser.id },
      data: { activationToken: token, activationTokenExpires: expires }
    })
    
    console.log('✅ Token de ativação gerado:', token)
    console.log('Link de ativação:', `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/activate?token=${token}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister()
