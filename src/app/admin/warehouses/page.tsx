'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Star, MapPin } from 'lucide-react'

interface WarehouseAddress {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  instructions?: string
  createdAt: string
  updatedAt: string
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseAddress | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    instructions: '',
  })

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses')
      const data = await response.json()
      if (data.success) {
        setWarehouses(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar armazéns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingWarehouse ? `/api/warehouses/${editingWarehouse.id}` : '/api/warehouses'
      const method = editingWarehouse ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      if (data.success) {
        await fetchWarehouses()
        setShowModal(false)
        setEditingWarehouse(null)
        setFormData({
          name: '',
          line1: '',
          line2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'US',
          instructions: '',
        })
      }
    } catch (error) {
      console.error('Erro ao salvar armazém:', error)
    }
  }

  const handleEdit = (warehouse: WarehouseAddress) => {
    setEditingWarehouse(warehouse)
    setFormData({
      name: warehouse.name,
      line1: warehouse.line1,
      line2: warehouse.line2 || '',
      city: warehouse.city,
      state: warehouse.state,
      postalCode: warehouse.postalCode,
      country: warehouse.country,
      instructions: warehouse.instructions || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este armazém?')) return
    
    try {
      const response = await fetch(`/api/warehouses/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        await fetchWarehouses()
      }
    } catch (error) {
      console.error('Erro ao excluir armazém:', error)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/warehouses/${id}/default`, { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        await fetchWarehouses()
      }
    } catch (error) {
      console.error('Erro ao definir armazém padrão:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Armazéns</h1>
        <p className="mt-2 text-gray-600">
          Configure os endereços dos armazéns nos Estados Unidos onde os clientes receberão seus pacotes.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Armazém
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                  {warehouse.isDefault && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div>
                      <div>{warehouse.line1}</div>
                      {warehouse.line2 && <div>{warehouse.line2}</div>}
                      <div>{warehouse.city}, {warehouse.state} {warehouse.postalCode}</div>
                      <div>{warehouse.country}</div>
                    </div>
                  </div>
                </div>
                {warehouse.instructions && (
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {warehouse.instructions}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(warehouse)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </button>
              {!warehouse.isDefault && (
                <button
                  onClick={() => handleSetDefault(warehouse.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  <Star className="h-4 w-4 mr-1" />
                  Padrão
                </button>
              )}
              <button
                onClick={() => handleDelete(warehouse.id)}
                className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {warehouses.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum armazém configurado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando seu primeiro armazém para que os clientes possam receber seus pacotes.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingWarehouse ? 'Editar Armazém' : 'Novo Armazém'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Armazém</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Ex: Warehouse FL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço Linha 1</label>
                  <input
                    type="text"
                    required
                    value={formData.line1}
                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Ex: 123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço Linha 2 (opcional)</label>
                  <input
                    type="text"
                    value={formData.line2}
                    onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Ex: Suite 100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Ex: Miami"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Ex: FL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CEP</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Ex: 33101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">País</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: US"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Instruções (opcional)</label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Ex: Sempre use sua suíte para identificação"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingWarehouse(null)
                      setFormData({
                        name: '',
                        line1: '',
                        line2: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: 'US',
                        instructions: '',
                      })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingWarehouse ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
