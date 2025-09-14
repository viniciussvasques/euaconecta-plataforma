'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { SystemCustomization } from '@/lib/system-customization'
import { 
  Palette, 
  Home, 
  Users, 
  Settings, 
  Mail, 
  Globe, 
  Shield,
  Save,
  Eye,
  Upload,
  Loader2
} from 'lucide-react'

export default function SystemCustomizationPage() {
  const [activeTab, setActiveTab] = useState('branding')
  const [customization, setCustomization] = useState<SystemCustomization>({
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
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Carregar configurações ao montar o componente
  useEffect(() => {
    loadCustomization()
  }, [])

  const loadCustomization = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customization')
      const data = await response.json()
      
      if (data.success) {
        setCustomization(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customization),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Configurações salvas com sucesso!')
      } else {
        alert('Erro ao salvar configurações: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/customization/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customization,
          previewType: activeTab === 'landing' ? 'landing' : 
                      activeTab === 'client' ? 'client-dashboard' : 
                      'admin-dashboard'
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Aplicar CSS customizado temporariamente
        const style = document.createElement('style')
        style.textContent = data.data.css
        document.head.appendChild(style)
        
        // Mostrar preview em nova janela
        const previewWindow = window.open('', '_blank', 'width=1200,height=800')
        if (previewWindow) {
          previewWindow.document.write(`
            <html>
              <head>
                <title>Preview - ${customization.brandIdentity.companyName}</title>
                <style>${data.data.css}</style>
              </head>
              <body>
                <div class="custom-primary p-8 text-center">
                  <h1 class="text-4xl font-bold mb-4">${data.data.previewData.heroTitle || 'Preview'}</h1>
                  <p class="text-xl">${data.data.previewData.heroSubtitle || 'Visualização das configurações'}</p>
                </div>
              </body>
            </html>
          `)
        }
        
        // Remover CSS temporário após 5 segundos
        setTimeout(() => {
          document.head.removeChild(style)
        }, 5000)
      }
    } catch (error) {
      console.error('Erro ao gerar preview:', error)
      alert('Erro ao gerar preview')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personalização do Sistema</h1>
        <p className="mt-2 text-gray-600">
          Personalize completamente a aparência e funcionalidades do sistema
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-3">
          <Button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="flex items-center"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePreview} 
            disabled={loading}
            className="flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="branding" className="flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Identidade
          </TabsTrigger>
          <TabsTrigger value="landing" className="flex items-center">
            <Home className="w-4 h-4 mr-2" />
            Landing Page
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Dashboard Cliente
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Painel Admin
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Comunicação
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Localização
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identidade Visual</CardTitle>
              <CardDescription>
                Configure a identidade visual da sua marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações da Empresa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={customization.brandIdentity.companyName}
                    onChange={(e) => setCustomization({
                      ...customization,
                      brandIdentity: {
                        ...customization.brandIdentity,
                        companyName: e.target.value
                      }
                    })}
                    placeholder="Euaconecta"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Slogan</Label>
                  <Input
                    id="tagline"
                    value={customization.brandIdentity.tagline}
                    onChange={(e) => setCustomization({
                      ...customization,
                      brandIdentity: {
                        ...customization.brandIdentity,
                        tagline: e.target.value
                      }
                    })}
                    placeholder="Conectando você ao mundo"
                  />
                </div>
              </div>

              {/* Logos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo Principal</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="logoUrl"
                      value={customization.brandIdentity.logoUrl || ''}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          logoUrl: e.target.value
                        }
                      })}
                      placeholder="URL do logo principal"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="faviconUrl"
                      value={customization.brandIdentity.faviconUrl || ''}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          faviconUrl: e.target.value
                        }
                      })}
                      placeholder="URL do favicon"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={customization.brandIdentity.primaryColor}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          primaryColor: e.target.value
                        }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.brandIdentity.primaryColor}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          primaryColor: e.target.value
                        }
                      })}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={customization.brandIdentity.secondaryColor}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          secondaryColor: e.target.value
                        }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.brandIdentity.secondaryColor}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          secondaryColor: e.target.value
                        }
                      })}
                      placeholder="#6366F1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={customization.brandIdentity.accentColor}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          accentColor: e.target.value
                        }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.brandIdentity.accentColor}
                      onChange={(e) => setCustomization({
                        ...customization,
                        brandIdentity: {
                          ...customization.brandIdentity,
                          accentColor: e.target.value
                        }
                      })}
                      placeholder="#10B981"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Landing Page Tab */}
        <TabsContent value="landing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page</CardTitle>
              <CardDescription>
                Personalize a página inicial do seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Título Principal</Label>
                  <Input
                    id="heroTitle"
                    value={customization.heroTitle}
                    onChange={(e) => setCustomization({...customization, heroTitle: e.target.value})}
                    placeholder="Receba seus produtos dos EUA no Brasil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtítulo</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={customization.heroSubtitle}
                    onChange={(e) => setCustomization({...customization, heroSubtitle: e.target.value})}
                    placeholder="Consolidação de pacotes, envio seguro e rastreamento em tempo real"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaText">Texto do Botão</Label>
                    <Input
                      id="heroCtaText"
                      value={customization.heroCtaText}
                      onChange={(e) => setCustomization({...customization, heroCtaText: e.target.value})}
                      placeholder="Começar Agora"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaLink">Link do Botão</Label>
                    <Input
                      id="heroCtaLink"
                      value={customization.heroCtaLink}
                      onChange={(e) => setCustomization({...customization, heroCtaLink: e.target.value})}
                      placeholder="/auth/register"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroBackgroundImage">Imagem de Fundo</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="heroBackgroundImage"
                      value={customization.heroBackgroundImage}
                      onChange={(e) => setCustomization({...customization, heroBackgroundImage: e.target.value})}
                      placeholder="URL da imagem de fundo"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Dashboard Tab */}
        <TabsContent value="client" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard do Cliente</CardTitle>
              <CardDescription>
                Personalize a experiência do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientPrimaryColor">Cor Primária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="clientPrimaryColor"
                      type="color"
                      value={customization.clientPrimaryColor}
                      onChange={(e) => setCustomization({...customization, clientPrimaryColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.clientPrimaryColor}
                      onChange={(e) => setCustomization({...customization, clientPrimaryColor: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSidebarColor">Cor da Sidebar</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="clientSidebarColor"
                      type="color"
                      value={customization.clientSidebarColor}
                      onChange={(e) => setCustomization({...customization, clientSidebarColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.clientSidebarColor}
                      onChange={(e) => setCustomization({...customization, clientSidebarColor: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientHeaderColor">Cor do Header</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="clientHeaderColor"
                      type="color"
                      value={customization.clientHeaderColor}
                      onChange={(e) => setCustomization({...customization, clientHeaderColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.clientHeaderColor}
                      onChange={(e) => setCustomization({...customization, clientHeaderColor: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sidebar Recolhida</Label>
                    <p className="text-sm text-gray-500">Mostrar sidebar recolhida por padrão</p>
                  </div>
                  <Switch
                    checked={customization.clientSidebarCollapsed}
                    onCheckedChange={(checked) => setCustomization({...customization, clientSidebarCollapsed: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar Notificações</Label>
                    <p className="text-sm text-gray-500">Exibir ícone de notificações no header</p>
                  </div>
                  <Switch
                    checked={customization.clientShowNotifications}
                    onCheckedChange={(checked) => setCustomization({...customization, clientShowNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar Perfil</Label>
                    <p className="text-sm text-gray-500">Exibir menu de perfil no header</p>
                  </div>
                  <Switch
                    checked={customization.clientShowProfile}
                    onCheckedChange={(checked) => setCustomization({...customization, clientShowProfile: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar Busca</Label>
                    <p className="text-sm text-gray-500">Exibir campo de busca no header</p>
                  </div>
                  <Switch
                    checked={customization.clientShowSearch}
                    onCheckedChange={(checked) => setCustomization({...customization, clientShowSearch: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Panel Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Painel Administrativo</CardTitle>
              <CardDescription>
                Personalize a interface administrativa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adminPrimaryColor">Cor Primária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="adminPrimaryColor"
                      type="color"
                      value={customization.adminPrimaryColor}
                      onChange={(e) => setCustomization({...customization, adminPrimaryColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.adminPrimaryColor}
                      onChange={(e) => setCustomization({...customization, adminPrimaryColor: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminSidebarColor">Cor da Sidebar</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="adminSidebarColor"
                      type="color"
                      value={customization.adminSidebarColor}
                      onChange={(e) => setCustomization({...customization, adminSidebarColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.adminSidebarColor}
                      onChange={(e) => setCustomization({...customization, adminSidebarColor: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminHeaderColor">Cor do Header</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="adminHeaderColor"
                      type="color"
                      value={customization.adminHeaderColor}
                      onChange={(e) => setCustomization({...customization, adminHeaderColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={customization.adminHeaderColor}
                      onChange={(e) => setCustomization({...customization, adminHeaderColor: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sidebar Recolhida</Label>
                  <p className="text-sm text-gray-500">Mostrar sidebar recolhida por padrão</p>
                </div>
                <Switch
                  checked={customization.adminSidebarCollapsed}
                  onCheckedChange={(checked) => setCustomization({...customization, adminSidebarCollapsed: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comunicação</CardTitle>
              <CardDescription>
                Configure emails e notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Templates de Email</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email de Boas-vindas</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Email de Pacote Recebido</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Email de Envio Criado</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Email de Confirmação de Pagamento</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificações</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Notificações In-App</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Notificações por Email</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label>Notificações por SMS</Label>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Localização</CardTitle>
              <CardDescription>
                Configure idioma, moeda e formato de dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Input
                    id="language"
                    value={customization.language}
                    onChange={(e) => setCustomization({...customization, language: e.target.value})}
                    placeholder="pt-BR"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Input
                    id="currency"
                    value={customization.currency}
                    onChange={(e) => setCustomization({...customization, currency: e.target.value})}
                    placeholder="USD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Input
                    id="timezone"
                    value={customization.timezone}
                    onChange={(e) => setCustomization({...customization, timezone: e.target.value})}
                    placeholder="America/Sao_Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Formato de Data</Label>
                  <Input
                    id="dateFormat"
                    value={customization.dateFormat}
                    onChange={(e) => setCustomization({...customization, dateFormat: e.target.value})}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Configure as opções de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-gray-500">Limitar número de requisições por minuto</p>
                  </div>
                  <Switch
                    checked={customization.rateLimiting}
                    onCheckedChange={(checked) => setCustomization({...customization, rateLimiting: checked})}
                  />
                </div>
                {customization.rateLimiting && (
                  <div className="space-y-2">
                    <Label htmlFor="rateLimitRequests">Requisições por Minuto</Label>
                    <Input
                      id="rateLimitRequests"
                      type="number"
                      value={customization.rateLimitRequests}
                      onChange={(e) => setCustomization({...customization, rateLimitRequests: parseInt(e.target.value)})}
                      placeholder="60"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Captcha</Label>
                    <p className="text-sm text-gray-500">Requerer captcha em formulários</p>
                  </div>
                  <Switch
                    checked={customization.captcha}
                    onCheckedChange={(checked) => setCustomization({...customization, captcha: checked})}
                  />
                </div>
                {customization.captcha && (
                  <div className="space-y-2">
                    <Label htmlFor="captchaSiteKey">Site Key do Captcha</Label>
                    <Input
                      id="captchaSiteKey"
                      value={customization.captchaSiteKey}
                      onChange={(e) => setCustomization({...customization, captchaSiteKey: e.target.value})}
                      placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="dataRetentionDays">Dias de Retenção de Dados</Label>
                  <Input
                    id="dataRetentionDays"
                    type="number"
                    value={customization.dataRetentionDays}
                    onChange={(e) => setCustomization({...customization, dataRetentionDays: parseInt(e.target.value)})}
                    placeholder="365"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exclusão Automática de Dados</Label>
                    <p className="text-sm text-gray-500">Excluir dados automaticamente após período de retenção</p>
                  </div>
                  <Switch
                    checked={customization.autoDeleteData}
                    onCheckedChange={(checked) => setCustomization({...customization, autoDeleteData: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
