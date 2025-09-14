import { NextRequest, NextResponse } from 'next/server'
import { addressService } from '@/lib/addresses'

export async function GET(request: NextRequest) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    if (!session.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const addresses = await addressService.getByUserId(session.userId)

    return NextResponse.json({
      success: true,
      data: addresses
    })
  } catch (error) {
    console.error('Erro ao buscar endereços:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    if (!session.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, line1, line2, city, state, postalCode, country, isDefault } = body

    // Validação básica
    if (!name || !line1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: nome, endereço, cidade, estado, CEP' },
        { status: 400 }
      )
    }

    const address = await addressService.create({
      userId: session.userId,
      name,
      line1,
      line2,
      city,
      state,
      postalCode,
      country: country || 'BR',
      isDefault: isDefault || false
    })

    return NextResponse.json({
      success: true,
      data: address
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar endereço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
