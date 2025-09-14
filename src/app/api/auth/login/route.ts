import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/users'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

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

    // Criar sessão (simples por enquanto)
    // TODO: Implementar JWT ou NextAuth.js
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      canManageUsers: user.canManageUsers,
      canManageConsolidations: user.canManageConsolidations,
      canManagePackages: user.canManagePackages,
      canManageCarriers: user.canManageCarriers,
      canViewFinancials: user.canViewFinancials,
      canManageSettings: user.canManageSettings
    }

    // Definir cookie de sessão
    const response = NextResponse.json({
      success: true,
      data: {
        user: session,
        message: 'Login realizado com sucesso'
      }
    })

    // Cookie simples (em produção, usar JWT)
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
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
