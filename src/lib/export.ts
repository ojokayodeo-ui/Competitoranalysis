/**
 * Export helpers — JSON, CSV, and HTML report.
 */
import type { AnalysisResult } from '@/types'

// ─── JSON ─────────────────────────────────────────────────────────────────────

export function toJson(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2)
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

export function toCsv(result: AnalysisResult): string {
  const rows: string[][] = []

  // Header
  rows.push([
    'Name', 'Website', 'Founded', 'Employees', 'Headquarters',
    'Positioning', 'Core Offer', 'Target Audience', 'USP', 'Pricing',
    'Marketing Channels', 'BCG Category', 'BCG Growth Score', 'BCG Share Score',
    'Strengths', 'Weaknesses',
  ])

  for (const c of result.competitors) {
    rows.push([
      c.name,
      c.website,
      c.foundedYear || '',
      c.employeeCount || '',
      c.headquarters || '',
      c.positioning,
      c.coreOffer,
      c.targetAudience,
      c.usp,
      c.pricing || '',
      c.marketingChannels.join('; '),
      c.bcg.category,
      String(c.bcg.marketGrowthScore),
      String(c.bcg.marketShareScore),
      c.strengths.join('; '),
      c.weaknesses.join('; '),
    ])
  }

  return rows
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

// ─── HTML Report ─────────────────────────────────────────────────────────────

export function toHtml(result: AnalysisResult): string {
  const bcgLabels: Record<string, string> = {
    star: '⭐ Star',
    cash_cow: '🐄 Cash Cow',
    question_mark: '❓ Question Mark',
    dog: '🐕 Dog',
  }

  const competitorRows = result.competitors
    .map(
      c => `
      <div class="card">
        <h3>${c.name} <span class="badge">${c.positioning}</span> <span class="badge bcg">${bcgLabels[c.bcg.category] || c.bcg.category}</span></h3>
        <p><strong>Website:</strong> <a href="${c.website}">${c.website}</a></p>
        <p><strong>Core Offer:</strong> ${c.coreOffer}</p>
        <p><strong>USP:</strong> ${c.usp}</p>
        <p><strong>Target Audience:</strong> ${c.targetAudience}</p>
        ${c.pricing ? `<p><strong>Pricing:</strong> ${c.pricing}</p>` : ''}
        <h4>SWOT</h4>
        <table>
          <tr><th>Strengths</th><th>Weaknesses</th></tr>
          <tr>
            <td><ul>${c.swot.strengths.map(s => `<li>${s}</li>`).join('')}</ul></td>
            <td><ul>${c.swot.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul></td>
          </tr>
          <tr><th>Opportunities</th><th>Threats</th></tr>
          <tr>
            <td><ul>${c.swot.opportunities.map(s => `<li>${s}</li>`).join('')}</ul></td>
            <td><ul>${c.swot.threats.map(s => `<li>${s}</li>`).join('')}</ul></td>
          </tr>
        </table>
      </div>`
    )
    .join('\n')

  const insightRows = result.actionableInsights
    .map(
      i => `
      <div class="insight">
        <h4>${i.title} <span class="badge priority-${i.priority}">${i.priority.toUpperCase()}</span></h4>
        <p>${i.description}</p>
        <ol>${i.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        <p><em>Expected outcome: ${i.expectedOutcome}</em></p>
      </div>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Intelligence Report: ${result.industry}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f1117; color: #e2e8f0; line-height: 1.6; padding: 40px; }
    h1, h2, h3, h4 { color: #a5b4fc; margin-bottom: 12px; }
    h1 { font-size: 2rem; border-bottom: 2px solid #4338ca; padding-bottom: 12px; margin-bottom: 24px; }
    h2 { font-size: 1.4rem; margin-top: 32px; }
    .card { background: #161b27; border: 1px solid #2a3347; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .insight { background: #1e2433; border-left: 4px solid #6366f1; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .badge { background: #3730a3; color: #c7d2fe; padding: 2px 8px; border-radius: 20px; font-size: 0.75rem; margin-left: 8px; }
    .badge.bcg { background: #065f46; color: #6ee7b7; }
    .badge.priority-high { background: #7f1d1d; color: #fca5a5; }
    .badge.priority-medium { background: #78350f; color: #fde68a; }
    .badge.priority-low { background: #064e3b; color: #6ee7b7; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th { background: #1e2433; padding: 8px 12px; text-align: left; font-size: 0.85rem; color: #818cf8; }
    td { padding: 8px 12px; border-top: 1px solid #2a3347; vertical-align: top; font-size: 0.9rem; }
    ul, ol { padding-left: 18px; }
    li { margin-bottom: 4px; }
    a { color: #818cf8; }
    .meta { color: #64748b; font-size: 0.85rem; margin-bottom: 24px; }
    .disclaimer { background: #1e1a0e; border: 1px solid #78350f; border-radius: 8px; padding: 12px 16px; font-size: 0.85rem; color: #fbbf24; margin-bottom: 24px; }
  </style>
</head>
<body>
  <h1>Industry & Competitive Intelligence Report</h1>
  <h2>${result.industry}</h2>
  <p class="meta">Generated: ${new Date(result.generatedAt).toLocaleString()} | Confidence: ${result.dataConfidence.toUpperCase()}</p>
  <div class="disclaimer">⚠ ${result.aiDisclaimer}</div>

  <h2>Industry Overview</h2>
  <div class="card">
    <p>${result.industryOverview.summary}</p>
    <table>
      <tr><th>Market Size</th><td>${result.industryOverview.marketSize}</td><th>Growth Rate</th><td>${result.industryOverview.growthRate}</td></tr>
      <tr><th>Stage</th><td>${result.industryOverview.maturityStage}</td><th>Geography</th><td>${result.industryOverview.geographicFocus}</td></tr>
    </table>
    <h4>Key Trends</h4>
    <ul>${result.industryOverview.keyTrends.map(t => `<li>${t}</li>`).join('')}</ul>
    <h4>Key Challenges</h4>
    <ul>${result.industryOverview.keyChallenges.map(t => `<li>${t}</li>`).join('')}</ul>
  </div>

  <h2>Competitor Profiles</h2>
  ${competitorRows}

  <h2>Actionable Insights</h2>
  ${insightRows}

  <h2>Opportunities & Gaps</h2>
  ${result.opportunities.map(o => `
    <div class="insight">
      <h4>${o.title} <span class="badge priority-${o.urgency}">${o.urgency.toUpperCase()} URGENCY</span></h4>
      <p>${o.description}</p>
      <p><strong>Target segment:</strong> ${o.targetSegment}</p>
    </div>`).join('')}

  <footer style="margin-top:40px;color:#4b5563;font-size:0.8rem;border-top:1px solid #2a3347;padding-top:12px;">
    Generated by Industry &amp; Competitive Intelligence Engine
  </footer>
</body>
</html>`
}
