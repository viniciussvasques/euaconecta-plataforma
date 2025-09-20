'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Search,
  BarChart3,
  Users,
  Map,
  Bot,
  Save,
  Eye
} from 'lucide-react'
import { SEOConfig, AnalyticsConfig, LeadCaptureForm, SitemapConfig, RobotsConfig } from '@/lib/seo-analytics-types'

export default function SEOAdminPage() {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null)
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig | null>(null)
  const [leadForms, setLeadForms] = useState<LeadCaptureForm[]>([])
  const [sitemapConfig, setSitemapConfig] = useState<SitemapConfig | null>(null)
  const [robotsConfig, setRobotsConfig] = useState<RobotsConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAllConfigs()
  }, [])

  const fetchAllConfigs = async () => {
    try {
      const [seoRes, analyticsRes, formsRes, sitemapRes, robotsRes] = await Promise.all([
        fetch('/api/admin/seo'),
        fetch('/api/admin/analytics'),
        fetch('/api/admin/lead-forms'),
        fetch('/api/admin/sitemap'),
        fetch('/api/admin/robots')
      ])

      const [seoData, analyticsData, formsData, sitemapData, robotsData] = await Promise.all([
        seoRes.json(),
        analyticsRes.json(),
        formsRes.json(),
        sitemapRes.json(),
        robotsRes.json()
      ])

      if (seoData.success) setSeoConfig(seoData.data)
      if (analyticsData.success) setAnalyticsConfig(analyticsData.data)
      if (formsData.success) setLeadForms(formsData.data)
      if (sitemapData.success) setSitemapConfig(sitemapData.data)
      if (robotsData.success) setRobotsConfig(robotsData.data)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSEOConfig = async (config: Partial<SEOConfig>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      const data = await response.json()
      if (data.success) {
        setSeoConfig(data.data)
        alert('Configurações SEO salvas!')
      }
    } catch (error) {
      console.error('Erro ao salvar SEO:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const saveAnalyticsConfig = async (config: Partial<AnalyticsConfig>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/analytics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      const data = await response.json()
      if (data.success) {
        setAnalyticsConfig(data.data)
        alert('Configurações de Analytics salvas!')
      }
    } catch (error) {
      console.error('Erro ao salvar Analytics:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO & Analytics</h1>
          <p className="text-gray-600 mt-2">Gerencie SEO, analytics, lead capture e sitemap</p>
        </div>

        <Tabs defaultValue="seo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lead Capture
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Sitemap
            </TabsTrigger>
            <TabsTrigger value="robots" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Robots.txt
            </TabsTrigger>
          </TabsList>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <SEOConfigForm
              config={seoConfig}
              onSave={saveSEOConfig}
              saving={saving}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsConfigForm
              config={analyticsConfig}
              onSave={saveAnalyticsConfig}
              saving={saving}
            />
          </TabsContent>

          {/* Lead Capture Tab */}
          <TabsContent value="leads">
            <LeadCaptureManager
              forms={leadForms}
              onUpdate={fetchAllConfigs}
            />
          </TabsContent>

          {/* Sitemap Tab */}
          <TabsContent value="sitemap">
            <SitemapConfigForm
              config={sitemapConfig}
              onSave={setSitemapConfig}
              saving={saving}
            />
          </TabsContent>

          {/* Robots Tab */}
          <TabsContent value="robots">
            <RobotsConfigForm
              config={robotsConfig}
              onSave={setRobotsConfig}
              saving={saving}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// SEO Configuration Form
function SEOConfigForm({ config, onSave, saving }: {
  config: SEOConfig | null,
  onSave: (config: Partial<SEOConfig>) => void,
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    siteName: config?.siteName || '',
    siteDescription: config?.siteDescription || '',
    siteUrl: config?.siteUrl || '',
    defaultTitle: config?.defaultTitle || '',
    defaultDescription: config?.defaultDescription || '',
    defaultKeywords: config?.defaultKeywords?.join(', ') || '',
    ogImage: config?.ogImage || '',
    twitterHandle: config?.twitterHandle || '',
    facebookAppId: config?.facebookAppId || '',
    googleSiteVerification: config?.googleSiteVerification || '',
    bingSiteVerification: config?.bingSiteVerification || '',
    yandexSiteVerification: config?.yandexSiteVerification || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      defaultKeywords: formData.defaultKeywords.split(',').map(k => k.trim()).filter(Boolean)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Configurações SEO
        </CardTitle>
        <CardDescription>
          Configure meta tags, Open Graph, Twitter Cards e dados estruturados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="Euaconecta"
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">URL do Site</Label>
              <Input
                id="siteUrl"
                value={formData.siteUrl}
                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                placeholder="https://euaconecta.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="siteDescription">Descrição do Site</Label>
            <Textarea
              id="siteDescription"
              value={formData.siteDescription}
              onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
              placeholder="Plataforma de redirecionamento de encomendas..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="defaultTitle">Título Padrão</Label>
              <Input
                id="defaultTitle"
                value={formData.defaultTitle}
                onChange={(e) => setFormData({ ...formData, defaultTitle: e.target.value })}
                placeholder="Euaconecta - Redirecionamento de Encomendas"
              />
            </div>
            <div>
              <Label htmlFor="defaultDescription">Descrição Padrão</Label>
              <Input
                id="defaultDescription"
                value={formData.defaultDescription}
                onChange={(e) => setFormData({ ...formData, defaultDescription: e.target.value })}
                placeholder="Economize até 80% no frete internacional..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="defaultKeywords">Palavras-chave (separadas por vírgula)</Label>
            <Input
              id="defaultKeywords"
              value={formData.defaultKeywords}
              onChange={(e) => setFormData({ ...formData, defaultKeywords: e.target.value })}
              placeholder="redirecionamento, encomendas, frete, importação"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ogImage">Imagem Open Graph</Label>
              <Input
                id="ogImage"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                placeholder="https://euaconecta.com/og-image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="twitterHandle">Twitter Handle</Label>
              <Input
                id="twitterHandle"
                value={formData.twitterHandle}
                onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                placeholder="@euaconecta"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="googleSiteVerification">Google Search Console</Label>
              <Input
                id="googleSiteVerification"
                value={formData.googleSiteVerification}
                onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
                placeholder="Código de verificação"
              />
            </div>
            <div>
              <Label htmlFor="bingSiteVerification">Bing Webmaster Tools</Label>
              <Input
                id="bingSiteVerification"
                value={formData.bingSiteVerification}
                onChange={(e) => setFormData({ ...formData, bingSiteVerification: e.target.value })}
                placeholder="Código de verificação"
              />
            </div>
            <div>
              <Label htmlFor="facebookAppId">Facebook App ID</Label>
              <Input
                id="facebookAppId"
                value={formData.facebookAppId}
                onChange={(e) => setFormData({ ...formData, facebookAppId: e.target.value })}
                placeholder="123456789"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar SEO
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Analytics Configuration Form
function AnalyticsConfigForm({ config, onSave, saving }: {
  config: AnalyticsConfig | null,
  onSave: (config: Partial<AnalyticsConfig>) => void,
  saving: boolean
}) {
  const [formData, setFormData] = useState<{
    googleAnalyticsId: string
    googleTagManagerId: string
    facebookPixelId: string
    hotjarId: string
    mixpanelToken: string
    amplitudeApiKey: string
    customHeadScripts: string
    customBodyScripts: string
    pageView: boolean
    scrollDepth: boolean
    formSubmissions: boolean
    buttonClicks: boolean
    fileDownloads: boolean
    outboundLinks: boolean
  }>({
    googleAnalyticsId: config?.googleAnalyticsId || '',
    googleTagManagerId: config?.googleTagManagerId || '',
    facebookPixelId: config?.facebookPixelId || '',
    hotjarId: config?.hotjarId || '',
    mixpanelToken: config?.mixpanelToken || '',
    amplitudeApiKey: config?.amplitudeApiKey || '',
    customHeadScripts: config?.customScripts?.head?.join('\n') || '',
    customBodyScripts: config?.customScripts?.body?.join('\n') || '',
    pageView: config?.trackingEvents?.pageView ?? true,
    scrollDepth: config?.trackingEvents?.scrollDepth ?? false,
    formSubmissions: config?.trackingEvents?.formSubmissions ?? true,
    buttonClicks: config?.trackingEvents?.buttonClicks ?? false,
    fileDownloads: config?.trackingEvents?.fileDownloads ?? false,
    outboundLinks: config?.trackingEvents?.outboundLinks ?? false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      customScripts: {
        head: formData.customHeadScripts.split('\n').filter(Boolean),
        body: formData.customBodyScripts.split('\n').filter(Boolean)
      },
      trackingEvents: {
        pageView: formData.pageView,
        scrollDepth: formData.scrollDepth,
        formSubmissions: formData.formSubmissions,
        buttonClicks: formData.buttonClicks,
        fileDownloads: formData.fileDownloads,
        outboundLinks: formData.outboundLinks
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Configurações de Analytics
        </CardTitle>
        <CardDescription>
          Configure Google Analytics, Facebook Pixel, Hotjar e outros serviços de tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={formData.googleAnalyticsId}
                onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
              <Input
                id="googleTagManagerId"
                value={formData.googleTagManagerId}
                onChange={(e) => setFormData({ ...formData, googleTagManagerId: e.target.value })}
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
              <Input
                id="facebookPixelId"
                value={formData.facebookPixelId}
                onChange={(e) => setFormData({ ...formData, facebookPixelId: e.target.value })}
                placeholder="123456789012345"
              />
            </div>
            <div>
              <Label htmlFor="hotjarId">Hotjar Site ID</Label>
              <Input
                id="hotjarId"
                value={formData.hotjarId}
                onChange={(e) => setFormData({ ...formData, hotjarId: e.target.value })}
                placeholder="1234567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mixpanelToken">Mixpanel Token</Label>
              <Input
                id="mixpanelToken"
                value={formData.mixpanelToken}
                onChange={(e) => setFormData({ ...formData, mixpanelToken: e.target.value })}
                placeholder="abc123def456"
              />
            </div>
            <div>
              <Label htmlFor="amplitudeApiKey">Amplitude API Key</Label>
              <Input
                id="amplitudeApiKey"
                value={formData.amplitudeApiKey}
                onChange={(e) => setFormData({ ...formData, amplitudeApiKey: e.target.value })}
                placeholder="abc123def456"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customHeadScripts">Scripts Customizados (Head)</Label>
            <Textarea
              id="customHeadScripts"
              value={formData.customHeadScripts}
              onChange={(e) => setFormData({ ...formData, customHeadScripts: e.target.value })}
              placeholder="<script>console.log('Custom script');</script>"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="customBodyScripts">Scripts Customizados (Body)</Label>
            <Textarea
              id="customBodyScripts"
              value={formData.customBodyScripts}
              onChange={(e) => setFormData({ ...formData, customBodyScripts: e.target.value })}
              placeholder="<script>console.log('Custom script');</script>"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-base font-medium">Eventos de Tracking</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pageView"
                  checked={formData.pageView}
                  onCheckedChange={() => setFormData({ ...formData, pageView: !formData.pageView })}
                />
                <Label htmlFor="pageView">Page Views</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="scrollDepth"
                  checked={formData.scrollDepth}
                  onCheckedChange={() => setFormData({ ...formData, scrollDepth: !formData.scrollDepth })}
                />
                <Label htmlFor="scrollDepth">Scroll Depth</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="formSubmissions"
                  checked={formData.formSubmissions}
                  onCheckedChange={() => setFormData({ ...formData, formSubmissions: !formData.formSubmissions })}
                />
                <Label htmlFor="formSubmissions">Form Submissions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="buttonClicks"
                  checked={formData.buttonClicks}
                  onCheckedChange={() => setFormData({ ...formData, buttonClicks: !formData.buttonClicks })}
                />
                <Label htmlFor="buttonClicks">Button Clicks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="fileDownloads"
                  checked={formData.fileDownloads}
                  onCheckedChange={() => setFormData({ ...formData, fileDownloads: !formData.fileDownloads })}
                />
                <Label htmlFor="fileDownloads">File Downloads</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="outboundLinks"
                  checked={formData.outboundLinks}
                  onCheckedChange={() => setFormData({ ...formData, outboundLinks: !formData.outboundLinks })}
                />
                <Label htmlFor="outboundLinks">Outbound Links</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Analytics
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Lead Capture Manager
function LeadCaptureManager({}: {
  forms: LeadCaptureForm[],
  onUpdate: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Lead Capture Forms
        </CardTitle>
        <CardDescription>
          Gerencie formulários de captura de leads
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Sistema de Lead Capture em desenvolvimento</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Sitemap Configuration
function SitemapConfigForm({}: {
  config: SitemapConfig | null,
  onSave: (config: SitemapConfig) => void,
  saving: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Configurações do Sitemap
        </CardTitle>
        <CardDescription>
          Configure o sitemap.xml
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Sitemap automático será gerado</p>
          <Button className="mt-4" onClick={() => window.open('/sitemap.xml', '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Sitemap
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Robots Configuration
function RobotsConfigForm({}: {
  config: RobotsConfig | null,
  onSave: (config: RobotsConfig) => void,
  saving: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Configurações do Robots.txt
        </CardTitle>
        <CardDescription>
          Configure o arquivo robots.txt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Robots.txt automático será gerado</p>
          <Button className="mt-4" onClick={() => window.open('/robots.txt', '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Robots.txt
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
