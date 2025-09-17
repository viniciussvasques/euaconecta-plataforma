'use client'

import { useState, useEffect } from 'react'
import { X, User, MapPin, CreditCard, CheckCircle } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  cpf?: string | null
  phone?: string | null
  suiteNumber: number | null
}

interface Address {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface CompleteProfileModalProps {
  user: User
  onComplete: (updatedUser: User) => void
  onSkip: () => void
}

export function CompleteProfileModal({ user, onComplete, onSkip }: CompleteProfileModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [formData, setFormData] = useState({
    cpf: user.cpf || '',
    phone: user.phone || '',
    address: {
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'BR'
    }
  })

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      const data = await response.json()


      if (data.success) {
        setAddresses(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar endereços:', error)
    }
  }

  const validateCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, '')

    if (cpf.length !== 11) return false

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false

    // Validar primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(9))) return false

    // Validar segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = 11 - (sum % 11)
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf.charAt(10))) return false

    return true
  }

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[^\d]/g, '')
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  }

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const handleNext = async () => {
    if (step === 1) {
      // Validar dados pessoais
      if (!formData.cpf || !validateCPF(formData.cpf)) {
        alert('CPF inválido')
        return
      }
      if (!formData.phone || !validatePhone(formData.phone)) {
        alert('Telefone inválido')
        return
      }

      // Salvar dados pessoais
      setLoading(true)
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cpf: formData.cpf.replace(/[^\d]/g, ''),
            phone: formData.phone.replace(/[^\d]/g, '')
          })
        })

        if (response.ok) {
          await response.json()
          // Atualizar o usuário com os novos dados
          const updatedUser = { ...user, cpf: formData.cpf.replace(/[^\d]/g, ''), phone: formData.phone.replace(/[^\d]/g, '') }
          onComplete(updatedUser)
          setStep(2)
        } else {
          const errorData = await response.json()
          alert(errorData.error || 'Erro ao salvar dados pessoais')
        }
      } catch (error) {
        console.error('Erro ao salvar dados pessoais:', error)
        alert('Erro ao salvar dados pessoais')
      } finally {
        setLoading(false)
      }
    } else if (step === 2) {
      // Validar endereço
      if (!formData.address.name || !formData.address.line1 ||
          !formData.address.city || !formData.address.state ||
          !formData.address.postalCode) {
        alert('Preencha todos os campos obrigatórios do endereço')
        return
      }

      // Criar endereço
      setLoading(true)
      try {
        const response = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData.address,
            isDefault: true
          })
        })

        if (response.ok) {
          // Atualizar o usuário com os dados salvos
          const updatedUser = {
            ...user,
            cpf: formData.cpf.replace(/[^\d]/g, ''),
            phone: formData.phone.replace(/[^\d]/g, '')
          }
          onComplete(updatedUser)
        } else {
          const errorData = await response.json()
          alert(errorData.error || 'Erro ao salvar endereço')
        }
      } catch (error) {
        console.error('Erro ao salvar endereço:', error)
        alert('Erro ao salvar endereço')
      } finally {
        setLoading(false)
      }
    }
  }

  const getProgress = () => {
    const totalSteps = 2
    return (step / totalSteps) * 100
  }

  const isDataComplete = () => {
    // Verificar se tem CPF e telefone
    const hasPersonalData = user.cpf && user.phone && user.cpf.trim() !== '' && user.phone.trim() !== ''

    // Verificar se tem endereços
    const hasAddresses = addresses.length > 0

    return hasPersonalData && hasAddresses
  }

  if (isDataComplete()) {
    return null // Não mostrar se dados já estão completos
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Complete seu Cadastro
              </h2>
              <p className="text-sm text-gray-600">
                Para realizar envios, precisamos de algumas informações adicionais
              </p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Etapa {step} de 2</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Dados Pessoais
                </h3>
                <p className="text-sm text-gray-600">
                  Precisamos do seu CPF e telefone para processar os envios
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({
                      ...formData,
                      cpf: formatCPF(e.target.value)
                    })}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                  {formData.cpf && !validateCPF(formData.cpf) && (
                    <p className="text-sm text-red-600 mt-1">
                      CPF inválido
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      phone: formatPhone(e.target.value)
                    })}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                  {formData.phone && !validatePhone(formData.phone) && (
                    <p className="text-sm text-red-600 mt-1">
                      Telefone inválido
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Endereço de Entrega
                </h3>
                <p className="text-sm text-gray-600">
                  Onde você gostaria de receber seus pacotes no Brasil
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Endereço *
                  </label>
                  <input
                    type="text"
                    value={formData.address.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, name: e.target.value }
                    })}
                    placeholder="Ex: Casa, Trabalho, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    value={formData.address.line1}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, line1: e.target.value }
                    })}
                    placeholder="Rua, número, bairro"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.address.line2}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, line2: e.target.value }
                    })}
                    placeholder="Apartamento, bloco, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value }
                      })}
                      placeholder="Cidade"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Selecione</option>
                      {brazilianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, postalCode: formatCEP(e.target.value) }
                    })}
                    placeholder="00000-000"
                    maxLength={9}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Pular por enquanto
          </button>

          <div className="flex space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voltar
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : step === 2 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar
                </>
              ) : (
                'Continuar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
