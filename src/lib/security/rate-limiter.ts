/**
 * Sistema de Rate Limiting para APIs
 *
 * Este módulo implementa rate limiting para proteger as APIs
 * contra abuso e ataques de força bruta.
 */

import { NextRequest } from 'next/server'
import { RateLimitError } from '../errors/api-error-handler'

// Interface para configuração de rate limiting
interface RateLimitConfig {
  windowMs: number // Janela de tempo em milissegundos
  maxRequests: number // Máximo de requests por janela
  skipSuccessfulRequests?: boolean // Pular requests bem-sucedidos
  skipFailedRequests?: boolean // Pular requests com falha
  keyGenerator?: (request: NextRequest) => string // Função para gerar chave única
}

// Configurações padrão para diferentes tipos de endpoints
export const RateLimitConfigs = {
  // Autenticação - mais restritivo
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5, // 5 tentativas por 15 minutos
    skipSuccessfulRequests: true,
  },

  // APIs gerais - moderado
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // 100 requests por 15 minutos
  },

  // Upload de arquivos - mais restritivo
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 10, // 10 uploads por hora
  },

  // APIs de pagamento - muito restritivo
  payment: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 5, // 5 tentativas por hora
  },

  // APIs de suporte - moderado
  support: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 20, // 20 tickets por hora
  },
} as const

// Store em memória para rate limiting (em produção, usar Redis)
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  get(key: string): { count: number; resetTime: number } | null {
    const entry = this.store.get(key)
    if (!entry) return null

    // Verificar se a janela expirou
    if (Date.now() > entry.resetTime) {
      this.store.delete(key)
      return null
    }

    return entry
  }

  set(key: string, count: number, resetTime: number): void {
    this.store.set(key, { count, resetTime })
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now()
    const resetTime = now + windowMs
    const entry = this.get(key)

    if (entry) {
      entry.count++
      this.set(key, entry.count, entry.resetTime)
      return entry
    } else {
      this.set(key, 1, resetTime)
      return { count: 1, resetTime }
    }
  }

  // Limpar entradas expiradas (chamado periodicamente)
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

// Instância global do store
const store = new MemoryStore()

// Limpeza automática a cada 5 minutos
setInterval(() => {
  store.cleanup()
}, 5 * 60 * 1000)

// Função para gerar chave única baseada no IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('x-remote-addr')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (remoteAddr) {
    return remoteAddr
  }

  return 'unknown'
}

// Função para gerar chave única baseada no usuário
export function getUserId(request: NextRequest): string | null {
  // Aqui você implementaria a lógica para extrair o ID do usuário
  // Por exemplo, de um token JWT ou sessão
  return request.headers.get('x-user-id')
}

// Função para gerar chave única baseada no endpoint
export function getEndpointKey(request: NextRequest): string {
  const url = new URL(request.url)
  return `${request.method}:${url.pathname}`
}

// Função para gerar chave única baseada em múltiplos fatores
export function getCompositeKey(request: NextRequest): string {
  const ip = getClientIP(request)
  const userId = getUserId(request)
  const endpoint = getEndpointKey(request)

  if (userId) {
    return `user:${userId}:${endpoint}`
  }

  return `ip:${ip}:${endpoint}`
}

// Função para verificar rate limit
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = config.keyGenerator
    ? config.keyGenerator(request)
    : getCompositeKey(request)

  const entry = store.increment(key, config.windowMs)

  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  }
}

// Função para aplicar rate limiting
export function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): void {
  const { allowed, remaining: _remaining, resetTime } = checkRateLimit(request, config)

  if (!allowed) {
    const resetTimeSeconds = Math.ceil((resetTime - Date.now()) / 1000)
    throw new RateLimitError(
      `Muitas tentativas. Tente novamente em ${resetTimeSeconds} segundos.`
    )
  }
}

// Função para criar middleware de rate limiting
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return (request: NextRequest) => {
    applyRateLimit(request, config)
  }
}

// Função para criar rate limiter específico para autenticação
export function createAuthRateLimit() {
  return createRateLimitMiddleware(RateLimitConfigs.auth)
}

// Função para criar rate limiter específico para upload
export function createUploadRateLimit() {
  return createRateLimitMiddleware(RateLimitConfigs.upload)
}

// Função para criar rate limiter específico para pagamento
export function createPaymentRateLimit() {
  return createRateLimitMiddleware(RateLimitConfigs.payment)
}

// Função para criar rate limiter específico para suporte
export function createSupportRateLimit() {
  return createRateLimitMiddleware(RateLimitConfigs.support)
}

// Função para criar rate limiter genérico
export function createGeneralRateLimit() {
  return createRateLimitMiddleware(RateLimitConfigs.general)
}

// Função para verificar rate limit sem aplicar
export function checkRateLimitStatus(
  request: NextRequest,
  config: RateLimitConfig
): {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
  windowMs: number
} {
  const key = config.keyGenerator
    ? config.keyGenerator(request)
    : getCompositeKey(request)

  const entry = store.get(key)

  if (!entry) {
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
      limit: config.maxRequests,
      windowMs: config.windowMs,
    }
  }

  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
    limit: config.maxRequests,
    windowMs: config.windowMs,
  }
}

// Função para obter headers de rate limiting
export function getRateLimitHeaders(
  request: NextRequest,
  config: RateLimitConfig
): Record<string, string> {
  const status = checkRateLimitStatus(request, config)

  return {
    'X-RateLimit-Limit': status.limit.toString(),
    'X-RateLimit-Remaining': status.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(status.resetTime / 1000).toString(),
    'X-RateLimit-Window': status.windowMs.toString(),
  }
}

// Função para criar rate limiter com headers
export function createRateLimitWithHeaders(config: RateLimitConfig) {
  return (request: NextRequest) => {
    applyRateLimit(request, config)
    return getRateLimitHeaders(request, config)
  }
}

// Função para limpar rate limit de um usuário específico
export function clearRateLimit(userId: string): void {
  // Implementar lógica para limpar rate limit de um usuário específico
  // Em produção, isso seria feito no Redis
  console.log(`Clearing rate limit for user: ${userId}`)
}

// Função para obter estatísticas de rate limiting
export function getRateLimitStats(): {
  totalKeys: number
  activeKeys: number
  expiredKeys: number
} {
  // Implementar lógica para obter estatísticas
  // Em produção, isso seria feito no Redis
  return {
    totalKeys: 0,
    activeKeys: 0,
    expiredKeys: 0,
  }
}
