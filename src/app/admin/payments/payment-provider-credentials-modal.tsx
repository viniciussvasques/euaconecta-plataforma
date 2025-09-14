'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'

interface PaymentProviderCredentialsModalProps {
  provider: {
    id: string
    name: string
    code: string
    hasApi: boolean
    apiKey?: string | null
    apiSecret?: string | null
    apiUrl?: string | null
  }
  onClose: () => void
  onCredentialsSaved: () => void
}

export function PaymentProviderCredentialsModal({ 
  provider, 
  onClose, 
  onCredentialsSaved 
}: PaymentProviderCredentialsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    hasApi: provider.hasApi,
    apiKey: provider.apiKey || '',
    apiSecret: provider.apiSecret || '',
    apiUrl: provider.apiUrl || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/payment-providers/${provider.id}/credentials`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar credenciais')
      }

      onCredentialsSaved()
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error)
      alert('Erro ao salvar credenciais')
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderInstructions = () => {
    switch (provider.code) {
      case 'stripe':
        return {
          title: 'Configuração do Stripe',
          instructions: [
            '1. Acesse o Dashboard do Stripe',
            '2. Vá em "Developers" > "API keys"',
            '3. Copie a "Publishable key" para API Key',
            '4. Copie a "Secret key" para API Secret',
            '5. A URL padrão é: https://api.stripe.com/v1'
          ]
        }
      case 'paypal':
        return {
          title: 'Configuração do PayPal',
          instructions: [
            '1. Acesse o PayPal Developer Dashboard',
            '2. Crie uma aplicação ou use uma existente',
            '3. Copie o "Client ID" para API Key',
            '4. Copie o "Client Secret" para API Secret',
            '5. Use a URL: https://api-m.paypal.com (produção) ou https://api-m.sandbox.paypal.com (sandbox)'
          ]
        }
      case 'pix':
        return {
          title: 'Configuração do PIX',
          instructions: [
            '1. Configure com seu banco ou provedor PIX',
            '2. Obtenha as credenciais de API',
            '3. Configure a URL da API do provedor',
            '4. Teste a integração antes de ativar'
          ]
        }
      case 'boleto':
        return {
          title: 'Configuração do Boleto',
          instructions: [
            '1. Configure com seu banco ou provedor de boleto',
            '2. Obtenha as credenciais de API',
            '3. Configure a URL da API do provedor',
            '4. Teste a geração de boletos'
          ]
        }
      default:
        return {
          title: 'Configuração de API',
          instructions: [
            '1. Configure as credenciais da API',
            '2. Teste a integração',
            '3. Ative o provedor quando estiver funcionando'
          ]
        }
    }
  }

  const instructions = getProviderInstructions()

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
                {provider.name} ({provider.code.toUpperCase()})
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">{instructions.title}</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {instructions.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>

            {/* Toggle API */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hasApi" className="text-base font-medium text-gray-900">
                  Habilitar API
                </Label>
                <p className="text-sm text-gray-600">
                  Ative para permitir integração com a API do provedor
                </p>
              </div>
              <Switch
                id="hasApi"
                checked={formData.hasApi}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, hasApi: checked }))
                }
              />
            </div>

            {/* Campos de credenciais */}
            {formData.hasApi && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
                    API Key / Client ID
                  </Label>
                  <Input
                    id="apiKey"
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Digite a API Key ou Client ID"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="apiSecret" className="text-sm font-medium text-gray-700">
                    API Secret / Client Secret
                  </Label>
                  <Input
                    id="apiSecret"
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
                    placeholder="Digite a API Secret ou Client Secret"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="apiUrl" className="text-sm font-medium text-gray-700">
                    URL da API
                  </Label>
                  <Input
                    id="apiUrl"
                    type="url"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                    placeholder="https://api.exemplo.com"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

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
