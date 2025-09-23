import { NextRequest } from 'next/server'
import { UserService } from '@/modules/users/services/user-service'
import { UserRepository } from '@/modules/users/repositories/user-repository'
import { prisma } from '@/lib/database/prisma'
import { withValidation, createSuccessResponse } from '@/shared/utils/validation'
import { withRateLimit } from '@/shared/middlewares/auth'
import { emailSchema, passwordSchema } from '@/shared/utils/validation'
import { signAccessToken } from '@/modules/auth/auth/jwt'
import { MESSAGES, HTTP_STATUS } from '@/shared/constants'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

// Serviço de usuários (usando métodos estáticos para compatibilidade)
const userService = UserService

async function loginHandler(request: NextRequest) {
  try {
    const { email, password } = (request as any).validatedData

    // Buscar usuário por email
    const user = await userService.getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { success: false, message: MESSAGES.ERROR.INVALID_CREDENTIALS },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    // Verificar senha (usando o repositório para buscar o hash)
    const userWithPassword = await prisma.user.findUnique({
      where: { email },
      select: { password: true }
    })

    if (!userWithPassword?.password) {
      return NextResponse.json(
        { success: false, message: MESSAGES.ERROR.INVALID_CREDENTIALS },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    const bcrypt = await import('bcryptjs')
    const passwordMatch = await bcrypt.compare(password, userWithPassword.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: MESSAGES.ERROR.INVALID_CREDENTIALS },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    // Gerar token JWT
    const token = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    // Criar resposta com cookie
    const response = NextResponse.json(
      createSuccessResponse(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        MESSAGES.SUCCESS.LOGIN
      )
    )

    // Configurar cookie HTTP-only
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: MESSAGES.ERROR.INTERNAL_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}

// Aplicar middlewares: rate limiting + validação
export const POST = withRateLimit(
  withValidation(loginSchema, loginHandler),
  5, // 5 tentativas por janela
  15 * 60 * 1000 // 15 minutos
)