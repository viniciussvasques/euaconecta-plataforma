const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupDefaultConfig() {
  try {
    console.log('🚀 Configurando sistema padrão...')

    // 1. Configurar transportadora ABC (se não existir)
    let abcCarrier = await prisma.carrier.findUnique({
      where: { code: 'ABC' }
    })

    if (!abcCarrier) {
      abcCarrier = await prisma.carrier.create({
        data: {
          name: 'ABC Transportadora',
          code: 'ABC',
          description: 'Transportadora ABC - Correios Packet Standard/Express',
          baseRate: 15.00,
          ratePerKg: 2.50,
          services: {
            create: [
              {
                name: 'Packet Standard',
                code: 'PACKET_STANDARD',
                baseRate: 15.00,
                ratePerKg: 2.50,
                estimatedDays: 5,
                isActive: true
              },
              {
                name: 'Packet Express',
                code: 'PACKET_EXPRESS', 
                baseRate: 25.00,
                ratePerKg: 3.50,
                estimatedDays: 3,
                isActive: true
              }
            ]
          }
        }
      })
      console.log('✅ Transportadora ABC criada')
    } else {
      console.log('✅ Transportadora ABC já existe')
    }

    // 2. Configurar taxas padrão do sistema
    // Verificar se já existe configuração
    let config = await prisma.platformConfig.findFirst()
    
    if (!config) {
      config = await prisma.platformConfig.create({
        data: {
          companyName: 'Euaconecta',
          addressLine1: '123 Main St',
          addressLine2: 'Suite 100',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          country: 'US',
          phone: '+1 (555) 123-4567',
          email: 'admin@euaconecta.com',
          taxRate: 0.0825,
          handlingFee: 0,
          storageFeePerDay: 0.50,
          maxStorageDays: 30,
          consolidationBaseFeeUsdCents: 600,
          consolidationPerPackageUsdCents: 100,
          repackMultiplier: 1.5,
          currency: 'USD',
          freightMarkupPercentage: 0.20,
          freightMarkupMinAmount: 200,
          freightMarkupMaxAmount: 5000,
          processingFeeUsdCents: 300,
          defaultCarrier: 'ABC',
          defaultService: 'PACKET_STANDARD',
          insuranceRequired: false,
          minInsuranceAmount: 0,
          stripeEnabled: false,
          paypalEnabled: false,
          autoInvoice: true,
          emailNotifications: true,
          smsNotifications: false,
          shipstationEnabled: false,
          s3Enabled: false,
          maxFileSize: 10485760,
          maxLoginAttempts: 5,
          sessionTimeout: 3600,
          require2FA: false,
          supportEmail: 'support@euaconecta.com',
          supportPhone: '+1 (555) 123-4567',
          businessHours: '9:00 AM - 6:00 PM EST',
          timezone: 'America/New_York'
        }
      })
      console.log('✅ Configurações padrão criadas')
    } else {
      console.log('✅ Configurações já existem')
    }

    // 3. Configurar dimensões de caixas ABC
    const boxSizes = [
      {
        length: 15,
        width: 10,
        height: 5,
        weight: 0.5,
        volume: 750,
        sizeCategory: 'SMALL'
      },
      {
        length: 25,
        width: 18,
        height: 10,
        weight: 1.0,
        volume: 4500,
        sizeCategory: 'SMALL'
      },
      {
        length: 30,
        width: 23,
        height: 15,
        weight: 2.0,
        volume: 10350,
        sizeCategory: 'MEDIUM'
      },
      {
        length: 38,
        width: 30,
        height: 20,
        weight: 5.0,
        volume: 22800,
        sizeCategory: 'MEDIUM'
      },
      {
        length: 46,
        width: 36,
        height: 25,
        weight: 10.0,
        volume: 41400,
        sizeCategory: 'LARGE'
      },
      {
        length: 61,
        width: 46,
        height: 30,
        weight: 20.0,
        volume: 84180,
        sizeCategory: 'LARGE'
      },
      {
        length: 76,
        width: 61,
        height: 36,
        weight: 30.0,
        volume: 166896,
        sizeCategory: 'LARGE'
      }
    ]

    // Verificar se já existem dimensões
    const existingDimensions = await prisma.packageDimensions.findMany()
    
    if (existingDimensions.length === 0) {
      await prisma.packageDimensions.createMany({
        data: boxSizes
      })
      console.log('✅ Dimensões de caixas ABC criadas')
    } else {
      console.log('✅ Dimensões de caixas já existem')
    }

    // 4. Configurar serviços de proteção
    const protectionServices = [
      {
        name: 'Bubble Wrap Extra',
        code: 'BUBBLE_WRAP',
        description: 'Proteção adicional com plástico bolha',
        protectionType: 'BUBBLE_WRAP',
        category: 'BASIC_PROTECTION',
        basePrice: 3.00,
        pricePerKg: 0,
        pricePerDimension: 0,
        isActive: true,
        priority: 1
      },
      {
        name: 'Dupla Caixa',
        code: 'DOUBLE_BOX',
        description: 'Caixa dupla para itens frágeis',
        protectionType: 'DOUBLE_BOX',
        category: 'PREMIUM_PROTECTION',
        basePrice: 5.00,
        pricePerKg: 0,
        pricePerDimension: 0,
        isActive: true,
        priority: 2
      }
    ]

    // Verificar se já existem serviços de proteção
    const existingProtection = await prisma.protectionService.findMany()
    
    if (existingProtection.length === 0) {
      await prisma.protectionService.createMany({
        data: protectionServices
      })
      console.log('✅ Serviços de proteção criados')
    } else {
      console.log('✅ Serviços de proteção já existem')
    }

    console.log('🎉 Configuração padrão concluída com sucesso!')
    console.log('📋 Resumo:')
    console.log('   - Transportadora ABC configurada')
    console.log('   - Taxas padrão definidas')
    console.log('   - Dimensões de caixas criadas')
    console.log('   - Serviços de proteção configurados')

  } catch (error) {
    console.error('❌ Erro ao configurar sistema:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDefaultConfig()
