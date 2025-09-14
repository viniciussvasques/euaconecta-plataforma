import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/users'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const role = searchParams.get('role') || 'CLIENT'
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Buscar usuários por nome, email ou ID
    const users = await UserService.searchUsers(query, role)
    
    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
