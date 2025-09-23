import { PlatformConfig } from '@/lib/config/platform-config'
import { PlatformConfigForm } from './platform-config-form'

// Forçar renderização dinâmica para evitar cache
export const dynamic = 'force-dynamic'

export default async function PlatformConfigPage() {
  try {
    const config = await PlatformConfig.load()

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuração da Plataforma</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure os parâmetros básicos da plataforma Euaconecta
          </p>
        </div>

        {/* Configuration Form */}
        <PlatformConfigForm initialConfig={config} />
      </div>
    )
  } catch (error) {
    console.error('Erro ao carregar configuração:', error)

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuração da Plataforma</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure os parâmetros básicos da plataforma Euaconecta
          </p>
        </div>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <h3 className="text-sm font-medium">Erro ao carregar configuração</h3>
            <div className="mt-2 text-sm">
              Não foi possível carregar a configuração da plataforma.
              Verifique se o banco de dados está funcionando e tente novamente.
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
