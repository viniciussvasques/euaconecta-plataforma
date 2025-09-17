import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'

const encoder = new TextEncoder()

export async function POST(request: NextRequest) {
  try {
    const cookies = request.cookies
    const refreshToken = cookies.get('refresh_token')?.value
    if (!refreshToken) {
      return NextResponse.json({ success: false, error: 'Missing refresh token' }, { status: 401 })
    }

    // Buscar hash no BD
    // const tokenHash = await bcrypt.hash(refreshToken, 10) // Removido - não usado
    // Como o hash muda a cada chamada, buscar por comparação manual: listar do usuário não é possível sem sub.
    // Alternativa: armazenar hash estável: usamos bcrypt.compare contra cada registro recente.
    const tokens = await prisma.refreshToken.findMany({ where: { revokedAt: null } })
    const matched = await (async () => {
      for (const t of tokens) {
        if (await bcrypt.compare(refreshToken, t.tokenHash)) return t
      }
      return null
    })()

    if (!matched) {
      return NextResponse.json({ success: false, error: 'Invalid refresh token' }, { status: 401 })
    }

    if (matched.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Expired refresh token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: matched.userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Rotacionar refresh: revogar atual e emitir novo
    await prisma.refreshToken.update({ where: { id: matched.id }, data: { revokedAt: new Date() } })

    const newRefresh = cryptoRandom(64)
    const newHash = await bcrypt.hash(newRefresh, 10)
    const expiresInDays = parseInt(process.env.REFRESH_DAYS || '7', 10)
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newHash,
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    })

    // Access token
    const access = await new SignJWT({ sub: user.id, email: user.email, role: user.role, name: user.name })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRES_IN || '15m')
      .sign(encoder.encode(process.env.JWT_SECRET || ''))

    const res = NextResponse.json({ success: true, data: { message: 'Refreshed' } })
    res.cookies.set('session', access, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 15 })
    res.cookies.set('refresh_token', newRefresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: expiresInDays * 24 * 60 * 60 })
    return res
  } catch {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

function cryptoRandom(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length))
  return out
}
