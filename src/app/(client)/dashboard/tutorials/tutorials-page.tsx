'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Play,
  BookOpen,
  HelpCircle,
  Clock,
  Star,
  Grid,
  List,
  Eye
} from 'lucide-react'

interface Tutorial {
  id: string
  title: string
  description: string
  type: 'video' | 'article' | 'VIDEO' | 'ARTICLE'
  duration: number
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  url: string
  icon: string
  rating: number
  views: number
  isHighlighted: boolean
  isActive: boolean
  order: number
}

export function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'all', name: 'Todos os Tutoriais' },
    { id: 'iniciante', name: 'Iniciante' },
    { id: 'intermediario', name: 'Intermediário' },
    { id: 'avancado', name: 'Avançado' }
  ]

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
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
          // Normalizar o tipo para minúsculas para evitar divergências ('VIDEO' vs 'video')
          const normalized = data.data
            .filter((tutorial: Tutorial) => tutorial.isActive)
            .map((tutorial: Tutorial) => ({
              ...tutorial,
              type: (tutorial.type as unknown as string).toLowerCase() as 'video' | 'article'
            }))
          setTutorials(normalized)
        }
      } catch (error) {
        console.error('Erro ao carregar tutoriais:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTutorials()
  }, [])

  // Recarregar dados quando a página ganha foco (quando o usuário volta do admin)
  useEffect(() => {
    const handleFocus = () => {
      const fetchTutorials = async () => {
        try {
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
            const normalized = data.data
              .filter((tutorial: Tutorial) => tutorial.isActive)
              .map((tutorial: Tutorial) => ({
                ...tutorial,
                type: (tutorial.type as unknown as string).toLowerCase() as 'video' | 'article'
              }))
            setTutorials(normalized)
          }
        } catch (error) {
          console.error('Erro ao recarregar tutoriais:', error)
        }
      }
      fetchTutorials()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const filteredTutorials = tutorials.filter((tutorial: Tutorial) => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tutorial.difficulty === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante':
        return 'bg-green-100 text-green-800'
      case 'intermediario':
        return 'bg-yellow-100 text-yellow-800'
      case 'avancado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante':
        return 'Iniciante'
      case 'intermediario':
        return 'Intermediário'
      case 'avancado':
        return 'Avançado'
      default:
        return difficulty
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando tutoriais...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Centro de Aprendizado</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Tutoriais
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Aprenda a importar com segurança e economia. Guias completos para iniciantes e especialistas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">📚 {tutorials.length} Tutoriais</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">🎯 Dicas Práticas</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm font-medium">💰 Economia Garantida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Buscar tutoriais..."
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-12 px-4"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-12 px-4"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} encontrado{filteredTutorials.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Tutorials Grid/List */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'space-y-6'
        }>
          {filteredTutorials.map((tutorial: Tutorial) => (
            <Card key={tutorial.id} className={`group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden ${tutorial.isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              {tutorial.isHighlighted && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-center text-sm font-medium">
                  ⭐ Tutorial em Destaque
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-gray-200 group-hover:shadow-lg transition-shadow">
                      <span className="text-2xl">{tutorial.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tutorial.title}
                      </CardTitle>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {getDifficultyLabel(tutorial.difficulty)}
                  </span>
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {tutorial.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Type and Duration */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    {tutorial.type === 'video' ? (
                      <Play className="h-4 w-4 text-blue-600" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="font-medium text-gray-700 capitalize">{tutorial.type === 'video' ? 'Vídeo' : 'Artigo'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-700">{tutorial.duration} min</span>
                  </div>
                </div>

                {/* Rating and Views */}
                <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-700">{tutorial.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{tutorial.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = `/dashboard/tutorials/${tutorial.id}`}
                >
                  {tutorial.type === 'video' ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Ver Tutorial
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ler Tutorial
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum tutorial encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
