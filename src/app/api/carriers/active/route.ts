import { NextResponse } from 'next/server'
import { CarrierService } from '@/lib/carriers'

const carrierService = new CarrierService()

export async function GET() {
  try {
    const activeCarriers = await carrierService.getAllActive()
    
    return NextResponse.json({
      success: true,
      data: activeCarriers
    })
  } catch (error) {
    console.error('Erro ao buscar transportadoras ativas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
