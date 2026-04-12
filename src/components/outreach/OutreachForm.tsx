'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, ChevronDown, ArrowRight, Loader2 } from 'lucide-react'

const GEOGRAPHIES = [
  'Global', 'United Kingdom', 'United States', 'Europe', 'North America',
  'Australia / NZ', 'Canada', 'DACH', 'Nordics', 'Middle East', 'APAC',
]

export default function OutreachForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    companyUrl:    '',
    targetMarket:  '',
    yourProduct:   '',
    geographyFocus:'Global',
    senderName:    '',
    senderCompany: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState<Partial<typeof form>>({})

  const set = (k: keyof typeof form, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }))
    setErrors(prev => ({ ...prev, [k]: '' }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.companyUrl.trim())   e.companyUrl   = 'Please enter the company website URL'
    if (!form.targetMarket.trim()) e.targetMarket = 'Please describe your target market'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res  = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start')
      router.push(`/outreach/${data.id}`)
    } catch (err) {
      setErrors({ companyUrl: err instanceof Error ? err.message : 'Something went wrong' })
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">

      {/* ── Company URL — full-width highlighted section ───────────────── */}
      <div className="mb-1">
        <label className="block text-sm font-semibold text-white mb-2">
          Company Website URL
          <span className="ml-1.5 text-red-400">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none" />
          <input
            type="url"
            value={form.companyUrl}
            onChange={e => set('companyUrl', e.target.value)}
            placeholder="e.g. https://acme.com"
            autoComplete="url"
            className={`w-full pl-11 pr-4 py-4 bg-[#0d1117] border-2 rounded-xl text-white placeholder-slate-600 focus:outline-none text-[15px] transition-colors ${
              errors.companyUrl
                ? 'border-red-500 focus:border-red-400'
                : 'border-brand-600/60 focus:border-brand-500'
            }`}
            disabled={loading}
          />
        </div>
        {errors.companyUrl
          ? <p className="mt-1.5 text-xs text-red-400">{errors.companyUrl}</p>
          : <p className="mt-1.5 text-xs text-slate-600">We'll scrape this page to personalise every message</p>
        }
      </div>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 py-4">
        <div className="flex-1 h-px bg-surface-border" />
        <span className="text-xs text-slate-600 uppercase tracking-widest">then tell us about you</span>
        <div className="flex-1 h-px bg-surface-border" />
      </div>

      {/* ── Target Market ─────────────────────────────────────────────── */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-white mb-2">
          Target Market or Industry
          <span className="ml-1.5 text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.targetMarket}
          onChange={e => set('targetMarket', e.target.value)}
          placeholder="e.g. Recruitment agencies in the UK, or B2B SaaS companies selling to HR teams"
          className={`w-full px-4 py-3.5 bg-[#0d1117] border rounded-xl text-white placeholder-slate-600 focus:outline-none text-sm transition-colors ${
            errors.targetMarket ? 'border-red-500' : 'border-surface-border focus:border-brand-600/60'
          }`}
          disabled={loading}
        />
        {errors.targetMarket && <p className="mt-1 text-xs text-red-400">{errors.targetMarket}</p>}
      </div>

      {/* ── What are you selling ───────────────────────────────────────── */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-white mb-2">
          What are you selling?{' '}
          <span className="font-normal text-slate-500">(optional — improves output)</span>
        </label>
        <textarea
          rows={3}
          value={form.yourProduct}
          onChange={e => set('yourProduct', e.target.value)}
          placeholder="e.g. Cold email outreach services that book 10–15 qualified meetings per month for B2B companies"
          className="w-full px-4 py-3.5 bg-[#0d1117] border border-surface-border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/60 text-sm transition-colors resize-none"
          disabled={loading}
        />
      </div>

      {/* ── Geography ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-white mb-2">Geography Focus</label>
        <div className="relative">
          <select
            value={form.geographyFocus}
            onChange={e => set('geographyFocus', e.target.value)}
            className="w-full px-4 py-3.5 bg-[#0d1117] border border-surface-border rounded-xl text-white focus:outline-none focus:border-brand-600/60 text-sm transition-colors appearance-none"
            disabled={loading}
          >
            {GEOGRAPHIES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* ── Optional sender info ──────────────────────────────────────── */}
      <div className="mb-6 p-4 bg-surface-elevated/50 border border-surface-border rounded-xl">
        <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">
          Optional: personalise [[PLACEHOLDERS]]
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Your name</label>
            <input
              type="text"
              value={form.senderName}
              onChange={e => set('senderName', e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-3 py-2.5 bg-[#0d1117] border border-surface-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/60 text-sm"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Your company</label>
            <input
              type="text"
              value={form.senderCompany}
              onChange={e => set('senderCompany', e.target.value)}
              placeholder="e.g. Acme Ltd"
              className="w-full px-3 py-2.5 bg-[#0d1117] border border-surface-border rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-brand-600/60 text-sm"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-[15px]"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating report…</>
          : <>Generate Intelligence Report <ArrowRight className="w-4 h-4" /></>
        }
      </button>
    </form>
  )
}
