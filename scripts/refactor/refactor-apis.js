#!/usr/bin/env node

/**
 * Script para Refatorar APIs Automaticamente
 *
 * Este script analisa as APIs existentes e aplica as melhorias:
 * - Validação de entrada
 * - Tratamento de erros
 * - Rate limiting
 * - Logging
 * - Documentação
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

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

// Template para API refatorada
const API_TEMPLATE = `import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/prisma'
import { validateRequest, createSuccessResponse, createErrorResponse } from '@/lib/validation/api-validators'
import { withErrorHandler } from '@/lib/errors/api-error-handler'
import { createGeneralRateLimit } from '@/lib/security/rate-limiter'
import { logger } from '@/lib/logging/api-logger'

// GET /api/{endpoint} - {description}
export const GET = withErrorHandler(async (request: NextRequest) => {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  try {
    // Aplicar rate limiting
    const rateLimit = createGeneralRateLimit()
    rateLimit(request)

    // Log da request
    logger.logRequest(request, requestId)

    // Implementar lógica da API aqui

    // Log da response
    const duration = Date.now() - startTime
    logger.logPerformance({
      requestId,
      endpoint: '/api/{endpoint}',
      method: 'GET',
      duration,
      statusCode: 200,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      createSuccessResponse(data, 'Sucesso')
    )

  } catch (error) {
    // Log do erro
    logger.logError(error as Error, request, requestId)

    // Tratar erro
    const errorHandler = createErrorHandler({ requestId, endpoint: '/api/{endpoint}' })
    return errorHandler(error)
  }
})

// POST /api/{endpoint} - {description}
export const POST = withErrorHandler(async (request: NextRequest) => {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  try {
    // Aplicar rate limiting
    const rateLimit = createGeneralRateLimit()
    rateLimit(request)

    // Log da request
    logger.logRequest(request, requestId)

    // Validar dados de entrada
    const validation = await validateRequest(request, {endpoint}Schemas.create)
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(validation.error),
        { status: validation.status }
      )
    }

    const data = validation.data

    // Implementar lógica da API aqui

    // Log da response
    const duration = Date.now() - startTime
    logger.logPerformance({
      requestId,
      endpoint: '/api/{endpoint}',
      method: 'POST',
      duration,
      statusCode: 201,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      createSuccessResponse(data, 'Criado com sucesso'),
      { status: 201 }
    )

  } catch (error) {
    // Log do erro
    logger.logError(error as Error, request, requestId)

    // Tratar erro
    const errorHandler = createErrorHandler({ requestId, endpoint: '/api/{endpoint}' })
    return errorHandler(error)
  }
})`

// Função para analisar uma API
function analyzeAPI(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')

  const analysis = {
    file: filePath,
    hasValidation: false,
    hasErrorHandling: false,
    hasRateLimiting: false,
    hasLogging: false,
    hasDocumentation: false,
    issues: [],
    suggestions: []
  }

  // Verificar validação
  if (content.includes('validateRequest') || content.includes('z.object')) {
    analysis.hasValidation = true
  } else {
    analysis.issues.push('Falta validação de entrada')
    analysis.suggestions.push('Implementar validação com Zod')
  }

  // Verificar tratamento de erros
  if (content.includes('withErrorHandler') || content.includes('createErrorHandler')) {
    analysis.hasErrorHandling = true
  } else {
    analysis.issues.push('Falta tratamento de erros centralizado')
    analysis.suggestions.push('Implementar withErrorHandler')
  }

  // Verificar rate limiting
  if (content.includes('createGeneralRateLimit') || content.includes('rateLimit')) {
    analysis.hasRateLimiting = true
  } else {
    analysis.issues.push('Falta rate limiting')
    analysis.suggestions.push('Implementar rate limiting')
  }

  // Verificar logging
  if (content.includes('logger.') || content.includes('ApiLogger')) {
    analysis.hasLogging = true
  } else {
    analysis.issues.push('Falta logging estruturado')
    analysis.suggestions.push('Implementar sistema de logging')
  }

  // Verificar documentação
  if (content.includes('/**') || content.includes('* @')) {
    analysis.hasDocumentation = true
  } else {
    analysis.issues.push('Falta documentação')
    analysis.suggestions.push('Adicionar documentação JSDoc')
  }

  return analysis
}

// Função para refatorar uma API
function refactorAPI(filePath, analysis) {
  const content = fs.readFileSync(filePath, 'utf8')
  const endpoint = path.basename(path.dirname(filePath))

  // Criar backup
  const backupPath = filePath.replace('.ts', '.ts.backup')
  fs.writeFileSync(backupPath, content)

  // Aplicar refatoração
  let refactoredContent = content

  // Adicionar imports necessários
  if (!analysis.hasValidation) {
    refactoredContent = refactoredContent.replace(
      /import { NextRequest, NextResponse } from 'next\/server'/,
      `import { NextRequest, NextResponse } from 'next/server'
import { validateRequest, createSuccessResponse, createErrorResponse } from '@/lib/validation/api-validators'
import { withErrorHandler } from '@/lib/errors/api-error-handler'
import { createGeneralRateLimit } from '@/lib/security/rate-limiter'
import { logger } from '@/lib/logging/api-logger'`
    )
  }

  // Aplicar withErrorHandler
  if (!analysis.hasErrorHandling) {
    refactoredContent = refactoredContent.replace(
      /export async function (GET|POST|PUT|DELETE)/g,
      'export const $1 = withErrorHandler(async'
    )
  }

  // Adicionar rate limiting
  if (!analysis.hasRateLimiting) {
    refactoredContent = refactoredContent.replace(
      /try {/g,
      `try {
    // Aplicar rate limiting
    const rateLimit = createGeneralRateLimit()
    rateLimit(request)`
    )
  }

  // Adicionar logging
  if (!analysis.hasLogging) {
    refactoredContent = refactoredContent.replace(
      /try {/g,
      `try {
    const startTime = Date.now()
    const requestId = Math.random().toString(36).substring(7)

    // Log da request
    logger.logRequest(request, requestId)`
    )
  }

  // Salvar arquivo refatorado
  const refactoredPath = filePath.replace('.ts', '.ts.refactored')
  fs.writeFileSync(refactoredPath, refactoredContent)

  return {
    original: filePath,
    backup: backupPath,
    refactored: refactoredPath,
    changes: analysis.suggestions.length
  }
}

// Função principal
async function main() {
  try {
    log('🚀 Iniciando refatoração das APIs...', 'bright')

    // Encontrar todas as APIs
    const apiFiles = glob.sync('src/app/api/**/route.ts')

    if (apiFiles.length === 0) {
      log('❌ Nenhuma API encontrada', 'red')
      return
    }

    log(`📁 Encontradas ${apiFiles.length} APIs`, 'blue')

    // Analisar cada API
    const analyses = []
    for (const file of apiFiles) {
      const analysis = analyzeAPI(file)
      analyses.push(analysis)

      log(`\\n📋 Analisando: ${file}`, 'cyan')
      log(`  ✅ Validação: ${analysis.hasValidation ? 'Sim' : 'Não'}`, analysis.hasValidation ? 'green' : 'red')
      log(`  ✅ Tratamento de Erros: ${analysis.hasErrorHandling ? 'Sim' : 'Não'}`, analysis.hasErrorHandling ? 'green' : 'red')
      log(`  ✅ Rate Limiting: ${analysis.hasRateLimiting ? 'Sim' : 'Não'}`, analysis.hasRateLimiting ? 'green' : 'red')
      log(`  ✅ Logging: ${analysis.hasLogging ? 'Sim' : 'Não'}`, analysis.hasLogging ? 'green' : 'red')
      log(`  ✅ Documentação: ${analysis.hasDocumentation ? 'Sim' : 'Não'}`, analysis.hasDocumentation ? 'green' : 'red')

      if (analysis.issues.length > 0) {
        log(`  ⚠️  Problemas encontrados:`, 'yellow')
        analysis.issues.forEach(issue => log(`    - ${issue}`, 'yellow'))
      }
    }

    // Gerar relatório
    const report = {
      total: apiFiles.length,
      withValidation: analyses.filter(a => a.hasValidation).length,
      withErrorHandling: analyses.filter(a => a.hasErrorHandling).length,
      withRateLimiting: analyses.filter(a => a.hasRateLimiting).length,
      withLogging: analyses.filter(a => a.hasLogging).length,
      withDocumentation: analyses.filter(a => a.hasDocumentation).length,
      totalIssues: analyses.reduce((sum, a) => sum + a.issues.length, 0),
      analyses
    }

    // Salvar relatório
    fs.writeFileSync('api-refactor-report.json', JSON.stringify(report, null, 2))

    log(`\\n📊 Relatório de Análise:`, 'blue')
    log(`  Total de APIs: ${report.total}`, 'cyan')
    log(`  Com Validação: ${report.withValidation}/${report.total}`, report.withValidation === report.total ? 'green' : 'yellow')
    log(`  Com Tratamento de Erros: ${report.withErrorHandling}/${report.total}`, report.withErrorHandling === report.total ? 'green' : 'yellow')
    log(`  Com Rate Limiting: ${report.withRateLimiting}/${report.total}`, report.withRateLimiting === report.total ? 'green' : 'yellow')
    log(`  Com Logging: ${report.withLogging}/${report.total}`, report.withLogging === report.total ? 'green' : 'yellow')
    log(`  Com Documentação: ${report.withDocumentation}/${report.total}`, report.withDocumentation === report.total ? 'green' : 'yellow')
    log(`  Total de Problemas: ${report.totalIssues}`, report.totalIssues === 0 ? 'green' : 'yellow')

    // Refatorar APIs com problemas
    const apisToRefactor = analyses.filter(a => a.issues.length > 0)

    if (apisToRefactor.length > 0) {
      log(`\\n🔧 Refatorando ${apisToRefactor.length} APIs...`, 'blue')

      for (const analysis of apisToRefactor) {
        const result = refactorAPI(analysis.file, analysis)
        log(`  ✅ ${analysis.file} refatorada`, 'green')
        log(`    - Backup: ${result.backup}`, 'cyan')
        log(`    - Refatorada: ${result.refactored}`, 'cyan')
        log(`    - Mudanças: ${result.changes}`, 'cyan')
      }
    }

    log(`\\n🎉 Refatoração concluída!`, 'green')
    log(`📁 Relatório salvo em: api-refactor-report.json`, 'blue')
    log(`\\n🚀 Próximos passos:`, 'blue')
    log(`  1. Revisar arquivos refatorados`, 'yellow')
    log(`  2. Testar as APIs refatoradas`, 'yellow')
    log(`  3. Aplicar as mudanças em produção`, 'yellow')

  } catch (error) {
    log(`\\n❌ Erro durante a refatoração: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
}

module.exports = {
  analyzeAPI,
  refactorAPI,
  main
}
