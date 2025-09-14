'use client'

import { useState, useEffect, useMemo } from 'react'
import { ConsolidationType, ProtectionType } from '@prisma/client'

// Dinamic currency formatter
const getFormatter = (currency: string) => new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : currency === 'EUR' ? 'de-DE' : 'en-US', { style: 'currency', currency })

type PlatformConfigResponse = {
  consolidationBaseFeeUsdCents: number
  consolidationPerPackageUsdCents: number
  repackMultiplier: number
  currency: string
}

type ProtectionService = {
  id: string
  name: string
  protectionType: ProtectionType
  priceUsdCents: number
}

type StoragePolicy = {
  id: string
  name: string
  dailyRatePerItem: number
  dailyRateSmall: number
  dailyRateMedium: number
  dailyRateLarge: number
  freeDays: number
  isActive: boolean
}

interface Package {
  id: string
  description: string | null
  status: string
  weightGrams: number | null
  purchasePrice: number | null
  store: string | null
  orderNumber: string | null
  owner: {
    name: string | null
    email: string
  }
}

interface CreateConsolidationData {
  userId: string
  consolidationType: ConsolidationType
  customInstructions?: string
  extraProtection: ProtectionType[]
  removeInvoice: boolean
  packageIds: string[]
}

export default function CreateConsolidationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [consolidationType, setConsolidationType] = useState<ConsolidationType>('SIMPLE')
  const [extraProtection, setExtraProtection] = useState<ProtectionType[]>([])
  const [removeInvoice, setRemoveInvoice] = useState(false)
  const [customInstructions, setCustomInstructions] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [cfg, setCfg] = useState<PlatformConfigResponse | null>(null)
  const [protectionCatalog, setProtectionCatalog] = useState<ProtectionService[]>([])
  const [storagePolicies, setStoragePolicies] = useState<StoragePolicy[]>([])

  const currency = cfg?.currency ?? 'USD'
  const fmt = useMemo(() => getFormatter(currency), [currency])

  // Buscar pacotes disponíveis para consolidação
  useEffect(() => {
    if (isOpen) {
      fetchPackages()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    Promise.all([
      fetch('/api/platform-config').then(r => r.json()).then(r => r?.data || r),
      fetch('/api/protection-services').then(r => r.json()).then(r => r.data || []),
      fetch('/api/storage').then(r => r.json()).then(r => r.data || []),
    ]).then(([platform, protections, storage]) => {
      setCfg({
        consolidationBaseFeeUsdCents: platform.consolidationBaseFeeUsdCents ?? 500,
        consolidationPerPackageUsdCents: platform.consolidationPerPackageUsdCents ?? 100,
        repackMultiplier: platform.repackMultiplier ?? 1.5,
        currency: platform.currency ?? 'USD',
      })
      setProtectionCatalog(protections as ProtectionService[])
      setStoragePolicies(storage as StoragePolicy[])
    }).catch(() => {})
  }, [isOpen])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages?filter=RECEIVED')
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
      setPackages([])
    }
  }

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }

  const handleProtectionToggle = (protection: ProtectionType) => {
    setExtraProtection(prev => 
      prev.includes(protection)
        ? prev.filter(p => p !== protection)
        : [...prev, protection]
    )
  }

  const getProtectionPrice = (type: ProtectionType) => {
    const found = protectionCatalog.find(p => p.protectionType === type)
    return found ? found.priceUsdCents : 0
  }

  const formatMoney = (cents: number) => fmt.format((cents || 0) / 100)

  const calculateFees = () => {
    const base = cfg?.consolidationBaseFeeUsdCents ?? 500
    const perPackage = cfg?.consolidationPerPackageUsdCents ?? 100
    const multiplier = consolidationType === 'REPACK' ? (cfg?.repackMultiplier ?? 1.5) : 1

    let consolidationFee = (base + (perPackage * selectedPackages.length)) * multiplier

    extraProtection.forEach(p => {
      consolidationFee += getProtectionPrice(p)
    })

    // Storage: usar política ativa se existir
    const activePolicy = storagePolicies.find(p => p.isActive)
    let storageFee = 0
    if (activePolicy) {
      storageFee = activePolicy.dailyRatePerItem * Math.max(0, selectedPackages.length)
    } else {
      // fallback simples
      storageFee = 200 + (50 * Math.max(0, selectedPackages.length - 1))
    }

    return { consolidationFee, storageFee, total: consolidationFee + storageFee }
  }

  const handleSubmit = async () => {
    if (selectedPackages.length === 0) {
      setError('Selecione pelo menos um pacote para consolidação')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Usar o primeiro pacote selecionado para obter o userId
      const firstPackage = packages.find(p => p.id === selectedPackages[0])
      if (!firstPackage) throw new Error('Pacote não encontrado')

      const consolidationData: CreateConsolidationData = {
        userId: firstPackage.owner.email, // Usar email como identificador temporário
        consolidationType,
        customInstructions: customInstructions || undefined,
        extraProtection,
        removeInvoice,
        packageIds: selectedPackages
      }

      const response = await fetch('/api/consolidation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consolidationData),
      })

      if (response.ok) {
        setIsOpen(false)
        // Resetar formulário
        setSelectedPackages([])
        setConsolidationType('SIMPLE')
        setExtraProtection([])
        setRemoveInvoice(false)
        setCustomInstructions('')
        // Recarregar a página para mostrar a nova consolidação
        window.location.reload()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar consolidação')
      }
    } catch (error) {
      setError('Erro interno do servidor')
      console.error('Erro ao criar consolidação:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fees = calculateFees()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Nova Consolidação
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nova Consolidação</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna Esquerda - Seleção de Pacotes */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Pacotes Disponíveis</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPackages.includes(pkg.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePackageToggle(pkg.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedPackages.includes(pkg.id)}
                          onChange={() => handlePackageToggle(pkg.id)}
                          className="text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {pkg.description || 'Sem descrição'}
                          </p>
                          <p className="text-sm text-gray-700">
                            {pkg.store && `${pkg.store}`}
                            {pkg.orderNumber && ` - #${pkg.orderNumber}`}
                          </p>
                          <p className="text-sm text-gray-700">
                            {pkg.weightGrams ? `${pkg.weightGrams}g` : 'Peso não informado'}
                            {typeof pkg.purchasePrice === 'number' && ` • ${fmt.format(pkg.purchasePrice / 100)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna Direita - Configurações */}
              <div className="space-y-6">
                {/* Tipo de Consolidação */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Tipo de Consolidação</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="SIMPLE"
                        checked={consolidationType === 'SIMPLE'}
                        onChange={(e) => setConsolidationType(e.target.value as ConsolidationType)}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Simple Consolidation</span>
                        <p className="text-sm text-gray-700">Agrupa pacotes mantendo embalagem original</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        value="REPACK"
                        checked={consolidationType === 'REPACK'}
                        onChange={(e) => setConsolidationType(e.target.value as ConsolidationType)}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Repack & Combine</span>
                        <p className="text-sm text-gray-700">Abre embalagens e repacota em caixa menor</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Serviços de Proteção */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Proteções Extras</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(['BUBBLE_WRAP', 'DOUBLE_BOX', 'SECURITY_TAPE', 'PAPER_FILLING', 'CUSTOM_PACKAGING'] as ProtectionType[]).map((protection) => (
                      <label key={protection} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={extraProtection.includes(protection)}
                          onChange={() => handleProtectionToggle(protection)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-800">
                          {protection === 'BUBBLE_WRAP' && 'Plástico Bolha'}
                          {protection === 'DOUBLE_BOX' && 'Dupla Caixa'}
                          {protection === 'SECURITY_TAPE' && 'Fita Segurança'}
                          {protection === 'PAPER_FILLING' && 'Papel de Preenchimento'}
                          {protection === 'CUSTOM_PACKAGING' && 'Embalagem Customizada'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Opções Adicionais */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Opções Adicionais</h3>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={removeInvoice}
                      onChange={(e) => setRemoveInvoice(e.target.checked)}
                      className="text-blue-600"
                    />
                    <span className="text-gray-800">Remover Invoice/Packing Slip</span>
                  </label>
                </div>

                {/* Instruções Customizadas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Instruções Especiais</h3>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Instruções especiais para a consolidação..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white resize-none"
                    rows={3}
                  />
                </div>

                {/* Resumo de Taxas */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Resumo de Taxas ({currency})</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Taxa de Consolidação:</span>
                      <span className="text-gray-900 font-semibold">{formatMoney(fees.consolidationFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Taxa de Armazenamento:</span>
                      <span className="text-gray-900 font-semibold">{formatMoney(fees.storageFee)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">{formatMoney(fees.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || selectedPackages.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Criando...' : 'Criar Consolidação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
