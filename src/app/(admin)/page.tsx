export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="mt-2 text-sm text-gray-700">
          Resumo operacional da plataforma Euaconecta
        </p>
      </div>

      {/* Simple Test Content */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Teste de Rota Admin
        </h3>
        <p className="text-gray-600">
          Se você está vendo esta página, a rota /admin está funcionando corretamente!
        </p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            ✅ Rota admin funcionando - Próximo passo: integrar com Prisma
          </p>
        </div>
      </div>
    </div>
  )
}
