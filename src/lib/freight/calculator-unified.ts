import { prisma } from '@/lib/database/prisma'

export interface FreightCalculation {
  weight: number
  origin: string
  destination: string
  baseRate: number
  markup: number
  finalRate: number
  currency: string
}

export interface TaxCalculation {
  productValue: number
  freightValue: number
  totalValue: number
  icms: number
  ipi: number
  pis: number
  cofins: number
  totalTaxes: number
  finalValue: number
}

export interface FreightTaxResult {
  productValue: number
  weight: number
  origin: string
  destination: string
  freight: FreightCalculation
  taxes: TaxCalculation
  totalCost: number
  estimatedDelivery: string
}

export class FreightCalculatorService {
  private static readonly BRAZILIAN_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  private static readonly EXCHANGE_RATE = 5.2 // Taxa de câmbio USD/BRL
  private static readonly IMPORT_TAX = 0.60 // 60% de imposto de importação
  private static readonly ICMS_RATE = 0.18 // 18% de ICMS

  /**
   * Calcula o frete baseado no peso e distância
   */
  static async calculateFreight(
    weight: number,
    origin: string,
    destination: string
  ): Promise<FreightCalculation> {
    try {
      // Buscar transportadoras ativas
      const carriers = await prisma.carrier.findMany({
        where: { isActive: true },
        include: { services: true }
      })

      if (carriers.length === 0) {
        throw new Error('Nenhuma transportadora ativa encontrada')
      }

      // Calcular distância (simplificado) - future: use real distance API
      const _distance = this.calculateDistance(origin, destination)

      // Taxa base por kg
      const baseRatePerKg = 0.15 // USD por kg
      const baseRate = weight * baseRatePerKg

      // Markup da transportadora (10-20%)
      const markup = baseRate * 0.15

      // Taxa final
      const finalRate = baseRate + markup

      return {
        weight,
        origin,
        destination,
        baseRate,
        markup,
        finalRate,
        currency: 'USD'
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error)
      throw new Error('Falha ao calcular frete')
    }
  }

  /**
   * Calcula impostos sobre o produto
   */
  static calculateTaxes(
    productValue: number,
    freightValue: number
  ): TaxCalculation {
    const totalValue = productValue + freightValue

    // Imposto de importação (60%)
    const importTax = productValue * this.IMPORT_TAX

    // ICMS (18%)
    const icms = totalValue * this.ICMS_RATE

    // IPI (10%)
    const ipi = productValue * 0.10

    // PIS (1.65%)
    const pis = totalValue * 0.0165

    // COFINS (7.6%)
    const cofins = totalValue * 0.076

    const totalTaxes = importTax + icms + ipi + pis + cofins
    const finalValue = totalValue + totalTaxes

    return {
      productValue,
      freightValue,
      totalValue,
      icms,
      ipi,
      pis,
      cofins,
      totalTaxes,
      finalValue
    }
  }

  /**
   * Calcula frete e impostos completos
   */
  static async calculateFreightAndTaxes(
    productValue: number,
    weight: number,
    origin: string,
    destination: string
  ): Promise<FreightTaxResult> {
    try {
      // Calcular frete
      const freight = await this.calculateFreight(weight, origin, destination)

      // Calcular impostos
      const taxes = this.calculateTaxes(productValue, freight.finalRate)

      // Custo total
      const totalCost = taxes.finalValue

      // Prazo estimado de entrega
      const estimatedDelivery = this.estimateDelivery(origin, destination)

      return {
        productValue,
        weight,
        origin,
        destination,
        freight,
        taxes,
        totalCost,
        estimatedDelivery
      }
    } catch (error) {
      console.error('Erro ao calcular frete e impostos:', error)
      throw new Error('Falha ao calcular frete e impostos')
    }
  }

  /**
   * Calcula distância entre estados (simplificado)
   */
  private static calculateDistance(origin: string, destination: string): number {
    // Mapeamento simplificado de distâncias entre estados
    const distances: Record<string, Record<string, number>> = {
      'SP': { 'RJ': 400, 'MG': 300, 'PR': 200, 'SC': 400, 'RS': 600 },
      'RJ': { 'SP': 400, 'MG': 200, 'ES': 100 },
      'MG': { 'SP': 300, 'RJ': 200, 'ES': 100, 'BA': 400 },
      'PR': { 'SP': 200, 'SC': 200, 'RS': 400 },
      'SC': { 'PR': 200, 'RS': 200, 'SP': 400 },
      'RS': { 'SC': 200, 'PR': 400, 'SP': 600 }
    }

    return distances[origin]?.[destination] || 500 // Distância padrão
  }

  /**
   * Estima prazo de entrega
   */
  private static estimateDelivery(origin: string, destination: string): string {
    const distance = this.calculateDistance(origin, destination)

    if (distance <= 200) return '1-2 dias úteis'
    if (distance <= 400) return '2-3 dias úteis'
    if (distance <= 600) return '3-5 dias úteis'
    return '5-7 dias úteis'
  }

  /**
   * Valida dados de entrada
   */
  static validateInput(
    productValue: number,
    weight: number,
    origin: string,
    destination: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (productValue <= 0) {
      errors.push('Valor do produto deve ser maior que zero')
    }

    if (weight <= 0) {
      errors.push('Peso deve ser maior que zero')
    }

    if (!this.BRAZILIAN_STATES.includes(origin)) {
      errors.push('Estado de origem inválido')
    }

    if (!this.BRAZILIAN_STATES.includes(destination)) {
      errors.push('Estado de destino inválido')
    }

    if (origin === destination) {
      errors.push('Origem e destino não podem ser iguais')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Obtém lista de estados brasileiros
   */
  static getBrazilianStates(): string[] {
    return [...this.BRAZILIAN_STATES]
  }
}
