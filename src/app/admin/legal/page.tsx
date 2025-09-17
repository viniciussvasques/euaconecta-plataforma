'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, Eye, Edit, FileText, Shield } from 'lucide-react'

interface LegalContent {
  id: string
  type: 'terms' | 'privacy'
  title: string
  content: string
  lastUpdated: string
  isActive: boolean
}

export default function LegalAdminPage() {
  const [termsContent, setTermsContent] = useState<LegalContent | null>(null)
  const [privacyContent, setPrivacyContent] = useState<LegalContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingTerms, setEditingTerms] = useState(false)
  const [editingPrivacy, setEditingPrivacy] = useState(false)

  const [termsForm, setTermsForm] = useState({
    title: '',
    content: ''
  })

  const [privacyForm, setPrivacyForm] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    fetchLegalContent()
  }, [])

  const fetchLegalContent = async () => {
    try {
      setLoading(true)
      
      // Simular busca de conteúdo legal
      // Em produção, isso viria de uma API
      const mockTerms: LegalContent = {
        id: 'terms-1',
        type: 'terms',
        title: 'Termos de Uso - EuaConecta',
        content: 'Conteúdo dos termos de uso...',
        lastUpdated: new Date().toISOString(),
        isActive: true
      }

      const mockPrivacy: LegalContent = {
        id: 'privacy-1',
        type: 'privacy',
        title: 'Política de Privacidade - EuaConecta',
        content: 'Conteúdo da política de privacidade...',
        lastUpdated: new Date().toISOString(),
        isActive: true
      }

      setTermsContent(mockTerms)
      setPrivacyContent(mockPrivacy)
      setTermsForm({ title: mockTerms.title, content: mockTerms.content })
      setPrivacyForm({ title: mockPrivacy.title, content: mockPrivacy.content })
    } catch (error) {
      console.error('Erro ao carregar conteúdo legal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTerms = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTermsContent(prev => prev ? {
        ...prev,
        title: termsForm.title,
        content: termsForm.content,
        lastUpdated: new Date().toISOString()
      } : null)
      
      setEditingTerms(false)
    } catch (error) {
      console.error('Erro ao salvar termos:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPrivacyContent(prev => prev ? {
        ...prev,
        title: privacyForm.title,
        content: privacyForm.content,
        lastUpdated: new Date().toISOString()
      } : null)
      
      setEditingPrivacy(false)
    } catch (error) {
      console.error('Erro ao salvar política:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conteúdo Legal</h1>
        <p className="mt-2 text-gray-600">
          Gerencie os termos de uso e política de privacidade da plataforma.
        </p>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Termos de Uso
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Política de Privacidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Termos de Uso
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Última atualização: {termsContent?.lastUpdated ? new Date(termsContent.lastUpdated).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open('/terms', '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    onClick={() => setEditingTerms(!editingTerms)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {editingTerms ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingTerms ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="terms-title">Título</Label>
                    <Input
                      id="terms-title"
                      value={termsForm.title}
                      onChange={(e) => setTermsForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título dos termos de uso"
                    />
                  </div>
                  <div>
                    <Label htmlFor="terms-content">Conteúdo</Label>
                    <Textarea
                      id="terms-content"
                      value={termsForm.content}
                      onChange={(e) => setTermsForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Conteúdo dos termos de uso..."
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveTerms}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingTerms(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={termsContent?.isActive ? 'default' : 'secondary'}>
                      {termsContent?.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ID: {termsContent?.id}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{termsContent?.title}</h3>
                    <p className="text-gray-600 mt-2">
                      {termsContent?.content.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Política de Privacidade
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Última atualização: {privacyContent?.lastUpdated ? new Date(privacyContent.lastUpdated).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open('/privacy', '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    onClick={() => setEditingPrivacy(!editingPrivacy)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {editingPrivacy ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingPrivacy ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="privacy-title">Título</Label>
                    <Input
                      id="privacy-title"
                      value={privacyForm.title}
                      onChange={(e) => setPrivacyForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título da política de privacidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="privacy-content">Conteúdo</Label>
                    <Textarea
                      id="privacy-content"
                      value={privacyForm.content}
                      onChange={(e) => setPrivacyForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Conteúdo da política de privacidade..."
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSavePrivacy}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingPrivacy(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={privacyContent?.isActive ? 'default' : 'secondary'}>
                      {privacyContent?.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      ID: {privacyContent?.id}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{privacyContent?.title}</h3>
                    <p className="text-gray-600 mt-2">
                      {privacyContent?.content.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Termos de Uso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {termsContent?.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Política de Privacidade</p>
                <p className="text-2xl font-bold text-gray-900">
                  {privacyContent?.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Edit className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Última Edição</p>
                <p className="text-sm font-bold text-gray-900">
                  {termsContent?.lastUpdated ? new Date(termsContent.lastUpdated).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
