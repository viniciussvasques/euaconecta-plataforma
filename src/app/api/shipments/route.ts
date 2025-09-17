import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/shipments - Listar envios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    const where: Record<string, string | { in: string[] }> = {}

    if (userId) {
      where.userId = userId
    }

    if (status) {
      // Mapear status do frontend para o enum do Prisma
      const statusMap: Record<string, string> = {
        'pending': 'DRAFT',
        'in_transit': 'IN_TRANSIT',
        'delivered': 'DELIVERED',
        'cancelled': 'CANCELLED'
      }
      where.status = statusMap[status] || status
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            consolidationGroup: {
              select: {
                id: true,
                consolidationType: true,
                status: true,
              }
            }
          }
        },
        carrier: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit && { take: parseInt(limit) }),
    })

    const response = NextResponse.json({ success: true, data: shipments })

    // Configurar headers de cache para evitar cache desnecessário
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Erro ao buscar envios:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/shipments - Criar novo envio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      userId,
      outboundCarrier,
      trackingOut,
      // estimatedDeliveryDate, // Removido - não usado
      // actualDeliveryDate, // Removido - não usado
      // shippingCostCents, // Removido - não usado
      // insuranceCostCents, // Removido - não usado
      // customsDutyCents, // Removido - não usado
      // notes, // Removido - não usado
    } = body

    // Validar campos obrigatórios
    if (!userId || !outboundCarrier) {
      return NextResponse.json(
        { success: false, error: 'Usuário e transportadora são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const shipment = await prisma.shipment.create({
      data: {
        userId,
        outboundCarrier,
        trackingOut,
        status: 'DRAFT',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            consolidationGroup: {
              select: {
                id: true,
                consolidationType: true,
                status: true,
              }
            }
          }
        },
        carrier: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: shipment }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar envio:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
