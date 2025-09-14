'use client'

import { useState } from 'react'
import { ConsolidationList } from './consolidation-list'
import { ConsolidationGroupData } from '@/lib/consolidation-new'

interface ConsolidationGroup {
  id: string
  name?: string
  status: string
  userId: string
  createdAt: Date
  updatedAt: Date
  consolidationType?: string
  consolidationFee?: number
  storageFee?: number
  extraProtection?: boolean
  finalWeightGrams?: number
  trackingCode?: string
  user?: { id: string; name: string; email: string }
  deliveryAddress?: { name: string; line1: string; line2?: string; city: string; state: string; postalCode: string; country: string }
  packages?: Array<{
    id: string
    description?: string
    weightGrams?: number
    status: string
    createdAt: Date
  }>
  consolidationDeadline?: Date
  shippingDeadline?: Date
}

interface ConsolidationTabsProps {
  consolidations?: ConsolidationGroup[]
  openConsolidations?: ConsolidationGroup[]
  pendingConsolidations?: ConsolidationGroup[]
  inProgressConsolidations?: ConsolidationGroup[]
  readyToShipConsolidations?: ConsolidationGroup[]
  shippedConsolidations?: ConsolidationGroup[]
  onStatusUpdate?: (id: string, status: string) => void
  onEdit?: (id: string) => void
}

export function ConsolidationTabs({ 
  consolidations, 
  openConsolidations, 
  pendingConsolidations, 
  inProgressConsolidations, 
  readyToShipConsolidations, 
  shippedConsolidations, 
  onStatusUpdate, 
  onEdit 
}: ConsolidationTabsProps) {
  const tabs = [
    { id: 'OPEN', label: 'Caixas Abertas', status: 'OPEN' },
    { id: 'PENDING', label: 'Pendentes', status: 'PENDING' },
    { id: 'IN_PROGRESS', label: 'Em Processo', status: 'IN_PROGRESS' },
    { id: 'READY_TO_SHIP', label: 'Prontas para Envio', status: 'READY_TO_SHIP' },
    { id: 'SHIPPED', label: 'Enviadas', status: 'SHIPPED' }
  ]

  const [activeTab, setActiveTab] = useState('OPEN')

  const allConsolidations = [
    ...(openConsolidations || []),
    ...(pendingConsolidations || []),
    ...(inProgressConsolidations || []),
    ...(readyToShipConsolidations || []),
    ...(shippedConsolidations || []),
    ...(consolidations || [])
  ]
  
  // Log para debug
  console.log('📊 ConsolidationTabs: Estado atual:', {
    activeTab,
    openConsolidations: openConsolidations?.length || 0,
    pendingConsolidations: pendingConsolidations?.length || 0,
    inProgressConsolidations: inProgressConsolidations?.length || 0,
    readyToShipConsolidations: readyToShipConsolidations?.length || 0,
    shippedConsolidations: shippedConsolidations?.length || 0,
    totalConsolidations: allConsolidations.length
  })
  
  const filteredConsolidations = allConsolidations.filter(
    consolidation => consolidation.status === activeTab
  )
  
  console.log('🔍 ConsolidationTabs: Filtrado para', activeTab, ':', filteredConsolidations.length, 'itens')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {allConsolidations.filter(c => c.status === tab.status).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        <ConsolidationList
          consolidations={filteredConsolidations as unknown as ConsolidationGroupData[]}
          type={activeTab === 'PENDING' ? 'pending' : activeTab === 'IN_PROGRESS' ? 'in_progress' : 'pending'}
          onStatusUpdate={onStatusUpdate}
          onEdit={onEdit}
        />
      </div>
    </div>
  )
}