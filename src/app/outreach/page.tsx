import OutreachForm from '@/components/outreach/OutreachForm'
import { Mail, Linkedin, Target, MessageSquare, BarChart2, Shield } from 'lucide-react'

const FEATURES = [
  { icon: <Target className="w-4 h-4 text-brand-400" />,       label: 'Company Intelligence',    desc: 'ICP match score, pain points, growth signals' },
  { icon: <BarChart2 className="w-4 h-4 text-emerald-400" />,  label: 'Personalisation Hooks',   desc: 'Specific openers pulled from their website' },
  { icon: <Mail className="w-4 h-4 text-blue-400" />,          label: '5-Email Sequence',        desc: 'Day 1 → 25 with subject lines and CTAs' },
  { icon: <Linkedin className="w-4 h-4 text-sky-400" />,       label: 'LinkedIn Messages',       desc: 'Connect request, follow-ups, voice note script' },
  { icon: <Shield className="w-4 h-4 text-amber-400" />,       label: 'Objection Handling',      desc: '5 common objections with scripted responses' },
  { icon: <MessageSquare className="w-4 h-4 text-purple-400" />,label: 'Campaign Strategy',      desc: 'Channel, timing, key messages, and do-nots' },
]

export default function OutreachPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-900/40 border border-brand-700/40 rounded-full text-brand-300 text-sm mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
            Cold Outreach Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            From research to{' '}
            <span className="bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent">
              ready-to-send messages
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Enter a company's website URL and your target market — get a complete personalised
            outreach report with email sequences, LinkedIn messages, and campaign strategy.
          </p>
        </div>

        {/* Form card */}
        <div className="relative max-w-2xl mx-auto bg-surface-card border border-surface-border rounded-2xl p-7">
          <OutreachForm />
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-center gap-2 px-3 py-1.5 bg-surface-card border border-surface-border rounded-full text-xs text-slate-400">
              {f.icon}
              <span className="font-medium text-slate-300">{f.label}</span>
              <span className="hidden sm:inline text-slate-600">· {f.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
