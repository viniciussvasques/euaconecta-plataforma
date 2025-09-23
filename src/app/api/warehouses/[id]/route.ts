import { NextRequest, NextResponse } from 'next/server'
import { withDb } from '@/lib/database/prisma-client'
import { withDatabaseConnection } from '@/lib/database/middleware'
import { verifyAccessToken } from '@/lib/auth/jwt'
type MinimalSession = { userId: string; role: string }

function ensureAdmin(session: { role?: string }) {
  return session && ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(session.role || '')
}

export const GET = withDatabaseConnection(async (request: NextRequest) => {
  const id = request.nextUrl.pathname.split('/').pop() || '';
  return withDb(async (prisma) => {
    const item = await prisma.warehouseAddress.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ success: false, error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json({ success: true, data: item })
  })
})

export const PUT = withDatabaseConnection(async (request: NextRequest) => {
  const id = request.nextUrl.pathname.split('/').pop() || '';
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
    const body = await request.json()
    const updated = await prisma.warehouseAddress.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, data: updated })
  })
})

export const DELETE = withDatabaseConnection(async (request: NextRequest) => {
  const id = request.nextUrl.pathname.split('/').pop() || '';
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
    await prisma.warehouseAddress.delete({ where: { id } })
    return NextResponse.json({ success: true })
  })
})
