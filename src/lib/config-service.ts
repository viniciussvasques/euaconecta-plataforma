import { prisma } from '@/lib/prisma'
import { SystemCustomization } from '@/lib/system-customization'

/**
 * Serviço de Configuração Híbrida
 * Combina configurações padrão (código) com configurações personalizadas (banco)
 */
export class ConfigService {
  private static instance: ConfigService
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutos

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  /**
   * Configurações padrão do sistema
   */
  private getDefaultConfig(): SystemCustomization {
    return {
      brandIdentity: {
        primaryColor: '#3B82F6',
        secondaryColor: '#6366F1',
        accentColor: '#10B981',
        logoUrl: null,
        faviconUrl: null,
        companyName: 'Euaconecta',
        tagline: 'Conectando você ao mundo'
      },
      landingPage: {
        heroTitle: 'Importe dos EUA com Segurança e Economia',
        heroSubtitle: 'Receba seus produtos favoritos diretamente no Brasil',
        heroImageUrl: null,
        features: [
          {
            title: 'Frete Econômico',
            description: 'Consolidação inteligente para reduzir custos',
            icon: '🚢'
          },
          {
            title: 'Rastreamento Total',
            description: 'Acompanhe seus pacotes em tempo real',
            icon: '📱'
          },
          {
            title: 'Suporte 24/7',
            description: 'Atendimento especializado sempre disponível',
            icon: '🎧'
          }
        ],
        testimonials: [],
        ctaText: 'Começar Agora',
        ctaUrl: '/auth/register'
      },
      clientDashboard: {
        welcomeMessage: 'Bem-vindo de volta!',
        quickActions: true,
        recentActivity: true,
        statsCards: true,
        customWidgets: []
      },
      adminDashboard: {
        theme: 'light',
        sidebarCollapsed: false,
        customReports: [],
        quickStats: true
      },
      communication: {
        emailTemplates: {
          welcome: {
            subject: 'Bem-vindo à Euaconecta!',
            template: 'welcome'
          },
          shipping: {
            subject: 'Seu pedido foi enviado!',
            template: 'shipping'
          }
        },
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      featureFlags: {
        enableStore: false,
        enableTutorials: true,
        enablePartnerStores: true,
        enableAdvancedAnalytics: false,
        enableMultiLanguage: false
      },
      localization: {
        defaultLanguage: 'pt-BR',
        supportedLanguages: ['pt-BR', 'en-US'],
        currency: 'BRL',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'America/Sao_Paulo'
      },
      analytics: {
        googleAnalyticsId: null,
        facebookPixelId: null,
        hotjarId: null,
        enableTracking: true
      },
      security: {
        enableTwoFactor: false,
        sessionTimeout: 30,
        passwordPolicy: 'medium',
        enableAuditLog: true
      }
    }
  }

  /**
   * Busca configuração específica do banco
   */
  private async getConfigFromDB(key: string): Promise<any> {
    try {
      const config = await prisma.systemCustomization.findUnique({
        where: { 
          key,
          isActive: true 
        }
      })
      return config?.value || null
    } catch (error) {
      console.error(`Erro ao buscar configuração ${key} do banco:`, error)
      return null
    }
  }

  /**
   * Salva configuração no banco
   */
  private async saveConfigToDB(key: string, value: any, description?: string): Promise<boolean> {
    try {
      await prisma.systemCustomization.upsert({
        where: { key },
        update: {
          value,
          description,
          isActive: true,
          version: { increment: 1 }
        },
        create: {
          key,
          value,
          description,
          isActive: true,
          version: 1
        }
      })
      return true
    } catch (error) {
      console.error(`Erro ao salvar configuração ${key} no banco:`, error)
      return false
    }
  }

  /**
   * Verifica se o cache é válido
   */
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key)
    return expiry ? Date.now() < expiry : false
  }

  /**
   * Limpa o cache
   */
  public clearCache(): void {
    this.cache.clear()
    this.cacheExpiry.clear()
  }

  /**
   * Busca configuração completa do sistema
   */
  public async getSystemConfig(): Promise<SystemCustomization> {
    const cacheKey = 'system_config'
    
    // Verifica cache
    if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      // Busca configuração do banco
      const dbConfig = await this.getConfigFromDB('system_customization')
      
      // Combina com configuração padrão
      const defaultConfig = this.getDefaultConfig()
      const finalConfig = dbConfig ? this.mergeConfigs(defaultConfig, dbConfig) : defaultConfig

      // Atualiza cache
      this.cache.set(cacheKey, finalConfig)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return finalConfig
    } catch (error) {
      console.error('Erro ao buscar configuração do sistema:', error)
      // Retorna configuração padrão em caso de erro
      return this.getDefaultConfig()
    }
  }

  /**
   * Salva configuração completa do sistema
   */
  public async saveSystemConfig(config: SystemCustomization): Promise<boolean> {
    try {
      const success = await this.saveConfigToDB(
        'system_customization',
        config,
        'Configuração completa do sistema'
      )

      if (success) {
        // Limpa cache para forçar recarregamento
        this.clearCache()
      }

      return success
    } catch (error) {
      console.error('Erro ao salvar configuração do sistema:', error)
      return false
    }
  }

  /**
   * Busca configuração específica
   */
  public async getConfig(key: string): Promise<any> {
    const cacheKey = `config_${key}`
    
    // Verifica cache
    if (this.cache.has(cacheKey) && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const dbConfig = await this.getConfigFromDB(key)
      
      // Atualiza cache
      this.cache.set(cacheKey, dbConfig)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return dbConfig
    } catch (error) {
      console.error(`Erro ao buscar configuração ${key}:`, error)
      return null
    }
  }

  /**
   * Salva configuração específica
   */
  public async saveConfig(key: string, value: any, description?: string): Promise<boolean> {
    try {
      const success = await this.saveConfigToDB(key, value, description)

      if (success) {
        // Atualiza cache
        this.cache.set(`config_${key}`, value)
        this.cacheExpiry.set(`config_${key}`, Date.now() + this.CACHE_TTL)
      }

      return success
    } catch (error) {
      console.error(`Erro ao salvar configuração ${key}:`, error)
      return false
    }
  }

  /**
   * Combina configurações (padrão + personalizada)
   */
  private mergeConfigs(defaultConfig: any, customConfig: any): any {
    const merged = { ...defaultConfig }

    for (const key in customConfig) {
      if (customConfig[key] !== null && customConfig[key] !== undefined) {
        if (typeof customConfig[key] === 'object' && !Array.isArray(customConfig[key])) {
          merged[key] = this.mergeConfigs(merged[key] || {}, customConfig[key])
        } else {
          merged[key] = customConfig[key]
        }
      }
    }

    return merged
  }

  /**
   * Gera CSS customizado baseado nas configurações
   */
  public generateCustomCSS(config: SystemCustomization): string {
    const { brandIdentity } = config
    
    return `
      :root {
        --primary-color: ${brandIdentity.primaryColor};
        --secondary-color: ${brandIdentity.secondaryColor};
        --accent-color: ${brandIdentity.accentColor};
        --company-name: "${brandIdentity.companyName}";
        --tagline: "${brandIdentity.tagline}";
      }
      
      .custom-primary {
        background-color: ${brandIdentity.primaryColor} !important;
        color: white !important;
      }
      
      .custom-secondary {
        background-color: ${brandIdentity.secondaryColor} !important;
        color: white !important;
      }
      
      .custom-accent {
        background-color: ${brandIdentity.accentColor} !important;
        color: white !important;
      }
      
      .custom-text-primary {
        color: ${brandIdentity.primaryColor} !important;
      }
      
      .custom-border-primary {
        border-color: ${brandIdentity.primaryColor} !important;
      }
      
      .custom-hover-primary:hover {
        background-color: ${brandIdentity.primaryColor} !important;
        color: white !important;
      }

      /* Modal customizations */
      .custom-modal-backdrop {
        background-color: rgba(0, 0, 0, 0.25) !important;
      }
      
      .custom-modal-content {
        max-width: 80vw !important;
        max-height: 90vh !important;
      }

      /* Dashboard customizations */
      .custom-dashboard-card {
        border-radius: 12px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      }

      /* Sidebar customizations */
      .custom-sidebar-item {
        padding: 12px 16px !important;
        font-weight: 600 !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
      }
    `
  }
}

// Instância singleton
export const configService = ConfigService.getInstance()
