'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SystemCustomization, defaultCustomization } from '@/lib/system-customization'
import { Eye, Save, Phone, Star, Users, Globe, Palette, ExternalLink } from 'lucide-react'

export default function SystemCustomizationPage() {
  const [customization, setCustomization] = useState<SystemCustomization>(defaultCustomization)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')

  useEffect(() => {
    void loadCustomization()
  }, [])

  const loadCustomization = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/customization')
      const data = await res.json()
      if (data?.success && data?.data) {
        setCustomization(data.data as SystemCustomization)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Erro ao salvar: ' + (data.error || 'Erro desconhecido'))
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
    { id: 'partners', name: 'Parceiros', icon: <Users className="w-4 h-4" /> }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {/* Contact Section */}
      {activeTab === 'contact' && (
          <Card>
            <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>Configure os dados de contato da empresa</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefone</Label>
                    <Input
                  id="contactPhone"
                  value={customization.contact?.phone || ''}
                  onChange={(e) => setCustomization({
                    ...customization,
                    contact: {
                      phone: e.target.value,
                      email: customization.contact?.email || '',
                      address: customization.contact?.address || ''
                    }
                  })}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                    <Input
                  id="contactEmail"
                  type="email"
                  value={customization.contact?.email || ''}
                  onChange={(e) => setCustomization({
                    ...customization,
                    contact: {
                      phone: customization.contact?.phone || '',
                      email: e.target.value,
                      address: customization.contact?.address || ''
                    }
                  })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
              <Label htmlFor="contactAddress">Endereço</Label>
              <Textarea
                id="contactAddress"
                rows={3}
                  value={customization.contact?.address || ''}
                onChange={(e) => setCustomization({
                  ...customization,
                  contact: {
                    phone: customization.contact?.phone || '',
                    email: customization.contact?.email || '',
                    address: e.target.value
                  }
                })}
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
    </div>
  )
}
