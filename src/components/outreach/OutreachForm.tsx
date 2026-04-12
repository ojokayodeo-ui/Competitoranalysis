'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Briefcase, User, Building2, Send } from 'lucide-react'

const GEOGRAPHIES = [
  'Global', 'United Kingdom', 'United States', 'Europe', 'North America',
  'Australia / NZ', 'Canada', 'DACH', 'Nordics', 'Middle East', 'APAC',
]

const MARKET_EXAMPLES = [
  'Recruitment agencies in the UK',
  'B2B SaaS companies selling to HR teams',
  'E-commerce brands doing £1M+ revenue',
  'Law firms with 10–50 employees',
  'Digital marketing agencies',
  'Series A–B funded startups',
]

export default function OutreachForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    companyUrl:   '',
    targetMarket: '',
    yourProduct:  '',
    geographyFocus: 'Global',
    senderName:   '',
    senderCompany:'',
  })
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState('')
  const [showSender, setShowSender] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyUrl.trim())   { setError('Company website URL is required');  return }
    if (!form.targetMarket.trim()) { setError('Target market is required'); return }
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      router.push(`/outreach/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Company URL */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Company Website URL <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={form.companyUrl}
            onChange={e => set('companyUrl', e.target.value)}
            placeholder="e.g. https://acme.com"
            className="w-full pl-10 pr-4 py-3 bg-surface-elevated border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition"
            disabled={loading}
          />
        </div>
        <p className="text-xs text-slate-600 mt-1">We'll scrape this page to personalise your outreach</p>
      </div>

      {/* Target Market */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Target Market or ICP <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <textarea
            rows={2}
            value={form.targetMarket}
            onChange={e => set('targetMarket', e.target.value)}
            placeholder="e.g. B2B SaaS companies selling to HR teams, UK recruitment agencies…"
            className="w-full pl-10 pr-4 py-3 bg-surface-elevated border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition resize-none"
            disabled={loading}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {MARKET_EXAMPLES.map(ex => (
            <button
              key={ex} type="button"
              onClick={() => set('targetMarket', ex)}
              className="px-2 py-0.5 text-xs bg-surface-elevated border border-surface-border rounded-full text-slate-500 hover:text-white hover:border-brand-500 transition"
            >{ex}</button>
          ))}
        </div>
      </div>

      {/* Your product */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          What are you selling?{' '}
          <span className="text-slate-500 font-normal">(optional — improves copy quality)</span>
        </label>
        <div className="relative">
          <Briefcase className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <textarea
            rows={2}
            value={form.yourProduct}
            onChange={e => set('yourProduct', e.target.value)}
            placeholder="e.g. Cold email outreach service that books 10–15 qualified meetings per month for B2B companies"
            className="w-full pl-10 pr-4 py-3 bg-surface-elevated border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition resize-none"
            disabled={loading}
          />
        </div>
      </div>

      {/* Geography */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Geography Focus</label>
        <select
          value={form.geographyFocus}
          onChange={e => set('geographyFocus', e.target.value)}
          className="w-full px-4 py-3 bg-surface-elevated border border-surface-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition appearance-none"
          disabled={loading}
        >
          {GEOGRAPHIES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Sender details toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowSender(!showSender)}
          className="text-xs text-slate-500 hover:text-brand-400 transition flex items-center gap-1.5"
        >
          <span>{showSender ? '▾' : '▸'}</span>
          Add your name/company for personalised placeholders
        </button>
        {showSender && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={form.senderName}
                onChange={e => set('senderName', e.target.value)}
                placeholder="Your name"
                className="w-full pl-9 pr-3 py-2.5 bg-surface-elevated border border-surface-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                disabled={loading}
              />
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={form.senderCompany}
                onChange={e => set('senderCompany', e.target.value)}
                placeholder="Your company"
                className="w-full pl-9 pr-3 py-2.5 bg-surface-elevated border border-surface-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                disabled={loading}
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !form.companyUrl.trim() || !form.targetMarket.trim()}
        className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-900/50 disabled:text-brand-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating report…</>
        ) : (
          <><Send className="w-4 h-4" />Generate Outreach Report →</>
        )}
      </button>
    </form>
  )
}
