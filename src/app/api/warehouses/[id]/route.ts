import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
type MinimalSession = { userId: string; role: string }

function ensureAdmin(session: { role?: string }) {
  return session && ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(session.role || '')
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.warehouseAddress.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ success: false, error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json({ success: true, data: item })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
  const body = await request.json()
  const updated = await prisma.warehouseAddress.update({ where: { id }, data: body })
  return NextResponse.json({ success: true, data: updated })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
  await prisma.warehouseAddress.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
