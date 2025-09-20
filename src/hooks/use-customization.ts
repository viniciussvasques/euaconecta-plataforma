'use client'

import { useState, useEffect } from 'react'
import { SystemCustomization, defaultCustomization } from '@/lib/config/system-customization'

export function useCustomization() {
  const [customization, setCustomization] = useState<SystemCustomization>(defaultCustomization)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/customization')
        const data = await response.json()

        if (data.success && data.data) {
          setCustomization(data.data)
        } else {
          setError('Erro ao carregar configurações')
        }
      } catch (err) {
        setError('Erro de conexão')
        console.error('Erro ao carregar configurações:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomization()
  }, [])

  return { customization, loading, error }
}
