/**
 * Core research pipeline.
 * Orchestrates: discovery → scraping → AI profiling → industry analysis → finalise
 */
import { v4 as uuidv4 } from 'uuid'
import type {
  AnalysisRequest,
  AnalysisResult,
  Competitor,
} from '@/types'
import { updateAnalysis, updateStep } from './store'
import { runJsonPrompt } from './ai'
import { scrapeCompanyWebsite } from './scraper'
import {
  buildDiscoveryPrompt,
  buildCompetitorAnalysisPrompt,
  buildIndustryAnalysisPrompt,
} from './prompts'

interface RawCompetitorMeta {
  name: string
  website: string
  headquarters?: string
  foundedYear?: string
  employeeCount?: string
  positioning?: string
}

interface RawCompetitorProfile {
  coreOffer: string
  targetAudience: string
  usp: string
  pricing?: string
  estimatedTrafficLevel?: string
  marketingChannels?: string[]
  messagingAngles?: string[]
  funnelStructure?: string
  leadMagnets?: string[]
  ctas?: string[]
  contentStrategy?: string
  strengths?: string[]
  weaknesses?: string[]
  recentActivity?: string[]
  swot?: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  bcg?: {
    category: string
    marketGrowthScore: number
    marketShareScore: number
    relativeSizeScore: number
    reasoning: string
  }
}

interface RawIndustryAnalysis {
  industryOverview: {
    summary: string
    marketSize: string
    growthRate: string
    maturityStage: string
    keyTrends: string[]
    customerSegments: string[]
    demandDrivers: string[]
    keyChallenges: string[]
    geographicFocus: string
  }
  news: Array<{
    competitor: string
    headline: string
    summary: string
    date: string
    category: string
    sentiment: string
    significance: string
  }>
  strategicAnalysis: {
    industrySWOT: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }
    portersFiveForces: Record<string, { level: string; score: number; factors: string[]; summary: string }>
    bcgNarrative: string
    competitiveDynamics: string
  }
  opportunities: Array<{
    title: string
    description: string
    targetSegment: string
    type: string
    urgency: string
    effort: string
    competitorsIgnoring: string[]
  }>
  actionableInsights: Array<{
    title: string
    description: string
    category: string
    priority: string
    timeframe: string
    steps: string[]
    expectedOutcome: string
  }>
}

export async function runPipeline(
  analysisId: string,
  request: AnalysisRequest
): Promise<void> {
  const { industry, competitors: providedCompetitors } = request

  try {
    // ── Step 1: Init ──────────────────────────────────────────────────────────
    updateStep(analysisId, 'init', 'running', 'Starting research engine…')
    await delay(300)
    updateStep(analysisId, 'init', 'completed')
    updateAnalysis(analysisId, { status: 'running', currentStep: 'Discovering competitors…' })

    // ── Step 2: Discover competitors ──────────────────────────────────────────
    updateStep(analysisId, 'discover', 'running', `Searching for competitors in "${industry}"…`)

    const discoveryPrompt = buildDiscoveryPrompt(industry, providedCompetitors)
    const competitorMetas = await runJsonPrompt<RawCompetitorMeta[]>(discoveryPrompt)

    const maxCompetitors = parseInt(process.env.MAX_COMPETITORS || '6', 10)
    const selectedMetas = competitorMetas.slice(0, maxCompetitors)

    updateStep(analysisId, 'discover', 'completed', `Found ${selectedMetas.length} competitors`)
    updateAnalysis(analysisId, { currentStep: 'Gathering web intelligence…' })

    // ── Step 3: Scrape websites ───────────────────────────────────────────────
    updateStep(analysisId, 'scrape', 'running', 'Fetching competitor websites…')

    const scrapeResults = await Promise.allSettled(
      selectedMetas.map(c => scrapeCompanyWebsite(c.name, c.website))
    )

    const scrapedData = scrapeResults.map((r, i) =>
      r.status === 'fulfilled' ? r.value : `[No data for ${selectedMetas[i].name}]`
    )

    updateStep(analysisId, 'scrape', 'completed', 'Web data collected')
    updateAnalysis(analysisId, { currentStep: 'Building competitor profiles…' })

    // ── Step 4: AI competitor profiles ────────────────────────────────────────
    updateStep(analysisId, 'ai_profiles', 'running', 'Running AI analysis on each competitor…')

    const profilePromises = selectedMetas.map((meta, i) =>
      runJsonPrompt<RawCompetitorProfile>(
        buildCompetitorAnalysisPrompt(industry, meta, scrapedData[i])
      ).catch(() => null)
    )

    const rawProfiles = await Promise.all(profilePromises)

    const competitors: Competitor[] = selectedMetas.map((meta, i) => {
      const profile = rawProfiles[i]
      return mergeCompetitor(meta, profile)
    })

    updateStep(analysisId, 'ai_profiles', 'completed', `${competitors.length} profiles built`)
    updateAnalysis(analysisId, { currentStep: 'Running SWOT & BCG analysis…' })

    // ── Step 5: SWOT & BCG already embedded in profiles ───────────────────────
    updateStep(analysisId, 'ai_swot', 'running', 'Finalising SWOT and BCG classifications…')
    await delay(500)
    updateStep(analysisId, 'ai_swot', 'completed')
    updateAnalysis(analysisId, { currentStep: 'Analysing industry strategy…' })

    // ── Step 6: Industry-level analysis ───────────────────────────────────────
    updateStep(analysisId, 'ai_strategy', 'running', 'Running Porter\'s Five Forces and industry SWOT…')

    const industryAnalysis = await runJsonPrompt<RawIndustryAnalysis>(
      buildIndustryAnalysisPrompt(industry, competitors.map(c => c.name))
    )

    updateStep(analysisId, 'ai_strategy', 'completed')
    updateAnalysis(analysisId, { currentStep: 'Generating actionable insights…' })

    // ── Step 7: Insights already in industryAnalysis ──────────────────────────
    updateStep(analysisId, 'ai_insights', 'running', 'Processing opportunities and strategic recommendations…')
    await delay(400)
    updateStep(analysisId, 'ai_insights', 'completed')
    updateAnalysis(analysisId, { currentStep: 'Compiling final report…' })

    // ── Step 8: Finalise ──────────────────────────────────────────────────────
    updateStep(analysisId, 'finalise', 'running', 'Assembling intelligence report…')

    const result: AnalysisResult = {
      id: analysisId,
      industry,
      generatedAt: new Date().toISOString(),
      dataConfidence: 'medium',
      aiDisclaimer:
        'This report is AI-generated using publicly available knowledge and live web data where accessible. ' +
        'Financial figures marked "(estimated)" are approximations. Verify critical data before making business decisions.',
      industryOverview: industryAnalysis.industryOverview as AnalysisResult['industryOverview'],
      competitors,
      news: (industryAnalysis.news || []).map(n => ({ ...n, id: uuidv4() }) as AnalysisResult['news'][0]),
      strategicAnalysis: industryAnalysis.strategicAnalysis as unknown as AnalysisResult['strategicAnalysis'],
      opportunities: (industryAnalysis.opportunities || []).map(o => ({ ...o, id: uuidv4() }) as AnalysisResult['opportunities'][0]),
      actionableInsights: (industryAnalysis.actionableInsights || []).map(a => ({ ...a, id: uuidv4() }) as AnalysisResult['actionableInsights'][0]),
    }

    updateStep(analysisId, 'finalise', 'completed')
    updateAnalysis(analysisId, {
      status: 'completed',
      progress: 100,
      currentStep: 'Analysis complete',
      result,
      completedAt: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    updateAnalysis(analysisId, {
      status: 'failed',
      error: msg,
      currentStep: 'Analysis failed',
    })
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mergeCompetitor(meta: RawCompetitorMeta, profile: RawCompetitorProfile | null): Competitor {
  const safe: Partial<RawCompetitorProfile> = profile ?? {}
  return {
    id: uuidv4(),
    name: meta.name,
    website: meta.website,
    foundedYear: meta.foundedYear,
    employeeCount: meta.employeeCount,
    headquarters: meta.headquarters,
    positioning: (meta.positioning as Competitor['positioning']) || 'mid-market',
    coreOffer: safe.coreOffer || 'Information not available',
    targetAudience: safe.targetAudience || 'Not specified',
    usp: safe.usp || 'Not specified',
    pricing: safe.pricing,
    estimatedTrafficLevel: (safe.estimatedTrafficLevel as Competitor['estimatedTrafficLevel']) || 'medium',
    marketingChannels: safe.marketingChannels || [],
    messagingAngles: safe.messagingAngles || [],
    funnelStructure: safe.funnelStructure || 'Not available',
    leadMagnets: safe.leadMagnets || [],
    ctas: safe.ctas || [],
    contentStrategy: safe.contentStrategy || 'Not available',
    strengths: safe.strengths || [],
    weaknesses: safe.weaknesses || [],
    recentActivity: safe.recentActivity || [],
    swot: safe.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
    bcg: {
      category: (safe.bcg?.category as Competitor['bcg']['category']) || 'question_mark',
      marketGrowthScore: safe.bcg?.marketGrowthScore ?? 50,
      marketShareScore: safe.bcg?.marketShareScore ?? 50,
      relativeSizeScore: safe.bcg?.relativeSizeScore ?? 25,
      reasoning: safe.bcg?.reasoning || 'Insufficient data for classification',
    },
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
