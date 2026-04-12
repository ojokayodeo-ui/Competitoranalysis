import type { OutreachState, OutreachStep } from '@/types/outreach'

const store = new Map<string, OutreachState>()
const subscribers = new Map<string, Set<(data: string) => void>>()

export function createOutreach(id: string, req: Omit<OutreachState, 'id' | 'status' | 'progress' | 'currentStep' | 'steps' | 'createdAt'>): OutreachState {
  const state: OutreachState = {
    id,
    ...req,
    status: 'pending',
    progress: 0,
    currentStep: 'Initialising…',
    steps: buildInitialSteps(),
    createdAt: new Date().toISOString(),
  }
  store.set(id, state)
  return state
}

export function getOutreach(id: string): OutreachState | undefined {
  return store.get(id)
}

export function updateOutreach(id: string, patch: Partial<OutreachState>): OutreachState | undefined {
  const current = store.get(id)
  if (!current) return undefined
  const updated = { ...current, ...patch }
  store.set(id, updated)
  emit(id, JSON.stringify(updated))
  return updated
}

export function updateOutreachStep(id: string, stepId: string, status: OutreachStep['status'], detail?: string) {
  const state = store.get(id)
  if (!state) return
  const steps = state.steps.map(s =>
    s.id === stepId ? { ...s, status, ...(detail ? { detail } : {}) } : s
  )
  const completedCount = steps.filter(s => s.status === 'completed').length
  const progress = Math.round((completedCount / steps.length) * 100)
  updateOutreach(id, { steps, progress })
}

export function subscribeOutreach(id: string, cb: (data: string) => void): () => void {
  if (!subscribers.has(id)) subscribers.set(id, new Set())
  subscribers.get(id)!.add(cb)
  return () => subscribers.get(id)?.delete(cb)
}

function emit(id: string, data: string) {
  subscribers.get(id)?.forEach(cb => cb(data))
}

function buildInitialSteps(): OutreachStep[] {
  return [
    { id: 'scrape',        label: 'Scraping company website',           status: 'pending' },
    { id: 'intelligence',  label: 'Analysing company profile',          status: 'pending' },
    { id: 'hooks',         label: 'Extracting personalisation hooks',   status: 'pending' },
    { id: 'emails',        label: 'Writing email sequences',            status: 'pending' },
    { id: 'linkedin',      label: 'Crafting LinkedIn messages',         status: 'pending' },
    { id: 'objections',    label: 'Building objection handling',        status: 'pending' },
    { id: 'strategy',      label: 'Designing campaign strategy',        status: 'pending' },
    { id: 'finalise',      label: 'Compiling outreach report',          status: 'pending' },
  ]
}
