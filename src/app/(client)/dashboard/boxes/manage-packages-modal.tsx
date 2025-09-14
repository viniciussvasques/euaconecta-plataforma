'use client'

import { useState, useEffect } from 'react'
import { X, Package, Plus, Trash2, Weight, DollarSign } from 'lucide-react'

interface Package {
  id: string
  description?: string
  status: string
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
}

interface ConsolidationBox {
  id: string
  name?: string
  status: string
  packages: Package[]
  currentWeightGrams: number
  maxItemsAllowed: number
}

interface ManagePackagesModalProps {
  box: ConsolidationBox
  onClose: () => void
  onUpdate: () => void
}

export function ManagePackagesModal({ box, onClose, onUpdate }: ManagePackagesModalProps) {
  const [availablePackages, setAvailablePackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingPackages, setLoadingPackages] = useState(false)

  // Buscar pacotes disponíveis do usuário
  useEffect(() => {
    const fetchAvailablePackages = async () => {
      setLoadingPackages(true)
      try {
        const response = await fetch('/api/packages?filter=RECEIVED')
        const data = await response.json()
        
        if (data.success) {
          // Filtrar pacotes que não estão em nenhuma caixa
          const packagesInBox = box.packages.map(pkg => pkg.id)
          const available = data.data.filter((pkg: Package) => 
            !packagesInBox.includes(pkg.id) && 
            pkg.status === 'RECEIVED' && 
            !(pkg as { consolidationGroupId?: string }).consolidationGroupId // Pacote não está em nenhuma consolidação
          )
          setAvailablePackages(available)
        }
      } catch {
        console.error('Erro ao buscar pacotes:', error)
      } finally {
        setLoadingPackages(false)
      }
    }

    fetchAvailablePackages()
  }, [box.packages])

  const addPackageToBox = async (packageId: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/consolidation/${box.id}/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId })
      })

      const data = await response.json()
      
      if (data.success) {
        onUpdate() // Atualizar a lista de caixas
      } else {
        setError(data.error || 'Erro ao adicionar pacote')
      }
    } catch (error) {
      setError('Erro ao adicionar pacote')
    } finally {
      setLoading(false)
    }
  }

  const removePackageFromBox = async (packageId: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/consolidation/${box.id}/packages?packageId=${packageId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        onUpdate() // Atualizar a lista de caixas
      } else {
        setError(data.error || 'Erro ao remover pacote')
      }
    } catch (error) {
      setError('Erro ao remover pacote')
    } finally {
      setLoading(false)
    }
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`
    }
    return `${grams}g`
  }

  const formatPrice = (price: number | string) => {
    const numPrice = Number(price) || 0
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice)
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Gerenciar Pacotes - {box.name || 'Caixa sem nome'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className="font-medium">{box.status}</span> • 
              Peso atual: <span className="font-medium">{formatWeight(box.currentWeightGrams)}</span> • 
              Itens: {box.packages.length}/{box.maxItemsAllowed}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pacotes na Caixa */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pacotes na Caixa ({box.packages.length})
              </h3>
              
              {box.packages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum pacote na caixa</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {box.packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {pkg.description || 'Pacote sem descrição'}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            {pkg.store && <span>Loja: {pkg.store}</span>}
                            <span className="flex items-center">
                              <Weight className="h-3 w-3 mr-1" />
                              {formatWeight(pkg.weightGrams)}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatPrice(pkg.purchasePrice)}
                            </span>
                          </div>
                          {pkg.orderNumber && (
                            <p className="text-xs text-gray-400 mt-1">
                              Pedido: {pkg.orderNumber}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removePackageFromBox(pkg.id)}
                          disabled={loading || box.status !== 'OPEN'}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pacotes Disponíveis */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pacotes Disponíveis ({availablePackages.length})
              </h3>
              
              {loadingPackages ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Carregando pacotes...</p>
                </div>
              ) : availablePackages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum pacote disponível</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availablePackages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {pkg.description || 'Pacote sem descrição'}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            {pkg.store && <span>Loja: {pkg.store}</span>}
                            <span className="flex items-center">
                              <Weight className="h-3 w-3 mr-1" />
                              {formatWeight(pkg.weightGrams)}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatPrice(pkg.purchasePrice)}
                            </span>
                          </div>
                          {pkg.orderNumber && (
                            <p className="text-xs text-gray-400 mt-1">
                              Pedido: {pkg.orderNumber}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => addPackageToBox(pkg.id)}
                          disabled={loading || box.status !== 'OPEN' || box.packages.length >= box.maxItemsAllowed}
                          className="text-green-500 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
