'use client'

import { useState } from 'react'
import { ConsolidationTabs } from './consolidation-tabs'
import { ConsolidationGroupData } from '@/lib/consolidation'

interface ConsolidationManagerProps {
  initialOpenConsolidations: ConsolidationGroupData[]
  initialPendingConsolidations: ConsolidationGroupData[]
  initialInProgressConsolidations: ConsolidationGroupData[]
  initialReadyToShipConsolidations: ConsolidationGroupData[]
  initialShippedConsolidations: ConsolidationGroupData[]
}

export function ConsolidationManager({
  initialOpenConsolidations,
  initialPendingConsolidations,
  initialInProgressConsolidations,
  initialReadyToShipConsolidations,
  initialShippedConsolidations
}: ConsolidationManagerProps) {
  const [openConsolidations] = useState(initialOpenConsolidations)
  const [pendingConsolidations, setPendingConsolidations] = useState(initialPendingConsolidations)
  const [inProgressConsolidations, setInProgressConsolidations] = useState(initialInProgressConsolidations)
  const [readyToShipConsolidations, setReadyToShipConsolidations] = useState(initialReadyToShipConsolidations)
  const [shippedConsolidations, setShippedConsolidations] = useState(initialShippedConsolidations)

  const handleStatusUpdate = async (consolidationId: string, newStatus: string) => {
    console.log('🔄 ConsolidationManager: Atualizando estado local:', { consolidationId, newStatus })

    // Encontrar a consolidação em todas as listas
    let consolidation: ConsolidationGroupData | null = null
    let sourceList = ''

    // Buscar em todas as listas
    const allConsolidations = [
      { list: pendingConsolidations, name: 'pending' },
      { list: inProgressConsolidations, name: 'inProgress' },
      { list: readyToShipConsolidations, name: 'readyToShip' },
      { list: shippedConsolidations, name: 'shipped' }
    ]

    for (const { list, name } of allConsolidations) {
      const found = list.find(c => c.id === consolidationId)
      if (found) {
        consolidation = found
        sourceList = name
        break
      }
    }

    if (!consolidation) {
      console.error('❌ ConsolidationManager: Consolidação não encontrada:', consolidationId)
      return
    }

    console.log('✅ ConsolidationManager: Consolidação encontrada:', {
      id: consolidation.id,
      currentStatus: consolidation.status,
      newStatus,
      sourceList
    })

    // Atualizar o status da consolidação
    const updatedConsolidation = {
      ...consolidation,
      status: newStatus as ConsolidationGroupData['status'],
      updatedAt: new Date()
    }

    // Remover da lista atual
    switch (sourceList) {
      case 'pending':
        setPendingConsolidations(prev => {
          const filtered = prev.filter(c => c.id !== consolidationId)
          console.log('📤 ConsolidationManager: Removido de pending:', {
            before: prev.length,
            after: filtered.length
          })
          return filtered
        })
        break
      case 'inProgress':
        setInProgressConsolidations(prev => {
          const filtered = prev.filter(c => c.id !== consolidationId)
          console.log('📤 ConsolidationManager: Removido de inProgress:', {
            before: prev.length,
            after: filtered.length
          })
          return filtered
        })
        break
      case 'readyToShip':
        setReadyToShipConsolidations(prev => {
          const filtered = prev.filter(c => c.id !== consolidationId)
          console.log('📤 ConsolidationManager: Removido de readyToShip:', {
            before: prev.length,
            after: filtered.length
          })
          return filtered
        })
        break
      case 'shipped':
        setShippedConsolidations(prev => {
          const filtered = prev.filter(c => c.id !== consolidationId)
          console.log('📤 ConsolidationManager: Removido de shipped:', {
            before: prev.length,
            after: filtered.length
          })
          return filtered
        })
        break
    }

    // Adicionar à lista de destino
    switch (newStatus) {
      case 'IN_PROGRESS':
        setInProgressConsolidations(prev => {
          const updated = [...prev, updatedConsolidation]
          console.log('📥 ConsolidationManager: Adicionado a inProgress:', {
            before: prev.length,
            after: updated.length
          })
          return updated
        })
        break
      case 'SHIPPED':
        setShippedConsolidations(prev => {
          const updated = [...prev, updatedConsolidation]
          console.log('📥 ConsolidationManager: Adicionado a shipped:', {
            before: prev.length,
            after: updated.length
          })
          return updated
        })
        break
      case 'READY_TO_SHIP':
        setReadyToShipConsolidations(prev => {
          const updated = [...prev, updatedConsolidation]
          console.log('📥 ConsolidationManager: Adicionado a readyToShip:', {
            before: prev.length,
            after: updated.length
          })
          return updated
        })
        break
    }

    console.log('✅ ConsolidationManager: Estado atualizado com sucesso!')
  }

  return (
    <ConsolidationTabs
      openConsolidations={openConsolidations}
      pendingConsolidations={pendingConsolidations}
      inProgressConsolidations={inProgressConsolidations}
      readyToShipConsolidations={readyToShipConsolidations}
      shippedConsolidations={shippedConsolidations}
      onStatusUpdate={handleStatusUpdate}
    />
  )
}
