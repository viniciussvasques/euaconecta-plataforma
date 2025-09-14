'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Plus } from 'lucide-react'
import { CreatePackageModal } from './create-package-modal'
import { PackageDetailsModal } from './package-details-modal'

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
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
  purchaseDate?: string
  expectedDeliveryDate?: string
  createdAt: string
  updatedAt: string
  carrier?: string
  trackingIn?: string
  trackingPhoto?: string
  deliveryConfirmation?: boolean
  declaredValue?: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  packageCondition?: string
  notes?: string
  confirmedAt?: string
  confirmedBy?: string
  confirmedWeightGrams?: number
  confirmationPhoto?: string
}

export function ClientPackagesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (response.ok && data.success) {
          setUser(data.data)
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        router.push('/auth/login')
      }
    }

    fetchUser()
  }, [router])

  const fetchPackages = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        userId: user.id,
        ...(filter !== 'all' && { filter })
      })

      const response = await fetch(`/api/packages?${params}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setPackages(data.data)
      } else {
        console.error('Erro ao carregar pacotes:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error)
    } finally {
      setLoading(false)
    }
  }, [user, filter])

  useEffect(() => {
    if (user) {
      fetchPackages()
    }
  }, [user, filter, fetchPackages])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-green-100 text-green-800'
      case 'READY_TO_SHIP':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'Recebido'
      case 'READY_TO_SHIP':
        return 'Pronto para Envio'
      case 'SHIPPED':
        return 'Enviado'
      case 'DELIVERED':
        return 'Entregue'
      default:
        return status
    }
  }

  const filteredPackages = packages.filter(pkg => {
    if (!searchTerm) return true
    return (
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.store?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pacotes...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Pacotes</h1>
            <p className="mt-2 text-gray-600">
              Gerencie e acompanhe todos os seus pacotes recebidos.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pacote
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por Status */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Todos</option>
              <option value="RECEIVED">Recebidos</option>
              <option value="READY_TO_SHIP">Prontos para Envio</option>
              <option value="SHIPPED">Enviados</option>
              <option value="DELIVERED">Entregues</option>
            </select>
          </div>

          {/* Busca */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por descrição, pedido ou loja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de Pacotes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Pacotes ({filteredPackages.length})
          </h2>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pacote encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Tente ajustar os filtros de busca.'
                : 'Você ainda não tem pacotes registrados.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {pkg.description || 'Pacote sem descrição'}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                        {getStatusText(pkg.status)}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Loja:</span> {pkg.store || 'Não informado'}
                      </div>
                      <div>
                        <span className="font-medium">Pedido:</span> {pkg.orderNumber || 'Não informado'}
                      </div>
                      <div>
                        <span className="font-medium">Peso:</span> {pkg.weightGrams ? `${pkg.weightGrams}g` : 'Não informado'}
                      </div>
                    </div>

                    {pkg.purchasePrice && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-600">Valor:</span>
                        <span className="ml-1 font-semibold text-green-600">
                          ${Number(pkg.purchasePrice).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Recebido em:</span> {new Date(pkg.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedPackage(pkg)
                        setShowDetailsModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação de Pacote */}
      {showCreateModal && (
        <CreatePackageModal
          user={user}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchPackages()
          }}
        />
      )}

      {/* Modal de Detalhes do Pacote */}
      {showDetailsModal && selectedPackage && (
        <PackageDetailsModal
          package={selectedPackage}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedPackage(null)
          }}
        />
      )}
    </div>
  )
}
