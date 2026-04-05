/**
 * Lightweight web scraper using axios + cheerio.
 * Returns structured text snippets for AI consumption.
 */
import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapeResult {
  url: string
  title: string
  description: string
  headings: string[]
  bodyText: string
  links: string[]
  success: boolean
  error?: string
}

const USER_AGENT =
  'Mozilla/5.0 (compatible; IntelligenceBot/1.0; +https://intelligence-engine.app)'

const TIMEOUT_MS = 10_000

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const base: ScrapeResult = { url, title: '', description: '', headings: [], bodyText: '', links: [], success: false }

  try {
    const { data, headers } = await axios.get(url, {
      timeout: TIMEOUT_MS,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
      maxRedirects: 5,
    })

    if (typeof data !== 'string') return { ...base, error: 'Non-HTML response' }

    const $ = cheerio.load(data)

    // Remove noisy elements
    $('script, style, nav, footer, iframe, noscript').remove()

    const title = $('title').first().text().trim()
    const description =
      $('meta[name="description"]').attr('content')?.trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      ''

    const headings: string[] = []
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim()
      if (text) headings.push(text)
    })

    // Extract meaningful body text (limit to ~3000 chars)
    const bodyText = $('main, article, section, .content, body')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000)

    const links: string[] = []
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || ''
      if (href.startsWith('http')) links.push(href)
    })

    return {
      ...base,
      title,
      description,
      headings: headings.slice(0, 20),
      bodyText,
      links: Array.from(new Set(links)).slice(0, 30),
      success: true,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ...base, error: msg }
  }
}

export async function scrapeCompanyWebsite(name: string, website: string): Promise<string> {
  const result = await scrapeUrl(website)

  if (!result.success) {
    return `[Scrape failed for ${website}: ${result.error}] — using AI knowledge only.`
  }

  return `
COMPANY: ${name}
URL: ${website}
TITLE: ${result.title}
META DESCRIPTION: ${result.description}
HEADINGS: ${result.headings.join(' | ')}
BODY EXCERPT: ${result.bodyText}
`.trim()
}

/** Attempt to find public news about a company via DuckDuckGo HTML */
export async function scrapeNewsSnippets(company: string): Promise<string> {
  const query = encodeURIComponent(`${company} news 2024 2025`)
  try {
    const { data } = await axios.get(`https://html.duckduckgo.com/html/?q=${query}`, {
      timeout: TIMEOUT_MS,
      headers: { 'User-Agent': USER_AGENT },
    })
    const $ = cheerio.load(data)
    const snippets: string[] = []
    $('.result__snippet').each((_, el) => {
      const t = $(el).text().trim()
      if (t) snippets.push(t)
    })
    return snippets.slice(0, 5).join('\n') || 'No news snippets found.'
  } catch {
    return 'News search unavailable.'
  }
}
