import OutreachForm from '@/components/outreach/OutreachForm'

export default function OutreachPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Mini branded header matching reference design ───────────────── */}
      <div className="border-b border-surface-border bg-surface/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <div className="flex items-center gap-2">
            <span className="text-brand-400">◆</span>
            <span className="text-sm font-semibold text-white">Cold Outreach Intelligence</span>
          </div>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-16 pb-20">

        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-900/50 border border-brand-700/40 rounded-full mb-6">
          <span className="text-brand-400">◆</span>
          <span className="text-sm text-brand-300 font-medium">Cold Outreach Intelligence</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-4 max-w-2xl leading-tight">
          From research to ready-to-send messages
        </h1>
        <p className="text-slate-400 text-center mb-10 max-w-xl text-lg">
          Enter your target company's website and get a complete outreach
          intelligence report in minutes.
        </p>

        {/* ── Form card ───────────────────────────────────────────────────── */}
        <div className="w-full max-w-2xl bg-[#111827]/80 border border-surface-border rounded-2xl p-7 shadow-2xl">
          <OutreachForm />
        </div>

        {/* ── Feature pills ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
          {[
            { dot: 'bg-brand-400',   label: 'Market Research' },
            { dot: 'bg-blue-400',    label: 'ICP + Personas' },
            { dot: 'bg-emerald-400', label: 'Campaign Strategy' },
            { dot: 'bg-purple-400',  label: 'Outreach Messages' },
            { dot: 'bg-amber-400',   label: 'Objection Handling' },
            { dot: 'bg-sky-400',     label: 'LinkedIn Scripts' },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
