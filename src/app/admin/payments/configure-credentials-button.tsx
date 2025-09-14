'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PaymentProviderCredentialsModal } from './payment-provider-credentials-modal'

interface ConfigureCredentialsButtonProps {
  provider: {
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

export function ConfigureCredentialsButton({ provider, onCredentialsSaved }: ConfigureCredentialsButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
      >
        Credenciais
      </Button>

      {showModal && (
        <PaymentProviderCredentialsModal
          provider={provider}
          onClose={() => setShowModal(false)}
          onCredentialsSaved={() => {
            onCredentialsSaved()
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}
