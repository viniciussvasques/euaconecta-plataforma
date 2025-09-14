'use client'

import { ConsolidationGroupData } from '@/lib/consolidation'
import { UpdateConsolidationButton } from './update-consolidation-button'
import { EditConsolidationButton } from './edit-consolidation-button'

interface ConsolidationListProps {
  consolidations: ConsolidationGroupData[]
  type?: 'pending' | 'in_progress'
  onStatusUpdate?: (id: string, status: string) => void
  onEdit?: (id: string) => void
}

export function ConsolidationList({ consolidations, type = 'pending', onStatusUpdate, onEdit }: ConsolidationListProps) {
  if (consolidations.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {type === 'pending' ? 'Nenhuma consolidação pendente' : 'Nenhuma consolidação em progresso'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {type === 'pending' 
            ? 'Todas as consolidações foram processadas ou não há solicitações pendentes.'
            : 'Todas as consolidações foram concluídas ou não há trabalhos em andamento.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <div className="space-y-4">
        {consolidations.map((consolidation) => (
          <div key={consolidation.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {consolidation.packages.length}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Consolidação #{consolidation.id.slice(-8)}
                    </h4>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {consolidation.packages.length} pacote{consolidation.packages.length !== 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span>
                        {consolidation.consolidationType === 'SIMPLE' ? 'Simple' : 'Repack'}
                      </span>
                      <span>•</span>
                      <span>
                        Peso: {consolidation.finalWeightGrams ? `${(consolidation.finalWeightGrams / 1000).toFixed(2)}kg` : 'N/A'}
                      </span>
                      <span>•</span>
                      <span>
                        Taxa: ${consolidation.consolidationFee.toFixed(2)}
                      </span>
                      <span>•</span>
                      <span>
                        Armazenamento: ${consolidation.storageFee.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Informações do usuário */}
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Cliente:</span> {consolidation.user?.name || 'N/A'} ({consolidation.user?.email || 'N/A'})
                    </div>
                    
                    {/* Endereço de entrega */}
                    {consolidation.deliveryAddress && (
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Entrega:</span> {consolidation.deliveryAddress.city}, {consolidation.deliveryAddress.state}
                      </div>
                    )}
                    
                    {/* Código de rastreamento */}
                    {consolidation.trackingCode && (
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Rastreamento:</span> 
                        <span className="ml-1 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {consolidation.trackingCode}
                        </span>
                      </div>
                    )}
                    {consolidation.customInstructions && (
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Instruções:</span> {consolidation.customInstructions}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  type === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {type === 'pending' ? 'Pendente' : 'Em Progresso'}
                </span>
                
                <EditConsolidationButton 
                  consolidation={consolidation}
                />
                <UpdateConsolidationButton 
                  consolidation={consolidation} 
                  type={type}
                  onStatusUpdate={onStatusUpdate}
                />
              </div>
            </div>
            
            {/* Detalhes dos pacotes */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Pacotes incluídos:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {consolidation.packages.map((pkg: { id: string; description?: string; weightGrams?: number; purchasePrice?: number; lengthCm?: number; widthCm?: number; heightCm?: number }) => (
                  <div key={pkg.id} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                    <div className="font-medium">{pkg.description || 'Sem descrição'}</div>
                    <div className="text-xs text-gray-500">
                      {pkg.weightGrams || 0}g • {pkg.lengthCm || 0}x{pkg.widthCm || 0}x{pkg.heightCm || 0}cm
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Proteções aplicadas */}
            {consolidation.extraProtection.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Proteções aplicadas:</h5>
                <div className="flex flex-wrap gap-2">
                  {consolidation.extraProtection.map((protection, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {protection}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Resumo Financeiro */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Resumo Financeiro</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Taxa Consolidação:</span>
                  <div className="text-gray-600">${consolidation.consolidationFee.toFixed(2)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Taxa Armazenamento:</span>
                  <div className="text-gray-600">${consolidation.storageFee.toFixed(2)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Valor Pacotes:</span>
                  <div className="text-gray-600">
                    ${consolidation.packages.reduce((sum, pkg) => sum + (Number(pkg.purchasePrice) || 0), 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Peso Total:</span>
                  <div className="text-gray-600">
                    {consolidation.packages.reduce((sum, pkg) => sum + (pkg.weightGrams || 0), 0) / 1000}kg
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prazos */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Prazo consolidação:</span>
                  <div className="text-gray-600">
                    {consolidation.consolidationDeadline ? new Date(consolidation.consolidationDeadline).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Prazo envio:</span>
                  <div className="text-gray-600">
                    {consolidation.shippingDeadline ? new Date(consolidation.shippingDeadline).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
