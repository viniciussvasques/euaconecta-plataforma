/**
 * Utilitários de Teste para APIs
 *
 * Este módulo fornece funções auxiliares para testar as APIs
 * de forma consistente e eficiente.
 */

import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Interface para configuração de teste
interface TestConfig {
  baseUrl?: string
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}

// Interface para resultado de teste
interface TestResult {
  success: boolean
  status: number
  data?: unknown
  error?: string
  duration: number
  timestamp: string
}

// Interface para suite de testes
interface TestSuite {
  name: string
  tests: Test[]
  setup?: () => Promise<void>
  teardown?: () => Promise<void>
}

// Interface para teste individual
interface Test {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  body?: unknown
  headers?: Record<string, string>
  expectedStatus?: number
  expectedData?: unknown
  timeout?: number
}

// Classe principal para testes de API
export class ApiTester {
  private config: TestConfig
  private results: TestResult[] = []

  constructor(config: TestConfig = {}) {
    this.config = {
      baseUrl: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
      retries: 3,
      ...config,
    }
  }

  // Executar um teste individual
  async runTest(test: Test): Promise<TestResult> {
    const startTime = Date.now()
    const url = `${this.config.baseUrl}${test.endpoint}`

    try {
      const response = await fetch(url, {
        method: test.method,
        headers: {
          ...this.config.headers,
          ...test.headers,
        },
        body: test.body ? JSON.stringify(test.body) : undefined,
        signal: AbortSignal.timeout(test.timeout || this.config.timeout!),
      })

      const data = await response.json()
      const duration = Date.now() - startTime

      const result: TestResult = {
        success: response.ok,
        status: response.status,
        data,
        duration,
        timestamp: new Date().toISOString(),
      }

      // Verificar status esperado
      if (test.expectedStatus && response.status !== test.expectedStatus) {
        result.success = false
        result.error = `Status esperado: ${test.expectedStatus}, recebido: ${response.status}`
      }

      // Verificar dados esperados
      if (test.expectedData && !this.compareData(data, test.expectedData)) {
        result.success = false
        result.error = `Dados não correspondem ao esperado`
      }

      this.results.push(result)
      return result

    } catch (error) {
      const duration = Date.now() - startTime
      const result: TestResult = {
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        duration,
        timestamp: new Date().toISOString(),
      }

      this.results.push(result)
      return result
    }
  }

  // Executar suite de testes
  async runTestSuite(suite: TestSuite): Promise<TestResult[]> {
    console.log(`🧪 Executando suite: ${suite.name}`)

    // Setup
    if (suite.setup) {
      await suite.setup()
    }

    const results: TestResult[] = []

    for (const test of suite.tests) {
      console.log(`  🔍 Executando: ${test.name}`)
      const result = await this.runTest(test)
      results.push(result)

      if (result.success) {
        console.log(`    ✅ Sucesso (${result.duration}ms)`)
      } else {
        console.log(`    ❌ Falhou: ${result.error}`)
      }
    }

    // Teardown
    if (suite.teardown) {
      await suite.teardown()
    }

    return results
  }

  // Comparar dados
  private compareData(actual: unknown, expected: unknown): boolean {
    if (typeof actual !== typeof expected) {
      return false
    }

    if (typeof actual === 'object' && actual !== null && typeof expected === 'object' && expected !== null) {
      const actualKeys = Object.keys(actual as Record<string, unknown>)
      const expectedKeys = Object.keys(expected as Record<string, unknown>)

      if (actualKeys.length !== expectedKeys.length) {
        return false
      }

      for (const key of expectedKeys) {
        if (!actualKeys.includes(key)) {
          return false
        }

        if (!this.compareData((actual as Record<string, unknown>)[key], (expected as Record<string, unknown>)[key])) {
          return false
        }
      }
    } else {
      return actual === expected
    }

    return true
  }

  // Obter estatísticas
  getStats(): {
    total: number
    passed: number
    failed: number
    averageDuration: number
    successRate: number
  } {
    const total = this.results.length
    const passed = this.results.filter(r => r.success).length
    const failed = total - passed
    const averageDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / total
    const successRate = (passed / total) * 100

    return {
      total,
      passed,
      failed,
      averageDuration,
      successRate,
    }
  }

  // Obter relatório
  getReport(): string {
    const stats = this.getStats()
    const report = []

    report.push('# Relatório de Testes de API')
    report.push('')
    report.push(`## Estatísticas Gerais`)
    report.push(`- Total de testes: ${stats.total}`)
    report.push(`- Aprovados: ${stats.passed}`)
    report.push(`- Falharam: ${stats.failed}`)
    report.push(`- Taxa de sucesso: ${stats.successRate.toFixed(2)}%`)
    report.push(`- Duração média: ${stats.averageDuration.toFixed(2)}ms`)
    report.push('')

    report.push('## Detalhes dos Testes')
    report.push('')

    for (const result of this.results) {
      const status = result.success ? '✅' : '❌'
      report.push(`### ${status} ${result.timestamp}`)
      report.push(`- Status: ${result.status}`)
      report.push(`- Duração: ${result.duration}ms`)

      if (result.error) {
        report.push(`- Erro: ${result.error}`)
      }

      if (result.data) {
        report.push(`- Dados: ${JSON.stringify(result.data, null, 2)}`)
      }

      report.push('')
    }

    return report.join('\n')
  }

  // Limpar resultados
  clearResults(): void {
    this.results = []
  }
}

// Função para criar teste de autenticação
export function createAuthTest(email: string, password: string): Test {
  return {
    name: 'Login de usuário',
    method: 'POST',
    endpoint: '/api/auth/login',
    body: { email, password },
    expectedStatus: 200,
  }
}

// Função para criar teste de registro
export function createRegisterTest(userData: unknown): Test {
  return {
    name: 'Registro de usuário',
    method: 'POST',
    endpoint: '/api/auth/register',
    body: userData,
    expectedStatus: 201,
  }
}

// Função para criar teste de listagem
export function createListTest(endpoint: string, expectedStatus: number = 200): Test {
  return {
    name: `Listar ${endpoint}`,
    method: 'GET',
    endpoint: `/api/${endpoint}`,
    expectedStatus,
  }
}

// Função para criar teste de criação
export function createCreateTest(endpoint: string, data: unknown, expectedStatus: number = 201): Test {
  return {
    name: `Criar ${endpoint}`,
    method: 'POST',
    endpoint: `/api/${endpoint}`,
    body: data,
    expectedStatus,
  }
}

// Função para criar teste de atualização
export function createUpdateTest(endpoint: string, id: string, data: unknown, expectedStatus: number = 200): Test {
  return {
    name: `Atualizar ${endpoint}`,
    method: 'PUT',
    endpoint: `/api/${endpoint}/${id}`,
    body: data,
    expectedStatus,
  }
}

// Função para criar teste de exclusão
export function createDeleteTest(endpoint: string, id: string, expectedStatus: number = 200): Test {
  return {
    name: `Excluir ${endpoint}`,
    method: 'DELETE',
    endpoint: `/api/${endpoint}/${id}`,
    expectedStatus,
  }
}

// Função para criar suite de testes de autenticação
export function createAuthTestSuite(): TestSuite {
  return {
    name: 'Testes de Autenticação',
    tests: [
      createRegisterTest({
        name: 'Teste User',
        email: 'teste@example.com',
        password: '123456',
      }),
      createAuthTest('teste@example.com', '123456'),
    ],
  }
}

// Função para criar suite de testes de pacotes
export function createPackageTestSuite(): TestSuite {
  return {
    name: 'Testes de Pacotes',
    tests: [
      createListTest('packages'),
      createCreateTest('packages', {
        ownerId: 'test-user-id',
        description: 'Pacote de teste',
        store: 'Amazon',
        orderNumber: 'TEST-123',
        purchasePrice: 100.00,
        weightGrams: 1000,
      }),
    ],
  }
}

// Função para criar suite de testes de frete
export function createFreightTestSuite(): TestSuite {
  return {
    name: 'Testes de Frete',
    tests: [
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
    ],
  }
}

// Função para executar todos os testes
export async function runAllTests(): Promise<void> {
  const tester = new ApiTester()

  const suites = [
    createAuthTestSuite(),
    createPackageTestSuite(),
    createFreightTestSuite(),
  ]

  for (const suite of suites) {
    await tester.runTestSuite(suite)
  }

  const stats = tester.getStats()
  console.log('\n📊 Estatísticas Finais:')
  console.log(`  Total: ${stats.total}`)
  console.log(`  Aprovados: ${stats.passed}`)
  console.log(`  Falharam: ${stats.failed}`)
  console.log(`  Taxa de sucesso: ${stats.successRate.toFixed(2)}%`)
  console.log(`  Duração média: ${stats.averageDuration.toFixed(2)}ms`)

  // Salvar relatório
  const report = tester.getReport()
  import('fs').then(fs => {
    fs.writeFileSync('test-report.md', report)
  })
  console.log('\n📁 Relatório salvo em: test-report.md')
}
