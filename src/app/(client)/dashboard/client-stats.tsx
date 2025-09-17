'use client'

import { useState, useEffect } from 'react'

interface ClientStatsProps {
  userId: string
}

interface Stats {
  totalPackages: number
  activeBoxes: number
  shippedBoxes: number
  totalSpent: number
}

export function ClientStats({ userId }: ClientStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalPackages: 0,
    activeBoxes: 0,
    shippedBoxes: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/stats`)
        const data = await response.json()

        if (response.ok && data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total de Pacotes',
      value: stats.totalPackages || 0,
      icon: '📦',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Caixas Ativas',
      value: stats.activeBoxes || 0,
      icon: '📋',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Caixas Enviadas',
      value: stats.shippedBoxes || 0,
      icon: '🚢',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Gasto',
      value: `$${(stats.totalSpent || 0).toFixed(2)}`,
      icon: '💰',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className={`p-4 rounded-xl ${stat.bgColor} group-hover:shadow-lg transition-shadow`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.textColor} group-hover:scale-105 transition-transform`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
