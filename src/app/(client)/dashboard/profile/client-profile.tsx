'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
  cpf?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  createdAt: string
  lastLogin?: string
}

interface Address {
  id: string
  name: string
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export function ClientProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [saving, setSaving] = useState(false)
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (response.ok && data.success) {
          setUser(data.data)
          setFormData(data.data)

          // Carregar endereços do usuário e definir o padrão
          try {
            const addrRes = await fetch('/api/addresses')
            const addrData = await addrRes.json()
            if (addrRes.ok && addrData.success) {
              const addresses: Address[] = addrData.data || []
              const preferred = addresses.find((a) => a.isDefault) || addresses[0] || null
              setDefaultAddress(preferred)
            }
          } catch (addrErr) {
            console.error('Erro ao carregar endereços:', addrErr)
          }
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setUser(data.data)
        setEditing(false)
        alert('Perfil atualizado com sucesso!')
      } else {
        alert('Erro ao atualizar perfil: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="mt-2 text-gray-600">
          Gerencie suas informações pessoais e configurações da conta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações Básicas */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Informações Pessoais</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">O email não pode ser alterado</p>
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.cpf || ''}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="000.000.000-00"
                  />
                ) : (
                  <p className="text-gray-900">{user.cpf || 'Não informado'}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="+55 (11) 99999-9999"
                  />
                ) : (
                  <p className="text-gray-900">{user.phone || 'Não informado'}</p>
                )}
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <p className="text-gray-900">
                  {defaultAddress
                    ? `${defaultAddress.line1}${defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}`
                    : 'Não informado'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Gerencie em Configurações → Endereços</p>
              </div>

              {/* Cidade, Estado, CEP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <p className="text-gray-900">{defaultAddress?.city || 'Não informado'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <p className="text-gray-900">{defaultAddress?.state || 'Não informado'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <p className="text-gray-900">{defaultAddress?.postalCode || 'Não informado'}</p>
                </div>
              </div>

              {/* Botões de Ação */}
              {editing && (
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setFormData(user)
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações da Conta */}
        <div className="space-y-6">
          {/* Suite Number */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Conta</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Suite Number</label>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">
                    #{user.suiteNumber || 'N/A'}
                  </span>
                  {!user.suiteNumber && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/users/me/generate-suite', {
                            method: 'POST'
                          })
                          const data = await response.json()
                          
                          if (response.ok && data.success) {
                            setUser(data.data)
                            alert('Suite gerada com sucesso!')
                          } else {
                            alert('Erro ao gerar suite: ' + (data.error || 'Erro desconhecido'))
                          }
                        } catch (error) {
                          console.error('Erro ao gerar suite:', error)
                          alert('Erro ao gerar suite')
                        }
                      }}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                    >
                      Gerar Suite
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Seu endereço interno para envios
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Membro desde</label>
                <p className="text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </p>
              </div>

              {user.lastLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Último acesso</label>
                  <p className="text-gray-900">
                    {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                ⚙️ Configurações
              </button>
              <button
                onClick={() => router.push('/dashboard/history')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                📊 Histórico Completo
              </button>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja sair?')) {
                    fetch('/api/auth/logout', { method: 'POST' })
                      .then(() => router.push('/auth/login'))
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                🚪 Sair da Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
