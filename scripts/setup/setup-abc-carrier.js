const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupABCCarrier() {
  try {
    // Verificar se a transportadora ABC já existe
    const existingCarrier = await prisma.carrier.findUnique({
      where: { code: 'ABC' }
    })

    if (existingCarrier) {
      console.log('Transportadora ABC já existe:', existingCarrier)
      return
    }

    // Criar a transportadora ABC
    const abcCarrier = await prisma.carrier.create({
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

    console.log('Transportadora ABC criada com sucesso:', abcCarrier)

    // Criar zonas de entrega para ABC
    await prisma.carrierZone.createMany({
      data: [
        {
          carrierId: abcCarrier.id,
          name: 'São Paulo Capital',
          baseRate: 15.00,
          ratePerKg: 2.50,
          estimatedDays: 3
        },
        {
          carrierId: abcCarrier.id,
          name: 'Interior SP',
          baseRate: 18.00,
          ratePerKg: 3.00,
          estimatedDays: 4
        },
        {
          carrierId: abcCarrier.id,
          name: 'Outros Estados',
          baseRate: 22.00,
          ratePerKg: 3.50,
          estimatedDays: 5
        }
      ]
    })

    console.log('Zonas de entrega ABC criadas com sucesso')

  } catch (error) {
    console.error('Erro ao configurar transportadora ABC:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupABCCarrier()
