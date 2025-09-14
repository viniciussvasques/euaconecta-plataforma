import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Buscar consolidação por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const consolidation = await prisma.consolidationGroup.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
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
            heightCm: true
          }
        },
      }
    })

    if (!consolidation) {
      return NextResponse.json(
        { success: false, error: 'Consolidação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: consolidation
    })

  } catch (error) {
    console.error('Erro ao buscar consolidação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Atualizar consolidação
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      name,
      consolidationType,
      consolidationFee,
      storageFee,
      finalWeightGrams,
      trackingCode,
      customInstructions,
      boxSize
    } = body

    // Verificar se a consolidação existe
    const existingConsolidation = await prisma.consolidationGroup.findUnique({
      where: { id }
    })

    if (!existingConsolidation) {
      return NextResponse.json(
        { success: false, error: 'Consolidação não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar a consolidação
    const updatedConsolidation = await prisma.consolidationGroup.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(consolidationType !== undefined && { consolidationType }),
        ...(consolidationFee !== undefined && { consolidationFee }),
        ...(storageFee !== undefined && { storageFee }),
        ...(finalWeightGrams !== undefined && { finalWeightGrams }),
        ...(trackingCode !== undefined && { trackingCode }),
        ...(customInstructions !== undefined && { customInstructions }),
        ...(boxSize !== undefined && { boxSize }),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
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
            heightCm: true
          }
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedConsolidation,
      message: 'Consolidação atualizada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar consolidação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Deletar consolidação
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar se a consolidação existe
    const existingConsolidation = await prisma.consolidationGroup.findUnique({
      where: { id }
    })

    if (!existingConsolidation) {
      return NextResponse.json(
        { success: false, error: 'Consolidação não encontrada' },
        { status: 404 }
      )
    }

    // Deletar a consolidação
    await prisma.consolidationGroup.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Consolidação deletada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar consolidação:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}