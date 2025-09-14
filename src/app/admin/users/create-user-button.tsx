'use client'

import { useState } from 'react'

type UserRole = 'CLIENT' | 'ADMIN'

export function CreateUserButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT' as UserRole,
    canManageUsers: false,
    canManageConsolidations: false,
    canManagePackages: false,
    canManageCarriers: false,
    canViewFinancials: false,
    canManageSettings: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          canManageUsers: formData.canManageUsers,
          canManageConsolidations: formData.canManageConsolidations,
          canManagePackages: formData.canManagePackages,
          canManageCarriers: formData.canManageCarriers,
          canViewFinancials: formData.canViewFinancials,
          canManageSettings: formData.canManageSettings
        }),
      })

      if (response.ok) {
        setIsOpen(false)
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'CLIENT',
          canManageUsers: false,
          canManageConsolidations: false,
          canManagePackages: false,
          canManageCarriers: false,
          canViewFinancials: false,
          canManageSettings: false
        })
        // Recarregar a página para mostrar o novo usuário
        window.location.reload()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar usuário')
      }
      } catch {
      setError('Erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }))
    
    // Definir permissões padrão baseadas no role
    if (role === 'ADMIN') {
      setFormData(prev => ({
        ...prev,
        canManageUsers: true,
        canManageConsolidations: true,
        canManagePackages: true,
        canManageCarriers: true,
        canViewFinancials: true,
        canManageSettings: true
      }))
    } else if (role === 'CLIENT') {
      setFormData(prev => ({
        ...prev,
        canManageUsers: false,
        canManageConsolidations: false,
        canManagePackages: false,
        canManageCarriers: false,
        canViewFinancials: false,
        canManageSettings: false
      }))
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Novo Usuário
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Criar Novo Usuário</h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Senha</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  >
                    <option value="CLIENT">Cliente</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Permissões</label>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="canManageUsers"
                      checked={formData.canManageUsers}
                      onChange={(e) => setFormData(prev => ({ ...prev, canManageUsers: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="canManageUsers" className="ml-2 block text-sm text-gray-900">
                      Gerenciar Usuários
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="canManageConsolidations"
                      checked={formData.canManageConsolidations}
                      onChange={(e) => setFormData(prev => ({ ...prev, canManageConsolidations: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="canManageConsolidations" className="ml-2 block text-sm text-gray-900">
                      Gerenciar Consolidações
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="canManagePackages"
                      checked={formData.canManagePackages}
                      onChange={(e) => setFormData(prev => ({ ...prev, canManagePackages: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="canManagePackages" className="ml-2 block text-sm text-gray-900">
                      Gerenciar Pacotes
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="canManageCarriers"
                      checked={formData.canManageCarriers}
                      onChange={(e) => setFormData(prev => ({ ...prev, canManageCarriers: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="canManageCarriers" className="ml-2 block text-sm text-gray-900">
                      Gerenciar Transportadoras
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="canViewFinancials"
                      checked={formData.canViewFinancials}
                      onChange={(e) => setFormData(prev => ({ ...prev, canViewFinancials: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="canViewFinancials" className="ml-2 block text-sm text-gray-900">
                      Ver Dados Financeiros
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="canManageSettings"
                      checked={formData.canManageSettings}
                      onChange={(e) => setFormData(prev => ({ ...prev, canManageSettings: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="canManageSettings" className="ml-2 block text-sm text-gray-900">
                      Gerenciar Configurações
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Criando...' : 'Criar Usuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
