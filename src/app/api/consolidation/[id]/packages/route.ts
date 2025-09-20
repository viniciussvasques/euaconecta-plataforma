import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database/prisma'

// GET /api/consolidation/[id]/packages - Listar pacotes de uma caixa
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: consolidationId } = await params

    const consolidation = await prisma.consolidationGroup.findUnique({
      where: { id: consolidationId },
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
            createdAt: true,
          }
        }
      }
    })

    if (!consolidation) {
      return NextResponse.json(
        { success: false, error: 'Caixa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: consolidation.packages
    })
  } catch (error) {
    console.error('Erro ao buscar pacotes da caixa:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/consolidation/[id]/packages - Adicionar pacote à caixa
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: consolidationId } = await params
    const { packageId } = await request.json()

    if (!packageId) {
      return NextResponse.json(
        { success: false, error: 'ID do pacote é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a caixa existe e está aberta
    const consolidation = await prisma.consolidationGroup.findUnique({
      where: { id: consolidationId },
      include: {
        packages: true
      }
    })

    if (!consolidation) {
      return NextResponse.json(
        { success: false, error: 'Caixa não encontrada' },
        { status: 404 }
      )
    }

    if (consolidation.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, error: 'Caixa deve estar aberta para adicionar pacotes' },
        { status: 400 }
      )
    }

    // Verificar se o pacote existe e está disponível
    const packageToAdd = await prisma.package.findUnique({
      where: { id: packageId }
    })

    if (!packageToAdd) {
      return NextResponse.json(
        { success: false, error: 'Pacote não encontrado' },
        { status: 404 }
      )
    }

    if (packageToAdd.ownerId !== consolidation.userId) {
      return NextResponse.json(
        { success: false, error: 'Pacote não pertence ao usuário' },
        { status: 403 }
      )
    }

    // Verificar se o pacote já está na caixa
    const packageAlreadyInBox = consolidation.packages.some((pkg: {id: string}) => pkg.id === packageId)
    if (packageAlreadyInBox) {
      return NextResponse.json(
        { success: false, error: 'Pacote já está nesta caixa' },
        { status: 400 }
      )
    }

    // Verificar limite de itens
    if (consolidation.packages.length >= consolidation.maxItemsAllowed) {
      return NextResponse.json(
        { success: false, error: 'Caixa atingiu o limite máximo de itens' },
        { status: 400 }
      )
    }

    // Adicionar pacote à caixa
    await prisma.consolidationGroup.update({
      where: { id: consolidationId },
      data: {
        packages: {
          connect: { id: packageId }
        },
        // Atualizar peso atual
        currentWeightGrams: {
          increment: packageToAdd.weightGrams || 0
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Pacote adicionado à caixa com sucesso'
    })
  } catch (error) {
    console.error('Erro ao adicionar pacote à caixa:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/consolidation/[id]/packages - Remover pacote da caixa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: consolidationId } = await params
    const { searchParams } = new URL(request.url)
    const packageId = searchParams.get('packageId')

    if (!packageId) {
      return NextResponse.json(
        { success: false, error: 'ID do pacote é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a caixa existe e está aberta
    const consolidation = await prisma.consolidationGroup.findUnique({
      where: { id: consolidationId },
      include: {
        packages: true
      }
    })

    if (!consolidation) {
      return NextResponse.json(
        { success: false, error: 'Caixa não encontrada' },
        { status: 404 }
      )
    }

    if (consolidation.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, error: 'Caixa deve estar aberta para remover pacotes' },
        { status: 400 }
      )
    }

    // Verificar se o pacote está na caixa
    const packageInBox = consolidation.packages.find((pkg: {id: string}) => pkg.id === packageId)
    if (!packageInBox) {
      return NextResponse.json(
        { success: false, error: 'Pacote não está nesta caixa' },
        { status: 404 }
      )
    }

    // Remover pacote da caixa
    await prisma.consolidationGroup.update({
      where: { id: consolidationId },
      data: {
        packages: {
          disconnect: { id: packageId }
        },
        // Atualizar peso atual
        currentWeightGrams: {
          decrement: packageInBox.weightGrams || 0
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Pacote removido da caixa com sucesso'
    })
  } catch (error) {
    console.error('Erro ao remover pacote da caixa:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
