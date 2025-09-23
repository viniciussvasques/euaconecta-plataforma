import { NextRequest, NextResponse } from 'next/server'
import { withDb } from '@/lib/database/prisma-client'
import { withDatabaseConnection } from '@/lib/database/middleware'
import { verifyAccessToken } from '@/lib/auth/jwt'
type MinimalSession = { userId: string; role: string }

function ensureAdmin(session: { role?: string }) {
  return session && ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(session.role || '')
}

export const POST = withDatabaseConnection(async (request: NextRequest) => {
  const id = request.nextUrl.pathname.split('/').slice(-2)[0] || '';
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  
  let session: MinimalSession | null = null
  try {
    const payload = await verifyAccessToken(sessionCookie.value)
    session = { userId: String(payload.sub || ''), role: String((payload as unknown as { role?: string }).role || '') }
  } catch {
    try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
  }
  
  if (!session || !ensureAdmin(session)) return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })

  return withDb(async (prisma) => {
    await prisma.$transaction([
      prisma.warehouseAddress.updateMany({ data: { isDefault: false }, where: { isDefault: true } }),
      prisma.warehouseAddress.update({ where: { id }, data: { isDefault: true } }),
    ])
    return NextResponse.json({ success: true })
  })
})
