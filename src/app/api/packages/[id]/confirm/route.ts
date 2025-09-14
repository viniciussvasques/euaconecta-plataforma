import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/notifications'
import { NotificationType } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    if (!session.userId || !['ADMIN', 'SUPER_ADMIN', 'OPERATOR'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { confirmedWeightGrams, confirmationPhoto, packageCondition, notes } = body

    // Validar campos obrigatórios
    if (!confirmedWeightGrams) {
      return NextResponse.json(
        { success: false, error: 'Peso confirmado é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o pacote existe
    const existingPackage = await prisma.package.findUnique({
      where: { id }
    })

    if (!existingPackage) {
      return NextResponse.json(
        { success: false, error: 'Pacote não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o pacote ainda está pendente
    if (existingPackage.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Pacote já foi processado' },
        { status: 400 }
      )
    }

    // Atualizar o pacote com confirmação
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        status: 'RECEIVED',
        confirmedWeightGrams: parseInt(confirmedWeightGrams),
        confirmationPhoto,
        packageCondition,
        notes: notes || existingPackage.notes,
        confirmedAt: new Date(),
        confirmedBy: session.userId,
        // Atualizar o peso declarado pelo cliente se necessário
        weightGrams: parseInt(confirmedWeightGrams)
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            suiteNumber: true
          }
        }
      }
    })

    // Notificar o dono do pacote
    await NotificationService.create({
      userId: existingPackage.ownerId,
      type: NotificationType.IN_APP,
      title: 'Pacote confirmado',
      message: `Seu pacote foi confirmado e pesado (${confirmedWeightGrams}g).`,
    })

    return NextResponse.json({
      success: true,
      data: updatedPackage,
      message: 'Pacote confirmado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao confirmar pacote:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
