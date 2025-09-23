import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { logger } from '@/lib/logging/winston-config'

type MinimalSession = { userId: string; role: string }

interface AdminAccessCheck {
  success: boolean
  response?: NextResponse
  session?: MinimalSession
}

/**
 * Verifica se o usuário possui acesso administrativo
 * @param request Requisição Next.js
 * @returns Objeto com resultado da verificação
 */
export async function checkAdminAccess(request: NextRequest): Promise<AdminAccessCheck> {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return {
        success: false,
        response: NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
      }
    }

    // Tentar obter a sessão do token JWT ou do cookie de sessão
    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { 
        userId: String(payload.sub || ''), 
        role: String((payload as unknown as { role?: string }).role || '') 
      }
    } catch {
      try { 
        session = JSON.parse(sessionCookie.value) as MinimalSession 
      } catch { 
        session = null 
      }
    }

    // Verificar se o usuário é administrador
    if (!session || !session.userId) {
      return {
        success: false,
        response: NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
      }
    }

    // Verificar se o usuário tem permissão de administrador
    const adminRoles = ['ADMIN', 'SUPER_ADMIN']
    if (!adminRoles.includes(session.role)) {
      logger.warn('Tentativa de acesso administrativo sem permissão', {
        userId: session.userId,
        role: session.role,
        path: request.nextUrl.pathname
      })

      return {
        success: false,
        response: NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
      }
    }

    // Acesso permitido
    return {
      success: true,
      session
    }
  } catch (error) {
    logger.error('Erro ao verificar acesso administrativo', { error })
    return {
      success: false,
      response: NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
    }
  }
}