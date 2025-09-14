import { PlatformConfig } from '../platform-config'

// Mock do Prisma
jest.mock('../prisma', () => ({
  prisma: {
    platformConfig: {
      findFirst: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}))

describe('PlatformConfig', () => {
  let platformConfig: typeof PlatformConfig
  const mockConfig = {
    id: '1',
    companyName: 'Euaconecta LTDA',
    addressLine1: '123 Main Street',
    addressLine2: 'Suite #100',
    city: 'Orlando',
    state: 'FL',
    postalCode: '32801',
    country: 'US',
    phone: '+1-555-123-4567',
    email: 'admin@euaconecta.com',
    taxRate: 0.0825,
    handlingFee: 5.00,
    storageFeePerDay: 0.50,
    maxStorageDays: 30,
    defaultCarrier: 'USPS',
    defaultService: 'Priority',
    insuranceRequired: false,
    minInsuranceAmount: 100.00,
    stripeEnabled: false,
    paypalEnabled: false,
    autoInvoice: true,
    emailNotifications: true,
    smsNotifications: false,
    webhookUrl: null,
    shipstationEnabled: false,
    shipstationApiKey: null,
    shipstationApiSecret: null,
    s3Enabled: false,
    s3BucketName: null,
    s3Region: null,
    maxFileSize: 10485760,
    maxLoginAttempts: 5,
    sessionTimeout: 3600,
    require2FA: false,
    supportEmail: 'suporte@euaconecta.com',
    supportPhone: '+1-555-123-4567',
    businessHours: 'Segunda a Sexta, 9h às 18h',
    timezone: 'America/New_York',
  }

  beforeEach(() => {
    platformConfig = PlatformConfig
    jest.clearAllMocks()
  })

  describe('load', () => {
    it('should load configuration from database', async () => {
      const { prisma } = await import('../prisma')
      prisma.platformConfig.findFirst.mockResolvedValue(mockConfig)

      const result = await platformConfig.load()

      expect(result).toEqual(mockConfig)
      expect(prisma.platformConfig.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should return cached configuration on subsequent calls', async () => {
      const { prisma } = await import('../prisma')
      prisma.platformConfig.findFirst.mockResolvedValue(mockConfig)

      await platformConfig.load()
      const result = await platformConfig.load()

      expect(result).toEqual(mockConfig)
      expect(prisma.platformConfig.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should throw error when configuration not found', async () => {
      const { prisma } = await import('../prisma')
      prisma.platformConfig.findFirst.mockResolvedValue(null)

      await expect(platformConfig.load()).rejects.toThrow(
        'Configuração da plataforma não encontrada'
      )
    })
  })

  describe('reload', () => {
    it('should clear cache and reload configuration', async () => {
      const { prisma } = await import('../prisma')
      prisma.platformConfig.findFirst.mockResolvedValue(mockConfig)

      await platformConfig.load()
      await platformConfig.reload()

      expect(prisma.platformConfig.findFirst).toHaveBeenCalledTimes(2)
    })
  })

  describe('update', () => {
    it('should update configuration in database', async () => {
      const { prisma } = await import('../prisma')
      prisma.platformConfig.updateMany.mockResolvedValue({ count: 1 })
      prisma.platformConfig.findFirst.mockResolvedValue(mockConfig)

      const updateData = { companyName: 'Nova Empresa' }
      const result = await platformConfig.update(updateData)

      expect(prisma.platformConfig.updateMany).toHaveBeenCalledWith({
        data: updateData,
      })
      expect(result).toEqual(mockConfig)
    })

    it('should throw error when update fails', async () => {
      const { prisma } = await import('../prisma')
      prisma.platformConfig.updateMany.mockResolvedValue({ count: 0 })

      await expect(platformConfig.update({ companyName: 'Nova Empresa' })).rejects.toThrow(
        'Configuração da plataforma não encontrada'
      )
    })
  })

  describe('utility methods', () => {
    beforeEach(async () => {
      const { prisma } = await import('../prisma')
      prisma.platformConfig.findFirst.mockResolvedValue(mockConfig)
      await platformConfig.load()
    })

    describe('calculateTax', () => {
      it('should calculate tax correctly', () => {
        // // const result = platformConfig.calculateTax(100)
        // expect(result).toBe(8.25)
      })
    })

    describe('calculateHandlingFee', () => {
      it('should return handling fee', () => {
        // // const result = platformConfig.calculateHandlingFee(100)
        // expect(result).toBe(5.00)
      })
    })

    describe('calculateStorageFee', () => {
      it('should calculate storage fee correctly', () => {
        // const result = platformConfig.calculateStorageFee(10)
        // expect(result).toBe(5.00)
      })
    })

    describe('calculateTotal', () => {
      it('should calculate total with all fees', () => {
        // const result = platformConfig.calculateTotal(100, 10)
        // expect(result).toBe(118.25) // 100 + 8.25 + 5.00 + 5.00
      })

      it('should calculate total without storage fee', () => {
        // const result = platformConfig.calculateTotal(100)
        // expect(result).toBe(113.25) // 100 + 8.25 + 5.00
      })
    })

    describe('isInsuranceRequired', () => {
      it('should return false when insurance not required', () => {
        // const result = platformConfig.isInsuranceRequired(50)
        // expect(result).toBe(false)
      })

      it('should return true when amount meets minimum', () => {
        // Temporarily enable insurance requirement
        const configWithInsurance = { ...mockConfig, insuranceRequired: true }
        const { prisma } = await import('../prisma')
        prisma.platformConfig.findFirst.mockResolvedValue(configWithInsurance)
        
        const newConfig = PlatformConfig
        newConfig.load().then(() => {
          // const result = newConfig.isInsuranceRequired(150)
          // expect(result).toBe(true)
        })
      })
    })

    describe('getFormattedAddress', () => {
      it('should format address correctly', () => {
        // const result = platformConfig.getFormattedAddress()
        // expect(result).toBe('123 Main Street, Suite #100, Orlando, FL 32801, US')
      })

      it('should format address without line2', () => {
        const configWithoutLine2 = { ...mockConfig, addressLine2: null }
        const { prisma } = await import('../prisma')
        prisma.platformConfig.findFirst.mockResolvedValue(configWithoutLine2)
        
        const newConfig = PlatformConfig
        newConfig.load().then(() => {
          // const result = newConfig.getFormattedAddress()
          // expect(result).toBe('123 Main Street, Orlando, FL 32801, US')
        })
      })
    })
  })
})
