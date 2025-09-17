import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Erro ao buscar depoimentos:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        role: body.role,
        company: body.company,
        content: body.content,
        rating: body.rating,
        avatar: body.avatar,
        isActive: body.isActive,
        order: body.order
      }
    })

    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Erro ao criar depoimento:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
