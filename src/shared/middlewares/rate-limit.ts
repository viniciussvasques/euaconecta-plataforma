import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse } from '../utils/validation'

// Cache simples para rate limiting (em produção usar Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number // milliseconds
}

// Configurações padrão
export const RATE_LIMIT_CONFIGS = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests por 15min
  general: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests por 15min
  upload: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads por hora
  payment: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 payments por hora
} as const

// Middleware de rate limiting
export function withRateLimit(
  handler: (request: NextRequest) => Promise<Response>,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.general
) {
  return async (request: NextRequest): Promise<Response> => {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    const now = Date.now()
    const windowKey = `${ip}-${Math.floor(now / config.windowMs)}`

    const current = requestCounts.get(windowKey) || {
      count: 0,
      resetTime: now + config.windowMs
    }

    // Reset window if expired
    if (now > current.resetTime) {
      current.count = 0
      current.resetTime = now + config.windowMs
    }

    current.count++
    requestCounts.set(windowKey, current)

    // Set headers for client
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', Math.max(0, config.maxRequests - current.count).toString())
    response.headers.set('X-RateLimit-Reset', current.resetTime.toString())

    if (current.count > config.maxRequests) {
      return NextResponse.json(
        createErrorResponse('Muitas requisições. Tente novamente mais tarde.', [
          `Limite: ${config.maxRequests} requests por ${Math.floor(config.windowMs / 60000)} minutos`
        ]),
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
          }
        }
      )
    }

    return handler(request)
  }
}

// Limpeza periódica do cache (evitar memory leaks)
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key)
    }
  }
}, 60 * 1000) // Limpa a cada minuto