import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { verifyAccessToken } from '../../modules/auth/auth/jwt'
import { createErrorResponse } from '../utils/validation'

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    email: string
    role: UserRole
    name?: string
  }
}

// Middleware de autenticação
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<Response>,
  requiredRoles: UserRole[] = []
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const token = request.cookies.get('token')?.value

      if (!token) {
        return NextResponse.json(
          createErrorResponse('Token de autenticação não encontrado'),
          { status: 401 }
        )
      }

      const decoded = await verifyAccessToken(token)

      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role as UserRole)) {
        return NextResponse.json(
          createErrorResponse('Acesso negado - permissões insuficientes'),
          { status: 403 }
        )
      }

      // Adicionar usuário ao request
      const authenticatedRequest = Object.assign(request, {
        user: {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role as UserRole,
          name: decoded.name,
        }
      })

      return handler(authenticatedRequest)
    } catch (error) {
      console.error('Erro de autenticação:', error)
      return NextResponse.json(
        createErrorResponse('Token inválido ou expirado'),
        { status: 401 }
      )
    }
  }
}