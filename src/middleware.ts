import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota administrativa ou do dashboard
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    // Verificar se há cookie de sessão
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie) {
      // Redirecionar para login se não estiver autenticado
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      // Verificar se o cookie é válido
      const session = JSON.parse(sessionCookie.value)
      
      if (!session.userId || !session.email) {
        // Cookie inválido, redirecionar para login
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Verificar se o usuário tem permissão para acessar a rota
      if (pathname.startsWith('/admin') && session.role === 'CLIENT') {
        // Cliente tentando acessar admin, redirecionar para dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (pathname.startsWith('/dashboard') && session.role !== 'CLIENT') {
        // Admin tentando acessar dashboard, redirecionar para admin
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      // Adicionar informações do usuário aos headers para uso nas páginas
      const response = NextResponse.next()
      response.headers.set('x-user-id', session.userId)
      response.headers.set('x-user-email', session.email)
      response.headers.set('x-user-role', session.role)
      
      return response
    } catch {
      // Cookie corrompido, redirecionar para login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
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
