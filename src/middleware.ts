import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Attach a simple request id for tracing
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)

  // Headers de segurança
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CSP mais restritivo para rotas administrativas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://static.hotjar.com https://cdn.mxpnl.com https://cdn.amplitude.com https://challenges.cloudflare.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://assets.alicdn.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://api.stripe.com; frame-src 'self' https://www.googletagmanager.com https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';"
    )
  } else {
    // CSP padrão para outras rotas
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://static.hotjar.com https://cdn.mxpnl.com https://cdn.amplitude.com https://challenges.cloudflare.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://assets.alicdn.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://api.stripe.com; frame-src 'self' https://www.googletagmanager.com https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';"
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
