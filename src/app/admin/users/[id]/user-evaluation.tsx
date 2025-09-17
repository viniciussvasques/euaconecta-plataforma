'use client'

import { useState, useEffect } from 'react'

interface UserEvaluationProps {
  userId: string
}

interface EvaluationData {
  id: string
  communicationScore: number
  punctualityScore: number
  packageCareScore: number
  cooperationScore: number
  problemResolutionScore: number
  loyaltyScore: number
  overallScore: number
  strengths: string | null
  weaknesses: string | null
  recommendations: string | null
  evaluationDate: string
  lastUpdated: string
}

export function UserEvaluation({ userId }: UserEvaluationProps) {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [editData, setEditData] = useState({
    communicationScore: 5,
    punctualityScore: 5,
    packageCareScore: 5,
    cooperationScore: 5,
    problemResolutionScore: 5,
    loyaltyScore: 5,
    strengths: '',
    weaknesses: '',
    recommendations: ''
  })

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/evaluation`)
        const data = await response.json()
        if (data.success && data.data) {
          setEvaluation(data.data)
          setEditData({
            communicationScore: data.data.communicationScore,
            punctualityScore: data.data.punctualityScore,
            packageCareScore: data.data.packageCareScore,
            cooperationScore: data.data.cooperationScore,
            problemResolutionScore: data.data.problemResolutionScore,
            loyaltyScore: data.data.loyaltyScore,
            strengths: data.data.strengths || '',
            weaknesses: data.data.weaknesses || '',
            recommendations: data.data.recommendations || ''
          })
        }
      } catch (error) {
        console.error('Erro ao carregar avaliação:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvaluation()
  }, [userId])

  // const calculateOverallScore = () => {
  //   const scores = [
  //     editData.communicationScore,
  //     editData.punctualityScore,
  //     editData.packageCareScore,
  //     editData.cooperationScore,
  //     editData.problemResolutionScore,
  //     editData.loyaltyScore
  //   ]
  //   return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2)
  // }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/users/${userId}/evaluation`, {
        method: evaluation ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setEvaluation(data.data)
        setMessage({ type: 'success', text: 'Avaliação salva com sucesso!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao salvar avaliação' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (evaluation) {
      setEditData({
        communicationScore: evaluation.communicationScore,
        punctualityScore: evaluation.punctualityScore,
        packageCareScore: evaluation.packageCareScore,
        cooperationScore: evaluation.cooperationScore,
        problemResolutionScore: evaluation.problemResolutionScore,
        loyaltyScore: evaluation.loyaltyScore,
        strengths: evaluation.strengths || '',
        weaknesses: evaluation.weaknesses || '',
        recommendations: evaluation.recommendations || ''
      })
    }
    setIsEditing(false)
    setMessage(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    if (score >= 4) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excelente'
    if (score >= 8) return 'Muito Bom'
    if (score >= 7) return 'Bom'
    if (score >= 6) return 'Satisfatório'
    if (score >= 4) return 'Regular'
    return 'Ruim'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Carregando avaliação...</span>
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

      {/* Header da Avaliação */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">⭐ Avaliação Interna do Cliente</h3>
          <p className="text-sm text-gray-500">Avaliação confidencial para uso administrativo</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {evaluation ? 'Editar Avaliação' : 'Criar Avaliação'}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Nota Geral */}
      {evaluation && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Nota Geral</h4>
              <p className="text-sm text-gray-600">Média de todas as categorias</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                {evaluation.overallScore.toFixed(1)}/10
              </div>
              <p className="text-sm text-gray-600 mt-1">{getScoreLabel(evaluation.overallScore)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Categorias de Avaliação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'communicationScore', label: 'Comunicação', description: 'Resposta e clareza na comunicação' },
          { key: 'punctualityScore', label: 'Pontualidade', description: 'Pontualidade nos pagamentos e prazos' },
          { key: 'packageCareScore', label: 'Cuidado com Pacotes', description: 'Cuidado com embalagens e instruções' },
          { key: 'cooperationScore', label: 'Cooperação', description: 'Facilidade e cooperação geral' },
          { key: 'problemResolutionScore', label: 'Resolução de Problemas', description: 'Como lida com problemas e conflitos' },
          { key: 'loyaltyScore', label: 'Fidelidade', description: 'Retorno e fidelidade como cliente' }
        ].map((category) => (
          <div key={category.key} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{category.label}</h4>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
              <div className="text-right">
                {isEditing ? (
                  <select
                    value={editData[category.key as keyof typeof editData] as number}
                    onChange={(e) => setEditData({
                      ...editData,
                      [category.key]: parseInt(e.target.value)
                    })}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-900 bg-white"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                      <option key={score} value={score}>{score}</option>
                    ))}
                  </select>
                ) : evaluation ? (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${getScoreColor(evaluation[category.key as keyof EvaluationData] as number)}`}>
                    {evaluation[category.key as keyof EvaluationData]}/10
                  </div>
                ) : (
                  <span className="text-gray-400">Não avaliado</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Observações */}
      {(evaluation || isEditing) && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Observações</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pontos Fortes</label>
              {isEditing ? (
                <textarea
                  value={editData.strengths}
                  onChange={(e) => setEditData({ ...editData, strengths: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder="Descreva os pontos fortes do cliente..."
                />
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md min-h-[100px]">
                  <p className="text-sm text-gray-700">
                    {evaluation?.strengths || 'Nenhuma observação registrada'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pontos de Melhoria</label>
              {isEditing ? (
                <textarea
                  value={editData.weaknesses}
                  onChange={(e) => setEditData({ ...editData, weaknesses: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder="Descreva os pontos de melhoria..."
                />
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md min-h-[100px]">
                  <p className="text-sm text-gray-700">
                    {evaluation?.weaknesses || 'Nenhuma observação registrada'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recomendações</label>
              {isEditing ? (
                <textarea
                  value={editData.recommendations}
                  onChange={(e) => setEditData({ ...editData, recommendations: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  placeholder="Recomendações para melhorar o relacionamento..."
                />
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md min-h-[100px]">
                  <p className="text-sm text-gray-700">
                    {evaluation?.recommendations || 'Nenhuma recomendação registrada'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Informações da Avaliação */}
      {evaluation && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Avaliação criada em:</span>
              <span className="ml-2 text-gray-900">
                {new Date(evaluation.evaluationDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Última atualização:</span>
              <span className="ml-2 text-gray-900">
                {new Date(evaluation.lastUpdated).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
