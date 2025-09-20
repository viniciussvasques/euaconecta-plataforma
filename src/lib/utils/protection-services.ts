import { prisma } from '../database/prisma'
import type { ProtectionType } from '@prisma/client'

export interface ProtectionServiceData {
  id: string
  name: string
  code: string
  description?: string
  protectionType: 'BUBBLE_WRAP' | 'DOUBLE_BOX' | 'SECURITY_TAPE' | 'PAPER_FILLING' | 'CUSTOM_PACKAGING'
  category: 'BASIC_PROTECTION' | 'PREMIUM_PROTECTION' | 'FRAGILE_ITEMS' | 'ELECTRONICS' | 'CLOTHING' | 'CUSTOM'
  basePrice: number
  pricePerKg: number
  pricePerDimension: number
  isActive: boolean
  priority: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateProtectionServiceData {
  name: string
  code: string
  description?: string
  protectionType: 'BUBBLE_WRAP' | 'DOUBLE_BOX' | 'SECURITY_TAPE' | 'PAPER_FILLING' | 'CUSTOM_PACKAGING'
  category: 'BASIC_PROTECTION' | 'PREMIUM_PROTECTION' | 'FRAGILE_ITEMS' | 'ELECTRONICS' | 'CLOTHING' | 'CUSTOM'
  basePrice: number
  pricePerKg: number
  pricePerDimension: number
  priority?: number
}

export class ProtectionService {
  // Buscar todos os serviços ativos
  async getAllActive(): Promise<ProtectionServiceData[]> {
    const services = await prisma.protectionService.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' }
    })

    return services.map(service => ({
      ...service,
      basePrice: Number(service.basePrice),
      pricePerKg: Number(service.pricePerKg),
      pricePerDimension: Number(service.pricePerDimension),
      description: service.description || undefined,
    }))
  }

  // Buscar por categoria
  async getByCategory(category: ProtectionServiceData['category']): Promise<ProtectionServiceData[]> {
    const services = await prisma.protectionService.findMany({
      where: {
        category,
        isActive: true
      },
      orderBy: { priority: 'asc' }
    })

    return services.map(service => ({
      ...service,
      basePrice: Number(service.basePrice),
      pricePerKg: Number(service.pricePerKg),
      pricePerDimension: Number(service.pricePerDimension),
      description: service.description || undefined,
    }))
  }

  // Buscar por ID
  async getById(id: string): Promise<ProtectionServiceData | null> {
    const service = await prisma.protectionService.findUnique({
      where: { id }
    })

    if (!service) return null

    return {
      ...service,
      basePrice: Number(service.basePrice),
      pricePerKg: Number(service.pricePerKg),
      pricePerDimension: Number(service.pricePerDimension),
      description: service.description || undefined,
    }
  }

  // Criar novo serviço
  async create(data: CreateProtectionServiceData): Promise<ProtectionServiceData> {
    const service = await prisma.protectionService.create({
      data: {
        ...data,
        priority: data.priority || 0,
      }
    })

    return {
      ...service,
      basePrice: Number(service.basePrice),
      pricePerKg: Number(service.pricePerKg),
      pricePerDimension: Number(service.pricePerDimension),
      description: service.description || undefined,
    }
  }

  // Atualizar serviço
  async update(id: string, data: Partial<CreateProtectionServiceData>): Promise<ProtectionServiceData> {
    const service = await prisma.protectionService.update({
      where: { id },
      data
    })

    return {
      ...service,
      basePrice: Number(service.basePrice),
      pricePerKg: Number(service.pricePerKg),
      pricePerDimension: Number(service.pricePerDimension),
      description: service.description || undefined,
    }
  }

  // Deletar serviço
  async delete(id: string): Promise<void> {
    await prisma.protectionService.delete({
      where: { id }
    })
  }

  // Calcular preço de um serviço para um pacote específico
  calculatePrice(
    service: ProtectionServiceData,
    weightKg: number,
    dimensions: { length: number; width: number; height: number }
  ): number {
    const volume = dimensions.length * dimensions.width * dimensions.height

    let totalPrice = service.basePrice
    totalPrice += service.pricePerKg * weightKg
    totalPrice += service.pricePerDimension * volume

    return Math.max(0, totalPrice)
  }

  // Calcular preço total para múltiplos serviços
  calculateTotalPrice(
    services: ProtectionServiceData[],
    weightKg: number,
    dimensions: { length: number; width: number; height: number }
  ): number {
    return services.reduce((total, service) => {
      return total + this.calculatePrice(service, weightKg, dimensions)
    }, 0)
  }

  // Buscar serviços recomendados por tipo de item
  async getRecommendedForItem(itemType: string): Promise<ProtectionServiceData[]> {
    const recommendations: Record<string, string[]> = {
      'electronics': ['BUBBLE_WRAP', 'DOUBLE_BOX', 'SECURITY_TAPE'],
      'fragile': ['BUBBLE_WRAP', 'DOUBLE_BOX', 'PAPER_FILLING'],
      'clothing': ['PAPER_FILLING', 'SECURITY_TAPE'],
      'books': ['BUBBLE_WRAP', 'SECURITY_TAPE'],
      'default': ['BUBBLE_WRAP', 'SECURITY_TAPE']
    }

    const recommendedTypes = recommendations[itemType.toLowerCase()] || recommendations.default

    const services = await prisma.protectionService.findMany({
      where: {
        protectionType: { in: recommendedTypes as unknown as ProtectionType[] },
        isActive: true
      },
      orderBy: { priority: 'asc' }
    })

    return services.map(service => ({
      ...service,
      basePrice: Number(service.basePrice),
      pricePerKg: Number(service.pricePerKg),
      pricePerDimension: Number(service.pricePerDimension),
      description: service.description || undefined,
    }))
  }
}

export const protectionService = new ProtectionService()
