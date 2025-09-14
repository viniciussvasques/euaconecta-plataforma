'use client'

import { useState } from 'react'
import { X, Package, DollarSign, Weight, Calendar, FileText, Upload } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
}

interface CreatePackageModalProps {
  user: User | null
  onClose: () => void
  onSuccess: () => void
}

export function CreatePackageModal({ user, onClose, onSuccess }: CreatePackageModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    store: '',
    orderNumber: '',
    purchasePrice: '',
    weightGrams: '',
    purchaseDate: '',
    expectedDeliveryDate: '',
    notes: '',
    invoiceFile: null as File | null,
    // Novos campos
    trackingIn: '',
    carrier: '',
    declaredValue: '',
    packageType: '',
    lengthCm: '',
    widthCm: '',
    heightCm: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Usuário não encontrado')
      return
    }

    if (!formData.description.trim()) {
      setError('Descrição do produto é obrigatória')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: user.id,
          description: formData.description,
          store: formData.store || null,
          orderNumber: formData.orderNumber || null,
          purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
          weightGrams: formData.weightGrams ? parseInt(formData.weightGrams) : null,
          purchaseDate: formData.purchaseDate || null,
          expectedDeliveryDate: formData.expectedDeliveryDate || null,
          notes: formData.notes || null,
          // Novos campos
          trackingIn: formData.trackingIn || null,
          carrier: formData.carrier || null,
          declaredValue: formData.declaredValue ? parseFloat(formData.declaredValue) : null,
          packageType: formData.packageType || null,
          lengthCm: formData.lengthCm ? parseInt(formData.lengthCm) : null,
          widthCm: formData.widthCm ? parseInt(formData.widthCm) : null,
          heightCm: formData.heightCm ? parseInt(formData.heightCm) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
      } else {
        setError(data.error || 'Erro ao criar pacote')
      }
    } catch (error) {
      console.error('Erro ao criar pacote:', error)
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      invoiceFile: file
    }))
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Informar Nova Compra
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Adicione informações sobre sua compra
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Descrição do Produto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Produto
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: Tênis Nike Air Max 270, Tamanho 42, Cor Preto"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 resize-vertical"
                rows={3}
                required
              />
            </div>

            {/* Loja e Número do Pedido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loja
                </label>
                <input
                  type="text"
                  name="store"
                  value={formData.store}
                  onChange={handleInputChange}
                  placeholder="Ex: Amazon, Nike, Best Buy"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Pedido
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  placeholder="Ex: #123456789"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

          {/* Valor e Peso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Valor da Compra (USD)
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Weight className="h-4 w-4 inline mr-2" />
                Peso Estimado (gramas)
              </label>
              <input
                type="number"
                name="weightGrams"
                value={formData.weightGrams}
                onChange={handleInputChange}
                placeholder="500"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Valor Declarado e Tipo de Embalagem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Valor Declarado (USD)
              </label>
              <input
                type="number"
                name="declaredValue"
                value={formData.declaredValue}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-2" />
                Tipo de Embalagem
              </label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="">Selecione...</option>
                <option value="envelope">Envelope</option>
                <option value="caixa">Caixa</option>
                <option value="sacola">Sacola</option>
                <option value="tubo">Tubo</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          {/* Código de Rastreamento e Transportadora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Código de Rastreamento
              </label>
              <input
                type="text"
                name="trackingIn"
                value={formData.trackingIn}
                onChange={handleInputChange}
                placeholder="Ex: 1Z999AA1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-2" />
                Transportadora
              </label>
              <select
                name="carrier"
                value={formData.carrier}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="">Selecione...</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
                <option value="Amazon">Amazon</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          {/* Dimensões */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-2" />
              Dimensões (cm)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Comprimento</label>
                <input
                  type="number"
                  name="lengthCm"
                  value={formData.lengthCm}
                  onChange={handleInputChange}
                  placeholder="30"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Largura</label>
                <input
                  type="number"
                  name="widthCm"
                  value={formData.widthCm}
                  onChange={handleInputChange}
                  placeholder="20"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Altura</label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Data da Compra
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Previsão de Chegada
              </label>
              <input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Comprovante de Compra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="h-4 w-4 inline mr-2" />
              Comprovante de Compra (PDF/Imagem)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Anexe o comprovante de compra para facilitar o processo
            </p>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Informações adicionais sobre o produto ou compra..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
              rows={3}
            />
          </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </div>
              ) : (
                'Criar Pacote'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
