import { storageService } from '@/lib/storage/storage'
import StoragePolicyForm from './storage-policy-form'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

export default async function StoragePage() {
  const policies = await storageService.getAllPolicies()
  const active = policies.find(p => p.isActive)?.id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Políticas de Armazenamento</h1>
          <p className="text-sm text-gray-700">Gerencie regras de armazenamento e cobrança após período grátis</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <StoragePolicyForm />
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Políticas Existentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-800">
                  <th className="py-3 pr-6 font-semibold">Ativa</th>
                  <th className="py-3 pr-6 font-semibold">Free Days</th>
                  <th className="py-3 pr-6 font-semibold">Flat/Dia</th>
                  <th className="py-3 pr-6 font-semibold">Max Dias</th>
                  <th className="py-3 pr-6 font-semibold">Criada</th>
                  <th className="py-3 pr-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {policies.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50/70">
                    <td className="py-3 pr-6">{p.id === active ? 'Sim' : 'Não'}</td>
                    <td className="py-3 pr-6">{p.freeDays}</td>
                    <td className="py-3 pr-6">{p.flatDailyRateUsdCents ? `$ ${(p.flatDailyRateUsdCents/100).toFixed(2)}` : '-'}</td>
                    <td className="py-3 pr-6">{p.maxDaysAllowed}</td>
                    <td className="py-3 pr-6">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="py-3 pr-6">
                      {p.id !== active && (
                        <form action={async () => { 'use server'; await storageService.setActivePolicy(p.id) }}>
                          <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm">Ativar</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
