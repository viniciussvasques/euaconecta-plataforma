'use client'

import { useState, useEffect } from 'react'
import { Play, BookOpen, ExternalLink, Star, Clock, Eye } from 'lucide-react'

interface Tutorial {
  id: string
  title: string
  description: string
  url: string
  type: 'video' | 'article' | 'VIDEO' | 'ARTICLE'
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  duration: number
  icon: string
  rating: number
  views: number
  isHighlighted: boolean
  isActive: boolean
}

export function QuickGuide() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTutorials = async () => {
    try {
      // Forçar refresh completo
      const timestamp = Date.now()
      const random = Math.random()
      const response = await fetch(`/api/admin/tutorials?t=${timestamp}&refresh=${random}&force=${timestamp}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': '0'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Filtrar apenas tutoriais ativos e em destaque e normalizar o tipo
        const activeTutorials = data.data
          .filter((tutorial: Tutorial) => tutorial.isActive && tutorial.isHighlighted)
          .map((tutorial: Tutorial) => ({
            ...tutorial,
            type: (tutorial.type as unknown as string).toLowerCase() as 'video' | 'article'
          }))
        setTutorials(activeTutorials.slice(0, 1)) // Apenas 1 tutorial
      }
    } catch (error) {
      console.error('Erro ao carregar tutoriais:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTutorials()

    // Recarregar a cada 5 segundos para garantir dados atualizados
    const interval = setInterval(fetchTutorials, 5000)

    // Recarregar quando a página ganha foco (quando o usuário volta do admin)
    const handleFocus = () => {
      fetchTutorials()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (tutorials.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Guia Rápido</h3>
          <p className="text-gray-500 text-sm mb-3">
            Nenhum tutorial ativo no momento
          </p>
          <a
            href="/dashboard/tutorials"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium text-sm"
          >
            Ver todos os tutoriais
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Guia Rápido</h3>
            <p className="text-sm text-gray-500">Tutorial em destaque</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/dashboard/tutorials"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Ver todos
          </a>
        </div>
      </div>

      {tutorials.map((tutorial) => (
        <div
          key={tutorial.id}
          className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 hover:border-blue-200"
        >
          <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow">
                {(tutorial.type === 'video' || tutorial.type === 'VIDEO') ? (
                  <Play className="h-5 w-5 text-blue-600" />
                ) : (
                  <BookOpen className="h-5 w-5 text-purple-600" />
                )}
              </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {tutorial.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {tutorial.description}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{tutorial.duration}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{tutorial.rating}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="h-3 w-3" />
                  <span>{tutorial.views}</span>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${
                  tutorial.difficulty === 'iniciante'
                    ? 'bg-green-100 text-green-700'
                    : tutorial.difficulty === 'intermediario'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {tutorial.difficulty}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <a
                href={tutorial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                {(tutorial.type === 'video' || tutorial.type === 'VIDEO') ? 'Assistir' : 'Ler'}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
