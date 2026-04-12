export function buildOutreachPrompt(params: {
  scrapedContent: string
  companyUrl: string
  targetMarket: string
  yourProduct?: string
  geographyFocus: string
  senderName?: string
  senderCompany?: string
}): string {
  const { scrapedContent, companyUrl, targetMarket, yourProduct, geographyFocus, senderName, senderCompany } = params

  const senderCtx = senderName
    ? `SENDER: ${senderName}${senderCompany ? ` at ${senderCompany}` : ''}`
    : ''

  return `You are an elite B2B sales strategist, copywriter, and cold outreach expert.

Your task: Generate a comprehensive, hyper-personalised cold outreach report for the prospect below.

━━━━ PROSPECT ━━━━
URL: ${companyUrl}

WEBSITE CONTENT (scraped):
${scrapedContent}

━━━━ SELLER CONTEXT ━━━━
Target Market / ICP: ${targetMarket}
${yourProduct ? `Product/Service Being Sold: ${yourProduct}` : 'Product/Service: Not specified (generate general high-intent outreach)'}
Geography Focus: ${geographyFocus}
${senderCtx}

━━━━ INSTRUCTIONS ━━━━
Using the scraped website content AND your knowledge of this company/market, produce a complete outreach intelligence report.

Return ONLY valid JSON (no markdown fences). Match this EXACT schema:

{
  "companyIntelligence": {
    "name": "Company name from website",
    "website": "${companyUrl}",
    "description": "1–2 sentence description of what they do",
    "industry": "Their industry/sector",
    "estimatedSize": "e.g. 10–50 employees, or SME, or Enterprise",
    "likelyPainPoints": [
      "Specific pain point based on their business model",
      "Another pain point",
      "Another pain point",
      "Another pain point"
    ],
    "growthSignals": [
      "Signal found on site suggesting they are growing or investing",
      "Another signal"
    ],
    "techStackHints": [
      "Any tools, integrations, or tech mentioned or inferred"
    ],
    "keyMessages": [
      "What they claim to be brilliant at (from their own messaging)"
    ],
    "icpMatchScore": 82,
    "icpMatchReasoning": "2–3 sentences explaining why they are a strong/weak ICP match",
    "outreachAngle": "The single best angle to lead with — specific to this company"
  },
  "personalizationHooks": [
    {
      "hook": "Specific observation about them (e.g. 'Your homepage leads with X, which tells me…')",
      "sourceContext": "Where this came from (e.g. 'Homepage hero', 'About page', 'Blog')",
      "usageExample": "Exact opening sentence using this hook in an email",
      "strength": "strong"
    },
    {
      "hook": "Second hook",
      "sourceContext": "Source",
      "usageExample": "Example opener",
      "strength": "medium"
    },
    {
      "hook": "Third hook",
      "sourceContext": "Source",
      "usageExample": "Example opener",
      "strength": "medium"
    },
    {
      "hook": "Fourth hook (lighter observation)",
      "sourceContext": "Source",
      "usageExample": "Example opener",
      "strength": "light"
    }
  ],
  "emailSequence": [
    {
      "step": 1,
      "timing": "Day 1",
      "type": "initial",
      "subject": "Compelling subject line (no clickbait, no all-caps)",
      "previewText": "First 90 chars of email shown in inbox preview",
      "body": "Full email body. Use [[FIRST_NAME]] for personalisation. Keep under 150 words. Lead with the personalisation hook. One clear CTA. No fluff.",
      "cta": "The specific CTA used",
      "writingNotes": "Tips for further personalising this email"
    },
    {
      "step": 2,
      "timing": "Day 4",
      "type": "follow_up",
      "subject": "Short follow-up subject (often reply-chain Re: …)",
      "previewText": "Preview text",
      "body": "Brief follow-up. Reference value, not just checking in. Under 100 words.",
      "cta": "CTA",
      "writingNotes": "Notes"
    },
    {
      "step": 3,
      "timing": "Day 9",
      "type": "follow_up",
      "subject": "Subject",
      "previewText": "Preview text",
      "body": "Add a new angle or insight. Social proof or case study reference. Under 120 words.",
      "cta": "CTA",
      "writingNotes": "Notes"
    },
    {
      "step": 4,
      "timing": "Day 16",
      "type": "follow_up",
      "subject": "Subject",
      "previewText": "Preview text",
      "body": "Provide a quick win, resource, or insight relevant to their business. Under 100 words.",
      "cta": "CTA",
      "writingNotes": "Notes"
    },
    {
      "step": 5,
      "timing": "Day 25",
      "type": "breakup",
      "subject": "Should I close your file?",
      "previewText": "Preview text",
      "body": "Classic break-up email. Light humour optional. Make it easy to say yes or no. Under 80 words.",
      "cta": "CTA",
      "writingNotes": "Notes"
    }
  ],
  "linkedInMessages": {
    "connectionRequest": "Under 300 chars. Personalised, not salesy. Reference something specific.",
    "immediateFollowUp": "Message to send within 24h of connection. Conversational, add value. Under 150 words.",
    "valueMessage": "Message if no reply after 5 days. Share insight or resource. Under 100 words.",
    "voiceNoteScript": "60-second voice note script. Conversational. Reference personalisation. End with soft CTA."
  },
  "objectionHandling": [
    {
      "objection": "We already use someone for this",
      "category": "competitor",
      "response": "Empathetic, non-pushy response that repositions",
      "followUpLine": "Closing line to keep the door open"
    },
    {
      "objection": "Not the right time",
      "category": "timing",
      "response": "Response",
      "followUpLine": "Follow-up line"
    },
    {
      "objection": "Too expensive",
      "category": "price",
      "response": "Response reframing ROI",
      "followUpLine": "Follow-up line"
    },
    {
      "objection": "Not interested",
      "category": "not_interested",
      "response": "Response that gently challenges the assumption",
      "followUpLine": "Follow-up line"
    },
    {
      "objection": "You need to speak to [someone else]",
      "category": "wrong_person",
      "response": "Response asking for the warm intro",
      "followUpLine": "Follow-up line"
    }
  ],
  "campaignStrategy": {
    "recommendedApproach": "2–3 sentence summary of the best approach for this specific prospect",
    "sequenceOverview": "Description of the 5-email + LinkedIn hybrid sequence",
    "primaryChannel": "Email or LinkedIn — which to lead with and why",
    "secondaryChannel": "The supporting channel",
    "idealSendTimes": "Best days/times to send based on their industry",
    "keyMessages": [
      "Core message 1 to weave through all touchpoints",
      "Core message 2",
      "Core message 3"
    ],
    "doNots": [
      "Specific thing to avoid with this prospect",
      "Another do-not"
    ],
    "successMetrics": [
      "What a successful sequence looks like",
      "What to track"
    ]
  }
}

RULES:
- Every email must sound human — no corporate speak, no generic opener
- Use [[FIRST_NAME]], [[COMPANY]], [[YOUR_NAME]], [[YOUR_COMPANY]] as placeholders
- Personalisation hooks MUST reference something real found in the scraped content
- If scraping failed, generate high-quality generic-but-targeted outreach based on the URL domain and target market
- ICP match score: 0 = terrible fit, 100 = perfect fit — be honest
- All copy should be ready-to-send with minimal editing`
}
