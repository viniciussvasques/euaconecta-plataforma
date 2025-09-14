import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function ensureAdmin(session: { role?: string }) {
  return session && ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(session.role || '')
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  const session = JSON.parse(sessionCookie.value)
  if (!ensureAdmin(session)) return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })

  await prisma.$transaction([
    prisma.warehouseAddress.updateMany({ data: { isDefault: false }, where: { isDefault: true } }),
    prisma.warehouseAddress.update({ where: { id }, data: { isDefault: true } }),
  ])
  return NextResponse.json({ success: true })
}


