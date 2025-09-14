'use client'

import { useState } from 'react'
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CarrierCredentialsModalProps {
  carrier: {
    id: string
    name: string
    code: string
    hasApi: boolean
    apiKey?: string | null
    apiSecret?: string | null
    apiUrl?: string | null
  }
  isOpen: boolean
  onClose: () => void
  onSave: (credentials: {
    apiKey: string
    apiSecret: string
    apiUrl: string
    hasApi: boolean
  }) => Promise<void>
}

export function CarrierCredentialsModal({ 
  carrier, 
  isOpen, 
  onClose, 
  onSave 
}: CarrierCredentialsModalProps) {
  const [formData, setFormData] = useState({
    apiKey: carrier.apiKey || '',
    apiSecret: carrier.apiSecret || '',
    apiUrl: carrier.apiUrl || '',
    hasApi: carrier.hasApi || false
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [showApiSecret, setShowApiSecret] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await onSave(formData)
      setSuccess('Credenciais salvas com sucesso!')
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar credenciais')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Configurar Credenciais
              </h2>
              <p className="text-gray-600 mt-1">
                {carrier.name} ({carrier.code})
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Habilitar API */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuração de API</CardTitle>
                <CardDescription>
                  Habilite a integração com a API da transportadora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasApi"
                    checked={formData.hasApi}
                    onCheckedChange={(checked) => handleInputChange('hasApi', checked)}
                  />
                  <Label htmlFor="hasApi" className="text-sm font-medium">
                    Habilitar integração com API
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Credenciais da API */}
            {formData.hasApi && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Credenciais da API</CardTitle>
                  <CardDescription>
                    Configure as credenciais para acessar a API da transportadora
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* API Key */}
                  <div className="space-y-2">
                    <Label htmlFor="apiKey" className="text-sm font-medium">
                      API Key
                    </Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showApiKey ? 'text' : 'password'}
                        value={formData.apiKey}
                        onChange={(e) => handleInputChange('apiKey', e.target.value)}
                        placeholder="Digite sua API Key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* API Secret */}
                  <div className="space-y-2">
                    <Label htmlFor="apiSecret" className="text-sm font-medium">
                      API Secret
                    </Label>
                    <div className="relative">
                      <Input
                        id="apiSecret"
                        type={showApiSecret ? 'text' : 'password'}
                        value={formData.apiSecret}
                        onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                        placeholder="Digite sua API Secret"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                      >
                        {showApiSecret ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* API URL */}
                  <div className="space-y-2">
                    <Label htmlFor="apiUrl" className="text-sm font-medium">
                      URL da API
                    </Label>
                    <Input
                      id="apiUrl"
                      type="url"
                      value={formData.apiUrl}
                      onChange={(e) => handleInputChange('apiUrl', e.target.value)}
                      placeholder="https://api.transportadora.com"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informações sobre a transportadora */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Transportadora</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome:</span>
                    <p className="text-gray-600">{carrier.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Código:</span>
                    <p className="text-gray-600">{carrier.code}</p>
                  </div>
                </div>
                
                {carrier.code === 'ABC' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>ABC Transportadora:</strong> Esta transportadora utiliza tabelas de preços 
                      específicas por peso. As credenciais são opcionais, pois os preços são calculados 
                      localmente com base nas tabelas configuradas.
                    </p>
                  </div>
                )}

                {['UPS', 'USPS', 'FEDEX', 'DHL'].includes(carrier.code) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Transportadora com API:</strong> Esta transportadora requer credenciais 
                      válidas para funcionar. Entre em contato com a transportadora para obter suas 
                      credenciais de API.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Credenciais'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
