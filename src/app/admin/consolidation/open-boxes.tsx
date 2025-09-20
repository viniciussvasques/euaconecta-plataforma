'use client'

import { useState, useEffect } from 'react'
import { ConsolidationGroupData } from '@/lib/consolidation/consolidation'
import { FreightCalculatorService } from '@/lib/freight/freight-calculator'

interface OpenBoxesProps {
  consolidations: ConsolidationGroupData[]
}

export function OpenBoxes({ consolidations }: OpenBoxesProps) {
  const [openBoxes, setOpenBoxes] = useState<ConsolidationGroupData[]>([])
  const [selectedBox, setSelectedBox] = useState<ConsolidationGroupData | null>(null)
  const [showAddPackage, setShowAddPackage] = useState(false)
  const [newPackageData, setNewPackageData] = useState({
    packageId: '',
    weightGrams: 0,
    weightNotes: ''
  })

  useEffect(() => {
    // Mostrar todas as consolidações que não estão finalizadas
    setOpenBoxes(consolidations.filter(c =>
      ['OPEN', 'PENDING', 'IN_PROGRESS', 'READY_TO_SHIP'].includes(c.status)
    ))
  }, [consolidations])

  const handleCloseBox = async (consolidationId: string) => {
    try {
      const response = await fetch(`/api/consolidation/${consolidationId}/close`, {
        method: 'POST'
      })

      if (response.ok) {
        // Atualizar lista local
        setOpenBoxes(prev => prev.filter(box => box.id !== consolidationId))
        setSelectedBox(null)
      }
    } catch (error) {
      console.error('Erro ao fechar caixa:', error)
    }
  }

  const handleAddPackage = async () => {
    if (!selectedBox || !newPackageData.packageId) return

    try {
      const response = await fetch(`/api/consolidation/${selectedBox.id}/add-package`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: newPackageData.packageId,
          weightGrams: newPackageData.weightGrams,
          weighedBy: 'admin', // TODO: usar ID do usuário logado
          weightNotes: newPackageData.weightNotes
        })
      })

      if (response.ok) {
        // Limpar formulário
        setNewPackageData({ packageId: '', weightGrams: 0, weightNotes: '' })
        setShowAddPackage(false)

        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao adicionar pacote:', error)
    }
  }

  const handleRemovePackage = async (packageId: string) => {
    if (!selectedBox) return

    if (!confirm('Tem certeza que deseja remover este pacote da caixa?')) {
      return
    }

    try {
      const response = await fetch(`/api/consolidation/${selectedBox.id}/remove-package`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId })
      })

      if (response.ok) {
        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao remover pacote:', error)
    }
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`
    }
    return `${grams} g`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Consolidações Ativas</h2>
        <span className="text-sm text-gray-500">
          {openBoxes.length} caixa(s) aberta(s)
        </span>
      </div>

      {openBoxes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma caixa aberta no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Consolidações Ativas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Caixas Disponíveis</h3>
            {openBoxes.map(box => (
              <div
                key={box.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedBox?.id === box.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBox(box)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Caixa #{box.id.slice(-6)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {box.packages.length} pacote(s) • {formatWeight(box.currentWeightGrams)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Aberta em {new Date(box.openedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(box.consolidationFee)}
                    </p>
                    <p className="text-xs text-gray-500">Taxa de consolidação</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detalhes da Caixa Selecionada */}
          {selectedBox && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Detalhes da Caixa</h3>
              <div className="bg-white border rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Caixa #{selectedBox.id.slice(-6)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tipo: {selectedBox.consolidationType === 'SIMPLE' ? 'Simples' : 'Repack'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Peso Atual</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatWeight(selectedBox.currentWeightGrams)}
                    </p>
                    {selectedBox.estimatedFinalWeightGrams && (
                      <p className="text-xs text-gray-500">
                        Estimativa final: {formatWeight(selectedBox.estimatedFinalWeightGrams)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pacotes</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedBox.packages.length}/{selectedBox.maxItemsAllowed}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedBox.maxItemsAllowed - selectedBox.packages.length} vagas restantes
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Taxa de Consolidação</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(selectedBox.consolidationFee)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Taxa de Armazenamento</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(selectedBox.storageFee)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pacotes na Caixa</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedBox.packages.map(pkg => (
                      <div key={pkg.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <span className="text-gray-600">
                            {pkg.description || `Pacote ${pkg.id.slice(-6)}`}
                          </span>
                          <div className="text-xs text-gray-500">
                            {pkg.weightGrams ? formatWeight(pkg.weightGrams) : 'Não pesado'}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemovePackage(pkg.id)}
                          className="ml-2 text-red-600 hover:text-red-800 text-xs"
                          title="Remover pacote"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {selectedBox.packages.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Nenhum pacote na caixa
                      </p>
                    )}
                  </div>
                </div>

                {/* Status da Caixa */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Status da Caixa</p>
                      <p className="text-xs text-blue-700">
                        {selectedBox.packages.length === 0
                          ? 'Vazia - Pronta para receber pacotes'
                          : selectedBox.packages.length >= selectedBox.maxItemsAllowed
                          ? 'Cheia - Pronta para fechamento'
                          : 'Em uso - Aceitando mais pacotes'
                        }
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      selectedBox.packages.length === 0
                        ? 'bg-gray-400'
                        : selectedBox.packages.length >= selectedBox.maxItemsAllowed
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}></div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddPackage(true)}
                    disabled={selectedBox.packages.length >= selectedBox.maxItemsAllowed}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="mr-2">📦</span>
                    Adicionar Pacote
                  </button>
                  <button
                    onClick={() => handleCloseBox(selectedBox.id)}
                    disabled={selectedBox.packages.length === 0}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="mr-2">✅</span>
                    Fechar Caixa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para Adicionar Pacote */}
      {showAddPackage && selectedBox && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Adicionar Pacote à Caixa
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID do Pacote
                </label>
                <input
                  type="text"
                  value={newPackageData.packageId}
                  onChange={(e) => setNewPackageData(prev => ({ ...prev, packageId: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  placeholder="Digite o ID do pacote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Peso (gramas)
                </label>
                <input
                  type="number"
                  value={newPackageData.weightGrams}
                  onChange={(e) => setNewPackageData(prev => ({ ...prev, weightGrams: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  value={newPackageData.weightNotes}
                  onChange={(e) => setNewPackageData(prev => ({ ...prev, weightNotes: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                  rows={3}
                  placeholder="Observações sobre o peso..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddPackage(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPackage}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
