import { PaymentProviderList } from './payment-provider-list'

export default function PaymentsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Gerenciar Provedores de Pagamento
        </h1>
        <p className="text-gray-600 mt-1">
          Configure e gerencie os provedores de pagamento disponíveis no sistema
        </p>
      </div>
      
      <PaymentProviderList />
    </div>
  )
}
