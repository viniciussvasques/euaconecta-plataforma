import { carrierService } from '@/lib/carriers'
import { CarrierList } from './carrier-list'
import { CreateCarrierButton } from './create-carrier-button'

export default async function CarriersPage() {
  const carriers = await carrierService.getAll()
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Transportadoras</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure e gerencie transportadoras, taxas e serviços de envio
          </p>
        </div>
        <CreateCarrierButton />
      </div>

      {/* Carriers List */}
      <CarrierList carriers={carriers} />
    </div>
  )
}
