'use client'

import { useState, useEffect } from 'react'

interface UserObservationsProps {
  userId: string
}

interface Observation {
  id: string
  title: string
  content: string
  category: string
  priority: string
  createdBy: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export function UserObservations({ userId }: UserObservationsProps) {
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [newObservation, setNewObservation] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    isPrivate: true
  })

  useEffect(() => {
    const loadObservations = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/observations`)
        const data = await response.json()
        if (data.success) {
          setObservations(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar observações:', error)
      } finally {
        setLoading(false)
      }
    }

    loadObservations()
  }, [userId])

  const handleCreate = async () => {
    if (!newObservation.title.trim() || !newObservation.content.trim()) {
      setMessage({ type: 'error', text: 'Título e conteúdo são obrigatórios' })
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}/observations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newObservation),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setObservations([data.data, ...observations])
        setNewObservation({
          title: '',
          content: '',
          category: 'GENERAL',
          priority: 'MEDIUM',
          isPrivate: true
        })
        setIsCreating(false)
        setMessage({ type: 'success', text: 'Observação criada com sucesso!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao criar observação' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'GENERAL': return '📝'
      case 'PAYMENT': return '💰'
      case 'COMMUNICATION': return '💬'
      case 'PACKAGE': return '📦'
      case 'SUPPORT': return '🎧'
      default: return '📄'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'GENERAL': return 'Geral'
      case 'PAYMENT': return 'Pagamento'
      case 'COMMUNICATION': return 'Comunicação'
      case 'PACKAGE': return 'Pacote'
      case 'SUPPORT': return 'Suporte'
      default: return 'Outro'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Carregando observações...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mensagem de Status */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">📝 Observações Administrativas</h3>
          <p className="text-sm text-gray-500">Observações internas sobre o cliente</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Nova Observação
        </button>
      </div>

      {/* Formulário de Nova Observação */}
      {isCreating && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Criar Nova Observação</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={newObservation.title}
                onChange={(e) => setNewObservation({ ...newObservation, title: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="Título da observação..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select
                  value={newObservation.category}
                  onChange={(e) => setNewObservation({ ...newObservation, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                >
                  <option value="GENERAL">Geral</option>
                  <option value="PAYMENT">Pagamento</option>
                  <option value="COMMUNICATION">Comunicação</option>
                  <option value="PACKAGE">Pacote</option>
                  <option value="SUPPORT">Suporte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                <select
                  value={newObservation.priority}
                  onChange={(e) => setNewObservation({ ...newObservation, priority: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Conteúdo</label>
              <textarea
                value={newObservation.content}
                onChange={(e) => setNewObservation({ ...newObservation, content: e.target.value })}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                placeholder="Descreva a observação..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={newObservation.isPrivate}
                onChange={(e) => setNewObservation({ ...newObservation, isPrivate: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                Observação privada (apenas para administradores)
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Criar Observação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Observações */}
      {observations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma observação registrada
        </div>
      ) : (
        <div className="space-y-4">
          {observations.map((observation) => (
            <div key={observation.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getCategoryIcon(observation.category)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{observation.title}</h4>
                      <span className="text-xs text-gray-500">
                        {getCategoryLabel(observation.category)}
                      </span>
                      {observation.isPrivate && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Privada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{observation.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        Criado em {new Date(observation.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      {observation.updatedAt !== observation.createdAt && (
                        <span>
                          Atualizado em {new Date(observation.updatedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(observation.priority)}`}>
                  {observation.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
