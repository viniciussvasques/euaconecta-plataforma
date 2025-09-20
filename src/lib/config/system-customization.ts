/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 🎨 SISTEMA DE PERSONALIZAÇÃO EUACONECTA
 * Configurações para personalização completa do sistema
 */

export interface SystemCustomization {
  // ================================
  // 🎨 IDENTIDADE VISUAL
  // ================================
  branding: {
    logo: {
      primary: string // URL do logo principal
      secondary?: string // URL do logo secundário
      favicon: string // URL do favicon
    }
    colors: {
      primary: string // Cor principal da marca
      secondary: string // Cor secundária
      accent: string // Cor de destaque
    }
    fonts: {
      primary: string // Fonte principal
      secondary?: string // Fonte secundária
    }
  }

  // ================================
  // 🏠 LANDING PAGE
  // ================================
  landingPage: {
    hero: {
      title: string
      subtitle: string
      backgroundImage?: string
      ctaText: string
      ctaLink: string
    }
    features: Array<{
      icon: string
      title: string
      description: string
    }>
    testimonials: Array<{
      name: string
      role: string
      content: string
      avatar?: string
    }>
    pricing: {
      enabled: boolean
      plans: Array<{
        name: string
        price: string
        features: string[]
        popular?: boolean
      }>
    }
  }

  // ================================
  // 📞 CONTATO E REDES SOCIAIS
  // ================================
  contact: {
    phone: string
    email: string
    address: string
  }

  socialMedia: {
    whatsapp: string
    facebook: string
    instagram: string
  }

  // ================================
  // 📱 DASHBOARD DO CLIENTE
  // ================================
  clientDashboard: {
    layout: {
      sidebar: {
        collapsed: boolean
        items: Array<{
          id: string
          label: string
          icon: string
          href: string
          badge?: string
        }>
      }
      header: {
        showNotifications: boolean
        showProfile: boolean
        showSearch: boolean
      }
    }
    widgets: {
      stats: {
        enabled: boolean
        items: Array<{
          id: string
          label: string
          value: string
          change?: string
          trend?: 'up' | 'down' | 'neutral'
        }>
      }
      recentActivity: {
        enabled: boolean
        limit: number
      }
      quickActions: {
        enabled: boolean
        actions: Array<{
          id: string
          label: string
          icon: string
          href: string
        }>
      }
    }
    theme: {
      primaryColor: string
      sidebarColor: string
      headerColor: string
    }
  }

  // ================================
  // ⚙️ PAINEL ADMINISTRATIVO
  // ================================
  adminPanel: {
    layout: {
      sidebar: {
        collapsed: boolean
        items: Array<{
          id: string
          label: string
          icon: string
          href: string
          children?: Array<{
            id: string
            label: string
            href: string
          }>
        }>
      }
    }
    features: {
      userManagement: boolean
      packageManagement: boolean
      consolidationManagement: boolean
      shippingManagement: boolean
      paymentManagement: boolean
      reporting: boolean
      systemSettings: boolean
    }
    theme: {
      primaryColor: string
      sidebarColor: string
      headerColor: string
    }
  }

  // ================================
  // 📧 COMUNICAÇÃO
  // ================================
  communication: {
    emails: {
      templates: {
        welcome: {
          subject: string
          content: string
          enabled: boolean
        }
        packageReceived: {
          subject: string
          content: string
          enabled: boolean
        }
        shipmentCreated: {
          subject: string
          content: string
          enabled: boolean
        }
        paymentConfirmation: {
          subject: string
          content: string
          enabled: boolean
        }
      }
      branding: {
        logo: string
        primaryColor: string
        footerText: string
      }
    }
    notifications: {
      inApp: {
        enabled: boolean
        types: string[]
      }
      email: {
        enabled: boolean
        types: string[]
      }
      sms: {
        enabled: boolean
        types: string[]
      }
    }
  }

  // ================================
  // 🔧 FUNCIONALIDADES
  // ================================
  features: {
    // Autenticação
    auth: {
      socialLogin: {
        google: boolean
        facebook: boolean
        apple: boolean
      }
      twoFactor: boolean
      passwordReset: boolean
    }

    // Pagamentos
    payments: {
      stripe: boolean
      paypal: boolean
      pix: boolean
      boleto: boolean
    }

    // Transportadoras
    carriers: {
      usps: boolean
      ups: boolean
      fedex: boolean
      dhl: boolean
      custom: Array<{
        name: string
        code: string
        trackingUrl: string
      }>
    }

    // Consolidação
    consolidation: {
      types: string[]
      protectionOptions: string[]
      storageDays: number
      maxWeight: number
    }

    // Suporte
    support: {
      ticketSystem: boolean
      liveChat: boolean
      knowledgeBase: boolean
      faq: boolean
    }
  }

  // ================================
  // 🌐 LOCALIZAÇÃO
  // ================================
  localization: {
    language: string
    currency: string
    timezone: string
    dateFormat: string
    numberFormat: string
  }

  // ================================
  // 📊 ANALYTICS
  // ================================
  analytics: {
    googleAnalytics: {
      enabled: boolean
      trackingId?: string
    }
    facebookPixel: {
      enabled: boolean
      pixelId?: string
    }
    customEvents: Array<{
      name: string
      enabled: boolean
    }>
  }

  // ================================
  // 🔒 SEGURANÇA
  // ================================
  security: {
    rateLimiting: {
      enabled: boolean
      requestsPerMinute: number
    }
    captcha: {
      enabled: boolean
      siteKey?: string
    }
    dataRetention: {
      days: number
      autoDelete: boolean
    }
  }
}

// ================================
// 🎯 CONFIGURAÇÃO PADRÃO
// ================================
export const defaultCustomization: SystemCustomization = {
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

  landingPage: {
    hero: {
      title: 'Receba seus produtos dos EUA no Brasil',
      subtitle: 'Consolidação de pacotes, envio seguro e rastreamento em tempo real',
      ctaText: 'Começar Agora',
      ctaLink: '/auth/register'
    },
    features: [
      {
        icon: 'package',
        title: 'Consolidação Inteligente',
        description: 'Combine múltiplos pacotes em uma única remessa'
      },
      {
        icon: 'shield',
        title: 'Seguro e Confiável',
        description: 'Proteção total para seus produtos'
      },
      {
        icon: 'truck',
        title: 'Rastreamento em Tempo Real',
        description: 'Acompanhe sua encomenda a cada etapa'
      }
    ],
    testimonials: [],
    pricing: {
      enabled: false,
      plans: []
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
        limit: 5
      },
      quickActions: {
        enabled: true,
        actions: [
          { id: 'add-package', label: 'Adicionar Pacote', icon: 'plus', href: '/dashboard/packages/add' },
          { id: 'create-box', label: 'Criar Caixa', icon: 'box', href: '/dashboard/boxes/create' }
        ]
      }
    },
    theme: {
      primaryColor: '#3b82f6',
      sidebarColor: '#ffffff',
      headerColor: '#ffffff'
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

  communication: {
    emails: {
      templates: {
        welcome: {
          subject: 'Bem-vindo ao Euaconecta!',
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
        logo: '/logo-euaconecta.png',
        primaryColor: '#3b82f6',
        footerText: 'Euaconecta - Consolidação de Pacotes'
      }
    },
    notifications: {
      inApp: {
        enabled: true,
        types: ['package_received', 'shipment_created', 'payment_confirmed']
      },
      email: {
        enabled: true,
        types: ['package_received', 'shipment_created', 'payment_confirmed']
      },
      sms: {
        enabled: false,
        types: []
      }
    }
  },

  features: {
    auth: {
      socialLogin: {
        google: false,
        facebook: false,
        apple: false
      },
      twoFactor: false,
      passwordReset: true
    },
    payments: {
      stripe: true,
      paypal: false,
      pix: false,
      boleto: false
    },
    carriers: {
      usps: true,
      ups: true,
      fedex: true,
      dhl: false,
      custom: []
    },
    consolidation: {
      types: ['SIMPLE', 'REPACK'],
      protectionOptions: ['BUBBLE_WRAP', 'DOUBLE_BOX', 'SECURITY_TAPE'],
      storageDays: 30,
      maxWeight: 30000
    },
    support: {
      ticketSystem: true,
      liveChat: false,
      knowledgeBase: false,
      faq: true
    }
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
      enabled: false
    },
    facebookPixel: {
      enabled: false
    },
    customEvents: []
  },

  security: {
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 60
    },
    captcha: {
      enabled: false
    },
    dataRetention: {
      days: 365,
      autoDelete: false
    }
  }
}

// ================================
// 🎯 UTILITÁRIOS
// ================================
export class SystemCustomizationService {
  private customization: SystemCustomization

  constructor(customization?: Partial<SystemCustomization>) {
    this.customization = { ...defaultCustomization, ...customization }
  }

  // Obter configuração atual
  getCustomization(): SystemCustomization {
    return this.customization
  }

  // Atualizar configuração
  updateCustomization(updates: Partial<SystemCustomization>): void {
    this.customization = { ...this.customization, ...updates }
  }

  // Obter cores do tema
  getThemeColors() {
    return this.customization.branding.colors
  }

  // Obter configuração da landing page
  getLandingPageConfig() {
    return this.customization.landingPage
  }

  // Obter configuração do dashboard do cliente
  getClientDashboardConfig() {
    return this.customization.clientDashboard
  }

  // Obter configuração do painel admin
  getAdminPanelConfig() {
    return this.customization.adminPanel
  }

  // Verificar se uma funcionalidade está habilitada
  isFeatureEnabled(feature: string): boolean {
    const features = this.customization.features as any
    return features[feature] === true
  }

  // Obter configuração de localização
  getLocalizationConfig() {
    return this.customization.localization
  }
}

export default SystemCustomizationService
