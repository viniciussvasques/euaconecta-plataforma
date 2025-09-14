import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/shipments/[id] - Buscar detalhes de um envio específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            suiteNumber: true,
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
            orderNumber: true,
            carrier: true,
            declaredValue: true,
            packageType: true,
            lengthCm: true,
            widthCm: true,
            heightCm: true,
            consolidationGroup: {
              select: {
                id: true,
                consolidationType: true,
                status: true,
                trackingCode: true,
                customInstructions: true,
                extraProtection: true,
                removeInvoice: true,
                beforePhotos: true,
                afterPhotos: true,
                consolidationFee: true,
                storageFee: true,
                finalWeightGrams: true,
                openedAt: true,
                closedAt: true,
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

    if (!shipment) {
      return NextResponse.json(
        { success: false, error: 'Envio não encontrado' },
        { status: 404 }
      )
    }

    const response = NextResponse.json({ success: true, data: shipment })
    
    // Configurar headers de cache
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Erro ao buscar detalhes do envio:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
