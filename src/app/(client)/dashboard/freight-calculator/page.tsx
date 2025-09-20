'use client'

import { useState } from 'react'

export default function FreightCalculatorPage() {
  const [productValue, setProductValue] = useState<string>('')
  const [weightGrams, setWeightGrams] = useState<string>('')
  const [serviceType, setServiceType] = useState<'STANDARD' | 'EXPRESS'>('STANDARD')
  const [result, setResult] = useState<{
    productValue: number;
    weightGrams: number;
    serviceType: string;
    freight: {
      baseUSD: number;
      finalUSD: number;
      carrierName: string;
      deliveryTime: string;
    };
    totals: {
      productUSD: number;
      freightUSD: number;
      totalUSD: number;
      totalBRL: number;
      freightBRL: number;
      importTax: number;
      icms: number;
      totalTax: number;
      finalValue: number;
    };
    breakdown: {
      productValue: number;
      freight: number;
      tax: number;
      total: number;
    };
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateFreightAndTaxes = async () => {
    if (!productValue || !weightGrams) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Calcular frete usando a API existente
      const freightResponse = await fetch('/api/freight/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weightGrams: parseFloat(weightGrams),
          serviceType: serviceType
        }),
      })

      if (!freightResponse.ok) {
        throw new Error('Erro ao calcular frete')
      }

      const freightData = await freightResponse.json()

      if (!freightData.success) {
        throw new Error(freightData.error || 'Erro ao calcular frete')
      }

      const productVal = parseFloat(productValue)
      const freightUSD = freightData.data.pricing.finalPrice
      const EXCHANGE_RATE_USD_BRL = 5.2 // Taxa de câmbio aproximada

      // Calcular total em USD primeiro
      const totalUSD = productVal + freightUSD
      const totalBRL = totalUSD * EXCHANGE_RATE_USD_BRL
      const freightBRL = freightUSD * EXCHANGE_RATE_USD_BRL

      // Calcular impostos brasileiros corretos
      // 1. Taxa de importação: 60% sobre o valor total
      const importTax = totalBRL * 0.60
      // 2. ICMS: 18% sobre o valor total + taxa de importação
      const totalWithImportTax = totalBRL + importTax
      const icms = totalWithImportTax * 0.18

      const totalTax = importTax + icms
      const finalValue = totalBRL + totalTax

      setResult({
        productValue: productVal,
        weightGrams: parseFloat(weightGrams),
        serviceType,
        freight: {
          baseUSD: freightData.data.pricing.basePrice,
          finalUSD: freightUSD,
          carrierName: freightData.data.serviceInfo.name,
          deliveryTime: freightData.data.serviceInfo.deliveryTime
        },
        totals: {
          productUSD: productVal,
          freightUSD: freightUSD,
          totalUSD: totalUSD,
          totalBRL: totalBRL,
          freightBRL: freightBRL,
          importTax: importTax,
          icms: icms,
          totalTax: totalTax,
          finalValue: finalValue
        },
        breakdown: {
          productValue: productVal,
          freight: freightBRL,
          tax: totalTax,
          total: finalValue
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no cálculo')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCurrencyUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🧮 Calculadora de Frete e Impostos
          </h2>
          <p className="text-gray-600">
            Calcule o frete Packet (EUA → Brasil) + markup e os impostos para seus produtos
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📦 Dados do Produto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Produto (USD)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (gramas)
              </label>
              <input
                type="number"
                step="1"
                placeholder="1000"
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Peso mínimo: 500g | Peso máximo: 30.000g (30kg)
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Serviço
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as 'STANDARD' | 'EXPRESS')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="STANDARD">📦 Packet Standard (15-20 dias úteis)</option>
              <option value="EXPRESS">🚀 Packet Express (7-10 dias úteis)</option>
            </select>
          </div>

          <button
            onClick={calculateFreightAndTaxes}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculando...' : '🧮 Calcular Frete e Impostos'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">⚠️ {error}</p>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cálculo de Frete */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📦 Cálculo de Frete Packet
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transportadora:</span>
                  <span className="font-medium">{result.freight.carrierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Serviço:</span>
                  <span className="font-medium">
                    {result.serviceType === 'STANDARD' ? '📦 Packet Standard' : '🚀 Packet Express'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Prazo de Entrega:</span>
                  <span className="font-medium">{result.freight.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa Base (USD):</span>
                  <span className="font-medium">{formatCurrencyUSD(result.freight.baseUSD)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Frete Final (USD):</span>
                  <span className="text-green-600">{formatCurrencyUSD(result.freight.finalUSD)}</span>
                </div>
              </div>
            </div>

            {/* Totais */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💰 Totais
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valor do Produto (USD):</span>
                  <span className="font-medium">{formatCurrencyUSD(result.totals.productUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frete (USD):</span>
                  <span className="font-medium">{formatCurrencyUSD(result.totals.freightUSD)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total (USD):</span>
                  <span className="text-blue-600">{formatCurrencyUSD(result.totals.totalUSD)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total (BRL):</span>
                  <span className="text-blue-600">{formatCurrency(result.totals.totalBRL)}</span>
                </div>
              </div>
            </div>

            {/* Cálculo de Impostos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💰 Cálculo de Impostos
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valor Total (BRL):</span>
                  <span className="font-medium">{formatCurrency(result.totals.totalBRL)}</span>
                </div>
                <hr className="my-2" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa de Importação (60%):</span>
                    <span className="font-medium">{formatCurrency(result.totals.importTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ICMS (18%):</span>
                    <span className="font-medium">{formatCurrency(result.totals.icms)}</span>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total de Impostos:</span>
                  <span className="text-red-600">{formatCurrency(result.totals.totalTax)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Valor Final:</span>
                  <span className="text-blue-600">{formatCurrency(result.totals.finalValue)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            <strong>⚠️ Aviso:</strong> Os valores são estimativas baseadas nas alíquotas atuais.
            Valores finais podem variar conforme legislação vigente e características específicas do produto.
            O frete é calculado usando a tabela Packet oficial dos EUA para o Brasil.
          </p>
        </div>
      </div>
    </div>
  )
}
