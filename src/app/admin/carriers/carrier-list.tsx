'use client'

import { CarrierData } from '@/lib/freight/carriers'
import { EditCarrierButton } from './edit-carrier-button'
import { DeleteCarrierButton } from './delete-carrier-button'
import { ToggleActiveButton } from './toggle-active-button'
import { TestConnectionButton } from './test-connection-button'
import { ConfigureCredentialsButton } from './configure-credentials-button'

interface CarrierListProps {
  carriers: CarrierData[]
}

export function CarrierList({ carriers }: CarrierListProps) {
  if (carriers.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma transportadora</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece criando sua primeira transportadora para configurar taxas e serviços de envio.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-4 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Transportadoras Configuradas
        </h3>
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <table className="min-w-[900px] sm:min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa/kg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seguro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  API
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credenciais
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carriers.map((carrier) => (
                <tr key={carrier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {carrier.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{carrier.name}</div>
                        {carrier.description && (
                          <div className="text-sm text-gray-500">{carrier.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {carrier.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${carrier.baseRate.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${carrier.ratePerKg.toFixed(2)}/kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {carrier.insuranceAvailable ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {carrier.insuranceRate}%
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Não
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {carrier.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {carrier.isActive ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Inativa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TestConnectionButton carrier={carrier} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ConfigureCredentialsButton
                      carrier={carrier}
                      onCredentialsSaved={() => window.location.reload()}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <ToggleActiveButton
                        carrierId={carrier.id}
                        isActive={carrier.isActive}
                        onToggle={async (id, isActive) => {
                          // TODO: Implementar toggle de status
                          console.log('Toggle carrier:', id, isActive)
                        }}
                      />
                      <EditCarrierButton carrier={carrier} />
                      <DeleteCarrierButton carrierId={carrier.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
