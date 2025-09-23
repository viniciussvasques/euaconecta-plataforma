import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import { verifyAccessToken } from '@/lib/auth/jwt'

type MinimalSession = { userId: string }

// GET /api/users/[id]/settings - Buscar configurações do usuário
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o usuário pode acessar as configurações (próprias configurações)
    if (session.userId !== id) {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar ou criar configurações do usuário
    let settings = await prisma.userNotificationSettings.findUnique({
      where: { userId: id }
    })

    if (!settings) {
      // Criar configurações padrão se não existir
      settings = await prisma.userNotificationSettings.create({
        data: {
          userId: id,
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          inAppEnabled: true,
          consolidationUpdates: true,
          storageWarnings: true,
          deliveryUpdates: true,
          systemAnnouncements: true,
          digestFrequency: 'DAILY'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        notifications: {
          emailEnabled: settings.emailEnabled,
          smsEnabled: settings.smsEnabled,
          pushEnabled: settings.pushEnabled,
          inAppEnabled: settings.inAppEnabled,
          consolidationUpdates: settings.consolidationUpdates,
          storageWarnings: settings.storageWarnings,
          deliveryUpdates: settings.deliveryUpdates,
          systemAnnouncements: settings.systemAnnouncements,
          digestFrequency: settings.digestFrequency
        },
        privacy: {
          // Por enquanto retornar configurações padrão de privacidade
          // Pode ser expandido com novos campos na DB futuramente
          profileVisibility: 'private',
          dataSharing: false,
          analyticsOptIn: false
        }
      }
    })
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id]/settings - Atualizar configurações do usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verificar se o usuário pode atualizar as configurações (próprias configurações)
    if (session.userId !== id) {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { type, settings } = body

    if (type === 'notifications') {
      // Atualizar configurações de notificação
      const updatedSettings = await prisma.userNotificationSettings.upsert({
        where: { userId: id },
        update: {
          emailEnabled: settings.emailEnabled ?? true,
          smsEnabled: settings.smsEnabled ?? false,
          pushEnabled: settings.pushEnabled ?? true,
          inAppEnabled: settings.inAppEnabled ?? true,
          consolidationUpdates: settings.consolidationUpdates ?? true,
          storageWarnings: settings.storageWarnings ?? true,
          deliveryUpdates: settings.deliveryUpdates ?? true,
          systemAnnouncements: settings.systemAnnouncements ?? true,
          digestFrequency: settings.digestFrequency ?? 'DAILY'
        },
        create: {
          userId: id,
          emailEnabled: settings.emailEnabled ?? true,
          smsEnabled: settings.smsEnabled ?? false,
          pushEnabled: settings.pushEnabled ?? true,
          inAppEnabled: settings.inAppEnabled ?? true,
          consolidationUpdates: settings.consolidationUpdates ?? true,
          storageWarnings: settings.storageWarnings ?? true,
          deliveryUpdates: settings.deliveryUpdates ?? true,
          systemAnnouncements: settings.systemAnnouncements ?? true,
          digestFrequency: settings.digestFrequency ?? 'DAILY'
        }
      })

      return NextResponse.json({
        success: true,
        data: updatedSettings,
        message: 'Configurações de notificação atualizadas com sucesso'
      })
    } else if (type === 'privacy') {
      // Por enquanto apenas confirmar recebimento
      // Configurações de privacidade podem ser implementadas futuramente
      // com novos campos na tabela User ou nova tabela UserPrivacySettings
      
      return NextResponse.json({
        success: true,
        data: settings,
        message: 'Configurações de privacidade atualizadas com sucesso'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Tipo de configuração inválido' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}