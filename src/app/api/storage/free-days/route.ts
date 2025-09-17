import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { storageService } from '@/lib/storage'
import { verifyAccessToken } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) return NextResponse.json({ success: true, data: { remainingDays: 0, usedDays: 0, maxStorageDays: 0 } })
    let userId: string | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      userId = String(payload.sub || '')
    } catch {
      try { userId = JSON.parse(sessionCookie.value)?.userId || null } catch {}
    }
    if (!userId) return NextResponse.json({ success: true, data: { remainingDays: 0, usedDays: 0, maxStorageDays: 0 } })

    // Carrega a política ATIVA diretamente do banco
    const policy = await storageService.getActivePolicy()
    const maxStorageDays = policy?.freeDays ?? 30

    // Base do contador: desde a criação da CONTA do usuário
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } })
    const accountStart = user?.createdAt ? new Date(user.createdAt) : new Date()
    const now = new Date()
    const usedDays = Math.max(0, Math.floor((now.getTime() - accountStart.getTime()) / (1000 * 60 * 60 * 24)))

    const remainingDays = Math.max(0, maxStorageDays - usedDays)

    return new NextResponse(
      JSON.stringify({ success: true, data: { remainingDays, usedDays, maxStorageDays } }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    )
    } catch {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    )
  }
}
