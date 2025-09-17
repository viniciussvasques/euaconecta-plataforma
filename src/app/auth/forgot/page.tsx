'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  useEffect(() => {
    // Callback global para Turnstile
    ; ((window as unknown) as Record<string, unknown>).onTurnstileCallback = (token: string) => setTurnstileToken(token)

    // Carregar Turnstile apenas se não estiver presente
    if (!((window as unknown) as Record<string, unknown>).turnstile && !document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      s.async = true
      s.defer = true
      s.onerror = () => {
        console.warn('Turnstile não carregou - formulário funcionará sem proteção')
      }
      document.body.appendChild(s)
      return () => { s.remove() }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken })
      })
      await res.json()
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Esqueci minha senha</h1>
      <p className="text-gray-600 mb-6">Informe seu e-mail. Se existir, enviaremos um link para redefinir sua senha.</p>
      {sent ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Se existir uma conta com este e-mail, você receberá as instruções em instantes.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500" />
          </div>
          <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''} data-callback="onTurnstileCallback" data-theme="light" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Enviando...' : 'Enviar link'}</button>
          <div className="text-sm text-gray-600">Lembrou a senha? <Link href="/auth/login" className="text-blue-600">Fazer login</Link></div>
        </form>
      )}
    </div>
  )
}
