import { Suspense } from 'react'
import { PackageList } from './package-list'
import { CreatePackageButton } from './create-package-button'
import { PackageStats } from './package-stats'

export default function PackagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Pacotes</h1>
        <div className="flex items-center gap-2">
          <CreatePackageButton />
        </div>
      </div>

      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <PackageStats />
      </Suspense>

      <Suspense fallback={<div>Carregando pacotes...</div>}>
        <PackageList />
      </Suspense>
    </div>
  )
}
