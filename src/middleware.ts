import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { csrfMiddleware, includeNewCsrfToken } from './lib/security/csrf-protection'

export function middleware(request: NextRequest) {
  // Ignorar recursos estáticos e arquivos do Next.js
  if (request.nextUrl.pathname.includes('/_next/') || 
      request.nextUrl.pathname.includes('/static/') ||
      request.nextUrl.pathname.endsWith('.css') || 
      request.nextUrl.pathname.endsWith('.js')) {
    return NextResponse.next()
  }

  // Attach a simple request id for tracing
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
  
  // CSRF Protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const csrfResult = csrfMiddleware(request)
    if (csrfResult) return csrfResult
  }
  
  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)

  // Headers de segurança
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Adiciona token CSRF para páginas HTML que não sejam arquivos estáticos
  if ((request.nextUrl.pathname.endsWith('/') || 
      request.nextUrl.pathname.endsWith('.html') ||
      !request.nextUrl.pathname.includes('.')) && 
      !request.nextUrl.pathname.includes('_next') && 
      !request.nextUrl.pathname.includes('static')) {
    includeNewCsrfToken(response)
  }

  // CSP padrão para todas as páginas
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http: 'unsafe-inline' blob:https://app.euaconecta.com blob:https://storage.euaconecta.com; connect-src 'self' https://app.euaconecta.com http://minio:9000 https://storage.euaconecta.com wss:; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self'; media-src 'self' blob: data:; worker-src 'self' blob:;"
  )
  
  // CSP mais restritivo para rotas administrativas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://static.hotjar.com https://cdn.mxpnl.com https://cdn.amplitude.com https://challenges.cloudflare.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://assets.alicdn.com; img-src 'self' data: blob: https: http: 'unsafe-inline'; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://api.stripe.com wss: https://app.euaconecta.com http://minio:9000 https://storage.euaconecta.com; frame-src 'self' https://www.googletagmanager.com https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; media-src 'self' blob: data:; worker-src 'self' blob:;"
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/ (ALL Next.js internal assets & endpoints)
     * - __nextjs (Next.js internal font/data endpoints)
     * - favicon.ico (favicon file)
     * - terms (legal pages)
     * - privacy (legal pages)
     */
    '/((?!api|_next/|__nextjs|favicon.ico|terms|privacy).*)',
  ],
}
