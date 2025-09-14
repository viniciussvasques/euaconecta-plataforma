'use client'

import { useState, useEffect } from 'react'

interface ClientRecentActivityProps {
  userId: string
}

interface Activity {
  id: string
  type: 'package' | 'consolidation' | 'payment' | 'shipment'
  title: string
  description: string
  date: string
  status?: string
}

export function ClientRecentActivity({ userId }: ClientRecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/history?limit=10`)
        const data = await response.json()
        
        if (response.ok && data.success) {
          setActivities(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar atividades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'package':
        return '📦'
      case 'consolidation':
        return '📋'
      case 'payment':
        return '💰'
      case 'shipment':
        return '🚢'
      default:
        return '📄'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'package':
        return 'bg-blue-100 text-blue-600'
      case 'consolidation':
        return 'bg-green-100 text-green-600'
      case 'payment':
        return 'bg-yellow-100 text-yellow-600'
      case 'shipment':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Atividade Recente</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Atividade Recente</h3>
        <a
          href="/dashboard/history"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Ver histórico completo
        </a>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">Nenhuma atividade ainda</p>
          <p className="text-sm text-gray-400 mt-1">
            Suas atividades aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.date).toLocaleString('pt-BR')}
                </p>
              </div>
              {activity.status && (
                <div className="flex-shrink-0">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {activity.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
