import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function DuplicatedConfigWarning() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-600" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Configuração duplicada detectada
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Estas informações também estão disponíveis em{' '}
              <Link href="/admin/platform-config" className="font-medium text-yellow-700 underline hover:text-yellow-600">
                Configuração da Plataforma
              </Link>
              . Recomendamos gerenciar estas informações em um único lugar para evitar inconsistências.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}