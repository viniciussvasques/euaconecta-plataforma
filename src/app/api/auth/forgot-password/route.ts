import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, turnstileToken } = await request.json()
    if (!email) return NextResponse.json({ success: true, message: 'Se existir, enviaremos um e‑mail' })

    // Anti-bot opcional
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: turnstileToken })
      })
      const t = await res.json()
      if (!t.success) return NextResponse.json({ success: true, message: 'Se existir, enviaremos um e‑mail' })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ success: true, message: 'Se existir, enviaremos um e‑mail' })

    // Invalidar tokens anteriores
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

    // Gerar token raw e armazenar hash
    const raw = crypto.randomBytes(32).toString('hex')
    const tokenHash = await bcrypt.hash(raw, 10)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 60 min
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined
      }
    })

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset?token=${raw}`
    await EmailService.sendMail(EmailService.passwordResetEmail(user.name, user.email, resetLink))

    return NextResponse.json({ success: true, message: 'Se existir, enviaremos um e‑mail' })
  } catch (error) {
    console.error('Erro em forgot-password:', error)
    return NextResponse.json({ success: true, message: 'Se existir, enviaremos um e‑mail' })
  }
}




























