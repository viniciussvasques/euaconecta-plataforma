
export interface FreightCalculation {
  baseFreight: number // Frete base da transportadora
  markupAmount: number // Valor do markup aplicado
  processingFee: number // Taxa de processamento
  totalFreight: number // Frete total com markup
  breakdown: {
    baseFreight: number
    markupPercentage: number
    markupAmount: number
    processingFee: number
    total: number
  }
}

export interface ConsolidationCalculation {
  consolidationFee: number
  storageFee: number
  protectionFees: number
  totalFees: number
  estimatedFinalWeight: number
  breakdown: {
    baseFee: number
    perPackageFee: number
    repackMultiplier: number
    protectionCosts: number
    storageCosts: number
  }
}

export class FreightCalculator {
  /**
   * Calcula o markup sobre frete baseado na configuração da plataforma
   */
  static calculateFreightWithMarkup(
    baseFreight: number,
    platformConfig: Record<string, unknown>
  ): FreightCalculation {
    const markupPercentage = Number(platformConfig.freightMarkupPercentage) || 0.15
    const minMarkup = (Number(platformConfig.freightMarkupMinAmount) || 200) / 100
    const maxMarkup = (Number(platformConfig.freightMarkupMaxAmount) || 5000) / 100
    const processingFee = (Number(platformConfig.processingFeeUsdCents) || 300) / 100

    // Calcular markup
    let markupAmount = baseFreight * markupPercentage

    // Aplicar limites mínimo e máximo
    if (markupAmount < minMarkup) {
      markupAmount = minMarkup
    } else if (markupAmount > maxMarkup) {
      markupAmount = maxMarkup
    }

    const totalFreight = baseFreight + markupAmount + processingFee

    return {
      baseFreight,
      markupAmount,
      processingFee,
      totalFreight,
      breakdown: {
        baseFreight,
        markupPercentage,
        markupAmount,
        processingFee,
        total: totalFreight
      }
    }
  }

  /**
   * Calcula taxas de consolidação baseado na configuração da plataforma
   */
  static calculateConsolidationFees(
    packageCount: number,
    consolidationType: 'SIMPLE' | 'REPACK',
    protectionTypes: string[],
    storageDays: number,
    platformConfig: Record<string, unknown>
  ): ConsolidationCalculation {
    const baseFee = (Number(platformConfig.consolidationBaseFeeUsdCents) || 500) / 100
    const perPackageFee = (Number(platformConfig.consolidationPerPackageUsdCents) || 100) / 100
    const repackMultiplier = Number(platformConfig.repackMultiplier) || 1.5

    // Taxa base de consolidação
    let consolidationFee = baseFee + (perPackageFee * packageCount)

    // Aplicar multiplicador para REPACK
    if (consolidationType === 'REPACK') {
      consolidationFee *= repackMultiplier
    }

    // Calcular custos de proteção (estimativa)
    const protectionFees = this.calculateProtectionFees(protectionTypes, packageCount)

    // Calcular custos de armazenamento
    const storageFee = this.calculateStorageFees(storageDays, packageCount, platformConfig)

    const totalFees = consolidationFee + protectionFees + storageFee

    // Estimativa de peso final (com embalagem)
    const estimatedFinalWeight = this.estimateFinalWeight(packageCount, consolidationType)

    return {
      consolidationFee,
      storageFee,
      protectionFees,
      totalFees,
      estimatedFinalWeight,
      breakdown: {
        baseFee,
        perPackageFee,
        repackMultiplier,
        protectionCosts: protectionFees,
        storageCosts: storageFee
      }
    }
  }

  /**
   * Calcula custos de proteção baseado nos tipos selecionados
   */
  private static calculateProtectionFees(protectionTypes: string[], packageCount: number): number {
    const protectionCosts: { [key: string]: number } = {
      'BUBBLE_WRAP': 0.50,      // $0.50 por pacote
      'DOUBLE_BOX': 1.00,       // $1.00 por pacote
      'SECURITY_TAPE': 0.25,    // $0.25 por pacote
      'PAPER_FILLING': 0.30,    // $0.30 por pacote
      'CUSTOM_PACKAGING': 2.00  // $2.00 por pacote
    }

    let totalCost = 0
    for (const protectionType of protectionTypes) {
      totalCost += (protectionCosts[protectionType] || 0) * packageCount
    }

    return totalCost
  }

  /**
   * Calcula custos de armazenamento
   */
  private static calculateStorageFees(storageDays: number, packageCount: number, platformConfig: Record<string, unknown>): number {
    const dailyRate = Number(platformConfig.storageFeePerDay) || 0.50
    const freeDays = Number(platformConfig.maxStorageDays) || 30

    if (storageDays <= freeDays) {
      return 0
    }

    const chargedDays = storageDays - freeDays
    return dailyRate * chargedDays * packageCount
  }

  /**
   * Estima o peso final baseado no número de pacotes e tipo de consolidação
   */
  private static estimateFinalWeight(packageCount: number, consolidationType: 'SIMPLE' | 'REPACK'): number {
    // Peso médio estimado por pacote (em kg)
    const avgPackageWeight = 0.5
    
    // Peso da embalagem de consolidação
    const consolidationPackagingWeight = 0.2
    
    // Peso base estimado
    let estimatedWeight = (avgPackageWeight * packageCount) + consolidationPackagingWeight
    
    // Para REPACK, adicionar peso extra para embalagem adicional
    if (consolidationType === 'REPACK') {
      estimatedWeight += 0.1 * packageCount // +100g por pacote para embalagem extra
    }
    
    return estimatedWeight
  }

  /**
   * Formata valores monetários baseado na moeda configurada
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    const formatters: { [key: string]: Intl.NumberFormat } = {
      'USD': new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      'BRL': new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
      'EUR': new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
    }

    const formatter = formatters[currency] || formatters['USD']
    return formatter.format(amount)
  }

  /**
   * Calcula o frete total incluindo markup e taxas
   */
  static calculateTotalShippingCost(
    baseFreight: number,
    consolidationFees: ConsolidationCalculation,
    platformConfig: Record<string, unknown>
  ): number {
    const freightWithMarkup = this.calculateFreightWithMarkup(baseFreight, platformConfig)
    
    return freightWithMarkup.totalFreight + consolidationFees.totalFees
  }
}
