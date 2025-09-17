'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UserWithPermissions, UserRole } from '@/lib/users'

interface UserListProps {
  users: UserWithPermissions[]
}

export function UserList({ users }: UserListProps) {
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserWithPermissions>>({})

  const handleEdit = (user: UserWithPermissions) => {
    setEditingUser(user.id)
    setEditForm({
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      canManageUsers: user.canManageUsers,
      canManageConsolidations: user.canManageConsolidations,
      canManagePackages: user.canManagePackages,
      canManageCarriers: user.canManageCarriers,
      canViewFinancials: user.canViewFinancials,
      canManageSettings: user.canManageSettings
    })
  }

  const handleSave = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        setEditingUser(null)
        setEditForm({})
        window.location.reload() // Recarregar para mostrar mudanças
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const handleCancel = () => {
    setEditingUser(null)
    setEditForm({})
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800'
      case 'ADMIN':
        return 'bg-orange-100 text-orange-800'
      case 'OPERATOR':
        return 'bg-purple-100 text-purple-800'
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800'
      case 'SUPPORT':
        return 'bg-indigo-100 text-indigo-800'
      case 'CLIENT':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin'
      case 'ADMIN':
        return 'Administrador'
      case 'OPERATOR':
        return 'Operador'
      case 'MANAGER':
        return 'Gerente'
      case 'SUPPORT':
        return 'Suporte'
      case 'CLIENT':
        return 'Cliente'
      default:
        return role
    }
  }

  return (
    <div className="-mx-4 sm:mx-0 overflow-x-auto">
      <table className="min-w-[900px] sm:min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Permissões
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Último Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name || 'Usuário'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    {user.role === 'CLIENT' && user.suiteNumber && (
                      <div className="text-xs text-purple-600 font-medium">
                        Suite #{user.suiteNumber}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {editingUser === user.id ? (
                  <select
                    value={editForm.role || user.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 bg-white"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="OPERATOR">Operador</option>
                    <option value="MANAGER">Gerente</option>
                    <option value="SUPPORT">Suporte</option>
                    <option value="CLIENT">Cliente</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {editingUser === user.id ? (
                  <select
                    value={editForm.isActive?.toString() || user.isActive.toString()}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 text-gray-900 bg-white"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                )}
              </td>

              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 space-y-1">
                  {editingUser === user.id ? (
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.canManageUsers || false}
                          onChange={(e) => setEditForm(prev => ({ ...prev, canManageUsers: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-xs">Gerenciar Usuários</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.canManageConsolidations || false}
                          onChange={(e) => setEditForm(prev => ({ ...prev, canManageConsolidations: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-xs">Gerenciar Consolidações</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.canViewFinancials || false}
                          onChange={(e) => setEditForm(prev => ({ ...prev, canViewFinancials: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-xs">Ver Financeiro</span>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {user.canManageUsers && <span className="block text-xs text-blue-600">• Gerenciar Usuários</span>}
                      {user.canManageConsolidations && <span className="block text-xs text-blue-600">• Gerenciar Consolidações</span>}
                      {user.canViewFinancials && <span className="block text-xs text-blue-600">• Ver Financeiro</span>}
                      {!user.canManageUsers && !user.canManageConsolidations && !user.canViewFinancials && (
                        <span className="text-xs text-gray-500">Permissões básicas</span>
                      )}
                    </div>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastLogin ? (
                  new Date(user.lastLogin).toLocaleDateString('pt-BR')
                ) : (
                  'Nunca'
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingUser === user.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleSave(user.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      👤 Perfil
                    </Link>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      ✏️ Editar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
