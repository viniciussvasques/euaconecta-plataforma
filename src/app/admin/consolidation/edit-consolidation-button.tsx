'use client'

import { useState, useEffect } from 'react'
import { ConsolidationGroupData } from '@/lib/consolidation'

interface EditConsolidationButtonProps {
  consolidation: ConsolidationGroupData
  onUpdate?: () => void
}

export function EditConsolidationButton({ consolidation, onUpdate }: EditConsolidationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    consolidationType: 'SIMPLE',
    consolidationFee: 0,
    storageFee: 0,
    finalWeightGrams: 0,
    trackingCode: '',
    customInstructions: '',
    boxSize: ''
  })

  // Carregar dados da consolidação
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: consolidation.name || '',
        consolidationType: consolidation.consolidationType || 'SIMPLE',
        consolidationFee: consolidation.consolidationFee || 0,
        storageFee: consolidation.storageFee || 0,
        finalWeightGrams: consolidation.finalWeightGrams || 0,
        trackingCode: consolidation.trackingCode || '',
        customInstructions: consolidation.customInstructions || '',
        boxSize: consolidation.boxSize || ''
      })
    }
  }, [isOpen, consolidation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/consolidation/${consolidation.id}`, {
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
        // Recarregar a página para mostrar as mudanças
        window.location.reload()
      } else {
        alert(data.error || 'Erro ao atualizar consolidação')
      }
    } catch (error) {
      console.error('Erro ao atualizar consolidação:', error)
      alert('Erro ao atualizar consolidação')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Fee') || name.includes('Grams') 
        ? parseFloat(value) || 0 
        : value
    }))
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-900"
        title="Editar consolidação"
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
                <h3 className="text-xl font-medium text-gray-900">Editar Consolidação</h3>
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
                        Nome da Caixa
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="Nome da caixa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Consolidação
                      </label>
                      <select
                        name="consolidationType"
                        value={formData.consolidationType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="SIMPLE">Simples</option>
                        <option value="REPACK">Reembalagem</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tamanho da Caixa
                      </label>
                      <input
                        type="text"
                        name="boxSize"
                        value={formData.boxSize}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="Ex: Small, Medium, Large"
                      />
                    </div>
                  </div>

                  {/* Peso e Dimensões */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Peso e Dimensões</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso Final (gramas)
                      </label>
                      <input
                        type="number"
                        name="finalWeightGrams"
                        value={formData.finalWeightGrams}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        min="0"
                        step="1"
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        Peso total incluindo embalagem
                      </p>
                    </div>
                  </div>

                  {/* Taxas */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Taxas</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taxa de Consolidação (USD)
                      </label>
                      <input
                        type="number"
                        name="consolidationFee"
                        value={formData.consolidationFee}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taxa de Armazenamento (USD)
                      </label>
                      <input
                        type="number"
                        name="storageFee"
                        value={formData.storageFee}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="Código de rastreamento"
                      />
                    </div>
                  </div>
                </div>

                {/* Instruções Personalizadas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instruções Personalizadas
                  </label>
                  <textarea
                    name="customInstructions"
                    value={formData.customInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Instruções especiais para esta consolidação"
                  />
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
