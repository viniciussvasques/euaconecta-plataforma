'use client'

import { useState, useEffect } from 'react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'welcome' | 'payment_confirmation' | 'package_received' | 'consolidation_ready' | 'shipment_sent'
  isActive: boolean
}

export function EmailConfigPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<string>('')
  const [testTo, setTestTo] = useState<string>('')
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/email-templates')
      const data = await response.json()

      if (data.success) {
        setTemplates(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTemplate = async (template: EmailTemplate) => {
    setSaving(true)
    try {
      const response = await fetch('/api/email-templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      })

      const data = await response.json()

      if (data.success) {
        setTemplates(prev =>
          prev.map(t => t.id === template.id ? template : t)
        )
        setEditingTemplate(null)
      } else {
        alert(data.error || 'Erro ao salvar template')
      }
    } catch (error) {
      console.error('Erro ao salvar template:', error)
      alert('Erro ao salvar template')
    } finally {
      setSaving(false)
    }
  }

  const getTemplateTypeText = (type: string) => {
    switch (type) {
      case 'welcome': return 'Bem-vindo'
      case 'payment_confirmation': return 'Confirmação de Pagamento'
      case 'package_received': return 'Pacote Recebido'
      case 'consolidation_ready': return 'Consolidação Pronta'
      case 'shipment_sent': return 'Envio Realizado'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuração de Emails</h1>
        <p className="mt-2 text-gray-600">
          Configure os templates de email e notificações do sistema.
        </p>
      </div>

      {/* SMTP Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Conexão SMTP</h2>
            <p className="text-sm text-gray-600">Verifique a conexão e envie um e-mail de teste.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={async () => {
                setVerifying(true)
                setVerifyResult('')
                try {
                  const res = await fetch('/api/admin/email/verify')
                  const data = await res.json()
                  setVerifyResult(data.success ? 'Conexão SMTP verificada com sucesso.' : (data.error || 'Falha na verificação.'))
                } catch {
                  setVerifyResult('Erro ao verificar SMTP.')
                } finally {
                  setVerifying(false)
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={verifying}
            >
              {verifying ? 'Verificando...' : 'Verificar SMTP'}
            </button>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="destinatario@exemplo.com"
                className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={async () => {
                  if (!testTo) return
                  setSendingTest(true)
                  try {
                    const res = await fetch('/api/admin/email/test-send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ to: testTo })
                    })
                    const data = await res.json()
                    setVerifyResult(data.success ? 'Email de teste enviado.' : (data.error || 'Falha ao enviar email de teste.'))
                  } catch {
                    setVerifyResult('Erro ao enviar email de teste.')
                  } finally {
                    setSendingTest(false)
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={sendingTest || !testTo}
              >
                {sendingTest ? 'Enviando...' : 'Enviar teste'}
              </button>
            </div>
          </div>
        </div>
        {verifyResult && (
          <p className="mt-3 text-sm {verifyResult.includes('sucesso') ? 'text-green-700' : 'text-gray-700'}">
            {verifyResult}
          </p>
        )}
      </div>

      {/* Templates List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Templates de Email ({templates.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {templates.map((template) => (
            <div key={template.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {getTemplateTypeText(template.type)}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Assunto: {template.subject}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {template.content.substring(0, 100)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  Editar Template: {getTemplateTypeText(editingTemplate.type)}
                </h3>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                handleSaveTemplate(editingTemplate)
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto do Email
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      subject: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Assunto do email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo do Email (HTML)
                  </label>
                  <textarea
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      content: e.target.value
                    })}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Conteúdo HTML do email"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use variáveis como {'{userName}'}, {'{amount}'}, {'{trackingCode}'} que serão substituídas automaticamente.
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingTemplate.isActive}
                    onChange={(e) => setEditingTemplate({
                      ...editingTemplate,
                      isActive: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Template ativo
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar Template'}
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
