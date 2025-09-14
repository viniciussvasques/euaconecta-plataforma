'use client'

import { useEffect } from 'react'

export function DynamicStyles() {
  useEffect(() => {
    // Carregar estilos customizados
    const loadCustomStyles = async () => {
      try {
        const response = await fetch('/api/customization/styles')
        if (response.ok) {
          const css = await response.text()
          
          // Remover estilos anteriores se existirem
          const existingStyle = document.getElementById('dynamic-custom-styles')
          if (existingStyle) {
            existingStyle.remove()
          }
          
          // Adicionar novos estilos
          const styleElement = document.createElement('style')
          styleElement.id = 'dynamic-custom-styles'
          styleElement.textContent = css
          document.head.appendChild(styleElement)
        }
      } catch (error) {
        console.error('Erro ao carregar estilos customizados:', error)
      }
    }

    loadCustomStyles()

    // Recarregar estilos a cada 5 minutos
    const interval = setInterval(loadCustomStyles, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}
