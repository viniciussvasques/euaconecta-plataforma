import { prisma } from './database/prisma'

export interface StoragePolicyData {
  id: string
  freeDays: number
  dailyRateSmall: number
  dailyRateMedium: number
  dailyRateLarge: number
  dailyRatePerItem: number
  weekendCharges: boolean
  holidayCharges: boolean
  warningDays: number
  isActive: boolean
  flatDailyRateUsdCents?: number
  maxDaysAllowed: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateStoragePolicyData {
  freeDays: number
  dailyRateSmall: number
  dailyRateMedium: number
  dailyRateLarge: number
  dailyRatePerItem: number
  weekendCharges?: boolean
  holidayCharges?: boolean
  warningDays?: number
  flatDailyRateUsdCents?: number
  maxDaysAllowed?: number
}

export interface StorageCalculationParams {
  weightKg: number
  itemCount: number
  daysUsed: number
  includeWeekends?: boolean
  includeHolidays?: boolean
}

export class StorageService {
  // Buscar política ativa
  async getActivePolicy(): Promise<StoragePolicyData | null> {
    const policy = await prisma.storagePolicy.findFirst({
      where: { isActive: true }
    })

    if (!policy) return null

    return {
      ...policy,
      dailyRateSmall: Number(policy.dailyRateSmall),
      dailyRateMedium: Number(policy.dailyRateMedium),
      dailyRateLarge: Number(policy.dailyRateLarge),
      dailyRatePerItem: Number(policy.dailyRatePerItem),
      flatDailyRateUsdCents: policy.flatDailyRateUsdCents ?? undefined,
      maxDaysAllowed: policy.maxDaysAllowed,
    }
  }

  // Buscar todas as políticas
  async getAllPolicies(): Promise<StoragePolicyData[]> {
    const policies = await prisma.storagePolicy.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return policies.map(policy => ({
      ...policy,
      dailyRateSmall: Number(policy.dailyRateSmall),
      dailyRateMedium: Number(policy.dailyRateMedium),
      dailyRateLarge: Number(policy.dailyRateLarge),
      dailyRatePerItem: Number(policy.dailyRatePerItem),
      flatDailyRateUsdCents: policy.flatDailyRateUsdCents ?? undefined,
      maxDaysAllowed: policy.maxDaysAllowed,
    }))
  }

  // Buscar por ID
  async getById(id: string): Promise<StoragePolicyData | null> {
    const policy = await prisma.storagePolicy.findUnique({
      where: { id }
    })

    if (!policy) return null

    return {
      ...policy,
      dailyRateSmall: Number(policy.dailyRateSmall),
      dailyRateMedium: Number(policy.dailyRateMedium),
      dailyRateLarge: Number(policy.dailyRateLarge),
      dailyRatePerItem: Number(policy.dailyRatePerItem),
      flatDailyRateUsdCents: policy.flatDailyRateUsdCents ?? undefined,
      maxDaysAllowed: policy.maxDaysAllowed,
    }
  }

  // Criar nova política
  async create(data: CreateStoragePolicyData): Promise<StoragePolicyData> {
    // Desativar políticas existentes
    await prisma.storagePolicy.updateMany({
      data: { isActive: false }
    })

    const policy = await prisma.storagePolicy.create({
      data: {
        ...data,
        weekendCharges: data.weekendCharges || false,
        holidayCharges: data.holidayCharges || false,
        warningDays: data.warningDays || 7,
        maxDaysAllowed: data.maxDaysAllowed ?? 90,
        isActive: true,
      }
    })

    return {
      ...policy,
      dailyRateSmall: Number(policy.dailyRateSmall),
      dailyRateMedium: Number(policy.dailyRateMedium),
      dailyRateLarge: Number(policy.dailyRateLarge),
      dailyRatePerItem: Number(policy.dailyRatePerItem),
      flatDailyRateUsdCents: policy.flatDailyRateUsdCents ?? undefined,
      maxDaysAllowed: policy.maxDaysAllowed,
    }
  }

  // Atualizar política
  async update(id: string, data: Partial<CreateStoragePolicyData>): Promise<StoragePolicyData> {
    const policy = await prisma.storagePolicy.update({
      where: { id },
      data
    })

    return {
      ...policy,
      dailyRateSmall: Number(policy.dailyRateSmall),
      dailyRateMedium: Number(policy.dailyRateMedium),
      dailyRateLarge: Number(policy.dailyRateLarge),
      dailyRatePerItem: Number(policy.dailyRatePerItem),
      flatDailyRateUsdCents: policy.flatDailyRateUsdCents ?? undefined,
      maxDaysAllowed: policy.maxDaysAllowed,
    }
  }

  // Deletar política
  async delete(id: string): Promise<void> {
    await prisma.storagePolicy.delete({
      where: { id }
    })
  }

  // Calcular taxa de armazenamento
  calculateStorageFee(
    policy: StoragePolicyData,
    params: StorageCalculationParams
  ): {
    totalFee: number
    breakdown: {
      baseFee: number
      itemFee: number
      weekendFee: number
      holidayFee: number
      chargeableDays: number
    }
  } {
    const { weightKg, itemCount, daysUsed, includeWeekends = false, includeHolidays = false } = params

    // Respeitar limite máximo
    const clampedDays = Math.min(daysUsed, policy.maxDaysAllowed)

    // Dias além do período gratuito
    const chargeableDays = Math.max(0, clampedDays - policy.freeDays)
    if (chargeableDays === 0) {
      return {
        totalFee: 0,
        breakdown: { baseFee: 0, itemFee: 0, weekendFee: 0, holidayFee: 0, chargeableDays: 0 }
      }
    }

    // Se política simples por dia estiver definida, priorizar
    if (policy.flatDailyRateUsdCents && policy.flatDailyRateUsdCents > 0) {
      const baseFee = policy.flatDailyRateUsdCents * chargeableDays
      const itemFee = 0
      const weekendFee = 0
      const holidayFee = 0
      const totalFee = baseFee
      return { totalFee, breakdown: { baseFee, itemFee, weekendFee, holidayFee, chargeableDays } }
    }

    // Determinar taxa base baseada no peso
    let dailyRate = policy.dailyRateSmall // Padrão para pequeno
    if (weightKg > 5) {
      dailyRate = policy.dailyRateLarge
    } else if (weightKg > 1) {
      dailyRate = policy.dailyRateMedium
    }

    // Taxa base
    const baseFee = dailyRate * chargeableDays

    // Taxa por item
    const itemFee = itemCount * policy.dailyRatePerItem * chargeableDays

    // Taxas de fim de semana (se aplicável)
    let weekendFee = 0
    if (policy.weekendCharges && includeWeekends) {
      const weekendDays = Math.ceil(chargeableDays * (2/7))
      weekendFee = dailyRate * weekendDays * 0.5
    }

    // Taxas de feriados (se aplicável)
    let holidayFee = 0
    if (policy.holidayCharges && includeHolidays) {
      const holidayDays = Math.ceil(chargeableDays * 0.1)
      holidayFee = dailyRate * holidayDays * 0.5
    }

    const totalFee = baseFee + itemFee + weekendFee + holidayFee

    return {
      totalFee: Math.max(0, totalFee),
      breakdown: { baseFee, itemFee, weekendFee, holidayFee, chargeableDays }
    }
  }

  // Calcular data de aviso (quando começar a cobrar)
  calculateWarningDate(consolidationDate: Date, policy: StoragePolicyData): Date {
    const warningDate = new Date(consolidationDate)
    warningDate.setDate(warningDate.getDate() + policy.freeDays - policy.warningDays)
    return warningDate
  }

  // Verificar se está próximo do período de cobrança
  isNearChargingPeriod(consolidationDate: Date, policy: StoragePolicyData): boolean {
    const warningDate = this.calculateWarningDate(consolidationDate, policy)
    const now = new Date()
    return now >= warningDate
  }

  // Verificar se já passou do período gratuito
  isOverFreePeriod(consolidationDate: Date, policy: StoragePolicyData): boolean {
    const chargingDate = new Date(consolidationDate)
    chargingDate.setDate(chargingDate.getDate() + policy.freeDays)
    const now = new Date()
    return now > chargingDate
  }

  // Calcular dias restantes gratuitos
  getRemainingFreeDays(consolidationDate: Date, policy: StoragePolicyData): number {
    const chargingDate = new Date(consolidationDate)
    chargingDate.setDate(chargingDate.getDate() + policy.freeDays)
    const now = new Date()
    const remaining = Math.ceil((chargingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, remaining)
  }

  // Atualizar política ativa
  async setActivePolicy(id: string): Promise<void> {
    // Desativar todas as políticas
    await prisma.storagePolicy.updateMany({
      data: { isActive: false }
    })

    // Ativar a política selecionada
    await prisma.storagePolicy.update({
      where: { id },
      data: { isActive: true }
    })
  }
}

export const storageService = new StorageService()
