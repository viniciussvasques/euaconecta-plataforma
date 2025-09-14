const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createUsers() {
  try {
    console.log('🚀 Criando usuários...')

    // Verificar se admin já existe
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@euaconecta.com' }
    })

    if (!admin) {
      // Criar usuário ADMIN
      const adminPassword = await bcrypt.hash('admin123', 12)
      admin = await prisma.user.create({
        data: {
          email: 'admin@euaconecta.com',
          name: 'Administrador',
          password: adminPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
          suiteNumber: null, // Admin não tem suite
          permissions: ['*'], // Todas as permissões
          canManageUsers: true,
          canManageConsolidations: true,
          canManagePackages: true,
          canManageCarriers: true,
          canViewFinancials: true,
          canManageSettings: true
        }
      })
      console.log('✅ Admin criado:', {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      })
    } else {
      console.log('ℹ️ Admin já existe:', {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      })
    }

    // Verificar se cliente já existe
    let client = await prisma.user.findUnique({
      where: { email: 'cliente@teste.com' }
    })

    if (!client) {
      // Criar usuário CLIENTE
      const clientPassword = await bcrypt.hash('cliente123', 12)
      client = await prisma.user.create({
        data: {
          email: 'cliente@teste.com',
          name: 'João Silva',
          password: clientPassword,
          role: 'CLIENT',
          isActive: true,
          suiteNumber: 2351, // Segunda suite
          permissions: [],
          canManageUsers: false,
          canManageConsolidations: false,
          canManagePackages: false,
          canManageCarriers: false,
          canViewFinancials: false,
          canManageSettings: false
        }
      })
      console.log('✅ Cliente criado:', {
        id: client.id,
        email: client.email,
        name: client.name,
        role: client.role,
        suiteNumber: client.suiteNumber
      })
    } else {
      console.log('ℹ️ Cliente já existe:', {
        id: client.id,
        email: client.email,
        name: client.name,
        role: client.role,
        suiteNumber: client.suiteNumber
      })
    }

    // Criar endereço para o cliente
    const address = await prisma.address.create({
      data: {
        userId: client.id,
        name: 'Casa',
        line1: 'Rua das Flores, 123',
        line2: 'Apto 45',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
        country: 'BR',
        isDefault: true
      }
    })

    console.log('✅ Endereço criado para o cliente:', {
      id: address.id,
      city: address.city,
      state: address.state
    })

    // Criar alguns pacotes de exemplo para o cliente
    const packages = await Promise.all([
      prisma.package.create({
        data: {
          ownerId: client.id,
          description: 'iPhone 15 Pro Max',
          store: 'Apple Store',
          orderNumber: 'APL-001',
          purchasePrice: 1299.99,
          weightGrams: 240,
          status: 'RECEIVED',
          packageCondition: 'Excelente',
          notes: 'Produto novo, sem avarias'
        }
      }),
      prisma.package.create({
        data: {
          ownerId: client.id,
          description: 'Nike Air Max 270',
          store: 'Nike',
          orderNumber: 'NKE-002',
          purchasePrice: 150.00,
          weightGrams: 800,
          status: 'RECEIVED',
          packageCondition: 'Bom',
          notes: 'Tênis em perfeito estado'
        }
      }),
      prisma.package.create({
        data: {
          ownerId: client.id,
          description: 'Livro: Clean Code',
          store: 'Amazon',
          orderNumber: 'AMZ-003',
          purchasePrice: 45.99,
          weightGrams: 600,
          status: 'RECEIVED',
          packageCondition: 'Excelente',
          notes: 'Livro técnico para programação'
        }
      })
    ])

    console.log('✅ Pacotes criados:', packages.length, 'pacotes')

    // Criar uma caixa de consolidação
    const consolidation = await prisma.consolidationGroup.create({
      data: {
        userId: client.id,
        name: 'Caixa Eletrônicos',
        notes: 'Consolidação de produtos eletrônicos',
        boxSize: 'M',
        consolidationType: 'SIMPLE',
        status: 'OPEN',
        currentWeightGrams: 1040, // Soma dos pacotes
        maxItemsAllowed: 20,
        consolidationFee: 6.00,
        storageFee: 0.50,
        packages: {
          connect: packages.map(pkg => ({ id: pkg.id }))
        }
      }
    })

    console.log('✅ Caixa de consolidação criada:', {
      id: consolidation.id,
      name: consolidation.name,
      status: consolidation.status,
      packages: packages.length
    })

    console.log('\n🎉 Usuários criados com sucesso!')
    console.log('\n📋 CREDENCIAIS:')
    console.log('👨‍💼 ADMIN:')
    console.log('   Email: admin@euaconecta.com')
    console.log('   Senha: admin123')
    console.log('   Acesso: http://localhost:3000/admin')
    console.log('   Suite: N/A (Admin não tem suite)')
    console.log('\n👤 CLIENTE:')
    console.log('   Email: cliente@teste.com')
    console.log('   Senha: cliente123')
    console.log('   Acesso: http://localhost:3000/dashboard')
    console.log('   Suite: 2351')

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUsers()
