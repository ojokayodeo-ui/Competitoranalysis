'use client'
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react'

interface Props { analysisId: string }

export default function ExportBar({ analysisId }: Props) {
  const download = (format: string) => {
    window.open(`/api/export/${analysisId}/${format}`, '_blank')
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 flex items-center gap-1">
        <Download className="w-3.5 h-3.5" /> Export:
      </span>
      <button
        onClick={() => download('json')}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white hover:border-brand-500 transition"
      >
        <FileJson className="w-3.5 h-3.5" /> JSON
      </button>
      <button
        onClick={() => download('csv')}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white hover:border-brand-500 transition"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
      </button>
      <button
        onClick={() => download('html')}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-surface-border rounded-lg text-xs text-slate-400 hover:text-white hover:border-brand-500 transition"
      >
        <FileText className="w-3.5 h-3.5" /> HTML Report
      </button>
    </div>
  )
}
