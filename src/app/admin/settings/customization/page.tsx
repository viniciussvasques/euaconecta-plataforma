'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SystemCustomization, defaultCustomization } from '@/lib/config/system-customization'
import { Eye, Save, Phone, Star, Users, Globe, Palette, ExternalLink } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function SystemCustomizationPage() {
  const [customization, setCustomization] = useState<SystemCustomization>(defaultCustomization)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    // Recuperar última aba selecionada do localStorage
    const savedTab = localStorage.getItem('customization_active_tab')
    return savedTab || 'hero'
  })

  useEffect(() => {
    void loadCustomization()
  }, [])

  const loadCustomization = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/customization')
      const data = await res.json()
      if (data?.success && data?.data) {
        // Merge com o defaultCustomization para garantir que todas as propriedades existam
        const mergedCustomization = {
          ...defaultCustomization,
          ...data.data,
          clientDashboard: {
            ...defaultCustomization.clientDashboard,
            ...data.data.clientDashboard,
            banner: {
              ...defaultCustomization.clientDashboard.banner,
              ...data.data.clientDashboard?.banner
            },
            introduction: {
              ...defaultCustomization.clientDashboard.introduction,
              ...data.data.clientDashboard?.introduction
            }
          }
        }
        setCustomization(mergedCustomization as SystemCustomization)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      // Em caso de erro, manter o defaultCustomization
    } finally {
      setLoading(false)
    }
  }

  const validateUrls = () => {
    // Validar URLs da customização
    const urlFields = [
      { value: customization.landingPage.hero.ctaLink, name: 'Link do botão Hero' },
      { value: customization.landingPage.social.instagram, name: 'Instagram' },
      { value: customization.landingPage.social.facebook, name: 'Facebook' },
      { value: customization.landingPage.social.youtube, name: 'YouTube' },
    ]

    for (const field of urlFields) {
      if (field.value && !field.value.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
        toast({
          title: "URL inválida",
          description: `O campo ${field.name} contém uma URL inválida`,
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    
    if (!validateUrls()) {
      setSaving(false)
      return
    }
    try {
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 5000) // Aumentado para 5 segundos
      } else {
        // Usar um toast ou notification mais amigável
        const errorMessage = data.error || 'Ocorreu um erro ao salvar as configurações'
        toast({
          title: "Erro ao salvar",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro de conexão ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    // Abrir a landing page existente em uma nova aba
    window.open('https://app.euaconecta.com/', '_blank')
  }


  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: <Palette className="w-4 h-4" /> },
    { id: 'contact', name: 'Contato', icon: <Phone className="w-4 h-4" /> },
    { id: 'social', name: 'Redes Sociais', icon: <Globe className="w-4 h-4" /> },
    { id: 'testimonials', name: 'Depoimentos', icon: <Star className="w-4 h-4" /> },
    { id: 'partners', name: 'Parceiros', icon: <Users className="w-4 h-4" /> },
    { id: 'dashboard', name: 'Dashboard', icon: <ExternalLink className="w-4 h-4" /> }
  ]

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personalização - Landing Page</h1>
        <p className="mt-2 text-gray-600">Configure informações de contato e redes sociais da landing page</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
          <Button 
            onClick={handleSave} 
            disabled={saving || loading}
          className={`flex items-center ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
              <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar'}
          </Button>
        <Button variant="outline" onClick={handlePreview} disabled={loading} className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
          Ver Landing Page Atual
          </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="border-b border-gray-200 min-w-full">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 px-2 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  localStorage.setItem('customization_active_tab', tab.id)
                }}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </button>
            ))}
          </nav>
                </div>
              </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Conteúdo principal do topo da landing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                <div className="space-y-2">
              <Label htmlFor="heroTitle">Título</Label>
                    <Input
                id="heroTitle"
                value={customization.landingPage.hero.title}
                      onChange={(e) => setCustomization({
                        ...customization,
                  landingPage: {
                    ...customization.landingPage,
                    hero: { ...customization.landingPage.hero, title: e.target.value }
                  }
                })}
                    />
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtítulo</Label>
                  <Textarea
                    id="heroSubtitle"
                    rows={3}
                value={customization.landingPage.hero.subtitle}
                onChange={(e) => setCustomization({
                  ...customization,
                  landingPage: {
                    ...customization.landingPage,
                    hero: { ...customization.landingPage.hero, subtitle: e.target.value }
                  }
                })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaText">Texto do Botão</Label>
                    <Input
                      id="heroCtaText"
                  value={customization.landingPage.hero.ctaText}
                  onChange={(e) => setCustomization({
                    ...customization,
                    landingPage: {
                      ...customization.landingPage,
                      hero: { ...customization.landingPage.hero, ctaText: e.target.value }
                    }
                  })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaLink">Link do Botão</Label>
                    <Input
                      id="heroCtaLink"
                  value={customization.landingPage.hero.ctaLink}
                  onChange={(e) => setCustomization({
                    ...customization,
                    landingPage: {
                      ...customization.landingPage,
                      hero: { ...customization.landingPage.hero, ctaLink: e.target.value }
                    }
                  })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
              <Label htmlFor="heroBackgroundImage">Imagem de Fundo (URL)</Label>
                    <Input
                      id="heroBackgroundImage"
                value={customization.landingPage.hero.backgroundImage || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  landingPage: {
                    ...customization.landingPage,
                    hero: { ...customization.landingPage.hero, backgroundImage: e.target.value }
                  }
                })}
              />
              </div>
            </CardContent>
          </Card>
      )}

      {/* Dashboard Section */}
      {activeTab === 'dashboard' && (
        <Card>
          <CardHeader>
            <CardTitle>Seção de Dashboard</CardTitle>
            <CardDescription>Configure a seção que mostra o dashboard do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dashboardTitle">Título</Label>
              <Input
                id="dashboardTitle"
                value={customization.landingPage.dashboard?.title || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  landingPage: {
                    ...customization.landingPage,
                    dashboard: { 
                      ...customization.landingPage.dashboard,
                      title: e.target.value 
                    }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboardSubtitle">Subtítulo</Label>
              <Input
                id="dashboardSubtitle"
                value={customization.landingPage.dashboard?.subtitle || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  landingPage: {
                    ...customization.landingPage,
                    dashboard: { 
                      ...customization.landingPage.dashboard,
                      subtitle: e.target.value 
                    }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboardDescription">Descrição</Label>
              <Textarea
                id="dashboardDescription"
                rows={3}
                value={customization.landingPage.dashboard?.description || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  landingPage: {
                    ...customization.landingPage,
                    dashboard: { 
                      ...customization.landingPage.dashboard,
                      description: e.target.value 
                    }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboardImageUrl">URL da Imagem</Label>
              <Input
                id="dashboardImageUrl"
                value={customization.landingPage.dashboard?.imageUrl || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  landingPage: {
                    ...customization.landingPage,
                    dashboard: { 
                      ...customization.landingPage.dashboard,
                      imageUrl: e.target.value 
                    }
                  }
                })}
              />
              <p className="text-xs text-gray-500 mt-1">Recomendado: imagem com resolução mínima de 800x450px</p>
            </div>

            <div className="space-y-2">
              <Label>Recursos do Dashboard</Label>
              {customization.landingPage.dashboard?.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...customization.landingPage.dashboard.features];
                      newFeatures[index] = e.target.value;
                      setCustomization({
                        ...customization,
                        landingPage: {
                          ...customization.landingPage,
                          dashboard: { 
                            ...customization.landingPage.dashboard,
                            features: newFeatures
                          }
                        }
                      });
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      const newFeatures = [...customization.landingPage.dashboard.features];
                      newFeatures.splice(index, 1);
                      setCustomization({
                        ...customization,
                        landingPage: {
                          ...customization.landingPage,
                          dashboard: { 
                            ...customization.landingPage.dashboard,
                            features: newFeatures
                          }
                        }
                      });
                    }}
                  >
                    Remover
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  const newFeatures = [...(customization.landingPage.dashboard?.features || []), ''];
                  setCustomization({
                    ...customization,
                    landingPage: {
                      ...customization.landingPage,
                      dashboard: { 
                        ...customization.landingPage.dashboard,
                        features: newFeatures
                      }
                    }
                  });
                }}
              >
                Adicionar Recurso
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Section */}
      {activeTab === 'contact' && (
          <Card>
            <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>Configure os dados de contato da empresa</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            {/* Aviso de configuração duplicada */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Configuração duplicada
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Estas informações agora são gerenciadas em{' '}
                      <a href="/admin/platform-config" className="font-medium text-yellow-700 underline hover:text-yellow-600">
                        Configuração da Plataforma
                      </a>. Acesse esta página para fazer alterações.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Display read-only values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefone</Label>
                <Input
                  id="contactPhone"
                  value={customization.contact?.phone || ''}
                  disabled
                  className="bg-gray-50"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={customization.contact?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                </div>
                </div>

                <div className="space-y-2">
              <Label htmlFor="contactAddress">Endereço</Label>
              <Textarea
                id="contactAddress"
                rows={3}
                value={customization.contact?.address || ''}
                disabled
                className="bg-gray-50"
              />
                </div>
            </CardContent>
          </Card>
      )}

      {/* Social Media Section */}
      {activeTab === 'social' && (
          <Card>
            <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>Configure os links das redes sociais</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
                <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                id="whatsapp"
                  value={customization.socialMedia?.whatsapp || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  socialMedia: {
                    whatsapp: e.target.value,
                    facebook: customization.socialMedia?.facebook || '',
                    instagram: customization.socialMedia?.instagram || ''
                  }
                })}
                    />
                  </div>

                <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
                    <Input
                id="facebook"
                  value={customization.socialMedia?.facebook || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  socialMedia: {
                    whatsapp: customization.socialMedia?.whatsapp || '',
                    facebook: e.target.value,
                    instagram: customization.socialMedia?.instagram || ''
                  }
                })}
                    />
                  </div>

                <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
                    <Input
                id="instagram"
                  value={customization.socialMedia?.instagram || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  socialMedia: {
                    whatsapp: customization.socialMedia?.whatsapp || '',
                    facebook: customization.socialMedia?.facebook || '',
                    instagram: e.target.value
                  }
                })}
                />
              </div>
            </CardContent>
          </Card>
      )}

      {/* Testimonials Section */}
      {activeTab === 'testimonials' && (
          <Card>
            <CardHeader>
            <CardTitle>Depoimentos</CardTitle>
            <CardDescription>Configure os depoimentos dos clientes</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-500">Use a seção &quot;Depoimentos&quot; no menu lateral para gerenciar os depoimentos</p>
              <Button
                className="mt-4"
                onClick={() => window.open('/admin/testimonials', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Gerenciar Depoimentos
              </Button>
              </div>
            </CardContent>
          </Card>
      )}

      {/* Partners Section */}
      {activeTab === 'partners' && (
          <Card>
            <CardHeader>
            <CardTitle>Parceiros</CardTitle>
            <CardDescription>Configure as lojas parceiras</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-500">Use a seção &quot;Parceiros&quot; no menu lateral para gerenciar as lojas parceiras</p>
              <Button
                className="mt-4"
                onClick={() => window.open('/admin/partners', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Gerenciar Parceiros
              </Button>
              </div>
            </CardContent>
          </Card>
      )}

      {/* Dashboard Banner */}
      {activeTab === 'dashboard' && (
        <Card>
          <CardHeader>
            <CardTitle>Banner do Dashboard</CardTitle>
            <CardDescription>Configure o banner que aparece na página principal do dashboard do cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="bannerEnabled"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                checked={customization?.clientDashboard?.banner?.enabled ?? false}
                onChange={(e) => setCustomization({
                  ...customization,
                  clientDashboard: {
                    ...customization.clientDashboard,
                    banner: { ...customization.clientDashboard.banner, enabled: e.target.checked }
                  }
                })}
              />
              <Label htmlFor="bannerEnabled">Ativar banner no dashboard</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerImageUrl">URL da imagem do banner</Label>
              <Input
                id="bannerImageUrl"
                value={customization.clientDashboard.banner.imageUrl}
                onChange={(e) => setCustomization({
                  ...customization,
                  clientDashboard: {
                    ...customization.clientDashboard,
                    banner: { ...customization.clientDashboard.banner, imageUrl: e.target.value }
                  }
                })}
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-xs text-gray-500">Tamanho recomendado: 1200x300px</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerTitle">Título do banner</Label>
              <Input
                id="bannerTitle"
                value={customization.clientDashboard.banner.title}
                onChange={(e) => setCustomization({
                  ...customization,
                  clientDashboard: {
                    ...customization.clientDashboard,
                    banner: { ...customization.clientDashboard.banner, title: e.target.value }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerSubtitle">Subtítulo do banner</Label>
              <Textarea
                id="bannerSubtitle"
                value={customization.clientDashboard.banner.subtitle}
                onChange={(e) => setCustomization({
                  ...customization,
                  clientDashboard: {
                    ...customization.clientDashboard,
                    banner: { ...customization.clientDashboard.banner, subtitle: e.target.value }
                  }
                })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bannerButtonText">Texto do botão</Label>
                <Input
                  id="bannerButtonText"
                  value={customization.clientDashboard.banner.buttonText}
                  onChange={(e) => setCustomization({
                    ...customization,
                    clientDashboard: {
                      ...customization.clientDashboard,
                      banner: { ...customization.clientDashboard.banner, buttonText: e.target.value }
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bannerButtonLink">Link do botão</Label>
                <Input
                  id="bannerButtonLink"
                  value={customization.clientDashboard.banner.buttonLink}
                  onChange={(e) => setCustomization({
                    ...customization,
                    clientDashboard: {
                      ...customization.clientDashboard,
                      banner: { ...customization.clientDashboard.banner, buttonLink: e.target.value }
                    }
                  })}
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="font-medium text-lg mb-3">Seção de introdução</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="introductionEnabled"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={customization?.clientDashboard?.introduction?.enabled ?? false}
                  onChange={(e) => setCustomization({
                    ...customization,
                    clientDashboard: {
                      ...customization.clientDashboard,
                      introduction: { ...customization.clientDashboard.introduction, enabled: e.target.checked }
                    }
                  })}
                />
                <Label htmlFor="introductionEnabled">Mostrar seção de introdução para novos usuários</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="introDismissible"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={customization.clientDashboard.introduction.dismissible}
                  onChange={(e) => setCustomization({
                    ...customization,
                    clientDashboard: {
                      ...customization.clientDashboard,
                      introduction: { ...customization.clientDashboard.introduction, dismissible: e.target.checked }
                    }
                  })}
                />
                <Label htmlFor="introDismissible">Permitir que usuários fechem a seção</Label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                As etapas da seção de introdução são gerenciadas automaticamente com base no progresso do usuário.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
