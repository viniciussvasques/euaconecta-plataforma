'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation' // Removido - não usado

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  // const router = useRouter() // Removido - não usado no fluxo atual
  const [turnstileToken, setTurnstileToken] = useState('')

  useEffect(() => {
    // Registrar callback global exigida pelo Turnstile (string em data-callback)
    ; ((window as unknown) as Record<string, unknown>).onTurnstileCallback = (token: string) => {
      setTurnstileToken(token)
    }

    // Evitar carregar script múltiplas vezes
    if (!((window as unknown) as Record<string, unknown>).turnstile && !document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      s.async = true
      s.defer = true
      document.body.appendChild(s)
      return () => { s.remove() }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          // Honeypot simples contra bots
          website: (document.getElementById('website') as HTMLInputElement)?.value || '',
          turnstileToken
        }),
      })

      const data = await response.json()
      console.log('Register response:', { response: response.status, data })

      if (response.ok && data.success) {
        setSuccess(true)
        // Não redirecionar. Exibir instrução para verificar e-mail de ativação.
      } else {
        console.log('Registration failed:', data.error)
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleResend = async () => {
    try {
      setResendLoading(true)
      setResendMsg('')
      const res = await fetch('/api/auth/resend-activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setResendMsg('Enviamos um novo e-mail de ativação.')
      } else {
        setResendMsg('Não foi possível reenviar. Tente novamente em instantes.')
      }
    } finally {
      setResendLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Conta criada com sucesso!</h3>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Ação necessária: para acessar o sistema você precisa <strong>ativar sua conta</strong>.
          Verifique seu e-mail e clique no botão de ativação. O link expira em 24 horas.
        </p>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-60"
          >
            {resendLoading ? 'Reenviando...' : 'Reenviar e-mail de ativação'}
          </button>
          {resendMsg && <p className="text-sm text-gray-600">{resendMsg}</p>}
          <p className="text-xs text-gray-500">Dica: confira a caixa de spam.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Honeypot contra bots */}
        <input type="text" id="website" name="website" className="hidden" autoComplete="off" tabIndex={-1} />
        {/* Turnstile */}
        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          data-callback="onTurnstileCallback"
        />
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-200"
            placeholder="Seu nome completo"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-200"
            placeholder="seu@email.com"
          />
        </div>

        {/* Senha */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-200"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-gray-500">
            Mínimo de 6 caracteres
          </p>
        </div>

        {/* Confirmar Senha */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-200"
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Termos e Condições */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-gray-700">
            Eu concordo com os{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Política de Privacidade
            </a>
          </label>
        </div>
      </div>

      {/* Botão de Registro */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Criando conta...
            </div>
          ) : (
            'Criar conta gratuita'
          )}
        </button>
      </div>
    </form>
  )
}
