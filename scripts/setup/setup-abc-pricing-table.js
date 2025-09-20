const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

// Tabela de preços ABC Packet Standard
const abcStandardPricing = [
  { minWeight: 500, maxWeight: 500, price: 12.78 },
  { minWeight: 1000, maxWeight: 1000, price: 15.32 },
  { minWeight: 1500, maxWeight: 1500, price: 17.86 },
  { minWeight: 2000, maxWeight: 2000, price: 20.40 },
  { minWeight: 2500, maxWeight: 2500, price: 22.94 },
  { minWeight: 3000, maxWeight: 3000, price: 25.48 },
  { minWeight: 4000, maxWeight: 4000, price: 30.56 },
  { minWeight: 5000, maxWeight: 5000, price: 35.64 },
  { minWeight: 6000, maxWeight: 6000, price: 40.72 },
  { minWeight: 7000, maxWeight: 7000, price: 45.80 },
  { minWeight: 8000, maxWeight: 8000, price: 50.88 },
  { minWeight: 9000, maxWeight: 9000, price: 55.96 },
  { minWeight: 10000, maxWeight: 10000, price: 61.04 },
  { minWeight: 11000, maxWeight: 11000, price: 66.12 },
  { minWeight: 12000, maxWeight: 12000, price: 71.20 },
  { minWeight: 13000, maxWeight: 13000, price: 76.28 },
  { minWeight: 14000, maxWeight: 14000, price: 81.36 },
  { minWeight: 15000, maxWeight: 15000, price: 86.44 },
  { minWeight: 16000, maxWeight: 16000, price: 91.52 },
  { minWeight: 17000, maxWeight: 17000, price: 96.60 },
  { minWeight: 18000, maxWeight: 18000, price: 101.68 },
  { minWeight: 19000, maxWeight: 19000, price: 106.76 },
  { minWeight: 20000, maxWeight: 20000, price: 111.84 },
  { minWeight: 21000, maxWeight: 21000, price: 116.92 },
  { minWeight: 22000, maxWeight: 22000, price: 122.00 },
  { minWeight: 23000, maxWeight: 23000, price: 127.08 },
  { minWeight: 24000, maxWeight: 24000, price: 132.16 },
  { minWeight: 25000, maxWeight: 25000, price: 137.24 },
  { minWeight: 26000, maxWeight: 26000, price: 142.32 },
  { minWeight: 27000, maxWeight: 27000, price: 147.40 },
  { minWeight: 28000, maxWeight: 28000, price: 152.48 },
  { minWeight: 29000, maxWeight: 29000, price: 157.56 },
  { minWeight: 30000, maxWeight: 30000, price: 162.64 }
]

// Tabela de preços ABC Packet Express
const abcExpressPricing = [
  { minWeight: 500, maxWeight: 500, price: 14.05 },
  { minWeight: 1000, maxWeight: 1000, price: 16.85 },
  { minWeight: 1500, maxWeight: 1500, price: 19.65 },
  { minWeight: 2000, maxWeight: 2000, price: 22.45 },
  { minWeight: 2500, maxWeight: 2500, price: 25.25 },
  { minWeight: 3000, maxWeight: 3000, price: 28.05 },
  { minWeight: 4000, maxWeight: 4000, price: 33.65 },
  { minWeight: 5000, maxWeight: 5000, price: 39.25 },
  { minWeight: 6000, maxWeight: 6000, price: 44.85 },
  { minWeight: 7000, maxWeight: 7000, price: 50.45 },
  { minWeight: 8000, maxWeight: 8000, price: 56.05 },
  { minWeight: 9000, maxWeight: 9000, price: 61.65 },
  { minWeight: 10000, maxWeight: 10000, price: 67.25 },
  { minWeight: 11000, maxWeight: 11000, price: 72.85 },
  { minWeight: 12000, maxWeight: 12000, price: 78.45 },
  { minWeight: 13000, maxWeight: 13000, price: 84.05 },
  { minWeight: 14000, maxWeight: 14000, price: 89.65 },
  { minWeight: 15000, maxWeight: 15000, price: 95.25 },
  { minWeight: 16000, maxWeight: 16000, price: 100.85 },
  { minWeight: 17000, maxWeight: 17000, price: 106.45 },
  { minWeight: 18000, maxWeight: 18000, price: 112.05 },
  { minWeight: 19000, maxWeight: 19000, price: 117.65 },
  { minWeight: 20000, maxWeight: 20000, price: 123.25 },
  { minWeight: 21000, maxWeight: 21000, price: 128.85 },
  { minWeight: 22000, maxWeight: 22000, price: 134.45 },
  { minWeight: 23000, maxWeight: 23000, price: 140.05 },
  { minWeight: 24000, maxWeight: 24000, price: 145.65 },
  { minWeight: 25000, maxWeight: 25000, price: 151.25 },
  { minWeight: 26000, maxWeight: 26000, price: 156.85 },
  { minWeight: 27000, maxWeight: 27000, price: 162.45 },
  { minWeight: 28000, maxWeight: 28000, price: 168.05 },
  { minWeight: 29000, maxWeight: 29000, price: 173.65 },
  { minWeight: 30000, maxWeight: 30000, price: 179.25 }
]

async function setupAbcPricingTable() {
  try {
    console.log('🚀 Configurando tabela de preços da ABC...')

    // Buscar a transportadora ABC
    const abcCarrier = await prisma.carrier.findFirst({
      where: { code: 'ABC' }
    })

    if (!abcCarrier) {
      console.log('❌ Transportadora ABC não encontrada. Execute primeiro o script setup-abc-carrier.js')
      return
    }

    console.log(`✅ Transportadora ABC encontrada: ${abcCarrier.name}`)

    // Limpar tabelas de preços existentes da ABC
    await prisma.carrierPricingTable.deleteMany({
      where: { carrierId: abcCarrier.id }
    })

    console.log('🧹 Tabelas de preços antigas removidas')

    // Inserir preços do Packet Standard
    console.log('📊 Inserindo preços do Packet Standard...')
    for (const pricing of abcStandardPricing) {
      await prisma.carrierPricingTable.create({
        data: {
          name: 'Packet Standard',
          serviceCode: 'STANDARD',
          minWeight: pricing.minWeight,
          maxWeight: pricing.maxWeight,
          price: pricing.price,
          carrierId: abcCarrier.id
        }
      })
    }

    // Inserir preços do Packet Express
    console.log('📊 Inserindo preços do Packet Express...')
    for (const pricing of abcExpressPricing) {
      await prisma.carrierPricingTable.create({
        data: {
          name: 'Packet Express',
          serviceCode: 'EXPRESS',
          minWeight: pricing.minWeight,
          maxWeight: pricing.maxWeight,
          price: pricing.price,
          carrierId: abcCarrier.id
        }
      })
    }

    console.log('✅ Tabela de preços da ABC configurada com sucesso!')
    console.log(`📈 Total de registros inseridos: ${abcStandardPricing.length + abcExpressPricing.length}`)

  } catch (error) {
    console.error('❌ Erro ao configurar tabela de preços:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupAbcPricingTable()
