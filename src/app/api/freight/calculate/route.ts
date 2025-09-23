import { NextRequest, NextResponse } from 'next/server'
import { getAbcPacketRateUSD, AbcPacketService } from '@/lib/freight/abc-packet-rates'
import { PlatformConfig } from '@/lib/config/platform-config'
import { CarrierService } from '@/lib/freight/carriers'

const carrierService = new CarrierService()

type Body = {
  weightGrams: number
  serviceType?: AbcPacketService // 'STANDARD' | 'EXPRESS'
  carrierId?: string
}

export async function POST(request: NextRequest) {
  try {
    // Validar se o request tem body JSON válido
    let body: Body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Corpo da requisição inválido' }, { status: 400 })
    }

    const weightGrams = Number(body?.weightGrams || 0)
    const serviceType = (body?.serviceType || 'STANDARD') as AbcPacketService
    const carrierId = body?.carrierId
    
    // Validações mais específicas
    if (!body.weightGrams) {
      return NextResponse.json({ success: false, error: 'Peso é obrigatório' }, { status: 400 })
    }
    
    if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
      return NextResponse.json({ success: false, error: 'Peso deve ser um número positivo' }, { status: 400 })
    }

    if (weightGrams < 500) { // mínimo 0.5kg
      return NextResponse.json({ success: false, error: 'Peso mínimo é 500g (0.5kg)' }, { status: 400 })
    }

    if (weightGrams > 30000) { // máximo 30kg
      return NextResponse.json({ success: false, error: 'Peso máximo é 30kg' }, { status: 400 })
    }

    let baseUSD: number | null = null
    let carrierName = 'ABC Packet'
    let deliveryTime = '15-20 dias úteis'

    if (carrierId) {
      // Buscar transportadora específica
      const carrier = await carrierService.getById(carrierId)
      if (!carrier) {
        return NextResponse.json({ success: false, error: 'Transportadora não encontrada' }, { status: 404 })
      }

      carrierName = carrier.name

      if (carrier.code === 'ABC') {
        // Usar tabela ABC
        baseUSD = getAbcPacketRateUSD(serviceType, weightGrams)
        deliveryTime = serviceType === 'EXPRESS' ? '7-10 dias úteis' : '15-20 dias úteis'
      } else {
        // Para outras transportadoras, usar taxa base + taxa por kg
        const weightKg = weightGrams / 1000
        baseUSD = Number(carrier.baseRate) + (Number(carrier.ratePerKg) * weightKg)
        deliveryTime = `${carrier.estimatedDays} dias úteis`
      }
    } else {
      // Fallback para ABC se não especificado
      baseUSD = getAbcPacketRateUSD(serviceType, weightGrams)
    }

    if (baseUSD == null) {
      return NextResponse.json({ success: false, error: 'Peso fora da faixa (0.5kg a 30kg)' }, { status: 400 })
    }

    // Carregar markup da plataforma
    const cfg = await PlatformConfig.load()
    const pct = Number(cfg.freightMarkupPercentage ?? 0)
    const min = Number(cfg.freightMarkupMinAmount ?? 0) / 100 // cfg em cents → USD
    const max = Number(cfg.freightMarkupMaxAmount ?? 0) / 100

    const markupValue = Math.min(Math.max(baseUSD * pct, min), max)
    const finalUSD = baseUSD + markupValue

    // Calcular taxas adicionais
    const processingFee = 5.00 // Taxa de processamento fixa
    const floridaTaxRate = 0.0825 // 8.25%
    const subtotal = finalUSD + processingFee
    const floridaTax = subtotal * floridaTaxRate
    const finalPrice = subtotal + floridaTax

    const pricing = {
      basePrice: baseUSD,
      markupAmount: markupValue,
      subtotal: finalUSD,
      floridaTax: floridaTax,
      finalPrice: finalPrice,
      breakdown: {
        abcFreight: baseUSD,
        markupPercentage: pct,
        markupAmount: markupValue,
        processingFee: processingFee,
        subtotal: subtotal,
        floridaTaxRate: floridaTaxRate,
        floridaTax: floridaTax
      }
    }

    const serviceInfo = {
      name: serviceType === 'EXPRESS' ? `${carrierName} Express` : `${carrierName} Standard`,
      description: serviceType === 'EXPRESS' ? 'Entrega expressa' : 'Entrega padrão',
      deliveryTime: deliveryTime
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        weightGrams,
        weightKg: (weightGrams / 1000).toFixed(1),
        serviceType,
        serviceInfo,
        pricing
      } 
    })
    } catch (error) {
    console.error('Erro ao calcular frete:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
