import { NextRequest, NextResponse } from 'next/server'
import { SuiteManager } from '@/lib/suite-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const suiteNumber = searchParams.get('suiteNumber')

    if (suiteNumber) {
      // Buscar usuário por número de suite
      const user = await SuiteManager.getUserBySuiteNumber(parseInt(suiteNumber))
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Suite não encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: user })
    }

    // Listar todas as suites ocupadas
    const occupiedSuites = await SuiteManager.getOccupiedSuites()
    return NextResponse.json({ success: true, data: occupiedSuites })
  } catch (error) {
    console.error('Erro ao buscar suites:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
