'use client'

import { useState, useEffect, useRef } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface ClientSelectorProps {
  value: string
  onChange: (clientId: string) => void
  required?: boolean
}

export function ClientSelector({ value, onChange, required = false }: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredClients, setFilteredClients] = useState<User[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedClient, setSelectedClient] = useState<User | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Buscar clientes em tempo real
  useEffect(() => {
    const searchClients = async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setFilteredClients([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}&role=CLIENT`)
        const data = await response.json()
        if (data.success) {
          setFilteredClients(data.data)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
        setFilteredClients([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchClients, 300) // Debounce de 300ms
    return () => clearTimeout(timeoutId)
  }, [searchTerm])


  // Carregar cliente selecionado quando value mudar
  useEffect(() => {
    const loadSelectedClient = async () => {
      if (value && !selectedClient) {
        try {
          const response = await fetch(`/api/users/${value}`)
          const data = await response.json()
          if (data.success) {
            setSelectedClient(data.data)
            setSearchTerm(`${data.data.name} (${data.data.email})`)
          }
        } catch (error) {
          console.error('Erro ao carregar cliente selecionado:', error)
        }
      }
    }

    loadSelectedClient()
  }, [value, selectedClient])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    setIsOpen(true)
    
    // Se limpar o campo, limpar seleção
    if (!newSearchTerm.trim()) {
      setSelectedClient(null)
      onChange('')
    }
  }

  const handleClientSelect = (client: User) => {
    setSelectedClient(client)
    setSearchTerm(`${client.name} (${client.email})`)
    onChange(client.id)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedClient(null)
    setSearchTerm('')
    onChange('')
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">
        Cliente {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative mt-1">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Digite nome, email ou ID do cliente..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white pr-20"
          required={required}
        />
        
        {selectedClient && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500 text-center">
              Carregando clientes...
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500 text-center">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente disponível'}
            </div>
          ) : (
            filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => handleClientSelect(client)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  selectedClient?.id === client.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{client.name}</span>
                  <span className="text-xs text-gray-500">{client.email}</span>
                  <span className="text-xs text-gray-400">ID: {client.id.slice(-8)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {selectedClient && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-700">
              Cliente selecionado: <strong>{selectedClient.name}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
