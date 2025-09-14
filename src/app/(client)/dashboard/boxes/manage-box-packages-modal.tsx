'use client'

import { useState, useEffect } from 'react'
import { X, Package, Plus, Weight, DollarSign, Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
}

interface Package {
  id: string
  description?: string
  status: string
  weightGrams?: number
  purchasePrice?: number
  store?: string
}

interface Box {
  id: string
  consolidationType: string
  status: string
  currentWeightGrams: number
  packages: Package[]
  consolidationFee: number
  storageFee: number
  openedAt: string
  closedAt?: string
  createdAt: string
}

interface ManageBoxPackagesModalProps {
  user: User | null
  box: Box | null
  onClose: () => void
  onSuccess: () => void
}

export function ManageBoxPackagesModal({ user, box, onClose, onSuccess }: ManageBoxPackagesModalProps) {
  const [availablePackages, setAvailablePackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingPackages, setLoadingPackages] = useState(true)

  // Carregar pacotes disponíveis
  useEffect(() => {
    const fetchAvailablePackages = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/packages?userId=${user.id}&filter=RECEIVED`)
        const data = await response.json()
        
        if (response.ok && data.success) {
          // Filtrar apenas pacotes que não estão em consolidação
          const available = data.data.filter((pkg: Package) => 
            (pkg.status === 'RECEIVED' || pkg.status === 'PENDING_ARRIVAL') &&
            !box?.packages.some(boxPkg => boxPkg.id === pkg.id) &&
            !(pkg as { consolidationGroupId?: string }).consolidationGroupId // Pacote não está em nenhuma consolidação
          )
          setAvailablePackages(available)
        }
      } catch (error) {
        console.error('Erro ao carregar pacotes:', error)
      } finally {
        setLoadingPackages(false)
      }
    }

    fetchAvailablePackages()
  }, [user, box])

  const handleAddPackage = async (packageId: string) => {
    if (!box) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/consolidation/${box.id}/add-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          weightGrams: availablePackages.find(p => p.id === packageId)?.weightGrams || 0,
          weighedBy: user?.id,
          weightNotes: 'Peso estimado pelo cliente'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Remover pacote da lista de disponíveis
        setAvailablePackages(prev => prev.filter(p => p.id !== packageId))
        onSuccess()
      } else {
        setError(data.error || 'Erro ao adicionar pacote')
      }
    } catch (error) {
      console.error('Erro ao adicionar pacote:', error)
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePackage = async (packageId: string) => {
    if (!box) return

    if (!confirm('Tem certeza que deseja remover este pacote da caixa?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/consolidation/${box.id}/remove-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onSuccess()
      } else {
        setError(data.error || 'Erro ao remover pacote')
      }
    } catch (error) {
      console.error('Erro ao remover pacote:', error)
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalWeight = () => {
    return box?.packages.reduce((total, pkg) => total + (pkg.weightGrams || 0), 0) || 0
  }

  const calculateTotalValue = () => {
    return box?.packages.reduce((total, pkg) => total + (pkg.purchasePrice || 0), 0) || 0
  }

  if (!box) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border border-gray-200 w-11/12 max-w-4xl shadow-2xl rounded-xl bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Gerenciar Pacotes da Caixa
              </h3>
              <p className="text-sm text-gray-500">
                {box.consolidationType} - {box.status}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Resumo da Caixa */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-800 mb-3">Resumo da Caixa</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Pacotes na caixa:</span>
              <span className="ml-2 font-medium">{box.packages.length}</span>
            </div>
            <div>
              <span className="text-blue-700">Peso total:</span>
              <span className="ml-2 font-medium">{calculateTotalWeight()}g</span>
            </div>
            <div>
              <span className="text-blue-700">Valor total:</span>
              <span className="ml-2 font-medium">${calculateTotalValue().toFixed(2)}</span>
            </div>
            <div>
              <span className="text-blue-700">Status:</span>
              <span className="ml-2 font-medium">{box.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pacotes na Caixa */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Pacotes na Caixa ({box.packages.length})
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {box.packages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>Nenhum pacote na caixa</p>
                </div>
              ) : (
                box.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {pkg.description || 'Pacote sem descrição'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        {pkg.store && (
                          <span>Loja: {pkg.store}</span>
                        )}
                        {pkg.weightGrams && (
                          <span className="flex items-center">
                            <Weight className="h-3 w-3 mr-1" />
                            {pkg.weightGrams}g
                          </span>
                        )}
                        {pkg.purchasePrice && (
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${pkg.purchasePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePackage(pkg.id)}
                      disabled={loading}
                      className="ml-3 text-red-600 hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pacotes Disponíveis */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Pacotes Disponíveis ({availablePackages.length})
            </h4>
            
            {loadingPackages ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando pacotes...</p>
              </div>
            ) : availablePackages.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum pacote disponível</p>
                <p className="text-sm text-gray-500 mt-1">
                  Todos os pacotes já estão em caixas
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {availablePackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {pkg.description || 'Pacote sem descrição'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        {pkg.store && (
                          <span>Loja: {pkg.store}</span>
                        )}
                        {pkg.weightGrams && (
                          <span className="flex items-center">
                            <Weight className="h-3 w-3 mr-1" />
                            {pkg.weightGrams}g
                          </span>
                        )}
                        {pkg.purchasePrice && (
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${pkg.purchasePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddPackage(pkg.id)}
                      disabled={loading}
                      className="ml-3 text-green-600 hover:text-green-500 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
