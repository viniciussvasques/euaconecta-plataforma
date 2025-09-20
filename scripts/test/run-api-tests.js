#!/usr/bin/env node

/**
 * Script para Executar Testes de API
 *
 * Este script executa testes automatizados para todas as APIs
 * e gera relatórios detalhados.
 */

const { ApiTester, runAllTests } = require('../../src/lib/testing/api-test-utils.ts')

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Função para verificar se o servidor está rodando
async function checkServerRunning(baseUrl = 'http://localhost:3000') {
  try {
    const response = await fetch(baseUrl)
    return response.ok
  } catch (error) {
    return false
  }
}

// Função para aguardar o servidor ficar disponível
async function waitForServer(baseUrl = 'http://localhost:3000', maxAttempts = 30) {
  log('🔍 Verificando se o servidor está rodando...', 'blue')

  for (let i = 0; i < maxAttempts; i++) {
    if (await checkServerRunning(baseUrl)) {
      log('✅ Servidor está rodando!', 'green')
      return true
    }

    log(`⏳ Aguardando servidor... (${i + 1}/${maxAttempts})`, 'yellow')
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  log('❌ Servidor não está rodando', 'red')
  return false
}

// Função para executar testes específicos
async function runSpecificTests() {
  const tester = new ApiTester({
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
  })

  // Testes de autenticação
  log('🧪 Executando testes de autenticação...', 'blue')
  const authTests = [
    {
      name: 'Registro de usuário',
      method: 'POST',
      endpoint: '/api/auth/register',
      body: {
        name: 'Teste User',
        email: 'teste@example.com',
        password: '123456',
      },
      expectedStatus: 201,
    },
    {
      name: 'Login de usuário',
      method: 'POST',
      endpoint: '/api/auth/login',
      body: {
        email: 'teste@example.com',
        password: '123456',
      },
      expectedStatus: 200,
    },
  ]

  for (const test of authTests) {
    const result = await tester.runTest(test)
    if (result.success) {
      log(`  ✅ ${test.name} - Sucesso (${result.duration}ms)`, 'green')
    } else {
      log(`  ❌ ${test.name} - Falhou: ${result.error}`, 'red')
    }
  }

  // Testes de pacotes
  log('🧪 Executando testes de pacotes...', 'blue')
  const packageTests = [
    {
      name: 'Listar pacotes',
      method: 'GET',
      endpoint: '/api/packages',
      expectedStatus: 200,
    },
    {
      name: 'Criar pacote',
      method: 'POST',
      endpoint: '/api/packages',
      body: {
        ownerId: 'test-user-id',
        description: 'Pacote de teste',
        store: 'Amazon',
        orderNumber: 'TEST-123',
        purchasePrice: 100.00,
        weightGrams: 1000,
      },
      expectedStatus: 201,
    },
  ]

  for (const test of packageTests) {
    const result = await tester.runTest(test)
    if (result.success) {
      log(`  ✅ ${test.name} - Sucesso (${result.duration}ms)`, 'green')
    } else {
      log(`  ❌ ${test.name} - Falhou: ${result.error}`, 'red')
    }
  }

  // Testes de frete
  log('🧪 Executando testes de frete...', 'blue')
  const freightTests = [
    {
      name: 'Calcular frete',
      method: 'POST',
      endpoint: '/api/freight/calculate',
      body: {
        weightGrams: 1000,
        serviceType: 'STANDARD',
      },
      expectedStatus: 200,
    },
  ]

  for (const test of freightTests) {
    const result = await tester.runTest(test)
    if (result.success) {
      log(`  ✅ ${test.name} - Sucesso (${result.duration}ms)`, 'green')
    } else {
      log(`  ❌ ${test.name} - Falhou: ${result.error}`, 'red')
    }
  }

  // Gerar relatório
  const stats = tester.getStats()
  log('\n📊 Estatísticas dos Testes:', 'blue')
  log(`  Total: ${stats.total}`, 'cyan')
  log(`  Aprovados: ${stats.passed}`, 'green')
  log(`  Falharam: ${stats.failed}`, 'red')
  log(`  Taxa de sucesso: ${stats.successRate.toFixed(2)}%`, stats.successRate === 100 ? 'green' : 'yellow')
  log(`  Duração média: ${stats.averageDuration.toFixed(2)}ms`, 'cyan')

  // Salvar relatório
  const report = tester.getReport()
  require('fs').writeFileSync('api-test-report.md', report)
  log('\n📁 Relatório salvo em: api-test-report.md', 'green')

  return stats
}

// Função principal
async function main() {
  try {
    log('🚀 Iniciando testes de API...', 'bright')

    // Verificar se o servidor está rodando
    const serverRunning = await waitForServer()
    if (!serverRunning) {
      log('❌ Servidor não está rodando. Execute "npm run dev" primeiro.', 'red')
      process.exit(1)
    }

    // Executar testes
    const stats = await runSpecificTests()

    if (stats.successRate === 100) {
      log('\n🎉 Todos os testes passaram!', 'green')
    } else {
      log('\n⚠️  Alguns testes falharam. Verifique o relatório.', 'yellow')
    }

  } catch (error) {
    log(`\n❌ Erro durante os testes: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
}

module.exports = {
  runSpecificTests,
  checkServerRunning,
  waitForServer,
  main
}
