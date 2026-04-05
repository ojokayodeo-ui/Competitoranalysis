// ─── Request / State ─────────────────────────────────────────────────────────

export interface AnalysisRequest {
  industry: string
  competitors?: string[]
}

export type AnalysisStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface ProgressStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  detail?: string
}

export interface AnalysisState {
  id: string
  industry: string
  status: AnalysisStatus
  progress: number           // 0-100
  currentStep: string
  steps: ProgressStep[]
  result?: AnalysisResult
  error?: string
  createdAt: string
  completedAt?: string
}

// ─── Core Result ─────────────────────────────────────────────────────────────

export interface AnalysisResult {
  id: string
  industry: string
  generatedAt: string
  dataConfidence: 'high' | 'medium' | 'low'
  aiDisclaimer: string
  industryOverview: IndustryOverview
  competitors: Competitor[]
  news: NewsItem[]
  strategicAnalysis: StrategicAnalysis
  opportunities: Opportunity[]
  actionableInsights: ActionableInsight[]
}

// ─── Industry Overview ────────────────────────────────────────────────────────

export interface IndustryOverview {
  summary: string
  marketSize: string
  growthRate: string
  maturityStage: 'emerging' | 'growth' | 'mature' | 'declining'
  keyTrends: string[]
  customerSegments: string[]
  demandDrivers: string[]
  keyChallenges: string[]
  geographicFocus: string
}

// ─── Competitor Profile ───────────────────────────────────────────────────────

export type MarketPositioning = 'premium' | 'mid-market' | 'budget' | 'niche' | 'enterprise' | 'freemium'

export interface Competitor {
  id: string
  name: string
  website: string
  foundedYear?: string
  employeeCount?: string
  headquarters?: string
  coreOffer: string
  targetAudience: string
  usp: string
  pricing?: string
  positioning: MarketPositioning
  // Marketing
  marketingChannels: string[]
  messagingAngles: string[]
  funnelStructure: string
  leadMagnets: string[]
  ctas: string[]
  contentStrategy: string
  estimatedTrafficLevel: 'very high' | 'high' | 'medium' | 'low' | 'very low'
  // Strategic
  swot: SWOT
  bcg: BCGClassification
  recentActivity: string[]
  strengths: string[]
  weaknesses: string[]
}

// ─── SWOT ─────────────────────────────────────────────────────────────────────

export interface SWOT {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

// ─── BCG Matrix ───────────────────────────────────────────────────────────────

export type BCGCategory = 'star' | 'cash_cow' | 'question_mark' | 'dog'

export interface BCGClassification {
  category: BCGCategory
  marketGrowthScore: number   // 0-100 (used for Y axis)
  marketShareScore: number    // 0-100 (used for X axis)
  relativeSizeScore: number   // 10-50 (bubble size)
  reasoning: string
}

// ─── Porter's Five Forces ─────────────────────────────────────────────────────

export type ForceLevel = 'high' | 'medium' | 'low'

export interface ForceAnalysis {
  level: ForceLevel
  score: number       // 1-10
  factors: string[]
  summary: string
}

export interface PortersFiveForces {
  barrierToEntry: ForceAnalysis
  supplierPower: ForceAnalysis
  buyerPower: ForceAnalysis
  competitiveRivalry: ForceAnalysis
  substituteThreat: ForceAnalysis
}

// ─── Strategic Analysis ───────────────────────────────────────────────────────

export interface StrategicAnalysis {
  industrySWOT: SWOT
  portersFiveForces: PortersFiveForces
  bcgNarrative: string
  competitiveDynamics: string
}

// ─── News ─────────────────────────────────────────────────────────────────────

export type NewsCategory = 'funding' | 'launch' | 'partnership' | 'expansion' | 'leadership' | 'award' | 'acquisition' | 'other'
export type NewsSentiment = 'positive' | 'neutral' | 'negative'

export interface NewsItem {
  id: string
  competitor: string        // competitor name or 'industry' for industry-wide
  headline: string
  summary: string
  date: string              // approximate e.g. "Q1 2025" or "March 2025"
  category: NewsCategory
  sentiment: NewsSentiment
  significance: 'high' | 'medium' | 'low'
}

// ─── Opportunities ────────────────────────────────────────────────────────────

export type OpportunityType = 'segment' | 'positioning' | 'offer' | 'channel' | 'geography' | 'technology'

export interface Opportunity {
  id: string
  title: string
  description: string
  targetSegment: string
  type: OpportunityType
  urgency: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  competitorsIgnoring: string[]
}

// ─── Actionable Insights ─────────────────────────────────────────────────────

export type InsightCategory = 'market_entry' | 'offer' | 'marketing' | 'differentiation' | 'partnerships' | 'pricing'

export interface ActionableInsight {
  id: string
  title: string
  description: string
  category: InsightCategory
  priority: 'high' | 'medium' | 'low'
  timeframe: 'immediate' | 'short_term' | 'long_term'
  steps: string[]
  expectedOutcome: string
}

// ─── Export ───────────────────────────────────────────────────────────────────

export type ExportFormat = 'json' | 'csv' | 'html'
