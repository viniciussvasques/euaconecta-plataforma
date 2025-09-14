import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Buscar tickets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (status) {
      where.status = status
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: tickets
    })

  } catch (error) {
    console.error('Erro ao buscar tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Criar novo ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, priority, userId } = body

    if (!title || !description || !category || !priority || !userId) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        title,
        description,
        category,
        priority,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        messages: true
      }
    })

    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket criado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao criar ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
