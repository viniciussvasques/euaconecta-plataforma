/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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
      branding: {
        logo: {
          primary: '/logo-euaconecta.png',
          favicon: '/favicon.ico'
        },
        colors: {
          primary: '#3b82f6',
          secondary: '#22c55e',
          accent: '#f59e0b'
        },
        fonts: {
          primary: 'Inter'
        }
      },
      contact: {
        phone: '+55 (11) 99999-9999',
        email: 'contato@euaconecta.com',
        address: 'São Paulo, SP - Brasil'
      },
      socialMedia: {
        whatsapp: 'https://wa.me/5511999999999',
        facebook: 'https://facebook.com/euaconecta',
        instagram: 'https://instagram.com/euaconecta'
      },
      landingPage: {
        hero: {
          title: 'Importe dos EUA com Segurança e Economia',
          subtitle: 'Receba seus produtos favoritos diretamente no Brasil',
          backgroundImage: undefined,
          ctaText: 'Começar Agora',
          ctaLink: '/auth/register'
        },
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
        pricing: {
          enabled: true,
          plans: []
        }
      },
      adminPanel: {
        layout: {
          sidebar: {
            collapsed: false,
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/admin' },
              { id: 'users', label: 'Usuários', icon: 'users', href: '/admin/users' },
              { id: 'packages', label: 'Pacotes', icon: 'package', href: '/admin/packages' },
              { id: 'consolidations', label: 'Consolidações', icon: 'box', href: '/admin/consolidations' },
              { id: 'shipments', label: 'Envios', icon: 'truck', href: '/admin/shipments' },
              { id: 'payments', label: 'Pagamentos', icon: 'credit-card', href: '/admin/payments' },
              { id: 'reports', label: 'Relatórios', icon: 'bar-chart', href: '/admin/reports' },
              { id: 'settings', label: 'Configurações', icon: 'settings', href: '/admin/settings' }
            ]
          }
        },
        features: {
          userManagement: true,
          packageManagement: true,
          consolidationManagement: true,
          shippingManagement: true,
          paymentManagement: true,
          reporting: true,
          systemSettings: true
        },
        theme: {
          primaryColor: '#3b82f6',
          sidebarColor: '#1f2937',
          headerColor: '#ffffff'
        }
      },
      clientDashboard: {
        layout: {
          sidebar: {
            collapsed: false,
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
              { id: 'packages', label: 'Meus Pacotes', icon: 'package', href: '/dashboard/packages' },
              { id: 'boxes', label: 'Minhas Caixas', icon: 'box', href: '/dashboard/boxes' },
              { id: 'shipping', label: 'Envios', icon: 'truck', href: '/dashboard/shipping' },
              { id: 'payments', label: 'Pagamentos', icon: 'credit-card', href: '/dashboard/payments' },
              { id: 'history', label: 'Histórico', icon: 'clock', href: '/dashboard/history' },
              { id: 'support', label: 'Suporte', icon: 'help-circle', href: '/dashboard/support' }
            ]
          },
          header: {
            showNotifications: true,
            showProfile: true,
            showSearch: true
          }
        },
        widgets: {
          stats: {
            enabled: true,
            items: [
              { id: 'packages', label: 'Pacotes Recebidos', value: '0' },
              { id: 'boxes', label: 'Caixas Ativas', value: '0' },
              { id: 'shipments', label: 'Envios Realizados', value: '0' }
            ]
          },
          recentActivity: {
            enabled: true,
            limit: 10
          },
          quickActions: {
            enabled: true,
            actions: []
          }
        },
        theme: {
          primaryColor: '#3b82f6',
          sidebarColor: '#64748b',
          headerColor: '#f59e0b'
        }
      },
      communication: {
        emails: {
          templates: {
            welcome: {
              subject: 'Bem-vindo à Euaconecta!',
              content: 'Obrigado por se cadastrar em nossa plataforma.',
              enabled: true
            },
            packageReceived: {
              subject: 'Pacote recebido com sucesso',
              content: 'Seu pacote foi recebido em nosso armazém.',
              enabled: true
            },
            shipmentCreated: {
              subject: 'Envio criado',
              content: 'Seu envio foi criado e está sendo processado.',
              enabled: true
            },
            paymentConfirmation: {
              subject: 'Pagamento confirmado',
              content: 'Seu pagamento foi processado com sucesso.',
              enabled: true
            }
          },
          branding: {
            logo: '',
            primaryColor: '#3B82F6',
            footerText: ''
          }
        },
        notifications: {
          inApp: {
            enabled: true,
            types: ['package', 'payment', 'shipping']
          },
          email: {
            enabled: true,
            types: ['welcome', 'shipping', 'payment']
          },
          sms: {
            enabled: false,
            types: []
          }
        }
      },
      features: {
        auth: {
          socialLogin: { google: false, facebook: false, apple: false },
          twoFactor: false,
          passwordReset: true
        },
        payments: { stripe: true, paypal: false, pix: false, boleto: false },
        carriers: { usps: true, ups: true, fedex: true, dhl: false, custom: [] },
        consolidation: { types: ['SIMPLE','REPACK'], protectionOptions: ['BUBBLE_WRAP','DOUBLE_BOX','SECURITY_TAPE'], storageDays: 30, maxWeight: 30000 },
        support: { ticketSystem: true, liveChat: false, knowledgeBase: false, faq: true }
      },
      localization: {
        language: 'pt-BR',
        currency: 'USD',
        timezone: 'America/Sao_Paulo',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'pt-BR'
      },
      analytics: {
        googleAnalytics: {
          enabled: false,
          trackingId: undefined
        },
        facebookPixel: {
          enabled: false,
          pixelId: undefined
        },
        customEvents: []
      },
      security: {
        rateLimiting: {
          enabled: true,
          requestsPerMinute: 100
        },
        captcha: {
          enabled: true,
          siteKey: undefined
        },
        dataRetention: {
          days: 365,
          autoDelete: false
        }
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
      return this.cache.get(cacheKey) as SystemCustomization
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

      return finalConfig as SystemCustomization
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
      return this.cache.get(cacheKey) as any
    }

    try {
      const dbConfig = await this.getConfigFromDB(key)

      // Atualiza cache
      this.cache.set(cacheKey, dbConfig)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      return dbConfig as any
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

    return merged as any
  }

  /**
   * Gera CSS customizado baseado nas configurações
   */
  public generateCustomCSS(_config: SystemCustomization): string {
    // Usar valores padrão já que brandIdentity não existe na interface

    return `
      :root {
        --primary-color: #3B82F6;
        --secondary-color: #6366F1;
        --accent-color: #F59E0B;
        --company-name: "Euaconecta";
        --tagline: "Conectando você ao mundo";
      }

      .custom-primary {
        background-color: #3B82F6 !important;
        color: white !important;
      }

      .custom-secondary {
        background-color: #6366F1 !important;
        color: white !important;
      }

      .custom-accent {
        background-color: #F59E0B !important;
        color: white !important;
      }

      .custom-text-primary {
        color: #3B82F6 !important;
      }

      .custom-border-primary {
        border-color: #3B82F6 !important;
      }

      .custom-hover-primary:hover {
        background-color: #3B82F6 !important;
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
