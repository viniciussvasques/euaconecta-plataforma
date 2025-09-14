import { prisma } from './prisma'
import { ConsolidationType, ConsolidationStatus, ProtectionType } from '@prisma/client'

export interface ConsolidationGroupData {
  id: string
  userId: string
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
  
  finalWeightGrams?: number
  beforePhotos: string[]
  afterPhotos: string[]
  
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
      customInstructions: consolidation.customInstructions as string || undefined,
      extraProtection: consolidation.extraProtection as ProtectionType[],
      removeInvoice: consolidation.removeInvoice as boolean,
      
      // Novos campos para caixas abertas
      currentWeightGrams: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).currentWeightGrams || 0,
      estimatedFinalWeightGrams: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).estimatedFinalWeightGrams || undefined,
      maxItemsAllowed: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).maxItemsAllowed || 20,
      
      finalWeightGrams: consolidation.finalWeightGrams as number || undefined,
      beforePhotos: consolidation.beforePhotos as string[],
      afterPhotos: consolidation.afterPhotos as string[],
      
      // Prazos atualizados
      openedAt: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).openedAt || consolidation.createdAt as Date,
      consolidationDeadline: consolidation.consolidationDeadline as Date || undefined,
      shippingDeadline: consolidation.shippingDeadline as Date || undefined,
      closedAt: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).closedAt || undefined,
      
      storageDaysAllowed: consolidation.storageDaysAllowed as number,
      storageDaysUsed: consolidation.storageDaysUsed as number,
      packages: consolidation.packages.map(pkg => ({
        id: pkg.id as string,
        description: pkg.description as string || undefined,
        status: pkg.status as string,
        weightGrams: pkg.weightGrams as number || undefined,
        purchasePrice: pkg.purchasePrice ? Number(pkg.purchasePrice) : undefined,
        store: pkg.store as string || undefined,
        orderNumber: pkg.orderNumber as string || undefined,
      })),
      createdAt: consolidation.createdAt as Date,
      updatedAt: consolidation.updatedAt as Date,
      finalDimensionsId: consolidation.finalDimensionsId as string || undefined,
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
      customInstructions: consolidation.customInstructions as string || undefined,
      extraProtection: consolidation.extraProtection as ProtectionType[],
      removeInvoice: consolidation.removeInvoice as boolean,
      
      // Novos campos para caixas abertas
      currentWeightGrams: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).currentWeightGrams || 0,
      estimatedFinalWeightGrams: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).estimatedFinalWeightGrams || undefined,
      maxItemsAllowed: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).maxItemsAllowed || 20,
      
      finalWeightGrams: consolidation.finalWeightGrams as number || undefined,
      beforePhotos: consolidation.beforePhotos as string[],
      afterPhotos: consolidation.afterPhotos as string[],
      
      // Prazos atualizados
      openedAt: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).openedAt || consolidation.createdAt as Date,
      consolidationDeadline: consolidation.consolidationDeadline as Date || undefined,
      shippingDeadline: consolidation.shippingDeadline as Date || undefined,
      closedAt: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).closedAt || undefined,
      
      storageDaysAllowed: consolidation.storageDaysAllowed as number,
      storageDaysUsed: consolidation.storageDaysUsed as number,
      packages: consolidation.packages.map(pkg => ({
        id: pkg.id as string,
        description: pkg.description as string || undefined,
        status: pkg.status as string,
        weightGrams: pkg.weightGrams as number || undefined,
        purchasePrice: pkg.purchasePrice ? Number(pkg.purchasePrice) : undefined,
        store: pkg.store as string || undefined,
        orderNumber: pkg.orderNumber as string || undefined,
      })),
      createdAt: consolidation.createdAt as Date,
      updatedAt: consolidation.updatedAt as Date,
      finalDimensionsId: consolidation.finalDimensionsId as string || undefined,
    }
  }

  // Criar nova consolidação (caixa aberta)
  async create(data: CreateConsolidationData): Promise<ConsolidationGroupData> {
    // Calcular taxas
    const consolidationFee = this.calculateConsolidationFee(data.consolidationType, data.packageIds.length)
    const storageFee = this.calculateStorageFee(data.packageIds.length)

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
        status: ConsolidationStatus.OPEN, // Começa aberta
        consolidationFee,
        storageFee,
        customInstructions: data.customInstructions,
        extraProtection: data.extraProtection,
        removeInvoice: data.removeInvoice || false,
        
        // Novos campos para caixas abertas
        currentWeightGrams,
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
          currentWeightGrams: newTotalWeight
        }
      })
    }

    return this.getById(data.consolidationId) as Promise<ConsolidationGroupData>
  }

  // Fechar caixa (mudar status para PENDING)
  async closeBox(consolidationId: string): Promise<ConsolidationGroupData> {
    const consolidation = await prisma.consolidationGroup.update({
      where: { id: consolidationId },
      data: {
        status: ConsolidationStatus.PENDING,
        closedAt: new Date()
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
  private calculateConsolidationFee(type: ConsolidationType, packageCount: number): number {
    // Buscar configuração da plataforma
    const baseFee = 5.00 // $5.00 base
    const perPackageFee = 1.00 // $1.00 por pacote
    
    let totalFee = baseFee + (perPackageFee * packageCount)
    
    if (type === ConsolidationType.REPACK) {
      totalFee *= 1.5 // 50% mais para repack
    }
    
    return totalFee
  }

  // Calcular taxa de armazenamento
  private calculateStorageFee(packageCount: number): number {
    const baseStorageFee = 0.50 // $0.50 por dia por pacote
    const days = 30 // 30 dias padrão
    
    return baseStorageFee * packageCount * days
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
      customInstructions: consolidation.customInstructions as string || undefined,
      extraProtection: consolidation.extraProtection as ProtectionType[],
      removeInvoice: consolidation.removeInvoice as boolean,
      
      // Novos campos para caixas abertas
      currentWeightGrams: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).currentWeightGrams || 0,
      estimatedFinalWeightGrams: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).estimatedFinalWeightGrams || undefined,
      maxItemsAllowed: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).maxItemsAllowed || 20,
      
      finalWeightGrams: consolidation.finalWeightGrams as number || undefined,
      beforePhotos: consolidation.beforePhotos as string[],
      afterPhotos: consolidation.afterPhotos as string[],
      
      // Prazos atualizados
      openedAt: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).openedAt || consolidation.createdAt as Date,
      consolidationDeadline: consolidation.consolidationDeadline as Date || undefined,
      shippingDeadline: consolidation.shippingDeadline as Date || undefined,
      closedAt: (consolidation as unknown as ConsolidationGroupData & { currentWeightGrams?: number; estimatedFinalWeightGrams?: number; maxItemsAllowed?: number; openedAt?: Date; closedAt?: Date }).closedAt || undefined,
      
      storageDaysAllowed: consolidation.storageDaysAllowed as number,
      storageDaysUsed: consolidation.storageDaysUsed as number,
      packages: (consolidation.packages as Record<string, unknown>[]).map((pkg: Record<string, unknown>) => ({
        id: pkg.id as string,
        description: pkg.description as string || undefined,
        status: pkg.status as string,
        weightGrams: pkg.weightGrams as number || undefined,
        purchasePrice: pkg.purchasePrice ? Number(pkg.purchasePrice) : undefined,
        store: pkg.store as string || undefined,
        orderNumber: pkg.orderNumber as string || undefined,
      })),
      createdAt: consolidation.createdAt as Date,
      updatedAt: consolidation.updatedAt as Date,
      finalDimensionsId: consolidation.finalDimensionsId as string || undefined,
    }
  }
}

export const consolidationService = new ConsolidationService()
