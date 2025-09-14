'use client'

import { useState } from 'react'
import { UserWithPermissions } from '@/lib/users'

interface UserQuickActionsProps {
  user: UserWithPermissions
  onUserUpdate: (user: UserWithPermissions) => void
}

export function UserQuickActions({ user, onUserUpdate }: UserQuickActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    role: user.role
  })
  const [suiteNumber, setSuiteNumber] = useState(user.suiteNumber?.toString() || '')
  const [isEditingSuite, setIsEditingSuite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onUserUpdate(data.data)
        setMessage({ type: 'success', text: 'Usuário atualizado com sucesso!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar usuário' })
      }
      } catch {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSuite = async () => {
    if (user.role !== 'CLIENT') {
      setMessage({ type: 'error', text: 'Apenas clientes podem ter suites' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/users/${user.id}/generate-suite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onUserUpdate(data.data)
        setSuiteNumber(data.data.suiteNumber?.toString() || '')
        setMessage({ type: 'success', text: `Suite #${data.data.suiteNumber} gerada com sucesso!` })
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao gerar suite' })
      }
      } catch {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.role
    })
    setIsEditing(false)
    setMessage(null)
  }

  const handleToggleStatus = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const newStatus = !user.isActive
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onUserUpdate(data.data)
        setMessage({ 
          type: 'success', 
          text: `Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso!` 
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao alterar status' })
      }
      } catch {
      setMessage({ type: 'error', text: 'Erro de conexão' })
    } finally {
      setLoading(false)
    }
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

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edição Rápida */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">✏️ Edição Rápida</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Editar
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                />
              ) : (
                <p className="mt-1 text-gray-900">{user.name || 'Usuário'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                />
              ) : (
                <p className="mt-1 text-gray-900">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Função</label>
              {isEditing ? (
                <select
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value as 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'MANAGER' | 'CLIENT' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                >
                  <option value="CLIENT">Cliente</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="OPERATOR">Operador</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="SUPPORT">Suporte</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-900">
                  {user.role === 'CLIENT' ? 'Cliente' : 
                   user.role === 'ADMIN' ? 'Administrador' :
                   user.role === 'OPERATOR' ? 'Operador' :
                   user.role === 'MANAGER' ? 'Gerente' : 'Suporte'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ações de Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Ações Rápidas</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Status da Conta</p>
                <p className="text-sm text-gray-500">
                  {user.isActive ? 'Conta ativa' : 'Conta desativada'}
                </p>
              </div>
              <button
                onClick={handleToggleStatus}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  user.isActive
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {loading ? 'Processando...' : user.isActive ? 'Desativar' : 'Ativar'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Redefinir Senha</p>
                <p className="text-sm text-gray-500">Enviar email de redefinição</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Enviar
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Histórico de Login</p>
                <p className="text-sm text-gray-500">Ver acessos recentes</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Ver
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Exportar Dados</p>
                <p className="text-sm text-gray-500">Baixar dados do usuário</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gerenciamento de Suite - Apenas para Clientes */}
      {user.role === 'CLIENT' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Gerenciamento de Suite</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Número da Suite</p>
                <p className="text-sm text-gray-500">
                  {user.suiteNumber ? `Suite #${user.suiteNumber}` : 'Nenhuma suite atribuída'}
                </p>
              </div>
              <div className="flex space-x-2">
                {!user.suiteNumber && (
                  <button
                    onClick={handleGenerateSuite}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Gerando...' : 'Gerar Suite'}
                  </button>
                )}
                {user.suiteNumber && (
                  <button
                    onClick={handleGenerateSuite}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? 'Gerando...' : 'Nova Suite'}
                  </button>
                )}
              </div>
            </div>

            {user.suiteNumber && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Endereço Interno:</strong> Suite #{user.suiteNumber}, Euaconecta LTDA
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Este é o endereço que o cliente deve usar para envios
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informações de Conta */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Informações da Conta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Datas Importantes</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Criado em:</span>
                <span className="text-gray-900">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Última atualização:</span>
                <span className="text-gray-900">{new Date(user.updatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
              {user.lastLogin && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Último login:</span>
                  <span className="text-gray-900">{new Date(user.lastLogin).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Permissões</h4>
            <div className="space-y-1 text-sm">
              {user.canManageUsers && <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Gerenciar Usuários</span>}
              {user.canManageConsolidations && <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Gerenciar Consolidações</span>}
              {user.canManagePackages && <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Gerenciar Pacotes</span>}
              {user.canManageCarriers && <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Gerenciar Transportadoras</span>}
              {user.canViewFinancials && <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Ver Financeiro</span>}
              {user.canManageSettings && <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">Gerenciar Configurações</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
