import { NextRequest, NextResponse } from 'next/server'
import { withDb } from '@/lib/database/prisma-client'
import { withDatabaseConnection } from '@/lib/database/middleware'
import { verifyAccessToken } from '@/lib/auth/jwt'
type MinimalSession = { userId: string; role: string }

function ensureAdmin(session: { role?: string }) {
  return session && ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(session.role || '')
}

export const GET = withDatabaseConnection(async () => {
  return withDb(async (prisma) => {
    const list = await prisma.warehouseAddress.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: list })
  })
})

export const POST = withDatabaseConnection(async (request: NextRequest) => {
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie) {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  
  try {
    // Validar JWT ou aceitar legado
    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || ''), role: String((payload as unknown as { role?: string }).role || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session || !ensureAdmin(session)) return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    
    return withDb(async (prisma) => {
      const body = await request.json()
      const created = await prisma.warehouseAddress.create({ data: body })
      return NextResponse.json({ success: true, data: created })
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
})
