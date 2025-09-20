import { prisma } from '../database/prisma'
import { ConsolidationType, ConsolidationStatus, ProtectionType } from '@prisma/client'
import { PlatformConfig } from '../config/platform-config'

export interface ConsolidationGroupData {
  id: string
  userId: string
  name?: string
  consolidationType: ConsolidationType
  status: ConsolidationStatus
  consolidationFee: number
  storageFee: number
  customInstructions?: string
  extraProtection: ProtectionType[]
  removeInvoice: boolean

  // Novos campos para caixas abertas
  currentWeightGrams: number
  estimatedFinalWeightGrams?: number
  maxItemsAllowed: number
  boxSize?: string

  finalWeightGrams?: number
  trackingCode?: string
  beforePhotos: string[]
  afterPhotos: string[]

  // Relacionamentos
  user?: {
    id: string
    name: string
    email: string
  }
  deliveryAddress?: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }

  // Prazos atualizados
  openedAt: Date
  consolidationDeadline?: Date
  shippingDeadline?: Date
  closedAt?: Date

  storageDaysAllowed: number
  storageDaysUsed: number
  packages: Array<{
    id: string
    description?: string
    status: string
    weightGrams?: number
    purchasePrice?: number
    store?: string
    orderNumber?: string
  }>
  createdAt: Date
  updatedAt: Date
  finalDimensionsId?: string
}

export interface CreateConsolidationData {
  userId: string
  consolidationType: ConsolidationType
  name?: string
  notes?: string
  boxSize?: string
  customInstructions?: string
  extraProtection: ProtectionType[]
  removeInvoice?: boolean
  packageIds: string[]
}

export interface UpdateConsolidationData {
  consolidationType?: ConsolidationType
  customInstructions?: string
  extraProtection?: ProtectionType[]
  removeInvoice?: boolean
  status?: ConsolidationStatus
  finalWeightGrams?: number
  beforePhotos?: string[]
  afterPhotos?: string[]
}

export interface AddPackageToBoxData {
  consolidationId: string
  packageId: string
  weightGrams: number
  weighedBy: string
  weightNotes?: string
}

export class ConsolidationService {
  // Buscar consolidações por usuário
  async getByUserId(userId: string): Promise<ConsolidationGroupData[]> {
    const consolidations = await prisma.consolidationGroup.findMany({
      where: { userId },
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return consolidations.map(consolidation => ({
      id: consolidation.id,
      userId: consolidation.userId,
      consolidationType: consolidation.consolidationType,
      status: consolidation.status,
      consolidationFee: Number(consolidation.consolidationFee),
      storageFee: Number(consolidation.storageFee),
      customInstructions: consolidation.customInstructions || undefined,
      extraProtection: consolidation.extraProtection as ProtectionType[],
      removeInvoice: Boolean(consolidation.removeInvoice),

      // Novos campos para caixas abertas
      currentWeightGrams: Number((consolidation as Record<string, unknown>).currentWeightGrams || 0),
      estimatedFinalWeightGrams: (consolidation as Record<string, unknown>).estimatedFinalWeightGrams ? Number((consolidation as Record<string, unknown>).estimatedFinalWeightGrams) : undefined,
      maxItemsAllowed: Number((consolidation as Record<string, unknown>).maxItemsAllowed || 20),
      boxSize: (consolidation as Record<string, unknown>).boxSize as string | undefined,

      finalWeightGrams: consolidation.finalWeightGrams || undefined,
      trackingCode: consolidation.trackingCode || undefined,
      beforePhotos: (consolidation.beforePhotos as string[]) || [],
      afterPhotos: (consolidation.afterPhotos as string[]) || [],

      // Prazos atualizados
      openedAt: (consolidation as Record<string, unknown>).openedAt ? new Date((consolidation as Record<string, unknown>).openedAt as string) : (consolidation.createdAt as Date),
      consolidationDeadline: consolidation.consolidationDeadline || undefined,
      shippingDeadline: consolidation.shippingDeadline || undefined,
      closedAt: (consolidation as Record<string, unknown>).closedAt ? new Date((consolidation as Record<string, unknown>).closedAt as string) : undefined,

      storageDaysAllowed: Number(consolidation.storageDaysAllowed || 30),
      storageDaysUsed: Number(consolidation.storageDaysUsed || 0),
      packages: consolidation.packages.map(pkg => ({
        id: pkg.id,
        description: pkg.description || undefined,
        status: pkg.status,
        weightGrams: pkg.weightGrams || undefined,
        purchasePrice: pkg.purchasePrice ? Number(pkg.purchasePrice) : undefined,
        store: pkg.store || undefined,
        orderNumber: pkg.orderNumber || undefined,
      })),
      createdAt: consolidation.createdAt,
      updatedAt: consolidation.updatedAt,
      finalDimensionsId: consolidation.finalDimensionsId || undefined,
    }))
  }

  // Buscar consolidação por ID
  async getById(id: string): Promise<ConsolidationGroupData | null> {
    const consolidation = await prisma.consolidationGroup.findUnique({
      where: { id },
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
          }
        }
      }
    })

    if (!consolidation) return null

    return {
      id: consolidation.id,
      userId: consolidation.userId,
      consolidationType: consolidation.consolidationType,
      status: consolidation.status,
      consolidationFee: Number(consolidation.consolidationFee),
      storageFee: Number(consolidation.storageFee),
      customInstructions: consolidation.customInstructions || undefined,
      extraProtection: consolidation.extraProtection as ProtectionType[],
      removeInvoice: Boolean(consolidation.removeInvoice),

      // Novos campos para caixas abertas
      currentWeightGrams: Number((consolidation as Record<string, unknown>).currentWeightGrams || 0),
      estimatedFinalWeightGrams: (consolidation as Record<string, unknown>).estimatedFinalWeightGrams ? Number((consolidation as Record<string, unknown>).estimatedFinalWeightGrams) : undefined,
      maxItemsAllowed: Number((consolidation as Record<string, unknown>).maxItemsAllowed || 20),
      boxSize: (consolidation as Record<string, unknown>).boxSize as string | undefined,

      finalWeightGrams: consolidation.finalWeightGrams || undefined,
      trackingCode: consolidation.trackingCode || undefined,
      beforePhotos: (consolidation.beforePhotos as string[]) || [],
      afterPhotos: (consolidation.afterPhotos as string[]) || [],

      // Prazos atualizados
      openedAt: (consolidation as Record<string, unknown>).openedAt ? new Date((consolidation as Record<string, unknown>).openedAt as string) : (consolidation.createdAt as Date),
      consolidationDeadline: consolidation.consolidationDeadline || undefined,
      shippingDeadline: consolidation.shippingDeadline || undefined,
      closedAt: (consolidation as Record<string, unknown>).closedAt ? new Date((consolidation as Record<string, unknown>).closedAt as string) : undefined,

      storageDaysAllowed: Number(consolidation.storageDaysAllowed || 30),
      storageDaysUsed: Number(consolidation.storageDaysUsed || 0),
      packages: consolidation.packages.map(pkg => ({
        id: pkg.id,
        description: pkg.description || undefined,
        status: pkg.status,
        weightGrams: pkg.weightGrams || undefined,
        purchasePrice: pkg.purchasePrice ? Number(pkg.purchasePrice) : undefined,
        store: pkg.store || undefined,
        orderNumber: pkg.orderNumber || undefined,
      })),
      createdAt: consolidation.createdAt,
      updatedAt: consolidation.updatedAt,
      finalDimensionsId: consolidation.finalDimensionsId || undefined,
    }
  }

  // Criar nova consolidação (caixa aberta)
  async create(data: CreateConsolidationData): Promise<ConsolidationGroupData> {
    // Calcular taxas
    const consolidationFee = await this.calculateConsolidationFee(data.consolidationType, data.packageIds.length)
    const storageFee = await this.calculateStorageFee(data.packageIds.length)

    // Calcular peso inicial dos pacotes
    const packages = await prisma.package.findMany({
      where: { id: { in: data.packageIds } },
      select: { weightGrams: true }
    })

    const currentWeightGrams = packages.reduce((total, pkg) => total + (pkg.weightGrams || 0), 0)

    const consolidation = await prisma.consolidationGroup.create({
      data: {
        userId: data.userId,
        consolidationType: data.consolidationType,
        name: data.name || null,
        notes: data.notes || null,
        boxSize: data.boxSize || null,
        status: 'OPEN' as ConsolidationStatus, // Começa aberta
        consolidationFee,
        storageFee,
        customInstructions: data.customInstructions,
        extraProtection: data.extraProtection,
        removeInvoice: data.removeInvoice || false,

        // Novos campos para caixas abertas
        currentWeightGrams: currentWeightGrams as number,
        maxItemsAllowed: 20, // Padrão

        storageDaysAllowed: 30,
        storageDaysUsed: 0,

        packages: {
          connect: data.packageIds.map(id => ({ id }))
        }
      },
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
          }
        }
      }
    })

    return this.mapToConsolidationData(consolidation)
  }

  // Adicionar pacote à caixa aberta
  async addPackageToBox(data: AddPackageToBoxData): Promise<ConsolidationGroupData> {
    // Atualizar peso do pacote
    await prisma.package.update({
      where: { id: data.packageId },
      data: {
        weightGrams: data.weightGrams,
        weighedAt: new Date(),
        weighedBy: data.weighedBy,
        weightNotes: data.weightNotes,
      }
    })

    // Adicionar à consolidação
    await prisma.consolidationGroup.update({
      where: { id: data.consolidationId },
      data: {
        packages: {
          connect: { id: data.packageId }
        }
      }
    })

    // Recalcular peso total da caixa
    const consolidation = await prisma.consolidationGroup.findUnique({
      where: { id: data.consolidationId },
      include: {
        packages: {
          select: { weightGrams: true }
        }
      }
    })

    if (consolidation) {
      const newTotalWeight = consolidation.packages.reduce((total, pkg) => total + (pkg.weightGrams || 0), 0)

      await prisma.consolidationGroup.update({
        where: { id: data.consolidationId },
        data: {
          currentWeightGrams: newTotalWeight         }
      })
    }

    return this.getById(data.consolidationId) as Promise<ConsolidationGroupData>
  }

  // Remover pacote da caixa aberta
  async removePackageFromBox(consolidationId: string, packageId: string): Promise<ConsolidationGroupData> {
    // Remover da consolidação
    await prisma.consolidationGroup.update({
      where: { id: consolidationId },
      data: {
        packages: {
          disconnect: { id: packageId }
        }
      }
    })

    // Recalcular peso total da caixa
    const consolidation = await prisma.consolidationGroup.findUnique({
      where: { id: consolidationId },
      include: {
        packages: {
          select: { weightGrams: true }
        }
      }
    })

    if (consolidation) {
      const newTotalWeight = consolidation.packages.reduce((total, pkg) => total + (pkg.weightGrams || 0), 0)

      await prisma.consolidationGroup.update({
        where: { id: consolidationId },
        data: {
          currentWeightGrams: newTotalWeight         }
      })
    }

    return this.getById(consolidationId) as Promise<ConsolidationGroupData>
  }

  // Fechar caixa (mudar status para PENDING)
  async closeBox(consolidationId: string): Promise<ConsolidationGroupData> {
    const consolidation = await prisma.consolidationGroup.update({
      where: { id: consolidationId },
      data: {
        status: ConsolidationStatus.PENDING,
        closedAt: new Date()       },
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
          }
        }
      }
    })

    return this.mapToConsolidationData(consolidation)
  }

  // Atualizar consolidação
  async update(id: string, data: UpdateConsolidationData): Promise<ConsolidationGroupData | null> {
    const consolidation = await prisma.consolidationGroup.update({
      where: { id },
      data: {
        consolidationType: data.consolidationType,
        customInstructions: data.customInstructions,
        extraProtection: data.extraProtection,
        removeInvoice: data.removeInvoice,
        status: data.status,
        finalWeightGrams: data.finalWeightGrams,
        beforePhotos: data.beforePhotos,
        afterPhotos: data.afterPhotos,
      },
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
          }
        }
      }
    })

    return this.mapToConsolidationData(consolidation)
  }

  // Deletar consolidação
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.consolidationGroup.delete({
        where: { id }
      })
      return true
    } catch {
      return false
    }
  }

  // Buscar todas as consolidações
  async getAll(): Promise<ConsolidationGroupData[]> {
    const consolidations = await prisma.consolidationGroup.findMany({
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return consolidations.map(consolidation => this.mapToConsolidationData(consolidation))
  }

  // Buscar consolidações por status
  async getByStatus(status: ConsolidationStatus): Promise<ConsolidationGroupData[]> {
    const consolidations = await prisma.consolidationGroup.findMany({
      where: { status },
      include: {
        packages: {
          select: {
            id: true,
            description: true,
            status: true,
            weightGrams: true,
            purchasePrice: true,
            store: true,
            orderNumber: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return consolidations.map(consolidation => this.mapToConsolidationData(consolidation))
  }

  // Calcular taxa de consolidação
  private async calculateConsolidationFee(type: ConsolidationType, packageCount: number): Promise<number> {
    try {
      // Buscar configuração da plataforma
      const platformConfig = await PlatformConfig.load()

      const baseFee = (platformConfig.consolidationBaseFeeUsdCents || 500) / 100
      const perPackageFee = (platformConfig.consolidationPerPackageUsdCents || 100) / 100

      let totalFee = baseFee + (perPackageFee * packageCount)

      if (type === ConsolidationType.REPACK) {
        const multiplier = platformConfig.repackMultiplier || 1.5
        totalFee *= multiplier
      }

      return totalFee
    } catch (error) {
      console.error('Erro ao calcular taxa de consolidação:', error)
      // Valores padrão em caso de erro
      const baseFee = 5.00
      const perPackageFee = 1.00
      let totalFee = baseFee + (perPackageFee * packageCount)

      if (type === ConsolidationType.REPACK) {
        totalFee *= 1.5
      }

      return totalFee
    }
  }

  // Calcular taxa de armazenamento
  private async calculateStorageFee(packageCount: number): Promise<number> {
    try {
      const platformConfig = await PlatformConfig.load()
      const dailyRate = (platformConfig.storageFeePerDay || 0.50)
      const days = 30 // 30 dias padrão

      return dailyRate * packageCount * days
    } catch (error) {
      console.error('Erro ao calcular taxa de armazenamento:', error)
      // Valor padrão em caso de erro
      const baseStorageFee = 0.50
      const days = 30
      return baseStorageFee * packageCount * days
    }
  }

  // Mapear dados do Prisma para interface
  private mapToConsolidationData(consolidation: Record<string, unknown>): ConsolidationGroupData {
    return {
      id: consolidation.id as string,
      userId: consolidation.userId as string,
      consolidationType: consolidation.consolidationType as ConsolidationType,
      status: consolidation.status as ConsolidationStatus,
      consolidationFee: Number(consolidation.consolidationFee),
      storageFee: Number(consolidation.storageFee),
      customInstructions: (consolidation.customInstructions as string) || undefined,
      extraProtection: (consolidation.extraProtection as ProtectionType[]) || [],
      removeInvoice: Boolean(consolidation.removeInvoice),

      // Novos campos para caixas abertas
      currentWeightGrams: Number((consolidation as Record<string, unknown>).currentWeightGrams || 0),
      estimatedFinalWeightGrams: (consolidation as Record<string, unknown>).estimatedFinalWeightGrams ? Number((consolidation as Record<string, unknown>).estimatedFinalWeightGrams) : undefined,
      maxItemsAllowed: Number((consolidation as Record<string, unknown>).maxItemsAllowed || 20),

      finalWeightGrams: (consolidation.finalWeightGrams as number) || undefined,
      beforePhotos: (consolidation.beforePhotos as string[]) || [],
      afterPhotos: (consolidation.afterPhotos as string[]) || [],

      // Prazos atualizados
      openedAt: (consolidation as Record<string, unknown>).openedAt ? new Date((consolidation as Record<string, unknown>).openedAt as string) : (consolidation.createdAt as Date),
      consolidationDeadline: (consolidation.consolidationDeadline as Date) || undefined,
      shippingDeadline: (consolidation.shippingDeadline as Date) || undefined,
      closedAt: (consolidation as Record<string, unknown>).closedAt ? new Date((consolidation as Record<string, unknown>).closedAt as string) : undefined,

      storageDaysAllowed: Number(consolidation.storageDaysAllowed || 30),
      storageDaysUsed: Number(consolidation.storageDaysUsed || 0),
      packages: ((consolidation.packages as Record<string, unknown>[]) || []).map((pkg: Record<string, unknown>) => ({
        id: pkg.id as string,
        description: (pkg.description as string) || undefined,
        status: pkg.status as string,
        weightGrams: (pkg.weightGrams as number) || undefined,
        purchasePrice: pkg.purchasePrice ? Number(pkg.purchasePrice) : undefined,
        store: (pkg.store as string) || undefined,
        orderNumber: (pkg.orderNumber as string) || undefined,
      })),
      createdAt: consolidation.createdAt as Date,
      updatedAt: consolidation.updatedAt as Date,
      finalDimensionsId: (consolidation.finalDimensionsId as string) || undefined,
      boxSize: (consolidation as Record<string, unknown>).boxSize as string | undefined,
    }
  }

  // Atualizar status da consolidação
  async updateStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'SHIPPED' | 'CANCELLED', trackingCode?: string) {
    const updateData: Record<string, unknown> = { status }

    if (trackingCode && status === 'SHIPPED') {
      updateData.trackingCode = trackingCode
    }

    return await prisma.consolidationGroup.update({
      where: { id },
      data: updateData
    })
  }
}

export const consolidationService = new ConsolidationService()
