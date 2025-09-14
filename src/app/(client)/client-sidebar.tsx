'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  suiteNumber: number | null
}

interface ClientSidebarProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function ClientSidebar({ user, isOpen, onClose }: ClientSidebarProps) {
  const pathname = usePathname()

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Meus Pacotes', href: '/dashboard/packages', icon: '📦' },
    { name: 'Minhas Caixas', href: '/dashboard/boxes', icon: '📋' },
    { name: 'Envios', href: '/dashboard/shipping', icon: '🚢' },
    { name: 'Pagamentos', href: '/dashboard/payments', icon: '💰' },
    { name: 'Histórico', href: '/dashboard/history', icon: '📊' },
  ]

  const servicesNavigation = [
    { name: 'Loja Euaconecta', href: '/dashboard/store', icon: '🛍️', badge: 'Em breve' },
    { name: 'Lojas Parceiras', href: '/dashboard/stores', icon: '🏪' },
    { name: 'Tutoriais', href: '/dashboard/tutorials', icon: '📚' },
    { name: 'Suporte', href: '/dashboard/support', icon: '🎧' },
  ]

  const userNavigation = [
    { name: 'Meu Perfil', href: '/dashboard/profile', icon: '👤' },
    { name: 'Configurações', href: '/dashboard/settings', icon: '⚙️' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Euaconecta</span>
          </div>

          {/* Main Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-6">
            {/* Principal */}
            <div>
              <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Principal
              </h3>
              <div className="space-y-1">
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Serviços */}
            <div>
              <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Serviços
              </h3>
              <div className="space-y-1">
                {servicesNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{item.icon}</span>
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* User Navigation */}
          <div className="px-2 py-4 border-t border-gray-200">
            <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Conta
            </h3>
            <nav className="space-y-1">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-900 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name || 'Usuário'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                {user.suiteNumber && (
                  <p className="text-xs text-purple-600 font-medium">Suite #{user.suiteNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 flex z-40">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <span className="sr-only">Fechar sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Logo Mobile */}
            <div className="flex items-center flex-shrink-0 px-4 pt-5">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Euaconecta</span>
            </div>

            {/* Navigation Mobile */}
            <nav className="mt-8 flex-1 px-2 space-y-6">
              {/* Principal */}
              <div>
                <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Principal
                </h3>
                <div className="space-y-1">
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-900 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                      }`}
                      onClick={onClose}
                    >
                      <span className="mr-3 text-xl">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Serviços */}
              <div>
                <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Serviços
                </h3>
                <div className="space-y-1">
                  {servicesNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-900 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                      }`}
                      onClick={onClose}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-xl">{item.icon}</span>
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* User Navigation Mobile */}
            <div className="px-2 py-4 border-t border-gray-200">
              <h3 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Conta
              </h3>
              <nav className="space-y-1">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                    onClick={onClose}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Info Mobile */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.suiteNumber && (
                    <p className="text-xs text-purple-600 font-medium">Suite #{user.suiteNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
