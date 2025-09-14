'use client'

import { useState } from 'react'
import { ClientSelector } from './client-selector'

interface CreatePackageForm {
  ownerId: string
  description: string
  purchaseDate: string
  expectedDeliveryDate: string
  store: string
  orderNumber: string
  purchasePrice: string
  weightGrams: string
  notes: string
  // Novos campos
  trackingIn: string
  carrier: string
  declaredValue: string
  packageType: string
  lengthCm: string
  widthCm: string
  heightCm: string
}

export function CreatePackageButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreatePackageForm>({
    ownerId: '',
    description: '',
    purchaseDate: '',
    expectedDeliveryDate: '',
    store: '',
    orderNumber: '',
    purchasePrice: '',
    weightGrams: '',
    notes: '',
    // Novos campos
    trackingIn: '',
    carrier: '',
    declaredValue: '',
    packageType: '',
    lengthCm: '',
    widthCm: '',
    heightCm: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          purchasePrice: parseFloat(form.purchasePrice) || 0,
          weightGrams: parseInt(form.weightGrams) || 0,
          declaredValue: parseFloat(form.declaredValue) || null,
          lengthCm: parseInt(form.lengthCm) || null,
          widthCm: parseInt(form.widthCm) || null,
          heightCm: parseInt(form.heightCm) || null,
        }),
      })

      if (response.ok) {
        setIsOpen(false)
        setForm({
          ownerId: '',
          description: '',
          purchaseDate: '',
          expectedDeliveryDate: '',
          store: '',
          orderNumber: '',
          purchasePrice: '',
          weightGrams: '',
          notes: '',
          // Novos campos
          trackingIn: '',
          carrier: '',
          declaredValue: '',
          packageType: '',
          lengthCm: '',
          widthCm: '',
          heightCm: ''
        })
        // Recarregar a lista de pacotes
        window.location.reload()
      } else {
        console.error('Erro ao criar pacote')
      }
    } catch (error) {
      console.error('Erro ao criar pacote:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Novo Pacote
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Criar Novo Pacote</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <ClientSelector
                  value={form.ownerId}
                  onChange={(clientId) => setForm({ ...form, ownerId: clientId })}
                  required
                />

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                      Data da Compra
                    </label>
                    <input
                      type="date"
                      id="purchaseDate"
                      value={form.purchaseDate}
                      onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700">
                      Data Prevista
                    </label>
                    <input
                      type="date"
                      id="expectedDeliveryDate"
                      value={form.expectedDeliveryDate}
                      onChange={(e) => setForm({ ...form, expectedDeliveryDate: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                      Loja
                    </label>
                    <input
                      type="text"
                      id="store"
                      value={form.store}
                      onChange={(e) => setForm({ ...form, store: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      placeholder="Amazon, eBay, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                      Número do Pedido
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      value={form.orderNumber}
                      onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
                      Preço da Compra
                    </label>
                    <input
                      type="number"
                      id="purchasePrice"
                      value={form.purchasePrice}
                      onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="weightGrams" className="block text-sm font-medium text-gray-700">
                      Peso (gramas)
                    </label>
                    <input
                      type="number"
                      id="weightGrams"
                      value={form.weightGrams}
                      onChange={(e) => setForm({ ...form, weightGrams: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="declaredValue" className="block text-sm font-medium text-gray-700">
                      Valor Declarado
                    </label>
                    <input
                      type="number"
                      id="declaredValue"
                      value={form.declaredValue}
                      onChange={(e) => setForm({ ...form, declaredValue: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="packageType" className="block text-sm font-medium text-gray-700">
                      Tipo de Embalagem
                    </label>
                    <select
                      id="packageType"
                      value={form.packageType}
                      onChange={(e) => setForm({ ...form, packageType: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="envelope">Envelope</option>
                      <option value="caixa">Caixa</option>
                      <option value="sacola">Sacola</option>
                      <option value="tubo">Tubo</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="trackingIn" className="block text-sm font-medium text-gray-700">
                      Código de Rastreamento
                    </label>
                    <input
                      type="text"
                      id="trackingIn"
                      value={form.trackingIn}
                      onChange={(e) => setForm({ ...form, trackingIn: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      placeholder="Ex: 1Z999AA1234567890"
                    />
                  </div>

                  <div>
                    <label htmlFor="carrier" className="block text-sm font-medium text-gray-700">
                      Transportadora
                    </label>
                    <select
                      id="carrier"
                      value={form.carrier}
                      onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Selecione...</option>
                      <option value="UPS">UPS</option>
                      <option value="FedEx">FedEx</option>
                      <option value="USPS">USPS</option>
                      <option value="DHL">DHL</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensões (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Comprimento</label>
                      <input
                        type="number"
                        value={form.lengthCm}
                        onChange={(e) => setForm({ ...form, lengthCm: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        placeholder="30"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Largura</label>
                      <input
                        type="number"
                        value={form.widthCm}
                        onChange={(e) => setForm({ ...form, widthCm: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        placeholder="20"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Altura</label>
                      <input
                        type="number"
                        value={form.heightCm}
                        onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        placeholder="10"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Criando...' : 'Criar Pacote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
