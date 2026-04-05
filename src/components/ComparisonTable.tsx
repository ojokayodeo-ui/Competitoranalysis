'use client'
import { useState, useMemo } from 'react'
import { ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { Competitor } from '@/types'

type SortKey = 'name' | 'positioning' | 'bcgGrowth' | 'bcgShare' | 'traffic' | 'channels'
type SortDir = 'asc' | 'desc'

const POSITIONING_ORDER: Record<string, number> = {
  enterprise: 0, premium: 1, 'mid-market': 2, niche: 3, freemium: 4, budget: 5,
}

const TRAFFIC_ORDER: Record<string, number> = {
  'very high': 5, high: 4, medium: 3, low: 2, 'very low': 1,
}

const BCG_BADGE: Record<string, { label: string; cls: string }> = {
  star:          { label: '⭐ Star',          cls: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/30' },
  cash_cow:      { label: '🐄 Cash Cow',      cls: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30' },
  question_mark: { label: '❓ Question Mark', cls: 'bg-blue-900/40 text-blue-300 border-blue-700/30' },
  dog:           { label: '🐕 Dog',           cls: 'bg-slate-800 text-slate-400 border-slate-700' },
}

const POSITIONING_BADGE: Record<string, string> = {
  premium:     'bg-amber-900/30 text-amber-300 border-amber-700/30',
  'mid-market':'bg-blue-900/30 text-blue-300 border-blue-700/30',
  budget:      'bg-green-900/30 text-green-300 border-green-700/30',
  niche:       'bg-purple-900/30 text-purple-300 border-purple-700/30',
  enterprise:  'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  freemium:    'bg-teal-900/30 text-teal-300 border-teal-700/30',
}

const TRAFFIC_DOTS = (level: string) => {
  const filled = TRAFFIC_ORDER[level] || 3
  return (
    <div className="flex gap-0.5 items-center">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`w-2 h-2 rounded-full ${n <= filled ? 'bg-brand-400' : 'bg-surface-elevated'}`} />
      ))}
    </div>
  )
}

interface Props { competitors: Competitor[] }

export default function ComparisonTable({ competitors }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('bcgShare')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [highlightCol, setHighlightCol] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...competitors].sort((a, b) => {
      let av: number | string = 0, bv: number | string = 0
      if (sortKey === 'name')       { av = a.name; bv = b.name }
      if (sortKey === 'positioning'){ av = POSITIONING_ORDER[a.positioning] ?? 9; bv = POSITIONING_ORDER[b.positioning] ?? 9 }
      if (sortKey === 'bcgGrowth')  { av = a.bcg.marketGrowthScore; bv = b.bcg.marketGrowthScore }
      if (sortKey === 'bcgShare')   { av = a.bcg.marketShareScore; bv = b.bcg.marketShareScore }
      if (sortKey === 'traffic')    { av = TRAFFIC_ORDER[a.estimatedTrafficLevel] ?? 3; bv = TRAFFIC_ORDER[b.estimatedTrafficLevel] ?? 3 }
      if (sortKey === 'channels')   { av = a.marketingChannels.length; bv = b.marketingChannels.length }
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
  }, [competitors, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-40" />
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-400" /> : <ArrowDown className="w-3 h-3 text-brand-400" />
  }

  const Th = ({ label, k, className = '' }: { label: string; k: SortKey; className?: string }) => (
    <th
      onClick={() => handleSort(k)}
      className={`px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-white select-none whitespace-nowrap ${className}`}
    >
      <span className="flex items-center gap-1.5">{label}<SortIcon k={k} /></span>
    </th>
  )

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Competitor Comparison</h3>
        <span className="text-xs text-slate-500">Click headers to sort</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-elevated/50">
              <Th label="Company" k="name" className="sticky left-0 bg-surface-elevated/90 backdrop-blur z-10 min-w-[180px]" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Core Offer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">USP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">Pricing</th>
              <Th label="Positioning" k="positioning" />
              <Th label="Traffic" k="traffic" />
              <Th label="Growth Score" k="bcgGrowth" />
              <Th label="Share Score" k="bcgShare" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">BCG</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap min-w-[200px]">Top Channels</th>
              <Th label="# Channels" k="channels" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap min-w-[200px]">Key Strengths</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap min-w-[200px]">Key Weaknesses</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => {
              const bcg = BCG_BADGE[c.bcg.category] || BCG_BADGE.question_mark
              const isHighlighted = highlightCol === c.id
              return (
                <tr
                  key={c.id}
                  onMouseEnter={() => setHighlightCol(c.id)}
                  onMouseLeave={() => setHighlightCol(null)}
                  className={`border-b border-surface-border/50 transition-colors ${isHighlighted ? 'bg-brand-900/10' : i % 2 === 0 ? 'bg-transparent' : 'bg-surface-elevated/20'}`}
                >
                  {/* Company – sticky */}
                  <td className={`px-4 py-3 sticky left-0 z-10 transition-colors ${isHighlighted ? 'bg-brand-900/20' : i % 2 === 0 ? 'bg-surface-card' : 'bg-surface-elevated/40'}`}>
                    <div>
                      <p className="font-semibold text-white whitespace-nowrap">{c.name}</p>
                      <a
                        href={c.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-400 transition mt-0.5"
                        onClick={e => e.stopPropagation()}
                      >
                        {c.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </td>

                  {/* Core Offer */}
                  <td className="px-4 py-3 text-slate-300 max-w-[200px]">
                    <p className="line-clamp-2 text-xs">{c.coreOffer}</p>
                  </td>

                  {/* USP */}
                  <td className="px-4 py-3 text-slate-300 max-w-[200px]">
                    <p className="line-clamp-2 text-xs">{c.usp}</p>
                  </td>

                  {/* Pricing */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-slate-400">{c.pricing || '—'}</span>
                  </td>

                  {/* Positioning */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs border rounded-full capitalize ${POSITIONING_BADGE[c.positioning] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {c.positioning}
                    </span>
                  </td>

                  {/* Traffic */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {TRAFFIC_DOTS(c.estimatedTrafficLevel)}
                      <span className="text-xs text-slate-500 capitalize">{c.estimatedTrafficLevel}</span>
                    </div>
                  </td>

                  {/* BCG Growth Score */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.bcg.marketGrowthScore}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{c.bcg.marketGrowthScore}</span>
                    </div>
                  </td>

                  {/* BCG Share Score */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.bcg.marketShareScore}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{c.bcg.marketShareScore}</span>
                    </div>
                  </td>

                  {/* BCG Badge */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs border rounded-full ${bcg.cls}`}>
                      {bcg.label}
                    </span>
                  </td>

                  {/* Top channels */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.marketingChannels.slice(0, 4).map(ch => (
                        <span key={ch} className="px-1.5 py-0.5 bg-surface-elevated border border-surface-border rounded text-xs text-slate-400">{ch}</span>
                      ))}
                      {c.marketingChannels.length > 4 && (
                        <span className="text-xs text-slate-600">+{c.marketingChannels.length - 4}</span>
                      )}
                    </div>
                  </td>

                  {/* # channels */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="text-sm font-mono text-slate-300">{c.marketingChannels.length}</span>
                  </td>

                  {/* Key Strengths */}
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5">
                      {c.strengths.slice(0, 2).map((s, j) => (
                        <li key={j} className="text-xs text-emerald-400 flex items-start gap-1">
                          <span className="flex-shrink-0">✓</span><span className="line-clamp-1">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* Key Weaknesses */}
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5">
                      {c.weaknesses.slice(0, 2).map((w, j) => (
                        <li key={j} className="text-xs text-red-400 flex items-start gap-1">
                          <span className="flex-shrink-0">✗</span><span className="line-clamp-1">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-surface-border text-xs text-slate-600">
        {competitors.length} competitors · Scores are 0–100 · Hover a row to highlight
      </div>
    </div>
  )
}
