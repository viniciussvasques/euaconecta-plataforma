'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'

interface Package {
  id: string
  description?: string
  status: string
  weightGrams: number
  purchasePrice: number
  store: string
  orderNumber: string
  trackingCode?: string
  carrier?: string
  declaredValue?: number
  packageType?: string
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  user: {
    id: string
    name: string
    email: string
  }
}

interface PrintLabelButtonProps {
  packageId: string
}

export function PrintLabelButton({ packageId }: PrintLabelButtonProps) {
  const [loading, setLoading] = useState(false)

  const generateLabel = async () => {
    setLoading(true)
    
    try {
      // Buscar dados do pacote
      const response = await fetch(`/api/packages/${packageId}`)
      const data = await response.json()
      
      if (!data.success) {
        alert('Erro ao carregar dados do pacote')
        return
      }

      const packageData: Package = data.data
      
      // Criar PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150] // Tamanho padrão de etiqueta
      })

      // Configurações
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 5

      // Cabeçalho
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('EUACONECTA', pageWidth / 2, 10, { align: 'center' })
      
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Package Label', pageWidth / 2, 15, { align: 'center' })

      // Linha separadora
      pdf.setLineWidth(0.5)
      pdf.line(margin, 18, pageWidth - margin, 18)

      // Informações do pacote
      let yPosition = 25
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Package ID:', margin, yPosition)
      pdf.setFont('helvetica', 'normal')
      pdf.text(packageData.id.slice(-8), margin + 25, yPosition)
      yPosition += 6

      if (packageData.trackingCode) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Tracking:', margin, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.text(packageData.trackingCode, margin + 20, yPosition)
        yPosition += 6
      }

      if (packageData.orderNumber) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Order #:', margin, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.text(packageData.orderNumber, margin + 20, yPosition)
        yPosition += 6
      }

      if (packageData.store) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Store:', margin, yPosition)
        pdf.setFont('helvetica', 'normal')
        pdf.text(packageData.store, margin + 15, yPosition)
        yPosition += 6
      }

      // Descrição
      if (packageData.description) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Description:', margin, yPosition)
        yPosition += 4
        
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        const descriptionLines = pdf.splitTextToSize(packageData.description, pageWidth - 2 * margin)
        pdf.text(descriptionLines, margin, yPosition)
        yPosition += descriptionLines.length * 3 + 2
      }

      // Dimensões e peso
      yPosition += 3
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Dimensions & Weight:', margin, yPosition)
      yPosition += 4

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      
      if (packageData.lengthCm && packageData.widthCm && packageData.heightCm) {
        pdf.text(`${packageData.lengthCm} x ${packageData.widthCm} x ${packageData.heightCm} cm`, margin, yPosition)
        yPosition += 3
      }
      
      pdf.text(`Weight: ${packageData.weightGrams}g`, margin, yPosition)
      yPosition += 3
      
      if (packageData.purchasePrice) {
        pdf.text(`Value: $${packageData.purchasePrice.toFixed(2)}`, margin, yPosition)
        yPosition += 3
      }

      // Informações do cliente
      yPosition += 3
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Customer:', margin, yPosition)
      yPosition += 4

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.text(packageData.user.name, margin, yPosition)
      yPosition += 3
      pdf.text(packageData.user.email, margin, yPosition)

      // Status
      yPosition += 6
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Status:', margin, yPosition)
      pdf.setFont('helvetica', 'normal')
      pdf.text(packageData.status, margin + 15, yPosition)

      // Código de barras (se houver tracking code)
      if (packageData.trackingCode) {
        try {
          // Criar canvas para o código de barras
          const canvas = document.createElement('canvas')
          JsBarcode(canvas, packageData.trackingCode, {
            format: 'CODE128',
            width: 2,
            height: 30,
            displayValue: false
          })

          // Adicionar código de barras ao PDF
          const imgData = canvas.toDataURL('image/png')
          pdf.addImage(imgData, 'PNG', margin, pageHeight - 25, pageWidth - 2 * margin, 15)
        } catch (error) {
          console.error('Erro ao gerar código de barras:', error)
        }
      }

      // Data de impressão
      pdf.setFontSize(6)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Printed: ${new Date().toLocaleString('pt-BR')}`, margin, pageHeight - 5)

      // Salvar PDF
      pdf.save(`package-label-${packageData.id.slice(-8)}.pdf`)

    } catch (error) {
      console.error('Erro ao gerar etiqueta:', error)
      alert('Erro ao gerar etiqueta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={generateLabel}
      disabled={loading}
      className="text-green-600 hover:text-green-900 disabled:opacity-50"
      title="Imprimir etiqueta"
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      )}
    </button>
  )
}
