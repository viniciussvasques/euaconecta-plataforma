'use client'

import { useState, useEffect } from 'react'
import { X, Box, Package, Weight, Info, Check } from 'lucide-react'

const BOX_SIZES = [
  {
    id: 'XS',
    name: 'XS - Extra Pequena',
    dimensions: '15 x 10 x 5 cm',
    maxWeight: 0.5,
    description: 'Jóias, pequenos eletrônicos'
  },
  {
    id: 'S',
    name: 'S - Pequena',
    dimensions: '25 x 18 x 10 cm',
    maxWeight: 1.0,
    description: 'Smartphones, acessórios'
  },
  {
    id: 'M',
    name: 'M - Média',
    dimensions: '30 x 23 x 15 cm',
    maxWeight: 2.0,
    description: 'Tablets, roupas'
  },
  {
    id: 'L',
    name: 'L - Grande',
    dimensions: '38 x 30 x 20 cm',
    maxWeight: 5.0,
    description: 'Notebooks, sapatos'
  },
  {
    id: 'XL',
    name: 'XL - Extra Grande',
    dimensions: '46 x 36 x 25 cm',
    maxWeight: 10.0,
    description: 'Eletrônicos grandes'
  },
  {
    id: 'XXL',
    name: 'XXL - Super Grande',
    dimensions: '61 x 46 x 30 cm',
    maxWeight: 20.0,
    description: 'Monitores, eletrodomésticos'
  },
  {
    id: 'XXXL',
    name: 'XXXL - Extra Super Grande',
    dimensions: '80 x 60 x 40 cm',
    maxWeight: 30.0,
    description: 'Eletrodomésticos grandes'
  }
]

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

interface CreateBoxModalProps {
  user: User | null
  onClose: () => void
  onSuccess: () => void
}

export function CreateBoxModal({ user, onClose, onSuccess }: CreateBoxModalProps) {
  const [formData, setFormData] = useState({
    consolidationType: 'STANDARD',
    boxSize: '',
    name: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availablePackages, setAvailablePackages] = useState<Package[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)

  // Carregar pacotes disponíveis
  useEffect(() => {
    const fetchAvailablePackages = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/packages?userId=${user.id}&filter=RECEIVED`)
        const data = await response.json()

        if (response.ok && data.success) {
          // Filtrar apenas pacotes que não estão em nenhuma consolidação
          const available = data.data.filter((pkg: Package) =>
            pkg.status === 'RECEIVED' &&
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
  }, [user])

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages(prev =>
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }


  // Removido cálculo de frete - será feito apenas na consolidação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Usuário não encontrado')
      return
    }

    // Removida validação de pacotes - caixa pode ser criada vazia

    setLoading(true)
    setError('')

    try {
        const response = await fetch('/api/consolidation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          consolidationType: 'SIMPLE', // Tipo padrão, será definido na consolidação
          boxSize: formData.boxSize,
          packageIds: selectedPackages, // Pacotes selecionados (pode estar vazio)
          name: formData.name || null,
          notes: formData.notes || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onSuccess()
      } else {
        setError(data.error || 'Erro ao criar caixa')
      }
    } catch (error) {
      console.error('Erro ao criar caixa:', error)
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Box className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Criar Nova Caixa
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Organize seus pacotes em uma caixa de consolidação
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Informações da Caixa */}
          {/* Seleção de Tamanho da Caixa com Visualização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Escolha o Tamanho da Caixa
            </label>

            {/* Grid de caixas com animação visual */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {BOX_SIZES.map((size) => (
                <div
                  key={size.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.boxSize === size.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, boxSize: size.id }))}
                >
                  {/* Ícone da caixa com tamanho proporcional */}
                  <div className="flex justify-center mb-3">
                    <div
                      className={`bg-gray-200 border-2 border-gray-400 rounded transition-all duration-300 ${
                        formData.boxSize === size.id ? 'bg-green-200 border-green-400' : ''
                      }`}
                      style={{
                        width: `${Math.min(30 + (size.maxWeight * 3), 60)}px`,
                        height: `${Math.min(20 + (size.maxWeight * 2), 40)}px`
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  {/* Informações da caixa */}
                  <div className="text-center">
                    <h4 className="font-medium text-sm text-gray-900">{size.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{size.dimensions}</p>
                    <p className="text-xs text-gray-500 mt-1">Até {size.maxWeight}kg</p>
                    <p className="text-xs text-gray-500 mt-1">{size.description}</p>
                  </div>

                  {/* Checkbox visual */}
                  {formData.boxSize === size.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Caixa (Opcional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Compras de Dezembro"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Informações adicionais sobre esta caixa..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white placeholder-gray-500"
              rows={3}
            />
          </div>

          {/* Seleção de Pacotes (Opcional) */}
          {availablePackages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="h-4 w-4 inline mr-2" />
                Adicionar Pacotes (Opcional)
              </label>

              {loadingPackages ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando pacotes...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {availablePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${
                        selectedPackages.includes(pkg.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePackageToggle(pkg.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPackages.includes(pkg.id)}
                        onChange={() => handlePackageToggle(pkg.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {pkg.description || 'Pacote sem descrição'}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          {pkg.store && <span>Loja: {pkg.store}</span>}
                          {pkg.weightGrams && (
                            <span className="flex items-center">
                              <Weight className="h-3 w-3 mr-1" />
                              {pkg.weightGrams}g
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPackages.length > 0 && (
                <div className="mt-2 text-sm text-green-700">
                  ✓ {selectedPackages.length} pacote(s) selecionado(s)
                </div>
              )}
            </div>
          )}

          {/* Informação sobre o processo */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Como Funciona
            </h5>
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <p><strong>Crie a caixa</strong> - Escolha o tamanho ideal para seus pacotes</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <p><strong>Adicione pacotes</strong> - Conforme seus pedidos chegam na nossa sede</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <p><strong>Feche a caixa</strong> - Quando estiver pronta para envio</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                <p><strong>Consolide e envie</strong> - Aí sim calculamos o frete e processamos o pagamento</p>
              </div>
            </div>
          </div>


          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.boxSize}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Caixa'}
            </button>
          </div>
          </form>
        </div>

      </div>
    </div>
  )
}
