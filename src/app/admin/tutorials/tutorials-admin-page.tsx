'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Play, BookOpen, ExternalLink, Save, X } from 'lucide-react'

interface Tutorial {
  id: string
  title: string
  description: string
  type: 'video' | 'article' | 'VIDEO' | 'ARTICLE'
  duration: number
  difficulty: 'iniciante' | 'intermediario' | 'avancado' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  url: string
  icon: string
  rating: number
  views: number
  isHighlighted: boolean
  isActive: boolean
  order: number
  createdAt?: string
  updatedAt?: string
}

export function TutorialsAdminPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'article',
    duration: 0,
    difficulty: 'iniciante' as 'iniciante' | 'intermediario' | 'avancado',
    url: '',
    icon: '📚',
    rating: 5,
    views: 0,
    isHighlighted: false,
    isActive: true,
    order: 0
  })

  useEffect(() => {
    fetchTutorials()
  }, [])

  const fetchTutorials = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/tutorials?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success) {
        setTutorials(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar tutoriais:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const endpoint = editingTutorial
        ? `/api/admin/tutorials/${editingTutorial.id}`
        : '/api/admin/tutorials'

      const method = editingTutorial ? 'PUT' : 'POST'

      // Normalizar payload
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        duration: formData.duration,
        difficulty: formData.difficulty,
        url: formData.url,
        icon: formData.icon,
        rating: formData.rating,
        views: formData.views,
        isHighlighted: formData.isHighlighted,
        isActive: formData.isActive,
        order: formData.order
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        await fetchTutorials()
        closeModal()
      }
    } catch (error) {
      console.error('Erro ao salvar tutorial:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial)
    const normalizedType = (tutorial.type as string).toLowerCase() as 'video' | 'article'
    const normalizedDifficulty = (
      tutorial.difficulty === 'BEGINNER' ? 'iniciante' :
      tutorial.difficulty === 'INTERMEDIATE' ? 'intermediario' :
      tutorial.difficulty === 'ADVANCED' ? 'avancado' :
      (tutorial.difficulty as 'iniciante' | 'intermediario' | 'avancado')
    )
    setFormData({
      title: tutorial.title,
      description: tutorial.description,
      type: normalizedType,
      duration: tutorial.duration,
      difficulty: normalizedDifficulty,
      url: tutorial.url || '',
      icon: tutorial.icon || '📚',
      rating: tutorial.rating ?? 5,
      views: tutorial.views ?? 0,
      isHighlighted: tutorial.isHighlighted ?? false,
      isActive: tutorial.isActive,
      order: tutorial.order ?? 0
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tutorial?')) return

    try {
      const response = await fetch(`/api/admin/tutorials/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchTutorials()
      }
    } catch (error) {
      console.error('Erro ao excluir tutorial:', error)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTutorial(null)
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: 0,
      difficulty: 'iniciante',
      url: '',
      icon: '📚',
      rating: 5,
      views: 0,
      isHighlighted: false,
      isActive: true,
      order: 0
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    const d = difficulty.toLowerCase()
    switch (d) {
      case 'iniciante': return 'bg-green-100 text-green-800'
      case 'intermediario': return 'bg-yellow-100 text-yellow-800'
      case 'avancado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    const d = difficulty.toLowerCase()
    switch (d) {
      case 'iniciante': return 'Iniciante'
      case 'intermediario': return 'Intermediário'
      case 'avancado': return 'Avançado'
      default: return difficulty
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Tutoriais</h1>
        <p className="mt-2 text-gray-600">Adicione e gerencie tutoriais para o centro de aprendizado</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''} cadastrado{tutorials.length !== 1 ? 's' : ''}
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Tutorial
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando tutoriais...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {(String(tutorial.type).toLowerCase() === 'video') ? (
                      <Play className="w-5 h-5 text-red-500" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="text-sm font-medium text-gray-500">
                      {String(tutorial.type).toLowerCase() === 'video' ? 'Vídeo' : 'Artigo'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(tutorial)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tutorial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Dificuldade:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {getDifficultyText(tutorial.difficulty)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duração:</span>
                    <span className="text-sm font-medium">{tutorial.duration} min</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tutorial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tutorial.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {tutorial.url && (
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(tutorial.url, '_blank')}
                        className="w-full"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir Link
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingTutorial ? 'Editar Tutorial' : 'Adicionar Tutorial'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="video"
                        checked={formData.type === 'video'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'video' | 'article' })}
                        className="mr-2"
                      />
                      Vídeo
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="article"
                        checked={formData.type === 'article'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'video' | 'article' })}
                        className="mr-2"
                      />
                      Artigo
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              {formData.type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="url">URL do Vídeo (YouTube, Vimeo, etc.)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              )}

              {formData.type === 'article' && (
                <div className="space-y-2">
                  <Label htmlFor="url">URL do Artigo</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value="iniciante"
                        checked={formData.difficulty === 'iniciante'}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'iniciante' | 'intermediario' | 'avancado' })}
                        className="mr-2"
                      />
                      Iniciante
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value="intermediario"
                        checked={formData.difficulty === 'intermediario'}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'iniciante' | 'intermediario' | 'avancado' })}
                        className="mr-2"
                      />
                      Intermediário
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value="avancado"
                        checked={formData.difficulty === 'avancado'}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'iniciante' | 'intermediario' | 'avancado' })}
                        className="mr-2"
                      />
                      Avançado
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Tutorial ativo</Label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : editingTutorial ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
