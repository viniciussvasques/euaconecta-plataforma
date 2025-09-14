import type { Metadata } from 'next'
import { AuthProvider } from './auth-provider'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

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
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
