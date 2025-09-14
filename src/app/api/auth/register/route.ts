import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/users'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { EmailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await UserService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Este email já está em uso' },
        { status: 400 }
      )
    }

    // Criar usuário como CLIENT (inativo por padrão)
    const newUser = await UserService.createUser({
      name,
      email,
      password,
      role: 'CLIENT' as const,
      permissions: ['view_own_packages', 'view_own_consolidations', 'create_consolidations'],
      canManageUsers: false,
      canManageConsolidations: false,
      canManagePackages: false,
      canManageCarriers: false,
      canViewFinancials: false,
      canManageSettings: false
    })
    // Gerar token de ativação e salvar no usuário
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
    await prisma.user.update({
      where: { id: newUser.id },
      data: { activationToken: token, activationTokenExpires: expires }
    })

    // Enviar e-mail de ativação
    const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/activate?token=${token}`
    const activationEmail = EmailService.activationEmail(newUser.name, newUser.email, activationLink)
    try {
      if (process.env.EMAIL_NOTIFICATIONS !== 'false') {
        await EmailService.sendMail(activationEmail)
      }
    } catch (e) {
      console.error('Falha ao enviar email de ativação:', e)
    }

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        suiteNumber: newUser.suiteNumber
      },
      message: 'Conta criada! Enviamos um e-mail de ativação. Verifique sua caixa de entrada.'
    })
  } catch (error) {
    console.error('Erro ao criar conta:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
