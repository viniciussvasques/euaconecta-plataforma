import type { Metadata } from 'next'
import { AuthProvider } from './auth-provider'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { ShellProvider } from './ui-shell-context'

export const metadata: Metadata = {
  title: 'Admin - Euaconecta',
  description: 'Área administrativa da plataforma Euaconecta',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ShellProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
              {children}
            </main>
          </div>
        </div>
      </ShellProvider>
    </AuthProvider>
  )
}
