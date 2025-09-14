import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function ensureAdmin(session: { role?: string }) {
  return session && ['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(session.role || '')
}

export async function GET() {
  const list = await prisma.warehouseAddress.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ success: true, data: list })
}

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie) return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  const session = JSON.parse(sessionCookie.value)
  if (!ensureAdmin(session)) return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })

  const body = await request.json()
  const created = await prisma.warehouseAddress.create({ data: body })
  return NextResponse.json({ success: true, data: created })
}


