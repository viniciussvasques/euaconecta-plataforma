'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

interface IntroductionStep {
  id: string
  title: string
  description: string
  icon: string
  completed: boolean
  link: string
  priority: number
}

export function IntroductionSection() {
  const [steps, setSteps] = useState<IntroductionStep[]>([
    {
      id: 'profile',
      title: 'Complete seu perfil',
      description: 'Adicione suas informações pessoais e endereço de entrega',
      icon: '👤',
      completed: false,
      link: '/dashboard/profile',
      priority: 1
    },
    {
      id: 'address',
      title: 'Configure seu endereço nos EUA',
      description: 'Veja seu número de suite para usar em suas compras',
      icon: '🏢',
      completed: false,
      link: '/dashboard/settings',
      priority: 2
    },
    {
      id: 'tutorial',
      title: 'Assista ao tutorial de introdução',
      description: 'Aprenda como funciona o processo de compra e envio',
      icon: '🎬',
      completed: false,
      link: '/dashboard/tutorials',
      priority: 3
    },
    {
      id: 'first-package',
      title: 'Receba seu primeiro pacote',
      description: 'Faça uma compra em uma loja americana usando seu endereço',
      icon: '📦',
      completed: false,
      link: '/dashboard/stores',
      priority: 4
    }
  ])
  
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkUserProgress = async () => {
      try {
        // Verificar se o usuário completou o perfil
        let profileComplete = false
        try {
          const userResponse = await fetch('/api/auth/me')
          if (userResponse.ok && userResponse.headers.get('content-type')?.includes('application/json')) {
            const userData = await userResponse.json()
            if (userData.success && userData.data) {
              const user = userData.data
              profileComplete = !!(user.name && user.email && user.phone)
            }
          }
        } catch (error) {
          console.warn('Erro ao verificar perfil do usuário:', error)
        }
        
        // Verificar se tem endereço configurado
        let addressComplete = false
        try {
          const addressResponse = await fetch('/api/addresses')
          if (addressResponse.ok && addressResponse.headers.get('content-type')?.includes('application/json')) {
            const addressData = await addressResponse.json()
            addressComplete = !!(addressData.success && addressData.data && addressData.data.length > 0)
          }
        } catch (error) {
          console.warn('Erro ao verificar endereços:', error)
        }
        
        // Verificar se visualizou tutoriais
        const tutorialViewed = localStorage.getItem('tutorial_introduction_viewed') === 'true'
        
        // Verificar se tem pacotes
        let hasPackages = false
        try {
          const packagesResponse = await fetch('/api/packages')
          if (packagesResponse.ok && packagesResponse.headers.get('content-type')?.includes('application/json')) {
            const packagesData = await packagesResponse.json()
            hasPackages = !!(packagesData.success && packagesData.data && packagesData.data.length > 0)
          }
        } catch (error) {
          console.warn('Erro ao verificar pacotes:', error)
        }
        
        // Atualizar estados
        setSteps(prev => prev.map(step => {
          if (step.id === 'profile') {
            return { ...step, completed: profileComplete }
          }
          if (step.id === 'address') {
            return { ...step, completed: addressComplete }
          }
          if (step.id === 'tutorial') {
            return { ...step, completed: tutorialViewed }
          }
          if (step.id === 'first-package') {
            return { ...step, completed: hasPackages }
          }
          return step
        }))
        
        // Verificar se deve mostrar a seção
        // Só esconder se o usuário explicitamente dismissou, não por completion automática
        const manuallyDismissed = localStorage.getItem('introduction_dismissed') === 'true'
        setDismissed(manuallyDismissed)
      } catch (error) {
        console.error('Erro ao verificar progresso do usuário:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkUserProgress()
  }, [])
  
  const dismissIntroduction = () => {
    localStorage.setItem('introduction_dismissed', 'true')
    setDismissed(true)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (dismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6 mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🚀</span> Primeiros passos
          </h2>
          <p className="text-gray-600 mt-1 mb-6">
            Complete estas etapas para começar a usar a plataforma
          </p>
        </div>
        <button 
          onClick={dismissIntroduction}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Fechar introdução"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {steps
          .sort((a, b) => a.priority - b.priority)
          .map((step) => (
          <Link
            key={step.id}
            href={step.link}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl">
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                <div className="mt-2 text-blue-600 text-sm font-medium flex items-center">
                  {step.completed ? 'Concluído' : 'Começar agora'}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <div className="text-sm text-gray-500">
          Progresso: {steps.filter(s => s.completed).length}/{steps.length} etapas concluídas
        </div>
      </div>
    </div>
  )
}