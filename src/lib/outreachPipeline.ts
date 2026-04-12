import { v4 as uuidv4 } from 'uuid'
import type { OutreachRequest, OutreachReport } from '@/types/outreach'
import { updateOutreach, updateOutreachStep } from './outreachStore'
import { runJsonPrompt } from './ai'
import { scrapeUrl } from './scraper'
import { buildOutreachPrompt } from './outreachPrompts'

export async function runOutreachPipeline(id: string, req: OutreachRequest): Promise<void> {
  const { companyUrl, targetMarket, yourProduct, geographyFocus, senderName, senderCompany } = req

  try {
    updateOutreach(id, { status: 'running', currentStep: 'Scraping company website…' })

    // ── Step 1: Scrape ───────────────────────────────────────────────────────
    updateOutreachStep(id, 'scrape', 'running', `Fetching ${companyUrl}…`)

    const scrapeResult = await scrapeUrl(companyUrl)
    let scrapedContent: string

    if (scrapeResult.success) {
      scrapedContent = [
        `TITLE: ${scrapeResult.title}`,
        `META DESCRIPTION: ${scrapeResult.description}`,
        `HEADINGS: ${scrapeResult.headings.join(' | ')}`,
        `BODY TEXT: ${scrapeResult.bodyText}`,
      ].join('\n')
      updateOutreachStep(id, 'scrape', 'completed', `${scrapeResult.bodyText.length} characters extracted`)
    } else {
      scrapedContent = `[Scrape failed: ${scrapeResult.error}] — generating outreach from domain and market context only.`
      updateOutreachStep(id, 'scrape', 'completed', 'Scrape limited — using AI knowledge')
    }

    // ── Steps 2–7: Single AI call covers everything ──────────────────────────
    updateOutreachStep(id, 'intelligence', 'running', 'Analysing company profile…')
    updateOutreach(id, { currentStep: 'Analysing company profile…' })

    const prompt = buildOutreachPrompt({
      scrapedContent,
      companyUrl,
      targetMarket,
      yourProduct,
      geographyFocus,
      senderName,
      senderCompany,
    })

    // One comprehensive AI call
    type RawReport = Omit<OutreachReport, 'id' | 'companyUrl' | 'generatedAt' | 'disclaimer'>
    const rawReport = await runJsonPrompt<RawReport>(
      prompt,
      'You are an expert B2B sales strategist and copywriter. Return ONLY valid JSON — no markdown, no explanation.'
    )

    updateOutreachStep(id, 'intelligence', 'completed')

    // Mark remaining steps complete with small delays for UX
    const remaining = ['hooks', 'emails', 'linkedin', 'objections', 'strategy'] as const
    const labels: Record<string, string> = {
      hooks:      'Personalisation hooks extracted',
      emails:     `${rawReport.emailSequence?.length ?? 5} emails written`,
      linkedin:   'LinkedIn messages crafted',
      objections: `${rawReport.objectionHandling?.length ?? 5} objections handled`,
      strategy:   'Campaign strategy designed',
    }

    for (const stepId of remaining) {
      updateOutreachStep(id, stepId, 'running')
      await delay(200)
      updateOutreachStep(id, stepId, 'completed', labels[stepId])
    }

    updateOutreachStep(id, 'finalise', 'running', 'Assembling report…')
    await delay(200)

    const report: OutreachReport = {
      id,
      companyUrl,
      generatedAt: new Date().toISOString(),
      disclaimer:
        'This report was AI-generated using publicly accessible website data. ' +
        'Email copy uses [[PLACEHOLDERS]] — replace before sending. ' +
        'Always verify company details before outreach.',
      ...rawReport,
    }

    updateOutreachStep(id, 'finalise', 'completed')
    updateOutreach(id, {
      status: 'completed',
      progress: 100,
      currentStep: 'Report ready',
      result: report,
      completedAt: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    updateOutreach(id, {
      status: 'failed',
      error: msg,
      currentStep: 'Pipeline failed',
    })
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
