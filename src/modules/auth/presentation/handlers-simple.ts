// Presentation Layer - API Routes (Next.js App Router)
// Versão simplificada focando em funcionalidades essenciais

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createApiPipeline, RATE_LIMIT_CONFIGS } from '../../../shared/middlewares'
import {
  getCreateUserUseCase,
  getAuthenticateUserUseCase,
  getGetUserUseCase
} from '../di/container'

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  role: z.enum(['CLIENT', 'ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'MANAGER', 'SUPPORT'])
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

// POST /api/auth/register
export const registerHandler = createApiPipeline(
  async (request: NextRequest) => {
    try {
      const body = await request.json()
      const validatedData = createUserSchema.parse(body)

      const createUserUseCase = getCreateUserUseCase()
      const user = await createUserUseCase.execute({
        ...validatedData,
        role: validatedData.role as import('../domain/types').UserRole
      })

      return NextResponse.json({
        success: true,
        data: {
          id: user.profile.id,
          email: user.profile.email,
          name: user.profile.name,
          role: user.role,
          status: user.status
        }
      }, { status: 201 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Dados inválidos',
          details: error.issues
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      }, { status: 500 })
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.general,
    enableAudit: true,
    auditAction: 'user-registration'
  }
)

// POST /api/auth/login
export const loginHandler = createApiPipeline(
  async (request: NextRequest) => {
    try {
      const body = await request.json()
      const { email, password } = loginSchema.parse(body)

      const authenticateUseCase = getAuthenticateUserUseCase()
      const result = await authenticateUseCase.execute({
        email,
        password,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 401 })
      }

      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: result.user!.profile.id,
            email: result.user!.profile.email,
            name: result.user!.profile.name,
            role: result.user!.role
          },
          token: result.token
        }
      })

      response.cookies.set('session', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      return response
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Dados inválidos',
          details: error.issues
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: 'Erro interno'
      }, { status: 500 })
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    enableAudit: true,
    auditAction: 'user-login'
  }
)

// GET /api/users
export const getUsersHandler = createApiPipeline(
  async (_request: NextRequest) => {
    try {
      const getUserUseCase = getGetUserUseCase()
      const users = await getUserUseCase.executeList()

      return NextResponse.json({
        success: true,
        data: users.map(user => ({
          id: user.profile.id,
          email: user.profile.email,
          name: user.profile.name,
          role: user.role,
          status: user.status,
          lastLogin: user.profile.lastLogin
        }))
      })
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return NextResponse.json({
        success: false,
        error: 'Erro interno'
      }, { status: 500 })
    }
  },
  {
    requireAuth: true,
    rateLimit: RATE_LIMIT_CONFIGS.general,
    enableAudit: true,
    auditAction: 'list-users'
  }
)