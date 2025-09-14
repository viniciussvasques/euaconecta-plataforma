'use client'

import { useState, useEffect, useCallback } from 'react'

interface Package {
  id: string
  description?: string
  status: string
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
  trackingCode?: string
  carrier?: string
  declaredValue?: number
  packageType?: string
  lengthCm?: number
  widthCm?: number
  heightCm?: number
}

interface EditPackageButtonProps {
  packageId: string
  onUpdate?: () => void
}

export function EditPackageButton({ packageId, onUpdate }: EditPackageButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [formData, setFormData] = useState({
    description: '',
    weightGrams: 0,
    purchasePrice: 0,
    store: '',
    orderNumber: '',
    trackingCode: '',
    carrier: '',
    declaredValue: 0,
    packageType: '',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0
  })

  const fetchPackageData = useCallback(async () => {
    try {
      const response = await fetch(`/api/packages/${packageId}`)
      const data = await response.json()
      
      if (data.success) {
        setPackageData(data.data)
        setFormData({
          description: data.data.description || '',
          weightGrams: data.data.weightGrams || 0,
          purchasePrice: data.data.purchasePrice || 0,
          store: data.data.store || '',
          orderNumber: data.data.orderNumber || '',
          trackingCode: data.data.trackingCode || '',
          carrier: data.data.carrier || '',
          declaredValue: data.data.declaredValue || 0,
          packageType: data.data.packageType || '',
          lengthCm: data.data.lengthCm || 0,
          widthCm: data.data.widthCm || 0,
          heightCm: data.data.heightCm || 0
        })
      }
    } catch (error) {
      console.error('Erro ao carregar pacote:', error)
    }
  }, [packageId])

  // Carregar dados do pacote
  useEffect(() => {
    if (isOpen && packageId) {
      fetchPackageData()
    }
  }, [isOpen, packageId, fetchPackageData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setIsOpen(false)
        onUpdate?.()
      } else {
        alert(data.error || 'Erro ao atualizar pacote')
      }
    } catch (error) {
      console.error('Erro ao atualizar pacote:', error)
      alert('Erro ao atualizar pacote')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Grams') || name.includes('Price') || name.includes('Value') || name.includes('Cm') 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-900"
        title="Editar pacote"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">Editar Pacote</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Informações Básicas</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Descrição do pacote"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loja
                      </label>
                      <input
                        type="text"
                        name="store"
                        value={formData.store}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome da loja"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Pedido
                      </label>
                      <input
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Número do pedido"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Pacote
                      </label>
                      <select
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="STANDARD">Padrão</option>
                        <option value="FRAGILE">Frágil</option>
                        <option value="ELECTRONICS">Eletrônicos</option>
                        <option value="CLOTHING">Roupas</option>
                        <option value="BOOKS">Livros</option>
                        <option value="OTHER">Outro</option>
                      </select>
                    </div>
                  </div>

                  {/* Dimensões e Peso */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Dimensões e Peso</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso (gramas)
                      </label>
                      <input
                        type="number"
                        name="weightGrams"
                        value={formData.weightGrams}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="1"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Largura (cm)
                        </label>
                        <input
                          type="number"
                          name="lengthCm"
                          value={formData.lengthCm}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Altura (cm)
                        </label>
                        <input
                          type="number"
                          name="widthCm"
                          value={formData.widthCm}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profundidade (cm)
                        </label>
                        <input
                          type="number"
                          name="heightCm"
                          value={formData.heightCm}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Valores</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço de Compra (USD)
                      </label>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor Declarado (USD)
                      </label>
                      <input
                        type="number"
                        name="declaredValue"
                        value={formData.declaredValue}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Rastreamento */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Rastreamento</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código de Rastreamento
                      </label>
                      <input
                        type="text"
                        name="trackingCode"
                        value={formData.trackingCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Código de rastreamento"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transportadora
                      </label>
                      <input
                        type="text"
                        name="carrier"
                        value={formData.carrier}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome da transportadora"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
