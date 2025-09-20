import { prisma } from '@/lib/prisma'

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
  totalTax: number
  finalValue: number
  currency: string
}

export interface FreightTaxResult {
  productValue: number
  weight: number
  origin: string
  destination: string
  freight: FreightCalculation
  taxes: TaxCalculation
  disclaimer: string
}

// Tabela de frete APC (exemplo - deve ser configurável)
const APC_FREIGHT_TABLE = {
  '0.1': 15.50,
  '0.2': 18.30,
  '0.3': 21.10,
  '0.4': 23.90,
  '0.5': 26.70,
  '0.6': 29.50,
  '0.7': 32.30,
  '0.8': 35.10,
  '0.9': 37.90,
  '1.0': 40.70,
  '1.1': 43.50,
  '1.2': 46.30,
  '1.3': 49.10,
  '1.4': 51.90,
  '1.5': 54.70,
  '1.6': 57.50,
  '1.7': 60.30,
  '1.8': 63.10,
  '1.9': 65.90,
  '2.0': 68.70,
  '2.5': 78.20,
  '3.0': 87.70,
  '3.5': 97.20,
  '4.0': 106.70,
  '4.5': 116.20,
  '5.0': 125.70,
  '6.0': 144.70,
  '7.0': 163.70,
  '8.0': 182.70,
  '9.0': 201.70,
  '10.0': 220.70,
  '12.0': 258.70,
  '15.0': 304.70,
  '20.0': 384.70,
  '25.0': 464.70,
  '30.0': 544.70
}

// Alíquotas de impostos no Brasil (2024)
const TAX_RATES = {
  ICMS: 0.18, // 18% - varia por estado
  IPI: 0.10,  // 10% - varia por produto
  PIS: 0.0165, // 1.65%
  COFINS: 0.076, // 7.6%
}

export class FreightCalculatorService {
  /**
   * Calcula o frete baseado no peso e origem/destino
   */
  static async calculateFreight(
    weight: number,
    origin: string,
    destination: string,
    markup: number = 0.20 // 20% de markup padrão
  ): Promise<FreightCalculation> {
    // Encontrar a taxa base na tabela APC
    const baseRate = this.getBaseRate(weight)

    // Aplicar markup
    const finalRate = baseRate * (1 + markup)

    return {
      weight,
      origin,
      destination,
      baseRate,
      markup,
      finalRate,
      currency: 'BRL'
    }
  }

  /**
   * Calcula os impostos sobre produto + frete
   */
  static calculateTaxes(
    productValue: number,
    freightValue: number
  ): TaxCalculation {
    const totalValue = productValue + freightValue

    const icms = productValue * TAX_RATES.ICMS
    const ipi = productValue * TAX_RATES.IPI
    const pis = totalValue * TAX_RATES.PIS
    const cofins = totalValue * TAX_RATES.COFINS

    const totalTax = icms + ipi + pis + cofins
    const finalValue = totalValue + totalTax

    return {
      productValue,
      freightValue,
      totalValue,
      icms,
      ipi,
      pis,
      cofins,
      totalTax,
      finalValue,
      currency: 'BRL'
    }
  }

  /**
   * Calcula frete + impostos completos
   */
  static async calculateFreightAndTaxes(
    productValue: number,
    weight: number,
    origin: string,
    destination: string,
    markup: number = 0.20
  ): Promise<FreightTaxResult> {
    const freight = await this.calculateFreight(weight, origin, destination, markup)
    const taxes = this.calculateTaxes(productValue, freight.finalRate)

    return {
      productValue,
      weight,
      origin,
      destination,
      freight,
      taxes,
      disclaimer: 'Os valores são estimativas baseadas nas alíquotas atuais. Valores finais podem variar conforme legislação vigente e características específicas do produto.'
    }
  }

  /**
   * Busca a taxa base na tabela APC baseada no peso
   */
  private static getBaseRate(weight: number): number {
    const weights = Object.keys(APC_FREIGHT_TABLE).map(Number).sort((a, b) => a - b)

    // Se o peso for exato, retorna a taxa
    if (APC_FREIGHT_TABLE[weight.toString() as keyof typeof APC_FREIGHT_TABLE]) {
      return APC_FREIGHT_TABLE[weight.toString() as keyof typeof APC_FREIGHT_TABLE]
    }

    // Se o peso for menor que o mínimo, retorna a taxa mínima
    if (weight < weights[0]) {
      return APC_FREIGHT_TABLE[weights[0].toString() as keyof typeof APC_FREIGHT_TABLE]
    }

    // Se o peso for maior que o máximo, retorna a taxa máxima
    if (weight > weights[weights.length - 1]) {
      return APC_FREIGHT_TABLE[weights[weights.length - 1].toString() as keyof typeof APC_FREIGHT_TABLE]
    }

    // Interpolação linear entre os pesos mais próximos
    for (let i = 0; i < weights.length - 1; i++) {
      if (weight >= weights[i] && weight <= weights[i + 1]) {
        const rate1 = APC_FREIGHT_TABLE[weights[i].toString() as keyof typeof APC_FREIGHT_TABLE]
        const rate2 = APC_FREIGHT_TABLE[weights[i + 1].toString() as keyof typeof APC_FREIGHT_TABLE]

        // Interpolação linear
        const ratio = (weight - weights[i]) / (weights[i + 1] - weights[i])
        return rate1 + (rate2 - rate1) * ratio
      }
    }

    // Fallback para a taxa máxima
    return APC_FREIGHT_TABLE[weights[weights.length - 1].toString() as keyof typeof APC_FREIGHT_TABLE]
  }

  /**
   * Busca configurações de markup do banco de dados
   */
  static async getMarkupConfig(): Promise<number> {
    try {
      const config = await prisma.platformConfig.findFirst()

      return config ? Number(config.freightMarkupPercentage) : 0.20 // 20% padrão
    } catch (error) {
      console.error('Erro ao buscar configuração de markup:', error)
      return 0.20
    }
  }

  /**
   * Salva configuração de markup no banco
   */
  static async setMarkupConfig(markup: number): Promise<void> {
    try {
      const existingConfig = await prisma.platformConfig.findFirst()

      if (existingConfig) {
        await prisma.platformConfig.update({
          where: { id: existingConfig.id },
          data: { freightMarkupPercentage: markup }
        })
      } else {
        // Criar configuração padrão se não existir
        await prisma.platformConfig.create({
          data: {
            companyName: 'EuaConecta',
            addressLine1: '123 Main St',
            city: 'Miami',
            state: 'FL',
            postalCode: '33101',
            phone: '+1-555-0123',
            email: 'admin@euaconecta.com',
            freightMarkupPercentage: markup
          }
        })
      }
    } catch (error) {
      console.error('Erro ao salvar configuração de markup:', error)
      throw error
    }
  }
}
