'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Star, Eye, BookOpen, Play, Share2, Printer, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Tutorial {
  id: string
  title: string
  description: string
  type: 'video' | 'article'
  duration: number
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  url: string
  icon: string
  rating: number
  views: number
  isHighlighted: boolean
  isActive: boolean
  order: number
  content?: string
  videoUrl?: string
}

interface TutorialViewerProps {
  tutorialId: string
}

function TutorialViewer({ tutorialId }: TutorialViewerProps) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const response = await fetch('/api/admin/tutorials')
        if (!response.ok) {
          throw new Error('Erro ao carregar tutorial')
        }

        const data = await response.json()
        if (data.success) {
          const foundTutorial = data.data.find((t: Tutorial) => t.id === tutorialId)
          if (foundTutorial) {
            setTutorial(foundTutorial)
          } else {
            setError('Tutorial não encontrado')
          }
        } else {
          setError('Erro ao carregar tutorial')
        }
      } catch (err) {
        console.error('Erro ao carregar tutorial:', err)
        setError('Erro ao carregar tutorial')
      } finally {
        setLoading(false)
      }
    }

    fetchTutorial()
  }, [tutorialId])

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

  const renderMarkdown = (content: string) => {
    // Enhanced markdown to HTML conversion with better styling
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mb-8 border-b-2 border-blue-200 pb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-800 mb-6 mt-10 flex items-center"><span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mr-3">$1</span></h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-700 mb-4 mt-8 flex items-center"><span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-medium text-gray-700 mb-3 mt-6">$1</h4>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900 bg-yellow-50 px-1 rounded">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-700">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="flex items-start mb-2 ml-4"><span class="text-blue-500 mr-2 mt-1">•</span><span class="text-gray-700">$1</span></li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="flex items-start mb-2 ml-4"><span class="bg-blue-100 text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">$1</span><span class="text-gray-700">$1</span></li>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-900 text-green-400 px-2 py-1 rounded text-sm font-mono border">$1</code>')
      .replace(/✅/gim, '<span class="text-green-500 text-lg">✅</span>')
      .replace(/❌/gim, '<span class="text-red-500 text-lg">❌</span>')
      .replace(/💰/gim, '<span class="text-yellow-500 text-lg">💰</span>')
      .replace(/📦/gim, '<span class="text-blue-500 text-lg">📦</span>')
      .replace(/🚚/gim, '<span class="text-purple-500 text-lg">🚚</span>')
      .replace(/🛡️/gim, '<span class="text-green-500 text-lg">🛡️</span>')
      .replace(/🔧/gim, '<span class="text-orange-500 text-lg">🔧</span>')
      .replace(/📊/gim, '<span class="text-indigo-500 text-lg">📊</span>')
      .replace(/\n\n/gim, '</p><p class="mb-6 text-gray-700 leading-relaxed text-lg">')
      .replace(/^(?!<[h|l])(.*$)/gim, '<p class="mb-6 text-gray-700 leading-relaxed text-lg">$1</p>')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando tutorial...</p>
        </div>
      </div>
    )
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tutorial não encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'O tutorial solicitado não existe.'}</p>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{tutorial.icon}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutorial.title}</h1>
                  <p className="text-gray-600 text-lg">{tutorial.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(tutorial.difficulty)} shadow-sm`}>
                {getDifficultyLabel(tutorial.difficulty)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border">
                      {tutorial.type === 'video' ? (
                        <Play className="h-5 w-5 text-blue-600" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      )}
                      <span className="font-semibold text-gray-700 capitalize">
                        {tutorial.type === 'video' ? 'Vídeo' : 'Artigo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-700">{tutorial.duration} min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-700">{tutorial.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border">
                      <Eye className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-gray-700">{tutorial.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {tutorial.content ? (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(tutorial.content)
                    }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Conteúdo não disponível
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Este tutorial ainda não possui conteúdo escrito.
                    </p>
                    {tutorial.url && (
                      <Button
                        onClick={() => window.open(tutorial.url, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {tutorial.type === 'video' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Assistir Vídeo
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Acessar Link
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Ações
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {tutorial.url && (
                  <Button
                    onClick={() => window.open(tutorial.url, '_blank')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {tutorial.type === 'video' ? (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Assistir Vídeo
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-5 w-5 mr-2" />
                        Acessar Link
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 font-semibold py-3 transition-all duration-300"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tutorial.title,
                        text: tutorial.description,
                        url: window.location.href
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copiado para a área de transferência!')
                    }
                  }}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Compartilhar
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-2 border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700 font-semibold py-3 transition-all duration-300"
                  onClick={() => window.print()}
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Imprimir
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-700 font-semibold py-3 transition-all duration-300"
                  onClick={() => {
                    const element = document.createElement('a')
                    const file = new Blob([tutorial.content || ''], { type: 'text/plain' })
                    element.href = URL.createObjectURL(file)
                    element.download = `${tutorial.title}.txt`
                    document.body.appendChild(element)
                    element.click()
                    document.body.removeChild(element)
                  }}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Baixar
                </Button>
              </CardContent>
            </Card>

            {/* Tutorial Info */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Informações
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Tipo:</span>
                  <span className="font-semibold capitalize bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{tutorial.type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Dificuldade:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${getDifficultyColor(tutorial.difficulty)}`}>
                    {getDifficultyLabel(tutorial.difficulty)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duração:</span>
                  <span className="font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{tutorial.duration} min</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Avaliação:</span>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">{tutorial.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Visualizações:</span>
                  <span className="font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">{tutorial.views.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialViewer
