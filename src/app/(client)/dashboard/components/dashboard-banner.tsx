'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function DashboardBanner() {
  const [customization, setCustomization] = useState({
    siteName: 'EUA Conecta',
    primaryColor: '#3b82f6', // blue-500
    logoUrl: '/logo.png',
    bannerImageUrl: '/dashboard-banner.jpg',
    bannerTitle: 'Sua ponte para os Estados Unidos',
    bannerSubtitle: 'Compre nos EUA e receba no Brasil com facilidade',
    bannerButtonText: 'Saiba mais',
    bannerButtonLink: '/sobre',
    bannerEnabled: true
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const response = await fetch('/api/customization')
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            // Mapear a estrutura correta da API
            const apiData = data.data
            const bannerData = apiData.clientDashboard?.banner
            
            if (bannerData) {
              setCustomization(prev => ({
                ...prev,
                bannerTitle: bannerData.title || prev.bannerTitle,
                bannerSubtitle: bannerData.subtitle || prev.bannerSubtitle,
                bannerButtonText: bannerData.buttonText || prev.bannerButtonText,
                bannerButtonLink: bannerData.buttonLink || prev.bannerButtonLink,
                bannerEnabled: bannerData.enabled !== undefined ? bannerData.enabled : prev.bannerEnabled,
                bannerImageUrl: bannerData.imageUrl || prev.bannerImageUrl,
                primaryColor: apiData.branding?.colors?.primary || prev.primaryColor
              }))
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar customizações:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomization()
  }, [])

  // Não mostrar se o banner estiver desativado
  if (!customization.bannerEnabled) {
    return null
  }

  const hasCustomBanner = customization.bannerImageUrl && 
                          customization.bannerImageUrl !== '/dashboard-banner.jpg' && 
                          !customization.bannerImageUrl.includes('placeholder')

  const bannerStyle = {
    backgroundColor: hasCustomBanner ? 'transparent' : customization.primaryColor,
    backgroundImage: !hasCustomBanner ? `linear-gradient(135deg, ${customization.primaryColor}, ${adjustColorBrightness(customization.primaryColor, -20)})` : undefined
  }

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-2xl animate-pulse mb-8"></div>
    )
  }

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden shadow-sm relative mb-8"
      style={{ height: '250px' }}
    >
      {hasCustomBanner ? (
        <Image
          src={customization.bannerImageUrl}
          alt={customization.bannerTitle}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      ) : null}
      
      <div 
        className="absolute inset-0 flex flex-col justify-center p-8"
        style={bannerStyle}
      >
        <div className={`max-w-lg ${hasCustomBanner ? 'bg-black/30 p-4 rounded-lg backdrop-blur-sm' : ''}`}>
          <h2 className={`text-2xl md:text-3xl font-bold ${hasCustomBanner ? 'text-white' : 'text-white'}`}>
            {customization.bannerTitle}
          </h2>
          <p className={`mt-2 ${hasCustomBanner ? 'text-gray-100' : 'text-white/80'}`}>
            {customization.bannerSubtitle}
          </p>
          {customization.bannerButtonText && (
            <Link 
              href={customization.bannerButtonLink || '/sobre'} 
              className="mt-4 inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              {customization.bannerButtonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Função auxiliar para ajustar a luminosidade de uma cor
function adjustColorBrightness(color: string, percent: number) {
  // Converte hex para rgb
  let r = parseInt(color.substring(1, 3), 16)
  let g = parseInt(color.substring(3, 5), 16)
  let b = parseInt(color.substring(5, 7), 16)

  // Ajusta a luminosidade
  r = Math.max(0, Math.min(255, r + percent))
  g = Math.max(0, Math.min(255, g + percent))
  b = Math.max(0, Math.min(255, b + percent))

  // Converte de volta para hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}