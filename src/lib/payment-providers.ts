import { prisma } from './prisma'

export interface PaymentProviderData {
  id: string
  name: string
  code: string
  description?: string
  isActive: boolean
  hasApi: boolean
  apiKey?: string
  apiSecret?: string
  apiUrl?: string
  webhookSecret?: string
  supportedCurrencies: string[]
  supportedCountries: string[]
  fees: {
    fixed: number
    percentage: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreatePaymentProviderData {
  name: string
  code: string
  description?: string
  isActive?: boolean
  hasApi?: boolean
  apiKey?: string
  apiSecret?: string
  apiUrl?: string
  webhookSecret?: string
  supportedCurrencies?: string[]
  supportedCountries?: string[]
  fees?: {
    fixed: number
    percentage: number
  }
}

export class PaymentProviderService {
  // Buscar todos os provedores
  async getAll(): Promise<PaymentProviderData[]> {
    const providers = await prisma.paymentProvider.findMany({
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' }
      ]
    })

    return providers.map((provider: Record<string, unknown>) => ({
      id: provider.id as string,
      name: provider.name as string,
      code: provider.code as string,
      description: provider.description as string || undefined,
      isActive: provider.isActive as boolean,
      hasApi: provider.hasApi as boolean,
      apiKey: provider.apiKey as string || undefined,
      apiSecret: provider.apiSecret as string || undefined,
      apiUrl: provider.apiUrl as string || undefined,
      webhookSecret: provider.webhookSecret as string || undefined,
      supportedCurrencies: provider.supportedCurrencies as string[],
      supportedCountries: provider.supportedCountries as string[],
      fees: {
        fixed: Number(provider.fixedFee),
        percentage: Number(provider.percentageFee)
      },
      createdAt: provider.createdAt as Date,
      updatedAt: provider.updatedAt as Date
    }))
  }

  // Buscar apenas provedores ativos
  async getAllActive(): Promise<PaymentProviderData[]> {
    const providers = await prisma.paymentProvider.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return providers.map((provider: Record<string, unknown>) => ({
      id: provider.id as string,
      name: provider.name as string,
      code: provider.code as string,
      description: provider.description as string || undefined,
      isActive: provider.isActive as boolean,
      hasApi: provider.hasApi as boolean,
      apiKey: provider.apiKey as string || undefined,
      apiSecret: provider.apiSecret as string || undefined,
      apiUrl: provider.apiUrl as string || undefined,
      webhookSecret: provider.webhookSecret as string || undefined,
      supportedCurrencies: provider.supportedCurrencies as string[],
      supportedCountries: provider.supportedCountries as string[],
      fees: {
        fixed: Number(provider.fixedFee),
        percentage: Number(provider.percentageFee)
      },
      createdAt: provider.createdAt as Date,
      updatedAt: provider.updatedAt as Date
    }))
  }

  // Buscar por ID
  async getById(id: string): Promise<PaymentProviderData | null> {
    const provider = await prisma.paymentProvider.findUnique({
      where: { id }
    })

    if (!provider) return null

    return {
      id: provider.id as string,
      name: provider.name as string,
      code: provider.code as string,
      description: provider.description as string || undefined,
      isActive: provider.isActive as boolean,
      hasApi: provider.hasApi as boolean,
      apiKey: provider.apiKey as string || undefined,
      apiSecret: provider.apiSecret as string || undefined,
      apiUrl: provider.apiUrl as string || undefined,
      webhookSecret: provider.webhookSecret as string || undefined,
      supportedCurrencies: provider.supportedCurrencies as string[],
      supportedCountries: provider.supportedCountries as string[],
      fees: {
        fixed: Number(provider.fixedFee),
        percentage: Number(provider.percentageFee)
      },
      createdAt: provider.createdAt as Date,
      updatedAt: provider.updatedAt as Date
    }
  }

  // Buscar por código
  async getByCode(code: string): Promise<PaymentProviderData | null> {
    const provider = await prisma.paymentProvider.findUnique({
      where: { code }
    })

    if (!provider) return null

    return {
      id: provider.id as string,
      name: provider.name as string,
      code: provider.code as string,
      description: provider.description as string || undefined,
      isActive: provider.isActive as boolean,
      hasApi: provider.hasApi as boolean,
      apiKey: provider.apiKey as string || undefined,
      apiSecret: provider.apiSecret as string || undefined,
      apiUrl: provider.apiUrl as string || undefined,
      webhookSecret: provider.webhookSecret as string || undefined,
      supportedCurrencies: provider.supportedCurrencies as string[],
      supportedCountries: provider.supportedCountries as string[],
      fees: {
        fixed: Number(provider.fixedFee),
        percentage: Number(provider.percentageFee)
      },
      createdAt: provider.createdAt as Date,
      updatedAt: provider.updatedAt as Date
    }
  }

  // Criar provedor
  async create(data: CreatePaymentProviderData): Promise<PaymentProviderData> {
    const provider = await prisma.paymentProvider.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: data.isActive ?? true,
        hasApi: data.hasApi ?? false,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        apiUrl: data.apiUrl,
        webhookSecret: data.webhookSecret,
        supportedCurrencies: data.supportedCurrencies || ['USD'],
        supportedCountries: data.supportedCountries || ['BR'],
        fixedFee: data.fees?.fixed || 0,
        percentageFee: data.fees?.percentage || 0
      }
    })

    return {
      id: provider.id as string,
      name: provider.name as string,
      code: provider.code as string,
      description: provider.description as string || undefined,
      isActive: provider.isActive as boolean,
      hasApi: provider.hasApi as boolean,
      apiKey: provider.apiKey as string || undefined,
      apiSecret: provider.apiSecret as string || undefined,
      apiUrl: provider.apiUrl as string || undefined,
      webhookSecret: provider.webhookSecret as string || undefined,
      supportedCurrencies: provider.supportedCurrencies as string[],
      supportedCountries: provider.supportedCountries as string[],
      fees: {
        fixed: Number(provider.fixedFee),
        percentage: Number(provider.percentageFee)
      },
      createdAt: provider.createdAt as Date,
      updatedAt: provider.updatedAt as Date
    }
  }

  // Atualizar provedor
  async update(id: string, data: Partial<CreatePaymentProviderData>): Promise<PaymentProviderData> {
    const provider = await prisma.paymentProvider.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: data.isActive,
        hasApi: data.hasApi,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        apiUrl: data.apiUrl,
        webhookSecret: data.webhookSecret,
        supportedCurrencies: data.supportedCurrencies,
        supportedCountries: data.supportedCountries,
        fixedFee: data.fees?.fixed,
        percentageFee: data.fees?.percentage
      }
    })

    return {
      id: provider.id as string,
      name: provider.name as string,
      code: provider.code as string,
      description: provider.description as string || undefined,
      isActive: provider.isActive as boolean,
      hasApi: provider.hasApi as boolean,
      apiKey: provider.apiKey as string || undefined,
      apiSecret: provider.apiSecret as string || undefined,
      apiUrl: provider.apiUrl as string || undefined,
      webhookSecret: provider.webhookSecret as string || undefined,
      supportedCurrencies: provider.supportedCurrencies as string[],
      supportedCountries: provider.supportedCountries as string[],
      fees: {
        fixed: Number(provider.fixedFee),
        percentage: Number(provider.percentageFee)
      },
      createdAt: provider.createdAt as Date,
      updatedAt: provider.updatedAt as Date
    }
  }

  // Atualizar credenciais
  async updateCredentials(id: string, credentials: {
    apiKey?: string
    apiSecret?: string
    apiUrl?: string
    webhookSecret?: string
    hasApi?: boolean
  }): Promise<PaymentProviderData> {
    const provider = await prisma.paymentProvider.update({
      where: { id },
      data: {
        apiKey: credentials.apiKey,
        apiSecret: credentials.apiSecret,
        apiUrl: credentials.apiUrl,
        webhookSecret: credentials.webhookSecret,
        hasApi: credentials.hasApi
      }
    })

    return {
      id: provider.id as string,
      name: provider.name as string,
      code: provider.code as string,
      description: provider.description as string || undefined,
      isActive: provider.isActive as boolean,
      hasApi: provider.hasApi as boolean,
      apiKey: provider.apiKey as string || undefined,
      apiSecret: provider.apiSecret as string || undefined,
      apiUrl: provider.apiUrl as string || undefined,
      webhookSecret: provider.webhookSecret as string || undefined,
      supportedCurrencies: provider.supportedCurrencies as string[],
      supportedCountries: provider.supportedCountries as string[],
      fees: {
        fixed: Number(provider.fixedFee),
        percentage: Number(provider.percentageFee)
      },
      createdAt: provider.createdAt as Date,
      updatedAt: provider.updatedAt as Date
    }
  }

  // Alternar status ativo
  async toggleActive(id: string): Promise<PaymentProviderData> {
    const provider = await prisma.paymentProvider.findUnique({
      where: { id }
    })

    if (!provider) {
      throw new Error('Provedor não encontrado')
    }

    const updatedProvider = await prisma.paymentProvider.update({
      where: { id },
      data: { isActive: !provider.isActive }
    })

    return {
      id: updatedProvider.id,
      name: updatedProvider.name,
      code: updatedProvider.code,
      description: updatedProvider.description || undefined,
      isActive: updatedProvider.isActive,
      hasApi: updatedProvider.hasApi,
      apiKey: updatedProvider.apiKey || undefined,
      apiSecret: updatedProvider.apiSecret || undefined,
      apiUrl: updatedProvider.apiUrl || undefined,
      webhookSecret: updatedProvider.webhookSecret || undefined,
      supportedCurrencies: updatedProvider.supportedCurrencies,
      supportedCountries: updatedProvider.supportedCountries,
      fees: {
        fixed: Number(updatedProvider.fixedFee),
        percentage: Number(updatedProvider.percentageFee)
      },
      createdAt: updatedProvider.createdAt,
      updatedAt: updatedProvider.updatedAt
    }
  }

  // Deletar provedor
  async delete(id: string): Promise<void> {
    await prisma.paymentProvider.delete({
      where: { id }
    })
  }
}

export const paymentProviderService = new PaymentProviderService()
