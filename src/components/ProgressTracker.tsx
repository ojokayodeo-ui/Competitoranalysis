'use client'
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react'
import type { ProgressStep } from '@/types'

interface Props {
  steps: ProgressStep[]
  progress: number
  currentStep: string
}

const STATUS_ICON = {
  pending:   <Circle className="w-5 h-5 text-slate-600" />,
  running:   <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />,
  completed: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  failed:    <XCircle className="w-5 h-5 text-red-400" />,
}

const STATUS_TEXT = {
  pending:   'text-slate-500',
  running:   'text-white',
  completed: 'text-emerald-400',
  failed:    'text-red-400',
}

export default function ProgressTracker({ steps, progress, currentStep }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">{currentStep}</span>
          <span className="text-sm font-mono text-brand-400">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              step.status === 'running'
                ? 'bg-brand-900/20 border border-brand-800/40'
                : 'bg-transparent'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">{STATUS_ICON[step.status]}</div>
            <div>
              <p className={`text-sm font-medium ${STATUS_TEXT[step.status]}`}>
                {step.label}
              </p>
              {step.detail && step.status !== 'pending' && (
                <p className="text-xs text-slate-500 mt-0.5">{step.detail}</p>
              )}
            </div>
            <div className="ml-auto text-xs text-slate-600 font-mono">
              {i + 1}/{steps.length}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-600">
        This typically takes 1–3 minutes depending on the industry scope
      </p>
    </div>
  )
}
