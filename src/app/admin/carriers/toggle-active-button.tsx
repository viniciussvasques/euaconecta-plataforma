'use client'

import { useState } from 'react'

interface ToggleActiveButtonProps {
  carrierId: string
  isActive: boolean
  onToggle: (carrierId: string, isActive: boolean) => Promise<void>
}

export function ToggleActiveButton({ carrierId, isActive, onToggle }: ToggleActiveButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await onToggle(carrierId, !isActive)
    } catch (error) {
      console.error('Erro ao alterar status da transportadora:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {loading ? '...' : isActive ? 'Ativo' : 'Inativo'}
    </button>
  )
}