'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Box, Settings } from 'lucide-react'
import { CreateBoxModal } from './create-box-modal'
import { ManagePackagesModal } from './manage-packages-modal'
import { ConsolidateModal } from './consolidate-modal'
import { BoxDetailsModal } from './box-details-modal'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
}

interface Box {
  id: string
  name?: string
  notes?: string
  consolidationType: string
  status: string
  currentWeightGrams: number
  maxItemsAllowed: number
  packages: Array<{
    id: string
    description?: string
    status: string
    weightGrams: number
    purchasePrice: number
    store: string
    orderNumber: string
    createdAt: string
  }>
  consolidationFee: number
  storageFee: number
  boxSize?: string
  trackingCode?: string
  openedAt: string
  closedAt?: string
  createdAt: string
  updatedAt: string
}

export function ClientBoxesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [boxes, setBoxes] = useState<Box[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showConsolidateModal, setShowConsolidateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBox, setSelectedBox] = useState<Box | null>(null)
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
      } catch {
        console.error('Erro ao carregar usuário')
        router.push('/auth/login')
      }
    }

    fetchUser()
  }, [router])

  const fetchBoxes = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        userId: user.id,
        ...(filter !== 'all' && { status: filter })
      })

      const response = await fetch(`/api/consolidation?${params}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        setBoxes(data.data)
      } else {
        console.error('Erro ao carregar caixas:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar caixas:', error)
    } finally {
      setLoading(false)
    }
  }, [user, filter])

  useEffect(() => {
    if (user) {
      fetchBoxes()
    }
  }, [user, filter, fetchBoxes])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'READY_TO_SHIP':
        return 'bg-purple-100 text-purple-800'
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Aberta'
      case 'PENDING':
        return 'Pendente'
      case 'IN_PROGRESS':
        return 'Em Processo'
      case 'READY_TO_SHIP':
        return 'Pronta para Envio'
      case 'SHIPPED':
        return 'Enviada'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getConsolidationTypeText = (type: string) => {
    switch (type) {
      case 'SIMPLE':
        return 'Simples'
      case 'REPACK':
        return 'Reembalagem'
      default:
        return type
    }
  }

  const handleManagePackages = (box: Box) => {
    setSelectedBox(box)
    setShowManageModal(true)
  }

  const handleCloseBox = async (box: Box) => {
    try {
      const response = await fetch(`/api/consolidation/${box.id}/close`, {
        method: 'POST'
      })

      const data = await response.json()
      
      if (data.success) {
        fetchBoxes() // Atualizar lista
      } else {
        alert(data.error || 'Erro ao fechar caixa')
      }
    } catch {
      alert('Erro ao fechar caixa')
    }
  }

  const handleConsolidate = (box: Box) => {
    setSelectedBox(box)
    setShowConsolidateModal(true)
  }

  const filteredBoxes = boxes

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando caixas...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Minhas Caixas</h1>
            <p className="mt-2 text-gray-600">
              Gerencie suas caixas de consolidação e acompanhe o progresso.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Caixa
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Todas</option>
              <option value="OPEN">Abertas</option>
              <option value="CLOSED">Fechadas</option>
              <option value="SHIPPED">Enviadas</option>
              <option value="DELIVERED">Entregues</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Caixas */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Caixas ({filteredBoxes.length})
          </h2>
        </div>

        {filteredBoxes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma caixa encontrada
            </h3>
            <p className="text-gray-500">
              {filter !== 'all' 
                ? 'Tente ajustar os filtros.'
                : 'Você ainda não tem caixas de consolidação.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBoxes.map((box) => (
              <div key={box.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {box.name || `Caixa ${getConsolidationTypeText(box.consolidationType)}`}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(box.status)}`}>
                        {getStatusText(box.status)}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Pacotes:</span> {box.packages.length}
                      </div>
                      <div>
                        <span className="font-medium">Peso Atual:</span> {box.currentWeightGrams}g
                      </div>
                      <div>
                        <span className="font-medium">Taxa de Consolidação:</span> ${(Number(box.consolidationFee) || 0).toFixed(2)}
                      </div>
                    </div>

                    {box.storageFee > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Taxa de Armazenamento:</span> ${(Number(box.storageFee) || 0).toFixed(2)}
                      </div>
                    )}

                    {box.trackingCode && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-blue-900">Código de Rastreio</p>
                            <p className="text-sm text-blue-700 font-mono">{box.trackingCode}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              ⚠️ Pode levar até 2 dias úteis para aparecer no sistema da transportadora
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <button 
                            onClick={() => {
                              const timestamp = Date.now()
                              window.open(`https://www.abcpacket.com/rastreamento.php?tracker=${box.trackingCode}&v=${timestamp}`, '_blank')
                            }}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Rastrear na ABC Packet
                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Aberta em:</span> {new Date(box.openedAt).toLocaleDateString('pt-BR')}
                      {box.closedAt && (
                        <span className="ml-4">
                          <span className="font-medium">Fechada em:</span> {new Date(box.closedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>

                    {/* Lista de Pacotes */}
                    {box.packages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Pacotes na Caixa:</h4>
                        <div className="space-y-1">
                          {box.packages.map((pkg) => (
                            <div key={pkg.id} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                              {pkg.description || 'Pacote sem descrição'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-shrink-0 space-y-2">
                    {box.status === 'OPEN' && (
                      <button
                        onClick={() => handleManagePackages(box)}
                        className="block w-full text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        <Settings className="h-4 w-4 inline mr-1" />
                        Gerenciar Pacotes
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedBox(box)
                        setShowDetailsModal(true)
                      }}
                      className="block w-full text-gray-600 hover:text-gray-500 text-sm font-medium"
                    >
                      Ver Detalhes
                    </button>
                    
                    {box.status === 'OPEN' && (
                      <button
                        onClick={() => handleCloseBox(box)}
                        className="block w-full text-green-600 hover:text-green-500 text-sm font-medium"
                      >
                        Fechar Caixa
                      </button>
                    )}

                    {box.status === 'READY_TO_SHIP' && (
                      <button
                        onClick={() => handleConsolidate(box)}
                        className="block w-full text-purple-600 hover:text-purple-500 text-sm font-medium"
                      >
                        Consolidar/Enviar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação de Caixa */}
      {showCreateModal && (
        <CreateBoxModal
          user={user}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchBoxes()
          }}
        />
      )}

      {/* Modal de Gerenciamento de Pacotes */}
      {showManageModal && selectedBox && (
        <ManagePackagesModal
          box={selectedBox}
          onClose={() => {
            setShowManageModal(false)
            setSelectedBox(null)
          }}
          onUpdate={() => {
            fetchBoxes()
          }}
        />
      )}

      {/* Modal de Consolidação */}
      {showConsolidateModal && selectedBox && (
        <ConsolidateModal
          box={selectedBox}
          onClose={() => {
            setShowConsolidateModal(false)
            setSelectedBox(null)
          }}
          onSuccess={() => {
            fetchBoxes()
          }}
        />
      )}

      {/* Modal de Detalhes da Caixa */}
      {showDetailsModal && selectedBox && (
        <BoxDetailsModal
          box={selectedBox}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedBox(null)
          }}
        />
      )}
    </div>
  )
}
