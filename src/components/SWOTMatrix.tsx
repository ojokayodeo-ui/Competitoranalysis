'use client'
import type { SWOT } from '@/types'

interface Props {
  swot: SWOT
  title: string
}

const QUADRANTS = [
  {
    key: 'strengths' as const,
    label: 'Strengths',
    icon: '💪',
    bg: 'bg-emerald-900/20',
    border: 'border-emerald-800/40',
    title: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  {
    key: 'weaknesses' as const,
    label: 'Weaknesses',
    icon: '⚠️',
    bg: 'bg-red-900/20',
    border: 'border-red-800/40',
    title: 'text-red-400',
    dot: 'bg-red-400',
  },
  {
    key: 'opportunities' as const,
    label: 'Opportunities',
    icon: '🚀',
    bg: 'bg-blue-900/20',
    border: 'border-blue-800/40',
    title: 'text-blue-400',
    dot: 'bg-blue-400',
  },
  {
    key: 'threats' as const,
    label: 'Threats',
    icon: '🛡️',
    bg: 'bg-amber-900/20',
    border: 'border-amber-800/40',
    title: 'text-amber-400',
    dot: 'bg-amber-400',
  },
]

export default function SWOTMatrix({ swot, title }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {QUADRANTS.map(q => (
          <div key={q.key} className={`${q.bg} border ${q.border} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <span>{q.icon}</span>
              <h4 className={`text-sm font-semibold ${q.title}`}>{q.label}</h4>
              <span className={`ml-auto text-xs ${q.title} opacity-60`}>
                {swot[q.key].length} items
              </span>
            </div>
            <ul className="space-y-1.5">
              {swot[q.key].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${q.dot}`} />
                  {item}
                </li>
              ))}
              {swot[q.key].length === 0 && (
                <li className="text-xs text-slate-500 italic">No data available</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
