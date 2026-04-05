'use client'
import { useState } from 'react'
import { Search, Plus, X, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'UK Recruitment Agencies',
  'SaaS CRM Tools',
  'US FinTech Lending',
  'Electric Vehicle Manufacturers',
  'Cloud Cybersecurity',
  'D2C Nutrition & Supplements',
  'HR Software Platforms',
  'Legal Tech Startups',
]

export default function InputForm() {
  const router = useRouter()
  const [industry, setIndustry] = useState('')
  const [competitors, setCompetitors] = useState<string[]>([])
  const [competitorInput, setCompetitorInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addCompetitor = () => {
    const val = competitorInput.trim()
    if (val && !competitors.includes(val)) {
      setCompetitors(prev => [...prev, val])
    }
    setCompetitorInput('')
  }

  const removeCompetitor = (name: string) => {
    setCompetitors(prev => prev.filter(c => c !== name))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!industry.trim()) { setError('Please enter an industry name'); return }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industry.trim(), competitors }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start analysis')
      router.push(`/analysis/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Industry Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Industry or Market
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="e.g. UK Recruitment Agencies, SaaS CRM Tools…"
              className="w-full pl-12 pr-4 py-4 bg-surface-elevated border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg transition"
              disabled={loading}
            />
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        {/* Example tags */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Quick examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setIndustry(ex)}
                className="px-3 py-1 text-xs bg-surface-elevated border border-surface-border rounded-full text-slate-400 hover:text-white hover:border-brand-500 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Optional competitors */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Known Competitors{' '}
            <span className="text-slate-500 font-normal">(optional — system will auto-discover)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={competitorInput}
              onChange={e => setCompetitorInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCompetitor() } }}
              placeholder="e.g. Salesforce, HubSpot…"
              className="flex-1 px-4 py-3 bg-surface-elevated border border-surface-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition"
              disabled={loading}
            />
            <button
              type="button"
              onClick={addCompetitor}
              disabled={!competitorInput.trim() || loading}
              className="px-4 py-3 bg-surface-elevated border border-surface-border rounded-xl text-slate-400 hover:text-white hover:border-brand-500 transition disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {competitors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {competitors.map(c => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 px-3 py-1 bg-brand-900/40 border border-brand-700/50 rounded-full text-brand-300 text-sm"
                >
                  {c}
                  <button type="button" onClick={() => removeCompetitor(c)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !industry.trim()}
          className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-900/50 disabled:text-brand-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Starting analysis…
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Run Intelligence Analysis
            </>
          )}
        </button>
      </form>
    </div>
  )
}
