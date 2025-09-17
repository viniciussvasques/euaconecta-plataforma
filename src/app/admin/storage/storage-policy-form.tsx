'use client'

import { useState } from 'react'

export default function StoragePolicyForm() {
  const [freeDays, setFreeDays] = useState(30)
  const [flatDailyUsd, setFlatDailyUsd] = useState(1)
  const [maxDays, setMaxDays] = useState(90)
  const [warningDays, setWarningDays] = useState(7)

  // Opções avançadas
  const [dailyRateSmall, setDailyRateSmall] = useState<number | ''>('')
  const [dailyRateMedium, setDailyRateMedium] = useState<number | ''>('')
  const [dailyRateLarge, setDailyRateLarge] = useState<number | ''>('')
  const [dailyRatePerItem, setDailyRatePerItem] = useState<number | ''>('')
  const [excludeWeekends, setExcludeWeekends] = useState(true)
  const [prorateAfterFree, setProrateAfterFree] = useState(true)
  const [notifyBeforeCharge, setNotifyBeforeCharge] = useState(true)
  const [graceExtensionDays, setGraceExtensionDays] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [notes, setNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeDays,
          dailyRateSmall: dailyRateSmall ? Math.round(Number(dailyRateSmall) * 100) : 0,
          dailyRateMedium: dailyRateMedium ? Math.round(Number(dailyRateMedium) * 100) : 0,
          dailyRateLarge: dailyRateLarge ? Math.round(Number(dailyRateLarge) * 100) : 0,
          dailyRatePerItem: dailyRatePerItem ? Math.round(Number(dailyRatePerItem) * 100) : 0,
          flatDailyRateUsdCents: Math.round((flatDailyUsd || 0) * 100),
          maxDaysAllowed: maxDays,
          warningDays,
          excludeWeekends,
          prorateAfterFree,
          notifyBeforeCharge,
          graceExtensionDays,
          currency,
          notes,
        })
      })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Erro')
      setMsg('Política criada e ativada com sucesso!')
      setTimeout(() => window.location.reload(), 800)
    } catch {
      setMsg('Falha ao criar política.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Nova Política</h2>

      {/* Básico */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <label className="text-sm font-medium text-gray-900">
          <span>Dias Grátis</span>
          <input type="number" min={0} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={freeDays} onChange={e=>setFreeDays(parseInt(e.target.value||'0'))} />
        </label>
        <label className="text-sm font-medium text-gray-900">
          <span>Valor por Dia após ($)</span>
          <input type="number" min={0} step="0.01" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={flatDailyUsd} onChange={e=>setFlatDailyUsd(parseFloat(e.target.value||'0'))} />
        </label>
        <label className="text-sm font-medium text-gray-900">
          <span>Máx. Dias Permitidos</span>
          <input type="number" min={1} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={maxDays} onChange={e=>setMaxDays(parseInt(e.target.value||'1'))} />
        </label>
        <label className="text-sm font-medium text-gray-900">
          <span>Dias de Aviso</span>
          <input type="number" min={0} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={warningDays} onChange={e=>setWarningDays(parseInt(e.target.value||'0'))} />
        </label>
      </div>

      {/* Tarifas por porte/opcional */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">Tarifas diferenciadas (opcional)</p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <label className="text-sm text-gray-900">
            <span className="font-medium">Pequeno ($/dia)</span>
            <input type="number" min={0} step="0.01" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={dailyRateSmall} onChange={e=>setDailyRateSmall(e.target.value === '' ? '' : parseFloat(e.target.value))} />
          </label>
          <label className="text-sm text-gray-900">
            <span className="font-medium">Médio ($/dia)</span>
            <input type="number" min={0} step="0.01" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={dailyRateMedium} onChange={e=>setDailyRateMedium(e.target.value === '' ? '' : parseFloat(e.target.value))} />
          </label>
          <label className="text-sm text-gray-900">
            <span className="font-medium">Grande ($/dia)</span>
            <input type="number" min={0} step="0.01" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={dailyRateLarge} onChange={e=>setDailyRateLarge(e.target.value === '' ? '' : parseFloat(e.target.value))} />
          </label>
          <label className="text-sm text-gray-900">
            <span className="font-medium">Por item ($/dia)</span>
            <input type="number" min={0} step="0.01" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={dailyRatePerItem} onChange={e=>setDailyRatePerItem(e.target.value === '' ? '' : parseFloat(e.target.value))} />
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-600">Caso preenchido, estas tarifas substituem a tarifa plana conforme regras do back‑office.</p>
      </div>

      {/* Regras e notificações */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 text-sm text-gray-900">
          <input type="checkbox" checked={excludeWeekends} onChange={e=>setExcludeWeekends(e.target.checked)} />
          <span><span className="font-medium">Ignorar finais de semana</span> (não conta para cobrança)</span>
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-900">
          <input type="checkbox" checked={prorateAfterFree} onChange={e=>setProrateAfterFree(e.target.checked)} />
          <span><span className="font-medium">Pró‑rata no primeiro dia cobrado</span></span>
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-900">
          <input type="checkbox" checked={notifyBeforeCharge} onChange={e=>setNotifyBeforeCharge(e.target.checked)} />
          <span><span className="font-medium">Notificar cliente antes da cobrança</span></span>
        </label>
        <label className="text-sm text-gray-900">
          <span className="font-medium">Dias extras de cortesia (grace)</span>
          <input type="number" min={0} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={graceExtensionDays} onChange={e=>setGraceExtensionDays(parseInt(e.target.value||'0'))} />
        </label>
      </div>

      {/* Outras opções */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm text-gray-900">
          <span className="font-medium">Moeda</span>
          <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" value={currency} onChange={e=>setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
          </select>
        </label>
        <label className="text-sm text-gray-900">
          <span className="font-medium">Observações internas</span>
          <textarea className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Ex.: política sazonal, campanha promocional, etc." />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md shadow-sm">{saving ? 'Salvando...' : 'Criar e Ativar'}</button>
        {msg && <span className="text-sm text-gray-900">{msg}</span>}
      </div>
    </form>
  )
}
