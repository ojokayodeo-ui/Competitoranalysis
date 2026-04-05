/**
 * In-memory analysis store.
 * For production, replace with Redis or a database.
 */
import type { AnalysisState, ProgressStep } from '@/types'

// Module-level singleton – persists for the lifetime of the Node process
const store = new Map<string, AnalysisState>()

// Event subscribers for SSE streaming
const subscribers = new Map<string, Set<(event: string) => void>>()

export function createAnalysis(id: string, industry: string): AnalysisState {
  const state: AnalysisState = {
    id,
    industry,
    status: 'pending',
    progress: 0,
    currentStep: 'Initialising analysis…',
    steps: buildInitialSteps(),
    createdAt: new Date().toISOString(),
  }
  store.set(id, state)
  return state
}

export function getAnalysis(id: string): AnalysisState | undefined {
  return store.get(id)
}

export function updateAnalysis(id: string, patch: Partial<AnalysisState>): AnalysisState | undefined {
  const current = store.get(id)
  if (!current) return undefined
  const updated = { ...current, ...patch }
  store.set(id, updated)
  // Notify all SSE subscribers
  emit(id, JSON.stringify(updated))
  return updated
}

export function updateStep(id: string, stepId: string, status: ProgressStep['status'], detail?: string) {
  const state = store.get(id)
  if (!state) return
  const steps = state.steps.map(s =>
    s.id === stepId ? { ...s, status, ...(detail ? { detail } : {}) } : s
  )
  const completedCount = steps.filter(s => s.status === 'completed').length
  const progress = Math.round((completedCount / steps.length) * 100)
  updateAnalysis(id, { steps, progress })
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

export function subscribe(id: string, cb: (event: string) => void): () => void {
  if (!subscribers.has(id)) subscribers.set(id, new Set())
  subscribers.get(id)!.add(cb)
  return () => subscribers.get(id)?.delete(cb)
}

function emit(id: string, data: string) {
  subscribers.get(id)?.forEach(cb => cb(data))
}

// ─── Step definitions ─────────────────────────────────────────────────────────

function buildInitialSteps(): ProgressStep[] {
  return [
    { id: 'init',        label: 'Initialising research engine',       status: 'pending' },
    { id: 'discover',    label: 'Discovering competitors',             status: 'pending' },
    { id: 'scrape',      label: 'Gathering web intelligence',          status: 'pending' },
    { id: 'ai_profiles', label: 'Building competitor profiles',        status: 'pending' },
    { id: 'ai_swot',     label: 'Running SWOT & BCG analysis',         status: 'pending' },
    { id: 'ai_strategy', label: 'Analysing industry strategy',         status: 'pending' },
    { id: 'ai_insights', label: 'Generating actionable insights',      status: 'pending' },
    { id: 'finalise',    label: 'Compiling final intelligence report', status: 'pending' },
  ]
}
