import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota administrativa ou do dashboard
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    // 1) Tentar JWT no cookie 'session'
    const sessionCookie = request.cookies.get('session')
    if (sessionCookie?.value) {
      try {
        const tokenPayload = await verifyAccessToken(sessionCookie.value)
        const response = NextResponse.next()
        response.headers.set('x-user-id', String(tokenPayload.sub))
        response.headers.set('x-user-email', String(tokenPayload['email'] || ''))
        response.headers.set('x-user-role', String(tokenPayload['role'] || ''))

        // Verificações de role
        if (pathname.startsWith('/admin') && tokenPayload['role'] === 'CLIENT') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        if (pathname.startsWith('/dashboard') && tokenPayload['role'] !== 'CLIENT') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        return response
      } catch {
        // Ignora, tenta cookie JSON legado
      }
    }

    // 2) Fallback: cookie JSON legado
    const legacyCookie = request.cookies.get('session')
    if (legacyCookie?.value) {
      try {
        const session = JSON.parse(legacyCookie.value)
        if (session?.userId && session?.email) {
          const response = NextResponse.next()
          response.headers.set('x-user-id', session.userId)
          response.headers.set('x-user-email', session.email)
          response.headers.set('x-user-role', session.role)

          if (pathname.startsWith('/admin') && session.role === 'CLIENT') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }
          if (pathname.startsWith('/dashboard') && session.role !== 'CLIENT') {
            return NextResponse.redirect(new URL('/admin', request.url))
          }
          return response
        }
      } catch {
        // segue para login
      }
    }

    // 3) Não autenticado
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Se estiver tentando acessar login/registro e já estiver autenticado, redirecionar baseado no role
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    const sessionCookie = request.cookies.get('session')

    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value)
        if (session.userId && session.email) {
          // Redirecionar baseado no role
          if (session.role === 'CLIENT') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          } else {
            return NextResponse.redirect(new URL('/admin', request.url))
          }
        }
      } catch {
        // Cookie inválido, permitir acesso à página de login/registro
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
