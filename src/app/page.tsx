import InputForm from '@/components/InputForm'
import { Cpu, TrendingUp, Shield, Lightbulb, BarChart2, Zap } from 'lucide-react'

const FEATURES = [
  { icon: <Cpu className="w-5 h-5 text-brand-400" />, title: 'AI Competitor Discovery', desc: 'Automatically identifies key players and builds deep profiles for each' },
  { icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, title: 'Market & Industry Analysis', desc: 'Market size, growth trends, customer segments, and demand drivers' },
  { icon: <BarChart2 className="w-5 h-5 text-blue-400" />, title: 'BCG Matrix & SWOT', desc: 'Visualised strategic positioning with full SWOT per competitor and industry' },
  { icon: <Shield className="w-5 h-5 text-amber-400" />, title: "Porter's Five Forces", desc: 'Barriers to entry, buyer/supplier power, rivalry, and substitute threats' },
  { icon: <Lightbulb className="w-5 h-5 text-purple-400" />, title: 'Opportunities & Gaps', desc: 'Underserved segments, positioning gaps, and market white space' },
  { icon: <Zap className="w-5 h-5 text-rose-400" />, title: 'Actionable Insights', desc: 'Prioritised recommendations for market entry, offers, and differentiation' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-900/40 border border-brand-700/40 rounded-full text-brand-300 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
            AI-Powered Market Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Industry & Competitive{' '}
            <span className="bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent">
              Intelligence Engine
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Enter any industry and get a complete AI-generated intelligence report — competitor profiles,
            SWOT analysis, BCG Matrix, Porter's Five Forces, market gaps, and strategic recommendations.
          </p>

          <InputForm />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-surface-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Everything you need to understand a market
          </h2>
          <p className="text-slate-500 text-center mb-12">
            Deep-dive competitive intelligence in minutes, not weeks
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <div className="w-10 h-10 bg-surface-elevated rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-6 border-t border-surface-border bg-surface-card/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Report sections included</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['🏭', 'Industry Overview',         'Market size, growth rate, trends, segments, demand drivers'],
              ['⚔️', 'Competitor Landscape',      'Profiles, positioning, USP, pricing for each competitor'],
              ['📣', 'Marketing & Sales Breakdown','Channels, messaging, funnels, lead magnets, CTAs'],
              ['📰', 'Latest News & Developments', 'Funding, launches, partnerships, expansions'],
              ['🎯', 'SWOT Analysis',              'Strengths, weaknesses, opportunities, threats per competitor'],
              ['📊', 'BCG Matrix',                 'Visual growth-share matrix with competitor placement'],
              ["⚖️", "Porter's Five Forces",       'Industry forces affecting competitive dynamics'],
              ['💡', 'Opportunities & Gaps',       'Underserved segments, positioning white space'],
              ['🚀', 'Actionable Insights',        'Prioritised recommendations with implementation steps'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="flex items-start gap-3 p-4 bg-surface-card border border-surface-border rounded-xl">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-medium text-white text-sm">{title as string}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-surface-border py-8 px-6 text-center text-xs text-slate-600">
        <p>Industry &amp; Competitive Intelligence Engine — AI-generated insights using Claude AI</p>
        <p className="mt-1">Always verify data before making business decisions. Some figures are AI-estimated.</p>
      </footer>
    </div>
  )
}
