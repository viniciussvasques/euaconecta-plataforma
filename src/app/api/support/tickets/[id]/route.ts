import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Buscar ticket por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        messages: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: ticket
    })

  } catch (error) {
    console.error('Erro ao buscar ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Atualizar ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { status, priority, assignedTo } = body

    // Verificar se o ticket existe
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id }
    })

    if (!existingTicket) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(status === 'CLOSED' && { closedAt: new Date() }),
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
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        messages: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedTicket,
      message: 'Ticket atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Deletar ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar se o ticket existe
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id }
    })

    if (!existingTicket) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    // Deletar o ticket (cascade deletará as mensagens)
    await prisma.supportTicket.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Ticket deletado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
