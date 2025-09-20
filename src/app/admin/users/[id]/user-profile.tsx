'use client'

import { useState } from 'react'
import { UserWithPermissions } from '@/lib/auth/users'
import { UserStats } from './user-stats'
import { UserEvaluation } from './user-evaluation'
import { UserObservations } from './user-observations'
import { UserHistory } from './user-history'
import { UserQuickActions } from './user-quick-actions'

interface UserProfileProps {
  user: UserWithPermissions
}

export function UserProfile({ user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState(user)

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'history', label: 'Histórico', icon: '📋' },
    { id: 'evaluation', label: 'Avaliação', icon: '⭐' },
    { id: 'observations', label: 'Observações', icon: '📝' },
    { id: 'actions', label: 'Ações Rápidas', icon: '⚡' }
  ]

  return (
    <div className="space-y-6">
      {/* Header do Usuário */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {userData.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  userData.role === 'CLIENT' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userData.role === 'CLIENT' ? 'Cliente' : 'Administrador'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  userData.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {userData.isActive ? 'Ativo' : 'Inativo'}
                </span>
                {userData.role === 'CLIENT' && userData.suiteNumber && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Suite #{userData.suiteNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Membro desde</p>
            <p className="font-medium text-gray-900">
              {new Date(userData.createdAt).toLocaleDateString('pt-BR')}
            </p>
            {userData.lastLogin && (
              <>
                <p className="text-sm text-gray-500 mt-2">Último acesso</p>
                <p className="font-medium text-gray-900">
                  {new Date(userData.lastLogin).toLocaleDateString('pt-BR')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <UserStats userId={userData.id} />
          )}
          
          {activeTab === 'history' && (
            <UserHistory userId={userData.id} />
          )}
          
          {activeTab === 'evaluation' && (
            <UserEvaluation userId={userData.id} />
          )}
          
          {activeTab === 'observations' && (
            <UserObservations userId={userData.id} />
          )}
          
          {activeTab === 'actions' && (
            <UserQuickActions user={userData} onUserUpdate={setUserData} />
          )}
        </div>
      </div>
    </div>
  )
}
