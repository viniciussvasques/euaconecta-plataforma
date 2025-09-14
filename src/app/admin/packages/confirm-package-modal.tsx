'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Package, Weight, Camera, CheckCircle, AlertCircle, Printer } from 'lucide-react'
import { LabelGenerator, PackageLabelData } from '@/lib/labels'
import { ImageUtils } from '@/lib/image-utils'

interface Package {
  id: string
  description?: string
  status: string
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
  createdAt: string
  trackingIn?: string
  carrier?: string
  packageType?: string
  ownerId: string
  owner: {
    name: string
    email: string
    suiteNumber: number | null
    cpf?: string
    phone?: string
  }
}

interface ConfirmPackageModalProps {
  package: Package
  onClose: () => void
  onSuccess: () => void
}

export function ConfirmPackageModal({ package: pkg, onClose, onSuccess }: ConfirmPackageModalProps) {
  const [formData, setFormData] = useState({
    confirmedWeightGrams: pkg.weightGrams.toString(),
    packageCondition: '',
    notes: '',
    confirmationPhoto: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatingLabel, setGeneratingLabel] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar arquivo
      if (!ImageUtils.isValidImage(file)) {
        alert('Por favor, selecione uma imagem válida (JPEG, PNG, WebP) de até 5MB')
        return
      }

      try {
        // Comprimir imagem
        const compressedImage = await ImageUtils.compressImage(file, 800, 0.7)
        const compressedBlob = ImageUtils.dataURLToBlob(compressedImage)
        const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' })
        
        setFormData({ ...formData, confirmationPhoto: compressedFile })
        setPhotoPreview(compressedImage)
        
        // Mostrar informações de compressão
        const originalSize = Math.round(file.size / 1024)
        const compressedSize = ImageUtils.getFileSizeKB(compressedImage)
        console.log(`Imagem comprimida: ${originalSize}KB → ${compressedSize}KB`)
      } catch (error) {
        console.error('Erro ao comprimir imagem:', error)
        alert('Erro ao processar imagem')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.confirmedWeightGrams) {
      setError('Peso confirmado é obrigatório')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Upload da foto se houver
      let photoUrl = null
      if (formData.confirmationPhoto) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.confirmationPhoto)

        const uploadResponse = await fetch('/api/upload/photo', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json()
          throw new Error(uploadError.error || 'Erro ao fazer upload da foto')
        }

        const uploadData = await uploadResponse.json()
        photoUrl = uploadData.data.url
      }

      const response = await fetch(`/api/packages/${pkg.id}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmedWeightGrams: parseInt(formData.confirmedWeightGrams),
          confirmationPhoto: photoUrl,
          packageCondition: formData.packageCondition,
          notes: formData.notes
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao confirmar pacote')
      }

      setIsConfirmed(true)
      // Gerar etiqueta automaticamente após confirmação
      await generateAndDownloadLabel()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao confirmar pacote:', error)
      setError(error instanceof Error ? error.message : 'Erro ao confirmar pacote')
    } finally {
      setLoading(false)
    }
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)}kg`
    }
    return `${grams}g`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const generateAndDownloadLabel = async () => {
    if (!pkg.owner) return

    setGeneratingLabel(true)
    try {
      const labelData: PackageLabelData = {
        packageId: pkg.id,
        userId: pkg.ownerId,
        userName: pkg.owner.name,
        userEmail: pkg.owner.email,
        suiteNumber: pkg.owner.suiteNumber,
        cpf: pkg.owner.cpf || null,
        phone: pkg.owner.phone || null,
        description: pkg.description || 'Sem descrição',
        weightGrams: parseInt(formData.confirmedWeightGrams),
        purchasePrice: pkg.purchasePrice,
        store: pkg.store,
        orderNumber: pkg.orderNumber,
        trackingIn: pkg.trackingIn || null,
        carrier: pkg.carrier || null,
        packageType: pkg.packageType || null,
        confirmedAt: new Date(),
        confirmedBy: 'Admin' // TODO: Pegar nome do admin logado
      }

      const labelBlob = await LabelGenerator.generatePackageLabel(labelData)
      const filename = `etiqueta-pacote-${pkg.id}-${new Date().toISOString().split('T')[0]}.pdf`
      LabelGenerator.downloadBlob(labelBlob, filename)
    } catch (error) {
      console.error('Erro ao gerar etiqueta:', error)
    } finally {
      setGeneratingLabel(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col border-2 border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Confirmar Recebimento
              </h2>
              <p className="text-sm text-gray-700 font-medium">
                {pkg.description || 'Pacote sem descrição'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Informações do Pacote */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Informações do Pacote</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-700 font-medium">Cliente:</span>
                <p className="font-semibold text-gray-900">{pkg.owner.name}</p>
                {pkg.owner.suiteNumber && (
                  <p className="text-xs text-gray-600 font-medium">Suite #{pkg.owner.suiteNumber}</p>
                )}
              </div>
              <div>
                <span className="text-gray-700 font-medium">Loja:</span>
                <p className="font-semibold text-gray-900">{pkg.store || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Peso Declarado:</span>
                <p className="font-semibold text-gray-900">{formatWeight(pkg.weightGrams)}</p>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Valor:</span>
                <p className="font-semibold text-gray-900">{formatPrice(pkg.purchasePrice)}</p>
              </div>
            </div>
          </div>

          {/* Formulário de Confirmação */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Peso Confirmado */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Peso Confirmado (gramas) *
              </label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="number"
                  value={formData.confirmedWeightGrams}
                  onChange={(e) => setFormData({ ...formData, confirmedWeightGrams: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 font-medium placeholder-gray-500"
                  placeholder="Digite o peso em gramas"
                  required
                />
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium">
                Peso declarado pelo cliente: {formatWeight(pkg.weightGrams)}
              </p>
            </div>

            {/* Condição do Pacote */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Condição do Pacote
              </label>
              <select
                value={formData.packageCondition}
                onChange={(e) => setFormData({ ...formData, packageCondition: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 font-medium"
                style={{
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="" style={{ color: '#6b7280', backgroundColor: '#ffffff' }}>Selecione a condição</option>
                <option value="EXCELLENT" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Excelente</option>
                <option value="GOOD" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Boa</option>
                <option value="FAIR" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Regular</option>
                <option value="DAMAGED" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Danificado</option>
              </select>
            </div>

            {/* Foto do Pacote */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Foto do Pacote
              </label>
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera className="h-8 w-8 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    Clique para adicionar foto
                  </span>
                </label>
              </div>
              
              {photoPreview && (
                <div className="mt-4">
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 font-medium placeholder-gray-500"
                placeholder="Observações sobre o pacote..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <div className="text-sm text-red-800">
                    {error}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4">
              {!isConfirmed ? (
                <button
                  type="button"
                  onClick={generateAndDownloadLabel}
                  disabled={generatingLabel || !formData.confirmedWeightGrams}
                  className="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {generatingLabel ? 'Gerando...' : 'Gerar Etiqueta'}
                </button>
              ) : (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Pacote Confirmado!</span>
                </div>
              )}
              
              <div className="flex space-x-3">
                {!isConfirmed ? (
                  <>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border-2 border-gray-400 rounded-md text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 border-2 border-green-700 rounded-md text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Confirmando...' : 'Confirmar Recebimento'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={generateAndDownloadLabel}
                      disabled={generatingLabel}
                      className="px-4 py-2 border-2 border-blue-400 rounded-md text-sm font-semibold text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      {generatingLabel ? 'Gerando...' : 'Gerar Etiqueta Novamente'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-green-600 border-2 border-green-700 rounded-md text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Fechar
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
