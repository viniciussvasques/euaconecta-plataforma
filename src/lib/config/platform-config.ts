/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../database/prisma'

export interface PlatformConfigData {
  companyName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  email: string
  taxRate: number
  handlingFee: number
  storageFeePerDay: number
  maxStorageDays: number
  defaultCarrier: string
  defaultService: string
  insuranceRequired: boolean
  minInsuranceAmount: number
  stripeEnabled: boolean
  paypalEnabled: boolean
  autoInvoice: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  webhookUrl?: string
  shipstationEnabled: boolean
  shipstationApiKey?: string
  shipstationApiSecret?: string
  s3Enabled: boolean
  s3BucketName?: string
  s3Region?: string
  maxFileSize: number
  maxLoginAttempts: number
  sessionTimeout: number
  require2FA: boolean

  // Novos campos dinâmicos
  consolidationBaseFeeUsdCents: number
  consolidationPerPackageUsdCents: number
  repackMultiplier: number
  currency: string

  // Markup sobre frete (monetização)
  freightMarkupPercentage: number
  freightMarkupMinAmount: number
  freightMarkupMaxAmount: number
  processingFeeUsdCents: number
}

let cachedConfig: PlatformConfigData | null = null

export const PlatformConfig = {
  async load(): Promise<PlatformConfigData> {
    if (cachedConfig) return cachedConfig

    let cfg = await prisma.platformConfig.findFirst()

    if (!cfg) {
      // Criar registro padrão
      cfg = await prisma.platformConfig.create({
        data: {
          companyName: 'Euaconecta',
          addressLine1: 'Address Line 1',
          city: 'City',
          state: 'ST',
          postalCode: '00000',
          country: 'US',
          phone: '+1 000 000 0000',
          email: 'admin@euaconecta.test',
          taxRate: 0,
          handlingFee: 0,
          storageFeePerDay: 0,
          maxStorageDays: 30,
          defaultCarrier: 'USPS',
          defaultService: 'Priority',
          insuranceRequired: false,
          minInsuranceAmount: 0,
          stripeEnabled: false,
          paypalEnabled: false,
          autoInvoice: true,
          emailNotifications: true,
          smsNotifications: false,
          shipstationEnabled: false,
          s3Enabled: false,
          maxFileSize: 10485760,
          maxLoginAttempts: 5,
          sessionTimeout: 3600,
          require2FA: false,
        },
      })
    }

    const anyCfg = cfg as Record<string, unknown>

    cachedConfig = {
      companyName: cfg.companyName,
      addressLine1: cfg.addressLine1,
      addressLine2: cfg.addressLine2 || undefined,
      city: cfg.city,
      state: cfg.state,
      postalCode: cfg.postalCode,
      country: cfg.country,
      phone: cfg.phone,
      email: cfg.email,
      taxRate: Number(anyCfg.taxRate ?? 0),
      handlingFee: Number(anyCfg.handlingFee ?? 0),
      storageFeePerDay: Number(anyCfg.storageFeePerDay ?? 0),
      maxStorageDays: Number(anyCfg.maxStorageDays ?? 30),
      defaultCarrier: anyCfg.defaultCarrier as string ?? 'USPS',
      defaultService: anyCfg.defaultService as string ?? 'Priority',
      insuranceRequired: Boolean(anyCfg.insuranceRequired ?? false),
      minInsuranceAmount: Number(anyCfg.minInsuranceAmount ?? 0),
      stripeEnabled: Boolean(anyCfg.stripeEnabled ?? false),
      paypalEnabled: Boolean(anyCfg.paypalEnabled ?? false),
      autoInvoice: Boolean(anyCfg.autoInvoice ?? true),
      emailNotifications: Boolean(anyCfg.emailNotifications ?? true),
      smsNotifications: Boolean(anyCfg.smsNotifications ?? false),
      webhookUrl: anyCfg.webhookUrl as string || undefined,
      shipstationEnabled: Boolean(anyCfg.shipstationEnabled ?? false),
      shipstationApiKey: anyCfg.shipstationApiKey as string || undefined,
      shipstationApiSecret: anyCfg.shipstationApiSecret as string || undefined,
      s3Enabled: Boolean(anyCfg.s3Enabled ?? false),
      s3BucketName: (anyCfg.s3BucketName as string) || undefined,
      s3Region: (anyCfg.s3Region as string) || undefined,
      maxFileSize: Number(anyCfg.maxFileSize ?? 10485760),
      maxLoginAttempts: Number(anyCfg.maxLoginAttempts ?? 5),
      sessionTimeout: Number(anyCfg.sessionTimeout ?? 3600),
      require2FA: Boolean(anyCfg.require2FA ?? false),

      // Novos campos dinâmicos
      consolidationBaseFeeUsdCents: Number(anyCfg.consolidationBaseFeeUsdCents ?? 500),
      consolidationPerPackageUsdCents: Number(anyCfg.consolidationPerPackageUsdCents ?? 100),
      repackMultiplier: Number(anyCfg.repackMultiplier ?? 1.5),
      currency: (anyCfg.currency as string) ?? 'USD',

      // Markup sobre frete
      freightMarkupPercentage: Number(anyCfg.freightMarkupPercentage ?? 0.15),
      freightMarkupMinAmount: Number(anyCfg.freightMarkupMinAmount ?? 200),
      freightMarkupMaxAmount: Number(anyCfg.freightMarkupMaxAmount ?? 5000),
      processingFeeUsdCents: Number(anyCfg.processingFeeUsdCents ?? 300),
    }

    return cachedConfig!
  },

  async reload() {
    cachedConfig = null
    return this.load()
  },

  async update(input: Partial<PlatformConfigData>): Promise<PlatformConfigData> {
    // Ensure a single config row exists, then update only provided fields
    const existing = await prisma.platformConfig.findFirst()

    const data: Record<string, unknown> = {}

    // Shallow map with basic coercion where necessário
    const assign = <K extends keyof PlatformConfigData>(key: K) => {
      if (input[key] !== undefined) data[key as string] = input[key] as unknown
    }

    assign('companyName')
    assign('addressLine1')
    assign('addressLine2')
    assign('city')
    assign('state')
    assign('postalCode')
    assign('country')
    assign('phone')
    assign('email')

    assign('taxRate')
    assign('handlingFee')
    assign('storageFeePerDay')
    assign('maxStorageDays')

    assign('defaultCarrier')
    assign('defaultService')
    assign('insuranceRequired')
    assign('minInsuranceAmount')

    assign('stripeEnabled')
    assign('paypalEnabled')
    assign('autoInvoice')
    assign('emailNotifications')
    assign('smsNotifications')
    assign('webhookUrl')

    assign('shipstationEnabled')
    assign('shipstationApiKey')
    assign('shipstationApiSecret')

    assign('s3Enabled')
    assign('s3BucketName')
    assign('s3Region')
    assign('maxFileSize')
    assign('maxLoginAttempts')
    assign('sessionTimeout')
    assign('require2FA')

    // Dynamic consolidation/freight fields
    assign('consolidationBaseFeeUsdCents')
    assign('consolidationPerPackageUsdCents')
    assign('repackMultiplier')
    assign('currency')
    assign('freightMarkupPercentage')
    assign('freightMarkupMinAmount')
    assign('freightMarkupMaxAmount')
    assign('processingFeeUsdCents')

    if (!existing) {
      await prisma.platformConfig.create({ data: data as any })
    } else {
      await prisma.platformConfig.update({ where: { id: existing.id }, data: data as any })
    }

    await this.reload()
    return cachedConfig as PlatformConfigData
  },
}
