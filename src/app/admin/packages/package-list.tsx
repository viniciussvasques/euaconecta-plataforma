'use client'

import { useEffect, useState, useCallback } from 'react'
import { EditPackageButton } from './edit-package-button'
import { DeletePackageButton } from './delete-package-button'
import { PrintLabelButton } from './print-label-button'
import { ConfirmPackageModal } from './confirm-package-modal'

interface Package {
  id: string
  owner: {
    name: string
    email: string
  }
  description: string
  status: string
  purchaseDate?: string
  expectedDeliveryDate?: string
  store?: string
  orderNumber?: string
  purchasePrice?: number
  weightGrams?: number
  createdAt: string
}

export function PackageList() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

  const fetchPackages = useCallback(async () => {
    try {
      const response = await fetch(`/api/packages?filter=${filter}`)
      if (response.ok) {
        const result = await response.json()
        // A API retorna { success: true, data: packages }
        if (result.success && Array.isArray(result.data)) {
          setPackages(result.data)
        } else {
          setPackages([])
        }
      }
    } catch (error) {
      console.error('Erro ao buscar pacotes:', error)
      setPackages([]) // Em caso de erro, garantir que seja um array vazio
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchPackages()
  }, [filter, fetchPackages])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-green-100 text-green-800'
      case 'READY_TO_SHIP':
        return 'bg-yellow-100 text-yellow-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
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
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Status
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
          >
            <option value="all">Todos</option>
            <option value="RECEIVED">Recebidos</option>
            <option value="READY_TO_SHIP">Pronto para Envio</option>
            <option value="SHIPPED">Enviados</option>
          </select>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Recebimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pkg.owner.name}</div>
                      <div className="text-sm text-gray-500">{pkg.owner.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {pkg.description || 'Sem descrição'}
                    </div>
                    {pkg.orderNumber && (
                      <div className="text-sm text-gray-500">Pedido: {pkg.orderNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pkg.store || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.status)}`}>
                      {getStatusText(pkg.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pkg.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {pkg.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg)
                            setShowConfirmModal(true)
                          }}
                          className="text-green-600 hover:text-green-500 text-sm font-medium"
                        >
                          Confirmar
                        </button>
                      )}
                      <PrintLabelButton packageId={pkg.id} />
                      <EditPackageButton packageId={pkg.id} />
                      <DeletePackageButton packageId={pkg.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {packages.length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pacote encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'Não há pacotes cadastrados ainda.' : `Não há pacotes com status "${filter}".`}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && selectedPackage && (
        <ConfirmPackageModal
          package={{
            ...selectedPackage,
            weightGrams: selectedPackage.weightGrams || 0,
            purchasePrice: selectedPackage.purchasePrice || 0,
            store: selectedPackage.store || '',
            orderNumber: selectedPackage.orderNumber || '',
            ownerId: (selectedPackage as { ownerId?: string }).ownerId || (selectedPackage.owner as { id?: string })?.id || '',
            owner: selectedPackage.owner ? { ...selectedPackage.owner, suiteNumber: null, cpf: '', phone: '' } : { name: '', email: '', suiteNumber: null, cpf: '', phone: '' }
          }}
          onClose={() => {
            setShowConfirmModal(false)
            setSelectedPackage(null)
          }}
          onSuccess={() => {
            fetchPackages()
          }}
        />
      )}
    </div>
  )
}
