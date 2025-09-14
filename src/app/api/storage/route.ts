import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/storage'

export async function GET() {
  try {
    const policies = await storageService.getAllPolicies()
    
    return NextResponse.json({
      success: true,
      data: policies
    })
  } catch (error) {
    console.error('Erro ao buscar políticas de armazenamento:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validar dados obrigatórios
    if (!data.freeDays) {
      return NextResponse.json(
        { success: false, error: 'Período gratuito é obrigatório' },
        { status: 400 }
      )
    }
    
    // Criar política com valores padrão para campos não enviados
    const policyData = {
      freeDays: data.freeDays,
      dailyRateSmall: data.dailyRateSmall || 0,
      dailyRateMedium: data.dailyRateMedium || 0,
      dailyRateLarge: data.dailyRateLarge || 0,
      dailyRatePerItem: data.dailyRatePerItem || 0,
      flatDailyRateUsdCents: data.flatDailyRateUsdCents,
      maxDaysAllowed: data.maxDaysAllowed || 90,
      warningDays: data.warningDays || 7,
      weekendCharges: false,
      holidayCharges: false
    }
    
    // Criar política
    const policy = await storageService.create(policyData)
    
    return NextResponse.json({
      success: true,
      data: policy
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar política de armazenamento:', error)
    
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
