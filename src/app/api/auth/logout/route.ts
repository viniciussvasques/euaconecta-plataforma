import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/prisma'
import bcrypt from 'bcryptjs'

// Temporary interface for refresh token
interface RefreshTokenInfo {
  id: string
  tokenHash: string
  userId: string
}

export async function POST(request: NextRequest) {
  try {
    // Obter userId da sessão atual para otimizar a busca
    let userId: string | null = null
    const sessionCookie = request.cookies.get('session')?.value

    if (sessionCookie) {
      try {
        const { verifyAccessToken } = await import('@/lib/auth/jwt')
        const payload = await verifyAccessToken(sessionCookie)
        userId = String(payload.sub || '')
      } catch {
        // Fallback para cookie legado
        try {
          const legacy = JSON.parse(sessionCookie)
          userId = legacy?.userId || null
        } catch {}
      }
    }

    // Revogar refresh token se existir (otimizado com userId)
    const refresh = request.cookies.get('refresh_token')?.value
    if (refresh && userId) {
      // Buscar apenas tokens do usuário atual
      const userTokens = await prisma.refreshToken.findMany({
        where: {
          userId: userId,
          revokedAt: null
        }
      })

      // Processar em paralelo para melhor performance
      const revokePromises = userTokens.map(async (t: RefreshTokenInfo) => {
        if (await bcrypt.compare(refresh, t.tokenHash)) {
          return prisma.refreshToken.update({
            where: { id: t.id },
            data: { revokedAt: new Date() }
          })
        }
        return null
      })

      await Promise.all(revokePromises)
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })

    // Limpar cookies de sessão e refresh
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response

  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
