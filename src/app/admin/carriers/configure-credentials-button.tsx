'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { CarrierCredentialsModal } from './carrier-credentials-modal'

interface ConfigureCredentialsButtonProps {
  carrier: {
    id: string
    name: string
    code: string
    hasApi: boolean
    apiKey?: string | null
    apiSecret?: string | null
    apiUrl?: string | null
  }
  onCredentialsSaved: () => void
}

export function ConfigureCredentialsButton({
  carrier,
  onCredentialsSaved
}: ConfigureCredentialsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isLoading, setIsLoading] = useState(false) // Removido - não usado

  const handleSaveCredentials = async (credentials: {
    apiKey: string
    apiSecret: string
    apiUrl: string
    hasApi: boolean
  }) => {
    // setIsLoading(true)

    try {
      const response = await fetch(`/api/carriers/${carrier.id}/credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar credenciais')
      }

      onCredentialsSaved()
    } catch (error) {
      throw error
    } finally {
      // setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
      >
        <Settings className="h-4 w-4 mr-1" />
        Credenciais
      </Button>

      <CarrierCredentialsModal
        carrier={carrier}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCredentials}
      />
    </>
  )
}
