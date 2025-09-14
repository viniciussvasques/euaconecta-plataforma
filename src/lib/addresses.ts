import { prisma } from './prisma'

export interface AddressData {
  id: string
  userId: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateAddressData {
  userId: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country?: string
  isDefault?: boolean
}

export interface UpdateAddressData {
  name?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  isDefault?: boolean
}

export class AddressService {
  /**
   * Buscar endereços de um usuário
   */
  async getByUserId(userId: string): Promise<AddressData[]> {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return addresses.map(address => ({
      id: address.id,
      userId: address.userId,
      name: address.name,
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    }))
  }

  /**
   * Buscar endereço por ID
   */
  async getById(id: string): Promise<AddressData | null> {
    const address = await prisma.address.findUnique({
      where: { id }
    })

    if (!address) return null

    return {
      id: address.id,
      userId: address.userId,
      name: address.name,
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    }
  }

  /**
   * Criar novo endereço
   */
  async create(data: CreateAddressData): Promise<AddressData> {
    // Se este endereço será o padrão, remover padrão dos outros
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: data.userId },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: data.userId,
        name: data.name,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country || 'BR',
        isDefault: data.isDefault || false
      }
    })

    return {
      id: address.id,
      userId: address.userId,
      name: address.name,
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    }
  }

  /**
   * Atualizar endereço
   */
  async update(id: string, data: UpdateAddressData): Promise<AddressData> {
    // Se este endereço será o padrão, remover padrão dos outros
    if (data.isDefault) {
      const address = await prisma.address.findUnique({ where: { id } })
      if (address) {
        await prisma.address.updateMany({
          where: { userId: address.userId },
          data: { isDefault: false }
        })
      }
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        name: data.name,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault
      }
    })

    return {
      id: address.id,
      userId: address.userId,
      name: address.name,
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    }
  }

  /**
   * Deletar endereço
   */
  async delete(id: string): Promise<void> {
    await prisma.address.delete({
      where: { id }
    })
  }

  /**
   * Definir endereço como padrão
   */
  async setDefault(id: string): Promise<AddressData> {
    const address = await prisma.address.findUnique({ where: { id } })
    if (!address) throw new Error('Endereço não encontrado')

    // Remover padrão dos outros endereços do usuário
    await prisma.address.updateMany({
      where: { userId: address.userId },
      data: { isDefault: false }
    })

    // Definir este como padrão
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    })

    return {
      id: updatedAddress.id,
      userId: updatedAddress.userId,
      name: updatedAddress.name,
      line1: updatedAddress.line1,
      line2: updatedAddress.line2 || undefined,
      city: updatedAddress.city,
      state: updatedAddress.state,
      postalCode: updatedAddress.postalCode,
      country: updatedAddress.country,
      isDefault: updatedAddress.isDefault,
      createdAt: updatedAddress.createdAt,
      updatedAt: updatedAddress.updatedAt
    }
  }

  /**
   * Buscar endereço padrão do usuário
   */
  async getDefaultByUserId(userId: string): Promise<AddressData | null> {
    const address = await prisma.address.findFirst({
      where: { 
        userId,
        isDefault: true
      }
    })

    if (!address) return null

    return {
      id: address.id,
      userId: address.userId,
      name: address.name,
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt
    }
  }
}

export const addressService = new AddressService()
