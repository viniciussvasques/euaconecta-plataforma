'use client'

import { useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { CarrierData } from '@/lib/carriers'

interface TestConnectionButtonProps {
  carrier: CarrierData
}

export function TestConnectionButton({ carrier }: TestConnectionButtonProps) {
  const [loading, setLoading] = useState(false)
  const [lastTest, setLastTest] = useState<{ success: boolean; error?: string } | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setLastTest(null)
    
    try {
      const response = await fetch(`/api/carriers/${carrier.id}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      setLastTest(result)
    } catch (error) {
      console.error('Erro ao testar conexão:', error)
      setLastTest({ success: false, error: 'Erro ao testar conexão' })
    } finally {
      setLoading(false)
    }
  }

  if (!carrier.hasApi) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-500">
        <WifiOff className="h-3 w-3 mr-1" />
        Manual
      </span>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={handleTest}
        disabled={loading}
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
          lastTest?.success
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : lastTest?.success === false
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Testar conexão com a API"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
        ) : lastTest?.success ? (
          <Wifi className="h-3 w-3 mr-1" />
        ) : (
          <WifiOff className="h-3 w-3 mr-1" />
        )}
        {loading ? 'Testando...' : lastTest?.success ? 'Conectado' : 'Testar'}
      </button>
      
      {lastTest?.error && (
        <div className="text-xs text-red-600 max-w-32 text-center">
          {lastTest.error}
        </div>
      )}
    </div>
  )
}
