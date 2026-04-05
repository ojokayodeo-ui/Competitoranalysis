'use client'
import type { Opportunity } from '@/types'

const TYPE_ICON: Record<string, string> = {
  segment:    '👥',
  positioning:'🎯',
  offer:      '📦',
  channel:    '📣',
  geography:  '🌍',
  technology: '💻',
}

const URGENCY_STYLE: Record<string, string> = {
  high:   'bg-red-900/30 text-red-300 border-red-700/30',
  medium: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  low:    'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
}

const EFFORT_STYLE: Record<string, string> = {
  high:   'text-red-400',
  medium: 'text-amber-400',
  low:    'text-emerald-400',
}

interface Props { opportunities: Opportunity[] }

export default function OpportunitiesSection({ opportunities }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {opportunities.map((opp, i) => (
        <div
          key={opp.id || i}
          className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3 animate-slide-up"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{TYPE_ICON[opp.type] || '💡'}</span>
              <h3 className="text-sm font-bold text-white">{opp.title}</h3>
            </div>
            <span className={`flex-shrink-0 px-2 py-0.5 text-xs border rounded-full ${URGENCY_STYLE[opp.urgency]}`}>
              {opp.urgency} urgency
            </span>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">{opp.description}</p>

          <div className="flex items-center justify-between pt-2 border-t border-surface-border/50">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Target Segment</p>
              <p className="text-xs text-slate-300">{opp.targetSegment}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-0.5">Effort Required</p>
              <p className={`text-xs font-medium capitalize ${EFFORT_STYLE[opp.effort]}`}>{opp.effort}</p>
            </div>
          </div>

          {opp.competitorsIgnoring.length > 0 && (
            <div className="pt-1">
              <p className="text-xs text-slate-500 mb-1">Competitors not addressing this:</p>
              <div className="flex flex-wrap gap-1.5">
                {opp.competitorsIgnoring.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-surface-elevated border border-surface-border rounded-full text-xs text-slate-400">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
