import { consolidationService } from '@/lib/consolidation/consolidation'
import { ConsolidationManager } from './consolidation-manager'
import CreateConsolidationButton from './create-consolidation-button'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

// interface ConsolidationGroup {
//   id: string
//   name?: string
//   status: string
//   userId: string
//   createdAt: Date
//   updatedAt: Date
//   consolidationType?: string
//   consolidationFee?: number
//   storageFee?: number
//   extraProtection?: boolean
//   finalWeightGrams?: number
//   trackingCode?: string
//   user?: { id: string; name: string; email: string }
//   deliveryAddress?: { name: string; line1: string; line2?: string; city: string; state: string; postalCode: string; country: string }
//   packages?: Array<{
//     id: string
//     description?: string
//     weightGrams?: number
//     status: string
//     createdAt: Date
//   }>
//   consolidationDeadline?: Date
//   shippingDeadline?: Date
// }

export default async function ConsolidationPage() {
  // Buscar consolidações por status
  const openConsolidations = await consolidationService.getByStatus('OPEN')
  const pendingConsolidations = await consolidationService.getByStatus('PENDING')
  const inProgressConsolidations = await consolidationService.getByStatus('IN_PROGRESS')
  const readyToShipConsolidations = await consolidationService.getByStatus('READY_TO_SHIP')
  const shippedConsolidations = await consolidationService.getByStatus('SHIPPED')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Consolidações</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie solicitações de consolidação e acompanhe o progresso
          </p>
        </div>
        <CreateConsolidationButton />
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Abertas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {openConsolidations.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pendentes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingConsolidations.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Em Progresso
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {inProgressConsolidations.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Prontas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {readyToShipConsolidations.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Enviadas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {shippedConsolidations.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Consolidações */}
      <ConsolidationManager
        initialOpenConsolidations={openConsolidations}
        initialPendingConsolidations={pendingConsolidations}
        initialInProgressConsolidations={inProgressConsolidations}
        initialReadyToShipConsolidations={readyToShipConsolidations}
        initialShippedConsolidations={shippedConsolidations}
      />
    </div>
  )
}
