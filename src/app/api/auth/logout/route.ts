import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Revogar refresh token se existir
    const refresh = request.cookies.get('refresh_token')?.value
    if (refresh) {
      const tokens = await prisma.refreshToken.findMany({ where: { revokedAt: null } })
      for (const t of tokens) {
        if (await bcrypt.compare(refresh, t.tokenHash)) {
          await prisma.refreshToken.update({ where: { id: t.id }, data: { revokedAt: new Date() } })
          break
        }
      }
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
