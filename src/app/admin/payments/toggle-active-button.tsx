'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ToggleActiveButtonProps {
  provider: {
    id: string
    name: string
    isActive: boolean
  }
  onToggle: () => void
}

export function ToggleActiveButton({ provider, onToggle }: ToggleActiveButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/payment-providers/${provider.id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao alterar status')
      }

      onToggle()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status do provedor de pagamento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={provider.isActive ? "destructive" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={provider.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
    >
      {isLoading ? 'Alterando...' : (provider.isActive ? 'Desativar' : 'Ativar')}
    </Button>
  )
}
