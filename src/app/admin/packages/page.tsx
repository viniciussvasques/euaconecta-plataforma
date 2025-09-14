import { Suspense } from 'react'
import { PackageList } from './package-list'
import { CreatePackageButton } from './create-package-button'
import { PackageStats } from './package-stats'

export default function PackagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Pacotes</h1>
        <CreatePackageButton />
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
