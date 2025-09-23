// Presentation Layer - API Routes (Next.js App Router)
// Segue Clean Architecture - Camada de Presentation

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createApiPipeline, RATE_LIMIT_CONFIGS } from '../../../shared/middlewares'
import {
  getCreateUserUseCase,
  getAuthenticateUserUseCase,
  getGetUserUseCase,
  getUpdateUserUseCase,
  getDeleteUserUseCase,
  getRefreshTokenUseCase
} from '../di/container'

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  role: z.enum(['CLIENT', 'ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'MANAGER', 'SUPPORT']),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  permissions: z.object({
    canManageUsers: z.boolean().optional(),
    canManageConsolidations: z.boolean().optional(),
    canManagePackages: z.boolean().optional(),
    canManageCarriers: z.boolean().optional(),
    canViewFinancials: z.boolean().optional(),
    canManageSettings: z.boolean().optional(),
    customPermissions: z.array(z.string()).optional()
  }).optional()
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['CLIENT', 'ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'MANAGER', 'SUPPORT']).optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  permissions: z.object({
    canManageUsers: z.boolean().optional(),
    canManageConsolidations: z.boolean().optional(),
    canManagePackages: z.boolean().optional(),
    canManageCarriers: z.boolean().optional(),
    canViewFinancials: z.boolean().optional(),
    canManageSettings: z.boolean().optional(),
    customPermissions: z.array(z.string()).optional()
  }).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
})

// API Handlers

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
          details: error.errors
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

      // Set HTTP-only cookie with the token
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

      if (result.refreshToken) {
        response.cookies.set('refresh-token', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })
      }

      return response
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Dados inválidos',
          details: error.errors
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

// POST /api/auth/logout
export const logoutHandler = createApiPipeline(
  async (request: NextRequest) => {
    // TODO: Implementar invalidação de tokens se necessário
    const response = NextResponse.json({ success: true })

    // Clear cookies
    response.cookies.set('session', '', { maxAge: 0 })
    response.cookies.set('refresh-token', '', { maxAge: 0 })

    return response
  },
  {
    requireAuth: true,
    enableAudit: true,
    auditAction: 'user-logout'
  }
)

// GET /api/auth/me
export const getCurrentUserHandler = createApiPipeline(
  async (request: NextRequest) => {
    try {
      // O middleware de auth já validou o token e adicionou o usuário ao request
      const authUser = (request as any).user // TODO: Tipar corretamente

      if (!authUser) {
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          id: authUser.profile.id,
          email: authUser.profile.email,
          name: authUser.profile.name,
          role: authUser.role,
          permissions: authUser.permissions,
          profile: authUser.profile
        }
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Erro interno'
      }, { status: 500 })
    }
  },
  {
    requireAuth: true,
    rateLimit: RATE_LIMIT_CONFIGS.general
  }
)

// GET /api/auth/validate
export const validateTokenHandler = createApiPipeline(
  async (request: NextRequest) => {
    // O middleware já validou o token
    return NextResponse.json({ success: true, valid: true })
  },
  {
    requireAuth: true,
    rateLimit: RATE_LIMIT_CONFIGS.general
  }
)

// POST /api/auth/refresh
export const refreshTokenHandler = createApiPipeline(
  async (request: NextRequest) => {
    try {
      const refreshToken = request.cookies.get('refresh-token')?.value

      if (!refreshToken) {
        return NextResponse.json({
          success: false,
          error: 'Token de refresh não encontrado'
        }, { status: 401 })
      }

      const refreshTokenUseCase = getRefreshTokenUseCase()
      const result = await refreshTokenUseCase.execute(refreshToken)

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 401 })
      }

      const response = NextResponse.json({
        success: true,
        data: {
          token: result.token
        }
      })

      // Update session cookie
      response.cookies.set('session', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

      return response
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Erro interno'
      }, { status: 500 })
    }
  },
  {
    rateLimit: RATE_LIMIT_CONFIGS.general
  }
)

// GET /api/users
export const getUsersHandler = createApiPipeline(
  async (request: NextRequest) => {
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
    } catch (error) {
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

// GET /api/users/[id]
export const getUserHandler = createApiPipeline(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const getUserUseCase = getGetUserUseCase()
      const user = await getUserUseCase.execute(params.id)

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          id: user.profile.id,
          email: user.profile.email,
          name: user.profile.name,
          role: user.role,
          status: user.status,
          permissions: user.permissions,
          profile: user.profile
        }
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Erro interno'
      }, { status: 500 })
    }
  },
  {
    requireAuth: true,
    rateLimit: RATE_LIMIT_CONFIGS.general
  }
)

// PUT /api/users/[id]
export const updateUserHandler = createApiPipeline(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const body = await request.json()
      const validatedData = updateUserSchema.parse(body)

      const updateUserUseCase = getUpdateUserUseCase()
      const user = await updateUserUseCase.execute(params.id, validatedData)

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          id: user.profile.id,
          email: user.profile.email,
          name: user.profile.name,
          role: user.role,
          status: user.status
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Dados inválidos',
          details: error.errors
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno'
      }, { status: 500 })
    }
  },
  {
    requireAuth: true,
    rateLimit: RATE_LIMIT_CONFIGS.general,
    enableAudit: true,
    auditAction: 'update-user'
  }
)

// DELETE /api/users/[id]
export const deleteUserHandler = createApiPipeline(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const deleteUserUseCase = getDeleteUserUseCase()
      const success = await deleteUserUseCase.execute(params.id)

      if (!success) {
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado'
        }, { status: 404 })
      }

      return NextResponse.json({ success: true })
    } catch (error) {
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
    auditAction: 'delete-user'
  }
)