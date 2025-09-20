'use client'

import React, { useState } from 'react'
import { Calculator, Package, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export function FreightCalculatorWidget() {
  const [productValue, setProductValue] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [origin, setOrigin] = useState<string>('')
  const [destination, setDestination] = useState<string>('')

  // const formatCurrency = (value: number) => {
  //   return new Intl.NumberFormat('pt-BR', {
  //     style: 'currency',
  //     currency: 'BRL'
  //   }).format(value)
  // }

  const calculateFreight = async () => {
    if (!productValue || !weight || !origin || !destination) {
      return
    }

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
          markup: 0.20
        }),
      })

      if (response.ok) {
        // const data = await response.json()
        // Redirecionar para a página completa com os dados
        const params = new URLSearchParams({
          productValue: productValue,
          weight: weight,
          origin: origin,
          destination: destination
        })
        window.location.href = `/dashboard/freight-calculator?${params.toString()}`
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculadora de Frete
        </CardTitle>
        <CardDescription>
          Calcule frete APC + impostos para seus produtos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="widget-productValue">Valor (R$)</Label>
            <Input
              id="widget-productValue"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={productValue}
              onChange={(e) => setProductValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="widget-weight">Peso (kg)</Label>
            <Input
              id="widget-weight"
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
            <Label htmlFor="widget-origin">Origem</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger>
                <SelectValue placeholder="Estado origem" />
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
            <Label htmlFor="widget-destination">Destino</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Estado destino" />
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

        <div className="flex gap-2">
          <Button
            onClick={calculateFreight}
            disabled={!productValue || !weight || !origin || !destination}
            className="flex-1"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calcular
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/freight-calculator">
              <ArrowRight className="h-4 w-4 mr-2" />
              Calculadora Completa
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            <Package className="h-3 w-3 mr-1" />
            Frete APC + Markup + Impostos
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
