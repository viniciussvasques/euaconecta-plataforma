import { NextRequest, NextResponse } from 'next/server'

// Headers de segurança recomendados
export const SECURITY_HEADERS = {
  // Previne clickjacking
  'X-Frame-Options': 'DENY',
  // Previne MIME sniffing
  'X-Content-Type-Options': 'nosniff',
  // Previne XSS
  'X-XSS-Protection': '1; mode=block',
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Content Security Policy básica
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  // Permissions Policy (anteriormente Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'fullscreen=(self)',
    'picture-in-picture=()'
  ].join(', '),
  // HSTS - força HTTPS por 1 ano
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Remove server header
  'Server': '',
} as const

// Middleware de segurança
export function withSecurityHeaders(
  handler: (request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const response = await handler(request)

    // Aplica headers de segurança
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      if (value) {
        response.headers.set(key, value)
      }
    })

    // Headers adicionais baseados na requisição
    if (request.method === 'GET') {
      // Cache control para GET requests
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }

    return response
  }
}

// Middleware específico para CSRF protection
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    // Para métodos que modificam dados, verificar CSRF token
    const modifyingMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

    if (modifyingMethods.includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token')
      const sessionToken = request.cookies.get('csrf-token')?.value

      if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
        return NextResponse.json(
          { error: 'Token CSRF inválido ou ausente' },
          { status: 403 }
        )
      }
    }

    return handler(request)
  }
}

// Middleware combinado de segurança completa
export function withSecurity(
  handler: (request: NextRequest) => Promise<Response>
) {
  return withSecurityHeaders(withCSRFProtection(handler))
}