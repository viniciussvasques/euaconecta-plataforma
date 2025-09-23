// Middlewares compartilhados - Camada de infraestrutura transversal
// Segue princípios de Clean Architecture e SOLID

export * from './auth'
export * from './rate-limit'
export * from './security'
export * from './logging'

// Re-export das principais funções para conveniência
export { withAuth } from './auth'
export { withRateLimit, RATE_LIMIT_CONFIGS } from './rate-limit'
export { withSecurity, withSecurityHeaders, withCSRFProtection, SECURITY_HEADERS } from './security'
export { withLogging, withAudit, logger, LogLevel, type LogEntry } from './logging'

// Imports para uso interno
import { withAuth } from './auth'
import { withRateLimit } from './rate-limit'
import { withSecurity } from './security'
import { withLogging, withAudit } from './logging'

// Função utilitária para combinar múltiplos middlewares
export function combineMiddlewares<T extends unknown[], R>(
  ...middlewares: ((handler: (...args: T) => R) => (...args: T) => R)[]
) {
  return (handler: (...args: T) => R) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}

// Middleware pipeline para rotas de API
export function createApiPipeline(
  handler: (request: import('next/server').NextRequest) => Promise<Response>,
  options: {
    requireAuth?: boolean
    rateLimit?: import('./rate-limit').RateLimitConfig
    enableAudit?: boolean
    auditAction?: string
  } = {}
) {
  const middlewares: ((handler: (request: import('next/server').NextRequest) => Promise<Response>) => (request: import('next/server').NextRequest) => Promise<Response>)[] = [
    withLogging,
    withSecurity
  ]

  if (options.rateLimit) {
    middlewares.push((h: (request: import('next/server').NextRequest) => Promise<Response>) =>
      withRateLimit(h, options.rateLimit))
  }

  if (options.requireAuth) {
    middlewares.push(withAuth)
  }

  if (options.enableAudit && options.auditAction) {
    middlewares.push((h: (request: import('next/server').NextRequest) => Promise<Response>) =>
      withAudit(h, options.auditAction!))
  }

  return combineMiddlewares(...middlewares)(handler)
}