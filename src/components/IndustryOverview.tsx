'use client'
import { TrendingUp, Users, Zap, AlertTriangle, Globe, BarChart3 } from 'lucide-react'
import type { IndustryOverview as IOverview } from '@/types'

const STAGE_COLORS: Record<string, string> = {
  emerging: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  growth:   'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  mature:   'bg-blue-900/40 text-blue-300 border-blue-700/40',
  declining:'bg-red-900/40 text-red-300 border-red-700/40',
}

interface Props { data: IOverview }

export default function IndustryOverview({ data }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary + key stats */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6">
        <p className="text-slate-300 leading-relaxed mb-6">{data.summary}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<BarChart3 className="w-5 h-5 text-brand-400" />} label="Market Size" value={data.marketSize} />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Growth Rate" value={data.growthRate} />
          <StatCard
            icon={<span className="text-lg">🎯</span>}
            label="Stage"
            value={
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs border capitalize ${STAGE_COLORS[data.maturityStage] || 'bg-slate-700 text-slate-300'}`}>
                {data.maturityStage}
              </span>
            }
          />
          <StatCard icon={<Globe className="w-5 h-5 text-blue-400" />} label="Geography" value={data.geographicFocus} />
        </div>
      </div>

      {/* Lists */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ListCard
          icon={<TrendingUp className="w-4 h-4 text-brand-400" />}
          title="Key Trends"
          items={data.keyTrends}
          accent="brand"
        />
        <ListCard
          icon={<Users className="w-4 h-4 text-blue-400" />}
          title="Customer Segments"
          items={data.customerSegments}
          accent="blue"
        />
        <ListCard
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          title="Demand Drivers"
          items={data.demandDrivers}
          accent="emerald"
        />
        <ListCard
          icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
          title="Key Challenges"
          items={data.keyChallenges}
          accent="amber"
        />
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="bg-surface-elevated rounded-xl p-4 border border-surface-border">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  )
}

function ListCard({
  icon, title, items, accent,
}: { icon: React.ReactNode; title: string; items: string[]; accent: string }) {
  const dotColor: Record<string, string> = {
    brand: 'bg-brand-400',
    blue: 'bg-blue-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
  }
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor[accent]}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
