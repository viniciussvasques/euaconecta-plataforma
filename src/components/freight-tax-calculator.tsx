'use client'

import React, { useState } from 'react'
import { Calculator, Package, DollarSign, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
// import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FreightTaxResult {
  productValue: number
  weight: number
  origin: string
  destination: string
  freight: {
    weight: number
    origin: string
    destination: string
    baseRate: number
    markup: number
    finalRate: number
    currency: string
  }
  taxes: {
    productValue: number
    freightValue: number
    totalValue: number
    icms: number
    ipi: number
    pis: number
    cofins: number
    totalTax: number
    finalValue: number
    currency: string
  }
  disclaimer: string
}

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export function FreightTaxCalculator() {
  const [productValue, setProductValue] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [origin, setOrigin] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [markup, setMarkup] = useState<string>('20')
  const [result, setResult] = useState<FreightTaxResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateFreightAndTaxes = async () => {
    if (!productValue || !weight || !origin || !destination) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/freight-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productValue: parseFloat(productValue),
          weight: parseFloat(weight),
          origin,
          destination,
          markup: parseFloat(markup) / 100
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao calcular frete e impostos')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
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

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Calculadora de Frete e Impostos
        </h2>
        <p className="text-gray-600">
          Calcule o frete APC + markup e os impostos para produtos no Brasil
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Dados do Produto
          </CardTitle>
          <CardDescription>
            Informe os dados do produto para calcular frete e impostos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productValue">Valor do Produto (R$)</Label>
              <Input
                id="productValue"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="0,0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origem (Estado)</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado de origem" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destino (Estado)</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado de destino" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="markup">Markup da Empresa (%)</Label>
            <Input
              id="markup"
              type="number"
              step="0.1"
              placeholder="20"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
            />
          </div>

          <Button
            onClick={calculateFreightAndTaxes}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Calculando...' : 'Calcular Frete e Impostos'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cálculo de Frete */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Cálculo de Frete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa Base APC:</span>
                  <span className="font-medium">{formatCurrency(result.freight.baseRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Markup ({formatPercentage(result.freight.markup)}):</span>
                  <span className="font-medium">{formatCurrency(result.freight.finalRate - result.freight.baseRate)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Frete Final:</span>
                  <span className="text-green-600">{formatCurrency(result.freight.finalRate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cálculo de Impostos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cálculo de Impostos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valor do Produto:</span>
                  <span className="font-medium">{formatCurrency(result.taxes.productValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frete:</span>
                  <span className="font-medium">{formatCurrency(result.taxes.freightValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(result.taxes.totalValue)}</span>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ICMS (18%):</span>
                    <span className="font-medium">{formatCurrency(result.taxes.icms)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IPI (10%):</span>
                    <span className="font-medium">{formatCurrency(result.taxes.ipi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">PIS (1.65%):</span>
                    <span className="font-medium">{formatCurrency(result.taxes.pis)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">COFINS (7.6%):</span>
                    <span className="font-medium">{formatCurrency(result.taxes.cofins)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total de Impostos:</span>
                  <span className="text-red-600">{formatCurrency(result.taxes.totalTax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Valor Final:</span>
                  <span className="text-blue-600">{formatCurrency(result.taxes.finalValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Aviso:</strong> {result.disclaimer}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
