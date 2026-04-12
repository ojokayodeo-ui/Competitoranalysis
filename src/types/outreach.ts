// ─── Request ──────────────────────────────────────────────────────────────────

export interface OutreachRequest {
  companyUrl: string
  targetMarket: string
  yourProduct?: string
  geographyFocus: string
  senderName?: string
  senderCompany?: string
}

// ─── State ────────────────────────────────────────────────────────────────────

export type OutreachStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface OutreachStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  detail?: string
}

export interface OutreachState {
  id: string
  companyUrl: string
  targetMarket: string
  yourProduct?: string
  geographyFocus: string
  senderName?: string
  senderCompany?: string
  status: OutreachStatus
  progress: number
  currentStep: string
  steps: OutreachStep[]
  result?: OutreachReport
  error?: string
  createdAt: string
  completedAt?: string
}

// ─── Report ───────────────────────────────────────────────────────────────────

export interface OutreachReport {
  id: string
  companyUrl: string
  generatedAt: string
  disclaimer: string

  companyIntelligence: CompanyIntelligence
  personalizationHooks: PersonalizationHook[]
  emailSequence: EmailStep[]
  linkedInMessages: LinkedInMessages
  objectionHandling: Objection[]
  campaignStrategy: CampaignStrategy
}

// ─── Company Intelligence ─────────────────────────────────────────────────────

export interface CompanyIntelligence {
  name: string
  website: string
  description: string
  industry: string
  estimatedSize: string           // e.g. "50–200 employees"
  likelyPainPoints: string[]
  growthSignals: string[]         // things found on site suggesting growth
  techStackHints: string[]        // tools/tech detected or mentioned
  keyMessages: string[]           // what they claim to be great at
  icpMatchScore: number           // 0–100
  icpMatchReasoning: string
  outreachAngle: string           // best angle to lead with
}

// ─── Personalisation Hooks ────────────────────────────────────────────────────

export interface PersonalizationHook {
  hook: string          // the observation (e.g. "You recently rebranded to…")
  sourceContext: string // where/what on the site (e.g. "Homepage hero")
  usageExample: string  // how to use it in an opener
  strength: 'strong' | 'medium' | 'light'
}

// ─── Email Sequence ───────────────────────────────────────────────────────────

export interface EmailStep {
  step: number
  timing: string        // "Day 1", "Day 4", "Day 8"
  type: 'initial' | 'follow_up' | 'breakup'
  subject: string
  previewText: string   // shown in inbox preview
  body: string          // full email body with [[PLACEHOLDERS]]
  cta: string
  writingNotes: string  // tips for personalising further
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────

export interface LinkedInMessages {
  connectionRequest: string   // 300-char limit
  immediateFollowUp: string   // after they accept
  valueMessage: string        // if no response after 5 days
  voiceNoteScript: string     // script for a 60s voice note
}

// ─── Objection Handling ───────────────────────────────────────────────────────

export interface Objection {
  objection: string
  category: 'timing' | 'price' | 'trust' | 'competitor' | 'not_interested' | 'wrong_person'
  response: string
  followUpLine: string
}

// ─── Campaign Strategy ────────────────────────────────────────────────────────

export interface CampaignStrategy {
  recommendedApproach: string
  sequenceOverview: string
  primaryChannel: string
  secondaryChannel: string
  idealSendTimes: string
  keyMessages: string[]
  doNots: string[]
  successMetrics: string[]
}

// ─── Export ───────────────────────────────────────────────────────────────────

export type OutreachExportFormat = 'html' | 'txt' | 'json'
