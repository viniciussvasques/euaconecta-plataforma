'use client'

import { useState } from 'react'
import { LabelGenerator, type PackageLabelData } from '@/lib/consolidation/labels'

interface FetchedUser {
  id?: string
  name?: string
  email?: string
  suiteNumber?: number | null
}

interface FetchedPackage {
  id?: string
  description?: string
  status?: string
  weightGrams?: number | string | null
  purchasePrice?: number | string | null
  store?: string | null
  orderNumber?: string | null
  trackingCode?: string | null
  carrier?: string | null
  packageType?: string | null
  lengthCm?: number | null
  widthCm?: number | null
  heightCm?: number | null
  user?: FetchedUser
  owner?: FetchedUser
  userId?: string
  suiteNumber?: number | null
}

interface UserApiResponse {
  success: boolean
  data?: { suiteNumber?: number | null }
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

      const packageData: FetchedPackage = data.data as FetchedPackage
      const userObj: FetchedUser = (packageData.user || packageData.owner || {}) as FetchedUser

      // Tentar obter a suite caso não venha no payload do pacote
      let suiteNumber: number | null = (userObj.suiteNumber ?? packageData.suiteNumber ?? null) as number | null
      const resolvedUserId = String(userObj.id || packageData.userId || '')
      if (suiteNumber == null && resolvedUserId) {
        try {
          const uRes = await fetch(`/api/users/${resolvedUserId}`)
          if (uRes.ok) {
            const uData: UserApiResponse = await uRes.json()
            if (uData.success && typeof uData.data?.suiteNumber !== 'undefined') {
              suiteNumber = (uData.data?.suiteNumber ?? null) as number | null
            }
          }
        } catch {}
      }

      const payload: PackageLabelData = {
        packageId: String(packageData.id || packageId),
        userId: resolvedUserId,
        userName: String(userObj.name || 'Usuário'),
        userEmail: String(userObj.email || ''),
        suiteNumber,
        cpf: null,
        phone: null,
        description: String(packageData.description || ''),
        weightGrams: Number(packageData.weightGrams ?? NaN) || null,
        purchasePrice: Number(packageData.purchasePrice ?? NaN) || null,
        store: packageData.store ? String(packageData.store) : null,
        orderNumber: packageData.orderNumber ? String(packageData.orderNumber) : null,
        trackingIn: packageData.trackingCode ? String(packageData.trackingCode) : null,
        carrier: packageData.carrier ? String(packageData.carrier) : null,
        packageType: packageData.packageType ? String(packageData.packageType) : null,
        confirmedAt: new Date(),
        confirmedBy: 'Admin'
      }

      const blob = await LabelGenerator.generatePackageLabel(payload, '4x6')
      const url = URL.createObjectURL(blob)

      // Abrir janela dedicada e acionar o diálogo de impressão, sem fechar automaticamente
      const printWin = window.open('', '_blank')
      if (printWin) {
        printWin.document.open()
        // Usar createElement em vez de document.write para segurança
        const html = printWin.document.createElement('html')
        const head = printWin.document.createElement('head')
        const title = printWin.document.createElement('title')
        title.textContent = 'Etiqueta'
        head.appendChild(title)

        const body = printWin.document.createElement('body')
        body.style.margin = '0'

        const embed = printWin.document.createElement('embed')
        embed.id = 'pdf'
        embed.src = url
        embed.type = 'application/pdf'
        embed.style.width = '100%'
        embed.style.height = '100vh'

        body.appendChild(embed)
        html.appendChild(head)
        html.appendChild(body)
        printWin.document.appendChild(html)

        // Adicionar script de impressão de forma segura
        const script = printWin.document.createElement('script')
        script.textContent = `
          const tryPrint = () => {
            try {
              window.focus();
              window.print();
            } catch(e){}
          }
          window.addEventListener('load', () => setTimeout(tryPrint, 500))
        `
        body.appendChild(script)
        printWin.document.close()
        const timer = setInterval(() => {
          if (printWin.closed) {
            clearInterval(timer)
            URL.revokeObjectURL(url)
          }
        }, 1000)
      } else {
        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.right = '0'
        iframe.style.bottom = '0'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.style.border = '0'
        iframe.src = url
        document.body.appendChild(iframe)
        iframe.onload = () => {
          try { iframe.contentWindow?.focus(); iframe.contentWindow?.print() } catch {}
        }
      }

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
