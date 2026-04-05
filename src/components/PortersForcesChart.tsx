'use client'
import type { PortersFiveForces, ForceLevel } from '@/types'

const LEVEL_STYLE: Record<ForceLevel, { bar: string; badge: string; text: string }> = {
  high:   { bar: 'bg-red-500',    badge: 'bg-red-900/40 text-red-300 border-red-700/30',    text: 'text-red-400' },
  medium: { bar: 'bg-amber-500',  badge: 'bg-amber-900/40 text-amber-300 border-amber-700/30', text: 'text-amber-400' },
  low:    { bar: 'bg-emerald-500',badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/30', text: 'text-emerald-400' },
}

const FORCES: Array<{ key: keyof PortersFiveForces; label: string; icon: string }> = [
  { key: 'barrierToEntry',    label: 'Barrier to Entry',   icon: '🚧' },
  { key: 'supplierPower',     label: 'Supplier Power',      icon: '📦' },
  { key: 'buyerPower',        label: 'Buyer Power',         icon: '👤' },
  { key: 'competitiveRivalry',label: 'Competitive Rivalry', icon: '⚔️' },
  { key: 'substituteThreat',  label: 'Substitute Threat',   icon: '🔄' },
]

interface Props { forces: PortersFiveForces }

export default function PortersForcesChart({ forces }: Props) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-5">
        Porter's Five Forces
      </h3>
      <div className="space-y-5">
        {FORCES.map(({ key, label, icon }) => {
          const force = forces[key]
          if (!force) return null
          const style = LEVEL_STYLE[force.level] || LEVEL_STYLE.medium
          const scorePercent = (force.score / 10) * 100

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">{force.score}/10</span>
                  <span className={`px-2 py-0.5 text-xs border rounded-full capitalize ${style.badge}`}>
                    {force.level}
                  </span>
                </div>
              </div>
              {/* Score bar */}
              <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${style.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              {/* Summary */}
              <p className="text-xs text-slate-400 mb-1">{force.summary}</p>
              {/* Factors */}
              <div className="flex flex-wrap gap-1.5">
                {force.factors.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 bg-surface-elevated border border-surface-border rounded-md text-xs text-slate-400">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
