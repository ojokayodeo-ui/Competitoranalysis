'use client'

interface Props { score: number; reasoning: string }

export default function IcpScoreRing({ score, reasoning }: Props) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171'
  const label = score >= 75 ? 'Strong fit' : score >= 50 ? 'Moderate fit' : 'Weak fit'

  return (
    <div className="flex items-center gap-6">
      {/* Ring */}
      <div className="relative flex-shrink-0">
        <svg width="100" height="100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1e2433" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-white">{score}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>
      {/* Label + reasoning */}
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color }}>{label}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{reasoning}</p>
      </div>
    </div>
  )
}
