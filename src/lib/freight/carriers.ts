import { prisma } from '../database/prisma'

export interface CarrierData {
  id: string
  name: string
  code: string
  description?: string | null
  hasApi: boolean
  apiKey?: string | null
  apiSecret?: string | null
  apiUrl?: string | null
  baseRate: number
  ratePerKg: number
  ratePerKm: number
  insuranceAvailable: boolean
  insuranceRate: number
  minInsuranceValue: number
  maxInsuranceValue: number
  estimatedDays: number
  isActive: boolean
  priority: number
  createdAt: Date
  updatedAt: Date
}

export interface CarrierServiceData {
  id: string
  name: string
  code: string
  baseRate: number
  ratePerKg: number
  ratePerKm: number
  estimatedDays: number
  isActive: boolean
  carrierId: string
}

export interface CarrierZoneData {
  id: string
  name: string
  baseRate: number
  ratePerKg: number
  estimatedDays: number
  carrierId: string
}

export interface CreateCarrierData {
  name: string
  code: string
  description?: string
  hasApi?: boolean
  apiKey?: string
  apiSecret?: string
  apiUrl?: string
  baseRate?: number
  ratePerKg?: number
  ratePerKm?: number
  insuranceAvailable?: boolean
  insuranceRate?: number
  minInsuranceValue?: number
  maxInsuranceValue?: number
  estimatedDays?: number
  priority?: number
}

export interface CreateCarrierServiceData {
  name: string
  code: string
  baseRate?: number
  ratePerKg?: number
  ratePerKm?: number
  estimatedDays?: number
  carrierId: string
}

export interface CreateCarrierZoneData {
  name: string
  baseRate?: number
  ratePerKg?: number
  estimatedDays?: number
  carrierId: string
}

export class CarrierService {
  // Buscar todas as transportadoras (ativas e inativas)
  async getAll(): Promise<CarrierData[]> {
    const carriers = await prisma.carrier.findMany({
      include: {
        services: true,
        deliveryZones: true,
      },
      orderBy: [
        { isActive: 'desc' },
        { priority: 'desc' },
        { name: 'asc' }
      ]
    })

    return carriers.map(carrier => ({
      ...carrier,
      baseRate: Number(carrier.baseRate),
      ratePerKg: Number(carrier.ratePerKg),
      ratePerKm: Number(carrier.ratePerKm),
      insuranceRate: Number(carrier.insuranceRate),
      minInsuranceValue: Number(carrier.minInsuranceValue),
      maxInsuranceValue: Number(carrier.maxInsuranceValue),
      services: carrier.services.map(service => ({
        ...service,
        baseRate: Number(service.baseRate),
        ratePerKg: Number(service.ratePerKg),
        ratePerKm: Number(service.ratePerKm),
      })),
      deliveryZones: carrier.deliveryZones.map(zone => ({
        ...zone,
        baseRate: Number(zone.baseRate),
        ratePerKg: Number(zone.ratePerKg),
      })),
    }))
  }

  // Buscar todas as transportadoras ativas
  async getAllActive(): Promise<CarrierData[]> {
    const carriers = await prisma.carrier.findMany({
      where: { isActive: true },
      include: {
        services: true,
        deliveryZones: true,
      },
      orderBy: { priority: 'desc' }
    })

    return carriers.map(carrier => ({
      ...carrier,
      baseRate: Number(carrier.baseRate),
      ratePerKg: Number(carrier.ratePerKg),
      ratePerKm: Number(carrier.ratePerKm),
      insuranceRate: Number(carrier.insuranceRate),
      minInsuranceValue: Number(carrier.minInsuranceValue),
      maxInsuranceValue: Number(carrier.maxInsuranceValue),
      services: carrier.services.map(service => ({
        ...service,
        baseRate: Number(service.baseRate),
        ratePerKg: Number(service.ratePerKg),
        ratePerKm: Number(service.ratePerKm),
      })),
      deliveryZones: carrier.deliveryZones.map(zone => ({
        ...zone,
        baseRate: Number(zone.baseRate),
        ratePerKg: Number(zone.ratePerKg),
      })),
    }))
  }

  // Buscar transportadora por ID
  async getById(id: string): Promise<CarrierData | null> {
    const carrier = await prisma.carrier.findUnique({
      where: { id },
      include: {
        services: true,
        deliveryZones: true
      }
    })

    if (!carrier) return null

    return {
      ...carrier,
      baseRate: Number(carrier.baseRate),
      ratePerKg: Number(carrier.ratePerKg),
      ratePerKm: Number(carrier.ratePerKm),
      insuranceRate: Number(carrier.insuranceRate),
      minInsuranceValue: Number(carrier.minInsuranceValue),
      maxInsuranceValue: Number(carrier.maxInsuranceValue),
    }
  }

  // Criar nova transportadora
  async create(data: CreateCarrierData): Promise<CarrierData> {
    const carrier = await prisma.carrier.create({
      data: {
        ...data,
        baseRate: data.baseRate || 0,
        ratePerKg: data.ratePerKg || 0,
        ratePerKm: data.ratePerKm || 0,
        insuranceRate: data.insuranceRate || 0,
        minInsuranceValue: data.minInsuranceValue || 0,
        maxInsuranceValue: data.maxInsuranceValue || 0,
        estimatedDays: data.estimatedDays || 3,
        priority: data.priority || 0,
      }
    })

    return {
      ...carrier,
      baseRate: Number(carrier.baseRate),
      ratePerKg: Number(carrier.ratePerKg),
      ratePerKm: Number(carrier.ratePerKm),
      insuranceRate: Number(carrier.insuranceRate),
      minInsuranceValue: Number(carrier.minInsuranceValue),
      maxInsuranceValue: Number(carrier.maxInsuranceValue),
    }
  }

  // Atualizar transportadora
  async update(id: string, data: Partial<CreateCarrierData>): Promise<CarrierData> {
    const carrier = await prisma.carrier.update({
      where: { id },
      data
    })

    return {
      ...carrier,
      baseRate: Number(carrier.baseRate),
      ratePerKg: Number(carrier.ratePerKg),
      ratePerKm: Number(carrier.ratePerKm),
      insuranceRate: Number(carrier.insuranceRate),
      minInsuranceValue: Number(carrier.minInsuranceValue),
      maxInsuranceValue: Number(carrier.maxInsuranceValue),
    }
  }

  // Deletar transportadora
  async delete(id: string): Promise<void> {
    await prisma.carrier.delete({
      where: { id }
    })
  }

  // Adicionar serviço à transportadora
  async addService(data: CreateCarrierServiceData): Promise<CarrierServiceData> {
    const service = await prisma.carrierService.create({
      data: {
        ...data,
        baseRate: data.baseRate || 0,
        ratePerKg: data.ratePerKg || 0,
        ratePerKm: data.ratePerKm || 0,
        estimatedDays: data.estimatedDays || 3,
      }
    })

    return {
      ...service,
      baseRate: Number(service.baseRate),
      ratePerKg: Number(service.ratePerKg),
      ratePerKm: Number(service.ratePerKm),
    }
  }

  // Adicionar zona de entrega
  async addZone(data: CreateCarrierZoneData): Promise<CarrierZoneData> {
    const zone = await prisma.carrierZone.create({
      data: {
        ...data,
        baseRate: data.baseRate || 0,
        ratePerKg: data.ratePerKg || 0,
        estimatedDays: data.estimatedDays || 3,
      }
    })

    return {
      ...zone,
      baseRate: Number(zone.baseRate),
      ratePerKg: Number(zone.ratePerKg),
    }
  }

  // Calcular taxa de envio
  calculateShippingRate(
    carrier: CarrierData,
    weightKg: number,
    distanceKm?: number,
    service?: CarrierServiceData,
    zone?: CarrierZoneData
  ): number {
    let totalRate = 0

    // Taxa base da transportadora
    totalRate += carrier.baseRate

    // Taxa por peso
    totalRate += carrier.ratePerKg * weightKg

    // Taxa por distância (se aplicável)
    if (distanceKm && carrier.ratePerKm > 0) {
      totalRate += carrier.ratePerKm * distanceKm
    }

    // Taxa adicional do serviço (se especificado)
    if (service) {
      totalRate += service.baseRate
      totalRate += service.ratePerKg * weightKg
      if (distanceKm && service.ratePerKm > 0) {
        totalRate += service.ratePerKm * distanceKm
      }
    }

    // Taxa adicional da zona (se especificada)
    if (zone) {
      totalRate += zone.baseRate
      totalRate += zone.ratePerKg * weightKg
    }

    return Math.max(0, totalRate)
  }

  // Calcular taxa de seguro
  calculateInsuranceRate(
    carrier: CarrierData,
    declaredValue: number
  ): number {
    if (!carrier.insuranceAvailable) return 0

    if (declaredValue < carrier.minInsuranceValue) return 0
    if (declaredValue > carrier.maxInsuranceValue) return 0

    return (declaredValue * carrier.insuranceRate) / 100
  }

  // Buscar transportadora mais adequada para um envio
  async findBestCarrier(
    weightKg: number,
    distanceKm?: number,
    requiresInsurance?: boolean,
    declaredValue?: number
  ): Promise<CarrierData | null> {
    const carriers = await this.getAllActive()

    if (carriers.length === 0) return null

    // Filtrar por requisitos de seguro
    let filteredCarriers = carriers
    if (requiresInsurance && declaredValue) {
      filteredCarriers = carriers.filter(carrier =>
        carrier.insuranceAvailable &&
        declaredValue >= carrier.minInsuranceValue &&
        declaredValue <= carrier.maxInsuranceValue
      )
    }

    if (filteredCarriers.length === 0) return null

    // Ordenar por prioridade e taxa
    filteredCarriers.sort((a, b) => {
      const rateA = this.calculateShippingRate(a, weightKg, distanceKm)
      const rateB = this.calculateShippingRate(b, weightKg, distanceKm)

      // Primeiro por prioridade, depois por taxa
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }

      return rateA - rateB
    })

    return filteredCarriers[0]
  }

  // Ativar/Desativar transportadora
  async toggleActive(id: string): Promise<CarrierData | null> {
    const carrier = await prisma.carrier.findUnique({
      where: { id }
    })

    if (!carrier) return null

    const updatedCarrier = await prisma.carrier.update({
      where: { id },
      data: { isActive: !carrier.isActive },
      include: {
        services: true,
        deliveryZones: true
      }
    })

    return {
      ...updatedCarrier,
      baseRate: Number(updatedCarrier.baseRate),
      ratePerKg: Number(updatedCarrier.ratePerKg),
      ratePerKm: Number(updatedCarrier.ratePerKm),
      insuranceRate: Number(updatedCarrier.insuranceRate),
      minInsuranceValue: Number(updatedCarrier.minInsuranceValue),
      maxInsuranceValue: Number(updatedCarrier.maxInsuranceValue),
    }
  }

  // Atualizar prioridade da transportadora
  async updatePriority(id: string, priority: number): Promise<CarrierData | null> {
    const updatedCarrier = await prisma.carrier.update({
      where: { id },
      data: { priority },
      include: {
        services: true,
        deliveryZones: true,
      }
    })

    return {
      ...updatedCarrier,
      baseRate: Number(updatedCarrier.baseRate),
      ratePerKg: Number(updatedCarrier.ratePerKg),
      ratePerKm: Number(updatedCarrier.ratePerKm),
      insuranceRate: Number(updatedCarrier.insuranceRate),
      minInsuranceValue: Number(updatedCarrier.minInsuranceValue),
      maxInsuranceValue: Number(updatedCarrier.maxInsuranceValue),
    }
  }

  // Atualizar credenciais da transportadora
  async updateCredentials(id: string, credentials: {
    apiKey: string | null
    apiSecret: string | null
    apiUrl: string | null
    hasApi: boolean
  }): Promise<CarrierData | null> {
    const updatedCarrier = await prisma.carrier.update({
      where: { id },
      data: {
        apiKey: credentials.apiKey,
        apiSecret: credentials.apiSecret,
        apiUrl: credentials.apiUrl,
        hasApi: credentials.hasApi
      },
      include: {
        services: true,
        deliveryZones: true,
      }
    })

    return {
      ...updatedCarrier,
      baseRate: Number(updatedCarrier.baseRate),
      ratePerKg: Number(updatedCarrier.ratePerKg),
      ratePerKm: Number(updatedCarrier.ratePerKm),
      insuranceRate: Number(updatedCarrier.insuranceRate),
      minInsuranceValue: Number(updatedCarrier.minInsuranceValue),
      maxInsuranceValue: Number(updatedCarrier.maxInsuranceValue),
    }
  }
}

export const carrierService = new CarrierService()
