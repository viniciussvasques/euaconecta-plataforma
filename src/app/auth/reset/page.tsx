'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function ResetPasswordPage() {
  const [token, setToken] = useState('')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Avoid useSearchParams to prevent prerender/Suspense requirement
  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search)
      setToken(qs.get('token') || '')
    } catch {
      setToken('')
    }
  }, [])

  const rules = useMemo(() => ({
    min: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password.length > 0 && password === confirm,
  }), [password, confirm])

  const allGood = rules.min && rules.upper && rules.lower && rules.digit && rules.special && rules.match

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!allGood) { setError('Verifique os requisitos de senha.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) })
      const data = await res.json()
      if (res.ok && data.success) { setMessage('Senha redefinida com sucesso. Redirecionando para login...'); setTimeout(() => router.push('/auth/login'), 2000) }
      else setError(data.error || 'Falha ao redefinir')
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Redefinir Senha</h1>
      {!token && <p className="text-red-600">Token inválido.</p>}
      {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
      {!message && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600 hover:text-gray-800"
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPass ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                placeholder="Repita a senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600 hover:text-gray-800"
                aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirm ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          {/* Regras de senha */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
            <p className="font-medium text-gray-800 mb-1">Sua senha deve conter:</p>
            <ul className="space-y-1 text-gray-700">
              <li className={rules.min ? 'text-green-600' : 'text-gray-600'}>• Pelo menos 8 caracteres</li>
              <li className={rules.upper ? 'text-green-600' : 'text-gray-600'}>• Uma letra maiúscula (A‑Z)</li>
              <li className={rules.lower ? 'text-green-600' : 'text-gray-600'}>• Uma letra minúscula (a‑z)</li>
              <li className={rules.digit ? 'text-green-600' : 'text-gray-600'}>• Um número (0‑9)</li>
              <li className={rules.special ? 'text-green-600' : 'text-gray-600'}>• Um caractere especial (!@#$%&*, etc.)</li>
              <li className={rules.match ? 'text-green-600' : 'text-gray-600'}>• Confirmação igual à senha</li>
            </ul>
          </div>
          <button type="submit" disabled={loading || !token || !allGood} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Salvando...' : 'Redefinir Senha'}</button>
        </form>
      )}
    </div>
  )
}
