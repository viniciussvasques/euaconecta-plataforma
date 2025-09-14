'use client'

import { useState, useEffect } from 'react'

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

export function ClientPackages({ userId }: ClientPackagesProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`/api/packages?userId=${userId}&limit=5`)
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Meus Pacotes</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📦 Meus Pacotes</h3>
        <a
          href="/dashboard/packages"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Ver todos
        </a>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-gray-500">Nenhum pacote ainda</p>
          <p className="text-sm text-gray-400 mt-1">
            Seus pacotes aparecerão aqui quando chegarem
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {pkg.description || `Pacote ${pkg.id.slice(-6)}`}
                  </h4>
                  <div className="mt-1 space-y-1">
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
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pkg.status)}`}>
                    {getStatusLabel(pkg.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
