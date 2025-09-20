'use client'

import { useState } from 'react'
import { PlatformConfigData } from '@/lib/config/platform-config'

interface PlatformConfigFormProps {
  initialConfig: PlatformConfigData
}

export function PlatformConfigForm({ initialConfig }: PlatformConfigFormProps) {
  const [config, setConfig] = useState<PlatformConfigData>(initialConfig)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/platform-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar configuração')
      }

      setMessage({ type: 'success', text: 'Configuração atualizada com sucesso!' })
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error)
      setMessage({ type: 'error', text: 'Erro ao atualizar configuração' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof PlatformConfigData, value: string | number | boolean) => {
    setConfig({ ...config, [field]: value })
  }

  return (
    <>
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Informações da Empresa
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={config.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="text"
                  value={config.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endereço - Linha 1
                </label>
                <input
                  type="text"
                  value={config.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endereço - Linha 2
                </label>
                <input
                  type="text"
                  value={config.addressLine2 || ''}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  value={config.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input
                  type="text"
                  value={config.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  type="text"
                  value={config.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  País
                </label>
                <input
                  type="text"
                  value={config.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Configurações de Negócio
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Taxa de Imposto (%)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max="1"
                  value={config.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="mt-1 text-sm text-gray-500">Ex: 0.0825 para 8.25%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Taxa de Manuseio ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={config.handlingFee}
                  onChange={(e) => handleInputChange('handlingFee', parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* NOVOS: Consolidação Dinâmica */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Consolidação - Taxa Base ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(config.consolidationBaseFeeUsdCents || 0) / 100}
                  onChange={(e) => handleInputChange('consolidationBaseFeeUsdCents', Math.round(parseFloat(e.target.value || '0') * 100))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Consolidação - Por Pacote ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(config.consolidationPerPackageUsdCents || 0) / 100}
                  onChange={(e) => handleInputChange('consolidationPerPackageUsdCents', Math.round(parseFloat(e.target.value || '0') * 100))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  REPACK - Multiplicador
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={config.repackMultiplier}
                  onChange={(e) => handleInputChange('repackMultiplier', parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Moeda
                </label>
                <select
                  value={config.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="USD">USD</option>
                  <option value="BRL">BRL</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Taxa de Armazenamento por Dia ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={config.storageFeePerDay}
                  onChange={(e) => handleInputChange('storageFeePerDay', parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dias Máximos de Armazenamento
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.maxStorageDays}
                  onChange={(e) => handleInputChange('maxStorageDays', parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Freight Markup Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Markup sobre Frete (Monetização)
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Percentual de Markup sobre Frete
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={config.freightMarkupPercentage}
                  onChange={(e) => handleInputChange('freightMarkupPercentage', parseFloat(e.target.value || '0'))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="mt-1 text-sm text-gray-500">Ex: 0.15 = 15% sobre o frete da transportadora</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor Mínimo de Markup (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(config.freightMarkupMinAmount / 100).toFixed(2)}
                  onChange={(e) => handleInputChange('freightMarkupMinAmount', Math.round(parseFloat(e.target.value || '0') * 100))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor Máximo de Markup (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(config.freightMarkupMaxAmount / 100).toFixed(2)}
                  onChange={(e) => handleInputChange('freightMarkupMaxAmount', Math.round(parseFloat(e.target.value || '0') * 100))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Taxa de Processamento (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(config.processingFeeUsdCents / 100).toFixed(2)}
                  onChange={(e) => handleInputChange('processingFeeUsdCents', Math.round(parseFloat(e.target.value || '0') * 100))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="mt-1 text-sm text-gray-500">Taxa fixa por envio</p>
              </div>
            </div>
          </div>
        </div>
                    {/* Shipping Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Configurações de Envio
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Transportadora Padrão
                </label>
                <select
                  value={config.defaultCarrier}
                  onChange={(e) => handleInputChange('defaultCarrier', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="USPS">USPS</option>
                  <option value="UPS">UPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="DHL">DHL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serviço Padrão
                </label>
                <input
                  type="text"
                  value={config.defaultService}
                  onChange={(e) => handleInputChange('defaultService', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.insuranceRequired}
                  onChange={(e) => handleInputChange('insuranceRequired', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Seguro obrigatório para valores altos
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valor Mínimo para Seguro ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={config.minInsuranceAmount}
                  onChange={(e) => handleInputChange('minInsuranceAmount', parseFloat(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {saving ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </div>
      </form>
    </>
  )
}
