import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/packages/stats - Estatísticas dos pacotes
export async function GET() {
  try {
    const [total, received, readyToShip, shipped, pendingConsolidation] = await Promise.all([
      prisma.package.count(),
      prisma.package.count({ where: { status: 'RECEIVED' } }),
      prisma.package.count({ where: { status: 'READY_TO_SHIP' } }),
      prisma.package.count({ where: { status: 'SHIPPED' } }),
      prisma.package.count({ where: { consolidationStatus: 'PENDING' } }),
    ])

    return NextResponse.json({
      total,
      received,
      readyToShip,
      shipped,
      pendingConsolidation,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos pacotes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
