'use client'
import type { Competitor } from '@/types'

interface Props {
  competitors: Competitor[]
  narrative: string
}

const QUADRANT_LABELS = [
  { x: 25, y: 25, label: '❓ Question Marks', sub: 'High Growth · Low Share', color: 'text-blue-400' },
  { x: 75, y: 25, label: '⭐ Stars', sub: 'High Growth · High Share', color: 'text-yellow-400' },
  { x: 25, y: 75, label: '🐕 Dogs', sub: 'Low Growth · Low Share', color: 'text-slate-500' },
  { x: 75, y: 75, label: '🐄 Cash Cows', sub: 'Low Growth · High Share', color: 'text-emerald-400' },
]

const BCG_COLOR: Record<string, string> = {
  star:          '#facc15',
  cash_cow:      '#34d399',
  question_mark: '#60a5fa',
  dog:           '#94a3b8',
}

export default function BCGMatrix({ competitors, narrative }: Props) {
  // Map BCG scores to SVG coords (0-100 score → 5-95% of chart)
  // X axis: market share (left=low, right=high)
  // Y axis: market growth (top=high, bottom=low) — inverted for SVG
  const mapX = (score: number) => 5 + (score / 100) * 90
  const mapY = (score: number) => 95 - (score / 100) * 90  // invert

  return (
    <div className="space-y-4">
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">BCG Growth–Share Matrix</h3>

        <div className="relative w-full" style={{ paddingBottom: '80%' }}>
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'visible' }}
          >
            {/* Quadrant backgrounds */}
            <rect x="0" y="0" width="50" height="50" fill="#1d3361" opacity="0.3" rx="1" />
            <rect x="50" y="0" width="50" height="50" fill="#3b2a00" opacity="0.3" rx="1" />
            <rect x="0" y="50" width="50" height="50" fill="#0f172a" opacity="0.4" rx="1" />
            <rect x="50" y="50" width="50" height="50" fill="#052e16" opacity="0.3" rx="1" />

            {/* Center dividers */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="#2a3347" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#2a3347" strokeWidth="0.5" />

            {/* Quadrant labels */}
            {QUADRANT_LABELS.map((q, i) => (
              <g key={i}>
                <text
                  x={q.x} y={q.y - 4}
                  textAnchor="middle"
                  fontSize="3.5"
                  fill={q.color === 'text-yellow-400' ? '#facc15' :
                        q.color === 'text-emerald-400' ? '#34d399' :
                        q.color === 'text-blue-400' ? '#60a5fa' : '#64748b'}
                  className="font-medium"
                >
                  {q.label}
                </text>
                <text x={q.x} y={q.y + 1} textAnchor="middle" fontSize="2.5" fill="#475569">
                  {q.sub}
                </text>
              </g>
            ))}

            {/* Axis labels */}
            <text x="50" y="104" textAnchor="middle" fontSize="2.8" fill="#64748b">
              ← Market Share →
            </text>
            <text
              x="-50" y="50" textAnchor="middle" fontSize="2.8" fill="#64748b"
              transform="rotate(-90, -4, 50)"
            >
              ← Market Growth →
            </text>

            {/* Competitor bubbles */}
            {competitors.map(c => {
              const cx = mapX(c.bcg.marketShareScore)
              const cy = mapY(c.bcg.marketGrowthScore)
              const r = (c.bcg.relativeSizeScore / 50) * 6 + 2  // 2-8 radius
              const color = BCG_COLOR[c.bcg.category] || '#94a3b8'
              return (
                <g key={c.id}>
                  <circle
                    cx={cx} cy={cy} r={r}
                    fill={color}
                    opacity="0.75"
                    stroke={color}
                    strokeWidth="0.5"
                  />
                  <text
                    x={cx} y={cy - r - 1}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill={color}
                    style={{ pointerEvents: 'none' }}
                  >
                    {c.name.split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {competitors.map(c => {
            const color = BCG_COLOR[c.bcg.category] || '#94a3b8'
            return (
              <div key={c.id} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                {c.name}
              </div>
            )
          })}
        </div>
      </div>

      {/* Narrative */}
      {narrative && (
        <div className="bg-surface-card border border-surface-border rounded-xl p-4">
          <h4 className="text-sm font-semibold text-slate-400 mb-2">BCG Landscape Analysis</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  )
}
