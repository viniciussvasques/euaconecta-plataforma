'use client'

import { useState, useEffect } from 'react'
import { ClientStats, ClientRecentActivity } from './index'
import { QuickGuide } from './components/quick-guide'
import { FeaturedBlog } from './components/featured-blog'
import { CollapsiblePackages } from './components/collapsible-packages'
import { CollapsibleBoxes } from './components/collapsible-boxes'
import { CompleteProfileModal } from './components/complete-profile-modal'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
  cpf?: string | null
  phone?: string | null
}

export function ClientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCompleteProfile, setShowCompleteProfile] = useState(false)
  const [warehouse, setWarehouse] = useState<{
    id: string;
    name: string;
    address: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    instructions?: string;
  } | null>(null)
  const [storageInfo, setStorageInfo] = useState<{ remainingDays: number; usedDays: number; maxStorageDays: number } | null>(null)

  useEffect(() => {
    // Verificar se usuário está logado
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (response.ok && data.success) {
          setUser(data.data)
          // Verificar se precisa completar o perfil
          checkProfileCompletion(data.data)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const fetchFreeDays = async () => {
      try {
        const res = await fetch('/api/storage/free-days', { cache: 'no-store' })
        const data = await res.json()
        if (data.success) setStorageInfo(data.data)
      } catch {}
    }

    const fetchWarehouses = async () => {
      try {
        const w = await fetch('/api/warehouses', { cache: 'no-store' }).then(r => r.json())
        if (w.success && Array.isArray(w.data)) {
          const def = w.data.find((x: { isDefault: boolean }) => x.isDefault) || w.data[0] || null
          setWarehouse(def)
        }
      } catch {}
    }

    fetchWarehouses()
    fetchFreeDays()

    // Recarregar ao focar a aba (reflete mudanças do admin)
    const onFocus = () => {
      fetchFreeDays()
      fetchWarehouses()
    }
    window.addEventListener('focus', onFocus)

    // Atualização periódica (a cada 60s)
    const interval = setInterval(fetchFreeDays, 60000)

    return () => {
      window.removeEventListener('focus', onFocus)
      clearInterval(interval)
    }
  }, [])

  const checkProfileCompletion = async (userData: User) => {
    try {
      // Verificar se tem CPF e telefone válidos
      const hasPersonalData = userData.cpf && userData.phone &&
                             userData.cpf.trim() !== '' && userData.phone.trim() !== ''

      if (!hasPersonalData) {
        setShowCompleteProfile(true)
        return
      }

      // Verificar se tem endereços
      const response = await fetch('/api/addresses')
      const data = await response.json()


      if (data.success && data.data.length === 0) {
        setShowCompleteProfile(true)
      }
    } catch (error) {
      console.error('Erro ao verificar perfil:', error)
    }
  }

  const handleProfileComplete = (updatedUser: User) => {
    setUser(updatedUser)
    setShowCompleteProfile(false)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user.name || 'Usuário'}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo ao seu painel de controle. Aqui você pode acompanhar seus pacotes e caixas.
          </p>
          {user.suiteNumber && (
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              🏢 Suite #{user.suiteNumber}
            </div>
          )}
        </div>

        {/* Cards superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {warehouse && user.suiteNumber && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Seu endereço nos EUA</div>
              <div className="mt-2 text-gray-900 font-semibold">Suite #{user.suiteNumber}</div>
              <div className="mt-1 text-sm text-gray-700">
                {warehouse.line1}{warehouse.line2 ? `, ${warehouse.line2}` : ''}<br/>
                {warehouse.city}, {warehouse.state} {warehouse.postalCode} • {warehouse.country}
              </div>
              {warehouse.instructions && (
                <div className="mt-3 text-xs text-gray-500">{warehouse.instructions}</div>
              )}
            </div>
          )}

          {storageInfo && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Armazenamento gratuito</div>
              <div className="mt-2 text-2xl font-bold text-gray-900">{storageInfo.remainingDays} dias restantes</div>
              <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 bg-emerald-500" style={{ width: `${Math.min(100, Math.round((storageInfo.usedDays / Math.max(1, storageInfo.maxStorageDays)) * 100))}%` }} />
              </div>
              <div className="mt-1 text-xs text-gray-500">Usados: {storageInfo.usedDays} / {storageInfo.maxStorageDays} dias</div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Ações rápidas</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <a href="/dashboard/packages" className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100">Meus Pacotes</a>
              <a href="/dashboard/boxes" className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Minhas Caixas</a>
              <a href="/dashboard/shipping" className="px-3 py-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100">Envios</a>
              <a href="/dashboard/support" className="px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100">Suporte</a>
            </div>
          </div>

          <div className="xl:col-span-1">
            <QuickGuide />
          </div>
        </div>

        {/* Estatísticas */}
        <ClientStats userId={user.id} />

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Pacotes */}
          <CollapsiblePackages userId={user.id} />

          {/* Caixas */}
          <CollapsibleBoxes userId={user.id} />
        </div>

        {/* Blog em Destaque */}
        <div className="mt-8">
          <FeaturedBlog />
        </div>




        {/* Atividade Recente */}
        <div className="mt-8">
          <ClientRecentActivity userId={user.id} />
        </div>
      </div>

      {/* Modal de Completar Perfil */}
      {showCompleteProfile && user && (
        <CompleteProfileModal
          user={user}
          onComplete={handleProfileComplete}
          onSkip={() => setShowCompleteProfile(false)}
        />
      )}
    </>
  )
}
