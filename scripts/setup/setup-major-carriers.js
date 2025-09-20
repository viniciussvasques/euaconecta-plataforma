const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupMajorCarriers() {
  try {
    console.log('🚀 Configurando transportadoras principais...')

    const majorCarriers = [
      {
        name: 'UPS',
        code: 'UPS',
        description: 'United Parcel Service - Serviços de entrega expressa e padrão',
        baseRate: 25.00,
        ratePerKg: 4.50,
        ratePerKm: 0.15,
        hasApi: true,
        apiKey: 'ups_api_key',
        apiSecret: 'ups_api_secret',
        apiUrl: 'https://api.ups.com',
        insuranceAvailable: true,
        insuranceRate: 0.5,
        minInsuranceValue: 100.00,
        maxInsuranceValue: 50000.00,
        estimatedDays: 3,
        isActive: false,
        priority: 90,
        services: [
          {
            name: 'UPS Ground',
            code: 'UPS_GROUND',
            baseRate: 25.00,
            ratePerKg: 4.50,
            estimatedDays: 5,
            isActive: true
          },
          {
            name: 'UPS 2nd Day Air',
            code: 'UPS_2ND_DAY',
            baseRate: 35.00,
            ratePerKg: 6.00,
            estimatedDays: 2,
            isActive: true
          },
          {
            name: 'UPS Next Day Air',
            code: 'UPS_NEXT_DAY',
            baseRate: 55.00,
            ratePerKg: 8.00,
            estimatedDays: 1,
            isActive: true
          }
        ]
      },
      {
        name: 'USPS',
        code: 'USPS',
        description: 'United States Postal Service - Serviços postais oficiais',
        baseRate: 15.00,
        ratePerKg: 3.00,
        ratePerKm: 0.10,
        hasApi: true,
        apiKey: 'usps_api_key',
        apiSecret: 'usps_api_secret',
        apiUrl: 'https://api.usps.com',
        insuranceAvailable: true,
        insuranceRate: 0.3,
        minInsuranceValue: 50.00,
        maxInsuranceValue: 5000.00,
        estimatedDays: 4,
        isActive: false,
        priority: 80,
        services: [
          {
            name: 'USPS Ground Advantage',
            code: 'USPS_GROUND',
            baseRate: 15.00,
            ratePerKg: 3.00,
            estimatedDays: 5,
            isActive: true
          },
          {
            name: 'USPS Priority Mail',
            code: 'USPS_PRIORITY',
            baseRate: 25.00,
            ratePerKg: 4.00,
            estimatedDays: 3,
            isActive: true
          },
          {
            name: 'USPS Priority Mail Express',
            code: 'USPS_EXPRESS',
            baseRate: 40.00,
            ratePerKg: 6.00,
            estimatedDays: 1,
            isActive: true
          }
        ]
      },
      {
        name: 'FedEx',
        code: 'FEDEX',
        description: 'Federal Express - Serviços de entrega expressa e padrão',
        baseRate: 30.00,
        ratePerKg: 5.00,
        ratePerKm: 0.20,
        hasApi: true,
        apiKey: 'fedex_api_key',
        apiSecret: 'fedex_api_secret',
        apiUrl: 'https://api.fedex.com',
        insuranceAvailable: true,
        insuranceRate: 0.4,
        minInsuranceValue: 100.00,
        maxInsuranceValue: 100000.00,
        estimatedDays: 3,
        isActive: false,
        priority: 85,
        services: [
          {
            name: 'FedEx Ground',
            code: 'FEDEX_GROUND',
            baseRate: 30.00,
            ratePerKg: 5.00,
            estimatedDays: 5,
            isActive: true
          },
          {
            name: 'FedEx 2Day',
            code: 'FEDEX_2DAY',
            baseRate: 45.00,
            ratePerKg: 7.00,
            estimatedDays: 2,
            isActive: true
          },
          {
            name: 'FedEx Standard Overnight',
            code: 'FEDEX_OVERNIGHT',
            baseRate: 65.00,
            ratePerKg: 9.00,
            estimatedDays: 1,
            isActive: true
          }
        ]
      },
      {
        name: 'DHL',
        code: 'DHL',
        description: 'DHL Express - Serviços internacionais e domésticos',
        baseRate: 35.00,
        ratePerKg: 6.00,
        ratePerKm: 0.25,
        hasApi: true,
        apiKey: 'dhl_api_key',
        apiSecret: 'dhl_api_secret',
        apiUrl: 'https://api.dhl.com',
        insuranceAvailable: true,
        insuranceRate: 0.6,
        minInsuranceValue: 100.00,
        maxInsuranceValue: 100000.00,
        estimatedDays: 2,
        isActive: false,
        priority: 95,
        services: [
          {
            name: 'DHL Express 12:00',
            code: 'DHL_EXPRESS_12',
            baseRate: 35.00,
            ratePerKg: 6.00,
            estimatedDays: 1,
            isActive: true
          },
          {
            name: 'DHL Express 10:30',
            code: 'DHL_EXPRESS_1030',
            baseRate: 45.00,
            ratePerKg: 8.00,
            estimatedDays: 1,
            isActive: true
          },
          {
            name: 'DHL Express 9:00',
            code: 'DHL_EXPRESS_9',
            baseRate: 55.00,
            ratePerKg: 10.00,
            estimatedDays: 1,
            isActive: true
          }
        ]
      },
      {
        name: 'Amazon Logistics',
        code: 'AMAZON',
        description: 'Amazon Logistics - Serviços de entrega da Amazon',
        baseRate: 20.00,
        ratePerKg: 3.50,
        ratePerKm: 0.12,
        hasApi: true,
        apiKey: 'amazon_api_key',
        apiSecret: 'amazon_api_secret',
        apiUrl: 'https://api.amazon.com',
        insuranceAvailable: true,
        insuranceRate: 0.2,
        minInsuranceValue: 50.00,
        maxInsuranceValue: 10000.00,
        estimatedDays: 3,
        isActive: false,
        priority: 70,
        services: [
          {
            name: 'Amazon Standard',
            code: 'AMAZON_STANDARD',
            baseRate: 20.00,
            ratePerKg: 3.50,
            estimatedDays: 4,
            isActive: true
          },
          {
            name: 'Amazon Prime',
            code: 'AMAZON_PRIME',
            baseRate: 30.00,
            ratePerKg: 5.00,
            estimatedDays: 2,
            isActive: true
          }
        ]
      }
    ]

    for (const carrierData of majorCarriers) {
      // Verificar se a transportadora já existe
      const existingCarrier = await prisma.carrier.findUnique({
        where: { code: carrierData.code }
      })

      if (existingCarrier) {
        console.log(`✅ ${carrierData.name} já existe`)
        continue
      }

      // Criar transportadora com serviços
      const { services, ...carrierInfo } = carrierData
      
      const carrier = await prisma.carrier.create({
        data: {
          ...carrierInfo,
          services: {
            create: services
          }
        }
      })

      console.log(`✅ ${carrierData.name} criada com sucesso`)
    }

    console.log('🎉 Todas as transportadoras principais foram configuradas!')
    console.log('\n📋 Transportadoras disponíveis:')
    console.log('- ABC (Ativa) - Correios Packet')
    console.log('- UPS (Inativa) - United Parcel Service')
    console.log('- USPS (Inativa) - United States Postal Service')
    console.log('- FedEx (Inativa) - Federal Express')
    console.log('- DHL (Inativa) - DHL Express')
    console.log('- Amazon (Inativa) - Amazon Logistics')
    console.log('\n💡 Acesse /admin/carriers para ativar/desativar transportadoras')

  } catch (error) {
    console.error('❌ Erro ao configurar transportadoras:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupMajorCarriers()
