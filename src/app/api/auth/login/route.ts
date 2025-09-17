import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/users'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validar dados obrigatórios
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário por email
    const user = await UserService.getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    // Verificar senha (precisamos buscar o hash da senha do banco)

    const userWithPassword = await prisma.user.findUnique({
      where: { email },
      select: { password: true }
    })

    console.log('User found:', !!userWithPassword)
    console.log('Password hash exists:', !!userWithPassword?.password)

    if (!userWithPassword) {
      console.log('User not found in database')
      return NextResponse.json(
        { success: false, error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, userWithPassword.password)
    console.log('Password match:', passwordMatch)

    if (!passwordMatch) {
      console.log('Password does not match')
      return NextResponse.json(
        { success: false, error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Conta inativa. Verifique seu e-mail para ativação.' },
        { status: 403 }
      )
    }

    // Criar JWT (compatível com middleware novo)
    // Garantir suite para clientes sem suite
    let effectiveUser = user
    try {
      if (user.role === 'CLIENT' && !user.suiteNumber) {
        effectiveUser = await UserService.generateSuiteForClient(user.id)
      }
    } catch (e) {
      console.error('Falha ao gerar suite no login:', e)
    }

    // Atualizar último login (não bloquear login em caso de falha)
    try {
      await UserService.updateLastLogin(user.id)
    } catch (e) {
      console.error('Falha ao registrar último login:', e)
    }

    const token = await signAccessToken({
      sub: effectiveUser.id,
      email: effectiveUser.email,
      role: effectiveUser.role,
      name: effectiveUser.name,
    })

    // Emitir refresh token
    const refreshRaw = Array.from({ length: 64 }, () => Math.random().toString(36).slice(2)).join('').slice(0, 64)
    const refreshHash = await bcrypt.hash(refreshRaw, 10)
    const refreshDays = parseInt(process.env.REFRESH_DAYS || '7', 10)
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshHash,
        expiresAt: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000),
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    })

    // Definir cookies
    const response = NextResponse.json({
      success: true,
      data: {
        user: { id: effectiveUser.id, email: effectiveUser.email, name: effectiveUser.name, role: effectiveUser.role },
        message: 'Login realizado com sucesso'
      }
    })

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15 // 15 minutos
    })
    response.cookies.set('refresh_token', refreshRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshDays * 24 * 60 * 60
    })

    return response

  } catch (error) {
    console.error('Erro no login:', error)

    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
