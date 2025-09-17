import { NextRequest, NextResponse } from 'next/server'
import { addressService } from '@/lib/addresses'
import { verifyAccessToken } from '@/lib/jwt'
type MinimalSession = { userId: string }

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const address = await addressService.getById(id)

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Endereço não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o endereço pertence ao usuário
    if (address.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: address
    })
  } catch (error) {
    console.error('Erro ao buscar endereço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, line1, line2, city, state, postalCode, country, isDefault } = body

    // Verificar se o endereço existe e pertence ao usuário
    const existingAddress = await addressService.getById(id)
    if (!existingAddress) {
      return NextResponse.json(
        { success: false, error: 'Endereço não encontrado' },
        { status: 404 }
      )
    }

    if (existingAddress.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const address = await addressService.update(id, {
      name,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault
    })

    return NextResponse.json({
      success: true,
      data: address
    })
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o endereço existe e pertence ao usuário
    const existingAddress = await addressService.getById(id)
    if (!existingAddress) {
      return NextResponse.json(
        { success: false, error: 'Endereço não encontrado' },
        { status: 404 }
      )
    }

    if (existingAddress.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      )
    }

    await addressService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Endereço deletado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar endereço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
