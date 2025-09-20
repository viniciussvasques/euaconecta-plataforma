import { PrismaClient } from '@prisma/client'
// import { UserRole } from '@prisma/client' // Temporarily commented due to Prisma client generation issues
import bcrypt from 'bcryptjs'

// Temporary enum definition until Prisma client is regenerated
const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  MANAGER: 'MANAGER',
  CLIENT: 'CLIENT',
  SUPPORT: 'SUPPORT'
} as const

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.supportMessage.deleteMany()
  await prisma.supportTicket.deleteMany()
  await prisma.paymentMethod.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.shipment.deleteMany()
  await prisma.consolidationGroup.deleteMany()
  await prisma.package.deleteMany()
  await prisma.packageDimensions.deleteMany()
  await prisma.protectionService.deleteMany()
  await prisma.storagePolicy.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.platformConfig.deleteMany()

  console.log('🧹 Dados anteriores limpos')

  // Criar configuração da plataforma
  const platformConfig = await prisma.platformConfig.create({
    data: {
      companyName: 'Euaconecta LTDA',
      addressLine1: '123 Main Street',
      addressLine2: 'Suite #100',
      city: 'Orlando',
      state: 'FL',
      postalCode: '32801',
      country: 'US',
      phone: '+1-555-123-4567',
      email: 'admin@euaconecta.com',
      
      // Configurações de negócio
      taxRate: 0.0825, // 8.25%
      handlingFee: 5.00,
      storageFeePerDay: 0.50,
      maxStorageDays: 30,
      
      // Consolidação (dinâmico)
      consolidationBaseFeeUsdCents: 500,      // $5.00 base
      consolidationPerPackageUsdCents: 100,   // $1.00 por pacote
      repackMultiplier: 1.5,                  // 50% mais para repack
      currency: "USD",                        // Dólar americano
      
      // Markup sobre frete (monetização)
      freightMarkupPercentage: 0.20,          // 20% sobre frete da transportadora
      freightMarkupMinAmount: 200,            // $2.00 mínimo
      freightMarkupMaxAmount: 5000,           // $50.00 máximo
      processingFeeUsdCents: 300,             // $3.00 taxa de processamento
      
      // Configurações de envio
      defaultCarrier: 'USPS',
      defaultService: 'Priority',
      insuranceRequired: false,
      minInsuranceAmount: 100.00,
      
      // Configurações de pagamento
      stripeEnabled: false,
      paypalEnabled: false,
      autoInvoice: true,
      
      // Configurações de notificação
      emailNotifications: true,
      smsNotifications: false,
      
      // Configurações de integração
      shipstationEnabled: false,
      
      // Configurações de upload
      s3Enabled: false,
      maxFileSize: 10485760, // 10MB
      
      // Configurações de segurança
      maxLoginAttempts: 5,
      sessionTimeout: 3600,
      require2FA: false,
      
      // Configurações de suporte
      supportEmail: 'suporte@euaconecta.com',
      supportPhone: '+1-555-123-4567',
      businessHours: 'Segunda a Sexta, 9h às 18h',
      timezone: 'America/New_York',
    },
  })

  console.log('⚙️ Configuração da plataforma criada:', platformConfig.id)

  // Criar usuário administrador padrão
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@euaconecta.com',
      name: 'Administrador',
      password: adminPassword,
      role: UserRole.ADMIN,
      permissions: ['*'],
      canManageUsers: true,
      canManageConsolidations: true,
      canManagePackages: true,
      canManageCarriers: true,
      canViewFinancials: true,
      canManageSettings: true
    }
  })

  console.log('✅ Usuário administrador criado:', adminUser.email)

  // Criar usuário operador
  const operatorPassword = await bcrypt.hash('operator123', 12)
  
  const operatorUser = await prisma.user.create({
    data: {
      email: 'operator@euaconecta.com',
      name: 'Operador',
      password: operatorPassword,
      role: UserRole.ADMIN,
      permissions: ['manage_consolidations', 'manage_packages', 'view_packages'],
      canManageUsers: false,
      canManageConsolidations: true,
      canManagePackages: true,
      canManageCarriers: false,
      canViewFinancials: false,
      canManageSettings: false
    }
  })

  console.log('✅ Usuário operador criado:', operatorUser.email)

  // Criar usuário cliente de exemplo
  const clientPassword = await bcrypt.hash('client123', 12)
  
  const clientUser = await prisma.user.create({
    data: {
      email: 'cliente@exemplo.com',
      name: 'João Silva',
      password: clientPassword,
      role: UserRole.CLIENT,
      suiteNumber: 2350, // Primeira suite
      permissions: ['view_own_packages', 'view_own_consolidations', 'create_consolidations'],
      canManageUsers: false,
      canManageConsolidations: false,
      canManagePackages: false,
      canManageCarriers: false,
      canViewFinancials: false,
      canManageSettings: false,
      addresses: {
        create: {
          name: 'Endereço Principal',
          line1: '456 Oak Avenue',
          line2: 'Apt 2B',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          country: 'US',
        },
      },
    },
  })

  console.log('✅ Usuário cliente criado:', clientUser.email)

  // Criar mais clientes de exemplo
  const client2Password = await bcrypt.hash('client123', 12)
  const client2User = await prisma.user.create({
    data: {
      email: 'maria@exemplo.com',
      name: 'Maria Santos',
      password: client2Password,
      role: UserRole.CLIENT,
      suiteNumber: 2351, // Segunda suite
      permissions: ['view_own_packages', 'view_own_consolidations', 'create_consolidations'],
      canManageUsers: false,
      canManageConsolidations: false,
      canManagePackages: false,
      canManageCarriers: false,
      canViewFinancials: false,
      canManageSettings: false,
    }
  })

  const client3Password = await bcrypt.hash('client123', 12)
  const client3User = await prisma.user.create({
    data: {
      email: 'pedro@exemplo.com',
      name: 'Pedro Costa',
      password: client3Password,
      role: UserRole.CLIENT,
      suiteNumber: 2352, // Terceira suite
      permissions: ['view_own_packages', 'view_own_consolidations', 'create_consolidations'],
      canManageUsers: false,
      canManageConsolidations: false,
      canManagePackages: false,
      canManageCarriers: false,
      canViewFinancials: false,
      canManageSettings: false,
    }
  })

  console.log('✅ Clientes adicionais criados:', client2User.email, client3User.email)

  // Criar política de armazenamento padrão
  const storagePolicy = await prisma.storagePolicy.create({
    data: {
      freeDays: 30,
      dailyRateSmall: 0.50,    // $0.50 por dia para caixas pequenas
      dailyRateMedium: 1.00,   // $1.00 por dia para caixas médias
      dailyRateLarge: 2.00,    // $2.00 por dia para caixas grandes
      dailyRatePerItem: 0.25,  // $0.25 adicional por item
      weekendCharges: false,
      holidayCharges: false,
      warningDays: 7,
      flatDailyRateUsdCents: 100, // $1.00 por dia após período grátis
      maxDaysAllowed: 90,         // máximo de 90 dias
    },
  })

  console.log('📦 Política de armazenamento criada:', storagePolicy.id)

  // Criar serviços de proteção
  const bubbleWrap = await prisma.protectionService.create({
    data: {
      name: 'Bubble Wrap Extra',
      code: 'BUBBLE_WRAP',
      description: 'Proteção adicional com plástico-bolha',
      protectionType: 'BUBBLE_WRAP',
      category: 'BASIC_PROTECTION',
      basePrice: 2.50,
      pricePerKg: 0.50,
      pricePerDimension: 0.10,
      priority: 1,
    },
  })

  const doubleBox = await prisma.protectionService.create({
    data: {
      name: 'Dupla Caixa',
      code: 'DOUBLE_BOX',
      description: 'Caixa externa adicional para proteção extra',
      protectionType: 'DOUBLE_BOX',
      category: 'PREMIUM_PROTECTION',
      basePrice: 5.00,
      pricePerKg: 1.00,
      pricePerDimension: 0.20,
      priority: 2,
    },
  })

  const securityTape = await prisma.protectionService.create({
    data: {
      name: 'Fita de Segurança',
      code: 'SECURITY_TAPE',
      description: 'Fita reforçada para fechamento seguro',
      protectionType: 'SECURITY_TAPE',
      category: 'BASIC_PROTECTION',
      basePrice: 1.50,
      pricePerKg: 0.25,
      pricePerDimension: 0.05,
      priority: 3,
    },
  })

  console.log('🛡️ Serviços de proteção criados:')
  console.log(`  - ${bubbleWrap.name} (${bubbleWrap.id})`)
  console.log(`  - ${doubleBox.name} (${doubleBox.id})`)
  console.log(`  - ${securityTape.name} (${securityTape.id})`)

  // Criar pacotes de exemplo
  const package1 = await prisma.package.create({
    data: {
      ownerId: clientUser.id,
      carrier: 'UPS',
      trackingIn: '1Z999AA1234567890',
      description: 'Livro técnico sobre desenvolvimento web',
      declaredValue: 45.99,
      weightGrams: 500,
      lengthCm: 20,
      widthCm: 15,
      heightCm: 3,
      status: 'RECEIVED',
      notes: 'Pacote em bom estado',
      // Novos campos de compra
      purchaseDate: new Date('2024-01-10'),
      expectedDeliveryDate: new Date('2024-01-20'),
      store: 'Amazon',
      orderNumber: 'AMZ-123456',
      purchasePrice: 45.99,
      packageCondition: 'Excelente',
      // Rastreamento de peso
      weighedAt: new Date('2024-01-15'),
      weighedBy: operatorUser.id,
      weightNotes: 'Peso confirmado na chegada'
    },
  })

  const package2 = await prisma.package.create({
    data: {
      ownerId: clientUser.id,
      carrier: 'FedEx',
      trackingIn: '794123456789',
      description: 'Smartphone Samsung Galaxy S23',
      declaredValue: 2999.99,
      weightGrams: 168,
      lengthCm: 15,
      widthCm: 8,
      heightCm: 2,
      status: 'READY_TO_SHIP',
      notes: 'Fragil - Manusear com cuidado',
      // Novos campos de compra
      purchaseDate: new Date('2024-01-12'),
      expectedDeliveryDate: new Date('2024-01-18'),
      store: 'eBay',
      orderNumber: 'EBAY-789012',
      purchasePrice: 2999.99,
      packageCondition: 'Excelente',
      // Rastreamento de peso
      weighedAt: new Date('2024-01-16'),
      weighedBy: operatorUser.id,
      weightNotes: 'Peso confirmado - item frágil'
    },
  })

  const package3 = await prisma.package.create({
    data: {
      ownerId: clientUser.id,
      carrier: 'USPS',
      trackingIn: '9400100000000000000000',
      description: 'Fone de ouvido Bluetooth Sony WH-1000XM4',
      declaredValue: 899.99,
      weightGrams: 254,
      lengthCm: 18,
      widthCm: 12,
      heightCm: 8,
      status: 'RECEIVED',
      notes: 'Caixa original',
      // Novos campos de compra
      purchaseDate: new Date('2024-01-08'),
      expectedDeliveryDate: new Date('2024-01-15'),
      store: 'Amazon',
      orderNumber: 'AMZ-654321',
      purchasePrice: 899.99,
      packageCondition: 'Excelente',
      // Rastreamento de peso
      weighedAt: new Date('2024-01-14'),
      weighedBy: operatorUser.id,
      weightNotes: 'Peso confirmado - embalagem original'
    },
  })

  console.log('📦 Pacotes de exemplo criados:', {
    package1: package1.id,
    package2: package2.id,
    package3: package3.id,
  })

  // Criar envio de exemplo
  const shipment = await prisma.shipment.create({
    data: {
      userId: clientUser.id,
      status: 'DRAFT',
      outboundCarrier: 'USPS',
      outboundService: 'Priority',
      totalWeightGrams: 1300,
      insuranceUsd: 200.00,
      toName: 'Maria Santos',
      toLine1: '789 Pine Street',
      toLine2: 'Apt 5C',
      toCity: 'São Paulo',
      toState: 'SP',
      toPostalCode: '01234-567',
      toCountry: 'BR',
      toPhone: '+55-11-98765-4321',
      toEmail: 'maria@exemplo.com',
    },
  })

  console.log('🚢 Envio de exemplo criado:', shipment.id)

  // Criar consolidação de exemplo (caixa aberta)
  const consolidation = await prisma.consolidationGroup.create({
    data: {
      userId: clientUser.id,
      consolidationType: 'SIMPLE',
      status: 'OPEN', // Começa aberta
      consolidationFee: 8.00, // $5.00 base + $1.00 x 3 pacotes
      storageFee: 15.00, // $0.50 x 3 pacotes x 10 dias
      extraProtection: ['BUBBLE_WRAP', 'SECURITY_TAPE'],
      removeInvoice: true,
      customInstructions: 'Manusear com cuidado - itens frágeis',
      currentWeightGrams: 922, // 500 + 168 + 254
      maxItemsAllowed: 20,
      storageDaysAllowed: 30,
      storageDaysUsed: 10,
      openedAt: new Date('2024-01-15'),
      consolidationDeadline: new Date('2024-01-25'),
      shippingDeadline: new Date('2024-01-30')
    }
  })

  console.log('📦 Consolidação de exemplo criada:', consolidation.id)

  // Criar ticket de suporte de exemplo
  const supportTicket = await prisma.supportTicket.create({
    data: {
      userId: clientUser.id,
      title: 'Dúvida sobre prazo de entrega',
      description: 'Gostaria de saber qual o prazo estimado para entrega do meu pacote.',
      status: 'OPEN',
      priority: 'MEDIUM',
      category: 'SHIPPING',
    },
  })

  console.log('🎫 Ticket de suporte criado:', supportTicket.id)

  console.log('✅ Seed concluído com sucesso!')
  console.log('')
  console.log('🔑 Credenciais de acesso:')
  console.log('Admin: admin@euaconecta.com / admin123')
  console.log('Operador: operator@euaconecta.com / operator123')
  console.log('Cliente: cliente@exemplo.com / client123')
  console.log('')
  console.log('📊 Dados criados:')
  console.log('- 1 configuração da plataforma')
  console.log('- 3 usuários (admin, operador, cliente)')
  console.log('- 1 política de armazenamento')
  console.log('- 3 serviços de proteção')
  console.log('- 3 pacotes de exemplo com rastreamento de peso')
  console.log('- 1 envio de exemplo')
  console.log('- 1 consolidação de exemplo (caixa aberta)')
  console.log('- 1 ticket de suporte')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
