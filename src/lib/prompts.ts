/**
 * Prompt templates for the AI analysis pipeline.
 */

export function buildDiscoveryPrompt(industry: string, providedCompetitors?: string[]): string {
  return `You are a senior market intelligence analyst with deep expertise in competitive research.

Your task: Identify the top 6–8 most relevant competitors in the following industry.

INDUSTRY: "${industry}"
${providedCompetitors?.length ? `USER-PROVIDED COMPETITORS (include these + discover more): ${providedCompetitors.join(', ')}` : 'Discover competitors automatically based on your knowledge.'}

Return ONLY a JSON array of competitor objects. No markdown, no explanation, just raw JSON.

Schema:
[
  {
    "name": "Company Name",
    "website": "https://example.com",
    "headquarters": "City, Country",
    "foundedYear": "2010",
    "employeeCount": "500-1000",
    "positioning": "premium|mid-market|budget|niche|enterprise|freemium"
  }
]

Rules:
- Return real, well-known companies in this industry
- Include a mix of market leaders and challengers where relevant
- Use accurate, publicly known websites
- If the industry is regional (e.g. "UK recruitment"), prioritise companies in that region`
}

export function buildCompetitorAnalysisPrompt(
  industry: string,
  competitor: { name: string; website: string },
  scrapedData: string
): string {
  return `You are a senior competitive intelligence analyst.

INDUSTRY: "${industry}"
COMPETITOR: ${competitor.name} (${competitor.website})

SCRAPED WEB DATA (may be partial or unavailable):
${scrapedData}

Using your knowledge of this company AND the scraped data above, produce a comprehensive competitor profile.

Return ONLY valid JSON matching this EXACT schema (no markdown, no extra keys):
{
  "coreOffer": "Primary product/service in 1–2 sentences",
  "targetAudience": "Primary customer segments",
  "usp": "Core unique selling proposition",
  "pricing": "Pricing model or range if known, else 'Not publicly available'",
  "estimatedTrafficLevel": "very high|high|medium|low|very low",
  "marketingChannels": ["SEO", "PPC", "LinkedIn", "..."],
  "messagingAngles": ["Value prop 1", "Value prop 2", "..."],
  "funnelStructure": "Description of their sales funnel",
  "leadMagnets": ["Free trial", "Whitepaper", "..."],
  "ctas": ["Book a demo", "Start free", "..."],
  "contentStrategy": "Description of content approach",
  "strengths": ["Strength 1", "Strength 2", "..."],
  "weaknesses": ["Weakness 1", "Weakness 2", "..."],
  "recentActivity": ["Recent development 1", "Recent development 2", "..."],
  "swot": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "opportunities": ["..."],
    "threats": ["..."]
  },
  "bcg": {
    "category": "star|cash_cow|question_mark|dog",
    "marketGrowthScore": 75,
    "marketShareScore": 80,
    "relativeSizeScore": 35,
    "reasoning": "Why this classification"
  }
}

IMPORTANT:
- Base all analysis on real, publicly known information about this company
- If information is uncertain, note it in the field value with "(estimated)"
- BCG scores are 0–100 integers; relativeSizeScore is 10–50`
}

export function buildIndustryAnalysisPrompt(
  industry: string,
  competitorNames: string[]
): string {
  return `You are a senior market intelligence analyst and strategy consultant.

INDUSTRY: "${industry}"
KEY COMPETITORS IDENTIFIED: ${competitorNames.join(', ')}

Produce a comprehensive industry intelligence report. Return ONLY valid JSON, no markdown.

{
  "industryOverview": {
    "summary": "2–3 sentence executive summary of the industry",
    "marketSize": "e.g. '$4.2B globally (2024)' or 'Unknown'",
    "growthRate": "e.g. '12% CAGR 2024–2029' or 'Unknown'",
    "maturityStage": "emerging|growth|mature|declining",
    "keyTrends": ["Trend 1", "Trend 2", "Trend 3", "Trend 4", "Trend 5"],
    "customerSegments": ["Segment 1", "Segment 2", "Segment 3"],
    "demandDrivers": ["Driver 1", "Driver 2", "Driver 3"],
    "keyChallenges": ["Challenge 1", "Challenge 2", "Challenge 3"],
    "geographicFocus": "Global | Regional (specify) | Local"
  },
  "news": [
    {
      "competitor": "Company Name or 'industry'",
      "headline": "News headline",
      "summary": "1–2 sentence summary",
      "date": "Approximate date e.g. Q1 2025",
      "category": "funding|launch|partnership|expansion|leadership|award|acquisition|other",
      "sentiment": "positive|neutral|negative",
      "significance": "high|medium|low"
    }
  ],
  "strategicAnalysis": {
    "industrySWOT": {
      "strengths": ["Industry-wide strength 1", "..."],
      "weaknesses": ["Industry-wide weakness 1", "..."],
      "opportunities": ["Macro opportunity 1", "..."],
      "threats": ["Macro threat 1", "..."]
    },
    "portersFiveForces": {
      "barrierToEntry": {
        "level": "high|medium|low",
        "score": 7,
        "factors": ["Factor 1", "Factor 2"],
        "summary": "One sentence summary"
      },
      "supplierPower": {
        "level": "high|medium|low",
        "score": 4,
        "factors": ["Factor 1", "Factor 2"],
        "summary": "One sentence summary"
      },
      "buyerPower": {
        "level": "high|medium|low",
        "score": 6,
        "factors": ["Factor 1", "Factor 2"],
        "summary": "One sentence summary"
      },
      "competitiveRivalry": {
        "level": "high|medium|low",
        "score": 8,
        "factors": ["Factor 1", "Factor 2"],
        "summary": "One sentence summary"
      },
      "substituteThreat": {
        "level": "high|medium|low",
        "score": 5,
        "factors": ["Factor 1", "Factor 2"],
        "summary": "One sentence summary"
      }
    },
    "bcgNarrative": "Overall BCG landscape summary paragraph",
    "competitiveDynamics": "Paragraph describing how competition plays out in this market"
  },
  "opportunities": [
    {
      "title": "Opportunity title",
      "description": "2–3 sentence description",
      "targetSegment": "Who this targets",
      "type": "segment|positioning|offer|channel|geography|technology",
      "urgency": "high|medium|low",
      "effort": "high|medium|low",
      "competitorsIgnoring": ["Competitor A", "Competitor B"]
    }
  ],
  "actionableInsights": [
    {
      "title": "Insight title",
      "description": "2–3 sentence description",
      "category": "market_entry|offer|marketing|differentiation|partnerships|pricing",
      "priority": "high|medium|low",
      "timeframe": "immediate|short_term|long_term",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "expectedOutcome": "What success looks like"
    }
  ]
}

Rules:
- Provide at least 5 news items (mix of company-specific and industry-wide)
- Provide at least 5 opportunities
- Provide at least 6 actionable insights
- All analysis should be based on real market knowledge
- Mark clearly uncertain data with "(estimated)" in the value
- Be specific and actionable, not generic`
}
