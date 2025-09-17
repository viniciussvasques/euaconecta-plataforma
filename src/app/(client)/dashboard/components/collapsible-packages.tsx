'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'

interface ClientPackagesProps {
  userId: string
}

interface Package {
  id: string
  description?: string
  status: string
  weightGrams?: number
  purchasePrice?: number
  store?: string
  orderNumber?: string
  createdAt: string
}

export function CollapsiblePackages({ userId }: ClientPackagesProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`/api/packages?userId=${userId}&limit=3`)
        const data = await response.json()

        if (response.ok && data.success) {
          setPackages(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar pacotes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-green-100 text-green-800'
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800'
      case 'DELIVERED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'Recebido'
      case 'IN_TRANSIT':
        return 'Em Trânsito'
      case 'DELIVERED':
        return 'Entregue'
      default:
        return 'Pendente'
    }
  }

  const formatWeight = (grams?: number) => {
    if (!grams) return 'Não pesado'
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`
    }
    return `${grams} g`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Meus Pacotes</h3>
            <p className="text-sm text-gray-500">
              {packages.length} pacote{packages.length !== 1 ? 's' : ''} recebido{packages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard/packages"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Ver todos
          </a>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6">
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-500 mb-2">Nenhum pacote ainda</p>
              <p className="text-sm text-gray-400">
                Seus pacotes aparecerão aqui quando chegarem
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {pkg.description || `Pacote ${pkg.id.slice(-6)}`}
                      </h4>
                      <div className="mt-2 space-y-1">
                        {pkg.store && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Loja:</span> {pkg.store}
                          </p>
                        )}
                        {pkg.orderNumber && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Pedido:</span> {pkg.orderNumber}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Peso:</span> {formatWeight(pkg.weightGrams)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Recebido em:</span>{' '}
                          {new Date(pkg.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(pkg.status)}`}>
                        {getStatusLabel(pkg.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
