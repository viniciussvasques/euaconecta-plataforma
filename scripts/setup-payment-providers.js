const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupPaymentProviders() {
  console.log('🚀 Configurando provedores de pagamento...')

  try {
    // Stripe
    await prisma.paymentProvider.upsert({
      where: { code: 'STRIPE' },
      update: {},
      create: {
        name: 'Stripe',
        code: 'STRIPE',
        description: 'Gateway de pagamento Stripe - Cartões de crédito e débito',
        isActive: true,
        hasApi: true,
        apiUrl: 'https://api.stripe.com/v1',
        supportedCurrencies: ['USD', 'BRL', 'EUR'],
        supportedCountries: ['BR', 'US', 'CA', 'GB'],
        fixedFee: 0.30,
        percentageFee: 0.029
      }
    })

    // PayPal
    await prisma.paymentProvider.upsert({
      where: { code: 'PAYPAL' },
      update: {},
      create: {
        name: 'PayPal',
        code: 'PAYPAL',
        description: 'Gateway de pagamento PayPal - Conta PayPal e cartões',
        isActive: true,
        hasApi: true,
        apiUrl: 'https://api.paypal.com/v1',
        supportedCurrencies: ['USD', 'BRL', 'EUR'],
        supportedCountries: ['BR', 'US', 'CA', 'GB'],
        fixedFee: 0.30,
        percentageFee: 0.034
      }
    })

    // PIX (Brasil)
    await prisma.paymentProvider.upsert({
      where: { code: 'PIX' },
      update: {},
      create: {
        name: 'PIX',
        code: 'PIX',
        description: 'Sistema de pagamento instantâneo PIX - Apenas Brasil',
        isActive: true,
        hasApi: false,
        supportedCurrencies: ['BRL'],
        supportedCountries: ['BR'],
        fixedFee: 0.00,
        percentageFee: 0.00
      }
    })

    // Boleto (Brasil)
    await prisma.paymentProvider.upsert({
      where: { code: 'BOLETO' },
      update: {},
      create: {
        name: 'Boleto Bancário',
        code: 'BOLETO',
        description: 'Boleto bancário - Apenas Brasil',
        isActive: true,
        hasApi: false,
        supportedCurrencies: ['BRL'],
        supportedCountries: ['BR'],
        fixedFee: 3.50,
        percentageFee: 0.00
      }
    })

    console.log('✅ Provedores de pagamento configurados com sucesso!')
    console.log('📋 Provedores criados:')
    console.log('   - Stripe (Cartões)')
    console.log('   - PayPal (Conta PayPal + Cartões)')
    console.log('   - PIX (Brasil)')
    console.log('   - Boleto (Brasil)')

  } catch (error) {
    console.error('❌ Erro ao configurar provedores de pagamento:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupPaymentProviders()
    .then(() => {
      console.log('🎉 Setup concluído!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Erro no setup:', error)
      process.exit(1)
    })
}

module.exports = { setupPaymentProviders }
