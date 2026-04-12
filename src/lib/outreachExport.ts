import type { OutreachReport } from '@/types/outreach'

// ─── JSON ─────────────────────────────────────────────────────────────────────

export function outreachToJson(report: OutreachReport): string {
  return JSON.stringify(report, null, 2)
}

// ─── Plain Text (email templates) ─────────────────────────────────────────────

export function outreachToText(report: OutreachReport): string {
  const c = report.companyIntelligence
  const lines: string[] = []

  lines.push(`COLD OUTREACH REPORT — ${c.name}`)
  lines.push(`Generated: ${new Date(report.generatedAt).toLocaleString()}`)
  lines.push(`URL: ${report.companyUrl}`)
  lines.push('='.repeat(60))

  lines.push('\nCOMPANY SUMMARY')
  lines.push('-'.repeat(40))
  lines.push(c.description)
  lines.push(`ICP Match: ${c.icpMatchScore}/100 — ${c.icpMatchReasoning}`)
  lines.push(`Best Angle: ${c.outreachAngle}`)

  lines.push('\nLIKELY PAIN POINTS')
  c.likelyPainPoints.forEach((p, i) => lines.push(`${i + 1}. ${p}`))

  lines.push('\nPERSONALISATION HOOKS')
  lines.push('-'.repeat(40))
  report.personalizationHooks.forEach((h, i) => {
    lines.push(`\n[Hook ${i + 1}] (${h.strength.toUpperCase()}) — ${h.sourceContext}`)
    lines.push(`Hook: ${h.hook}`)
    lines.push(`Usage: ${h.usageExample}`)
  })

  lines.push('\n' + '='.repeat(60))
  lines.push('EMAIL SEQUENCE')
  lines.push('='.repeat(60))
  report.emailSequence.forEach(email => {
    lines.push(`\n--- EMAIL ${email.step} | ${email.timing} | ${email.type.toUpperCase()} ---`)
    lines.push(`Subject: ${email.subject}`)
    lines.push(`Preview: ${email.previewText}`)
    lines.push('')
    lines.push(email.body)
    lines.push('')
    lines.push(`CTA: ${email.cta}`)
    lines.push(`Notes: ${email.writingNotes}`)
  })

  lines.push('\n' + '='.repeat(60))
  lines.push('LINKEDIN MESSAGES')
  lines.push('='.repeat(60))
  lines.push('\n[Connection Request]')
  lines.push(report.linkedInMessages.connectionRequest)
  lines.push('\n[Immediate Follow-Up (post-connect)]')
  lines.push(report.linkedInMessages.immediateFollowUp)
  lines.push('\n[Value Message (5 days, no reply)]')
  lines.push(report.linkedInMessages.valueMessage)
  lines.push('\n[Voice Note Script]')
  lines.push(report.linkedInMessages.voiceNoteScript)

  lines.push('\n' + '='.repeat(60))
  lines.push('OBJECTION HANDLING')
  lines.push('='.repeat(60))
  report.objectionHandling.forEach(o => {
    lines.push(`\nOBJECTION: "${o.objection}"`)
    lines.push(`RESPONSE: ${o.response}`)
    lines.push(`FOLLOW-UP: ${o.followUpLine}`)
  })

  lines.push('\n' + '='.repeat(60))
  lines.push('CAMPAIGN STRATEGY')
  lines.push('='.repeat(60))
  const s = report.campaignStrategy
  lines.push(`\nApproach: ${s.recommendedApproach}`)
  lines.push(`Primary Channel: ${s.primaryChannel}`)
  lines.push(`Secondary Channel: ${s.secondaryChannel}`)
  lines.push(`Ideal Send Times: ${s.idealSendTimes}`)
  lines.push('\nKey Messages:')
  s.keyMessages.forEach((m, i) => lines.push(`${i + 1}. ${m}`))
  lines.push('\nDo NOT:')
  s.doNots.forEach((d, i) => lines.push(`${i + 1}. ${d}`))

  lines.push(`\n\n${report.disclaimer}`)

  return lines.join('\n')
}

// ─── HTML Report ─────────────────────────────────────────────────────────────

export function outreachToHtml(report: OutreachReport): string {
  const c = report.companyIntelligence
  const scoreColor = c.icpMatchScore >= 75 ? '#34d399' : c.icpMatchScore >= 50 ? '#fbbf24' : '#f87171'

  const emailHtml = report.emailSequence.map(email => `
    <div class="email-card">
      <div class="email-header">
        <div>
          <span class="email-step">Email ${email.step}</span>
          <span class="timing">${email.timing}</span>
          <span class="type type-${email.type}">${email.type.replace('_', ' ')}</span>
        </div>
      </div>
      <p class="email-subject"><strong>Subject:</strong> ${email.subject}</p>
      <p class="email-preview"><strong>Preview:</strong> <em>${email.previewText}</em></p>
      <pre class="email-body">${email.body}</pre>
      <p class="email-cta"><strong>CTA:</strong> ${email.cta}</p>
      <p class="email-notes">💡 ${email.writingNotes}</p>
    </div>`).join('\n')

  const objHtml = report.objectionHandling.map(o => `
    <div class="objection">
      <p class="obj-q">❓ "${o.objection}"</p>
      <p class="obj-a"><strong>Response:</strong> ${o.response}</p>
      <p class="obj-f"><strong>Follow-up:</strong> <em>${o.followUpLine}</em></p>
    </div>`).join('\n')

  const hookHtml = report.personalizationHooks.map(h => `
    <div class="hook hook-${h.strength}">
      <div class="hook-meta"><span class="hook-strength">${h.strength}</span> <span class="hook-source">${h.sourceContext}</span></div>
      <p class="hook-text">${h.hook}</p>
      <p class="hook-example"><em>"${h.usageExample}"</em></p>
    </div>`).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Outreach Report — ${c.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f1117; color: #e2e8f0; line-height: 1.6; padding: 40px 24px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 1.8rem; color: #a5b4fc; margin-bottom: 4px; }
  h2 { font-size: 1.2rem; color: #818cf8; margin: 32px 0 16px; border-bottom: 1px solid #2a3347; padding-bottom: 8px; }
  h3 { font-size: 1rem; color: #c7d2fe; margin-bottom: 8px; }
  p { color: #cbd5e1; margin-bottom: 8px; }
  .meta { color: #64748b; font-size: 0.85rem; margin-bottom: 24px; }
  .disclaimer { background: #1e1a0e; border: 1px solid #78350f; border-radius: 8px; padding: 12px 16px; font-size: 0.82rem; color: #fbbf24; margin-bottom: 32px; }
  .card { background: #161b27; border: 1px solid #2a3347; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .score { font-size: 2.5rem; font-weight: 800; color: ${scoreColor}; }
  .score-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
  .pain-list, .signal-list { padding-left: 18px; }
  .pain-list li, .signal-list li { margin-bottom: 6px; color: #cbd5e1; font-size: 0.9rem; }
  .angle-box { background: #1e2433; border-left: 3px solid #6366f1; padding: 12px 16px; border-radius: 0 8px 8px 0; font-style: italic; color: #a5b4fc; margin-top: 12px; }
  /* Hooks */
  .hook { border: 1px solid #2a3347; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
  .hook-strong { border-color: #4338ca; background: #1a1f35; }
  .hook-medium { border-color: #2a3347; background: #161b27; }
  .hook-light  { border-color: #1e2433; background: #12161f; opacity: 0.85; }
  .hook-meta { display: flex; gap: 8px; margin-bottom: 6px; }
  .hook-strength { background: #312e81; color: #a5b4fc; padding: 2px 8px; border-radius: 20px; font-size: 0.75rem; text-transform: capitalize; }
  .hook-source { color: #64748b; font-size: 0.8rem; padding: 2px 0; }
  .hook-text { font-size: 0.9rem; color: #e2e8f0; margin-bottom: 6px; }
  .hook-example { font-size: 0.88rem; color: #818cf8; }
  /* Emails */
  .email-card { background: #161b27; border: 1px solid #2a3347; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .email-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .email-step { font-size: 0.8rem; font-weight: 700; color: #818cf8; text-transform: uppercase; margin-right: 8px; }
  .timing { font-size: 0.8rem; color: #64748b; margin-right: 8px; }
  .type { font-size: 0.75rem; padding: 2px 8px; border-radius: 20px; text-transform: capitalize; }
  .type-initial { background: #065f46; color: #6ee7b7; }
  .type-follow_up { background: #1e3a5f; color: #93c5fd; }
  .type-breakup { background: #450a0a; color: #fca5a5; }
  .email-subject { font-weight: 600; color: #e2e8f0; margin-bottom: 4px; }
  .email-preview { font-size: 0.85rem; color: #64748b; margin-bottom: 12px; }
  .email-body { background: #0f1117; border: 1px solid #1e2433; border-radius: 8px; padding: 16px; font-family: Georgia, serif; font-size: 0.9rem; white-space: pre-wrap; color: #cbd5e1; line-height: 1.7; margin-bottom: 12px; }
  .email-cta { font-size: 0.85rem; color: #34d399; margin-bottom: 4px; }
  .email-notes { font-size: 0.82rem; color: #64748b; font-style: italic; }
  /* LinkedIn */
  .linkedin-section { display: grid; gap: 12px; }
  .lk-box { background: #161b27; border: 1px solid #2a3347; border-radius: 10px; padding: 16px; }
  .lk-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #818cf8; margin-bottom: 8px; letter-spacing: 0.05em; }
  .lk-text { font-size: 0.9rem; color: #cbd5e1; white-space: pre-wrap; }
  /* Objections */
  .objection { background: #161b27; border-left: 3px solid #f87171; border-radius: 0 10px 10px 0; padding: 14px; margin-bottom: 12px; }
  .obj-q { font-weight: 600; color: #f87171; margin-bottom: 8px; }
  .obj-a, .obj-f { font-size: 0.9rem; color: #cbd5e1; margin-bottom: 4px; }
  /* Strategy */
  .strategy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .strategy-box { background: #161b27; border: 1px solid #2a3347; border-radius: 10px; padding: 14px; }
  .strategy-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
  .strategy-val { font-size: 0.9rem; color: #e2e8f0; }
  ul.strat-list { padding-left: 16px; }
  ul.strat-list li { font-size: 0.88rem; color: #cbd5e1; margin-bottom: 4px; }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #2a3347; font-size: 0.8rem; color: #475569; }
  @media print {
    body { background: #fff; color: #111; }
    .card, .email-card, .lk-box, .strategy-box, .hook, .objection { border-color: #e5e7eb; background: #f9fafb; }
    h1, h2, h3 { color: #111; }
    .email-body { background: #f3f4f6; color: #111; }
  }
</style>
</head>
<body>
<h1>Cold Outreach Report</h1>
<h2 style="border:0;margin-top:4px;font-size:1.4rem">${c.name}</h2>
<p class="meta">Generated ${new Date(report.generatedAt).toLocaleString()} · <a href="${report.companyUrl}" style="color:#818cf8">${report.companyUrl}</a></p>
<div class="disclaimer">⚠ ${report.disclaimer}</div>

<h2>Company Intelligence</h2>
<div class="card">
  <div class="score-row">
    <div>
      <div style="font-size:0.75rem;color:#64748b;text-transform:uppercase;margin-bottom:2px">ICP Match Score</div>
      <div class="score">${c.icpMatchScore}<span style="font-size:1rem;color:#64748b">/100</span></div>
    </div>
    <div>
      <p style="font-size:0.9rem;color:#cbd5e1">${c.icpMatchReasoning}</p>
    </div>
  </div>
  <p style="margin-bottom:12px">${c.description} · <em style="color:#64748b">${c.industry} · ${c.estimatedSize}</em></p>
  <div class="angle-box">🎯 Best Angle: ${c.outreachAngle}</div>
</div>

<h2>Likely Pain Points</h2>
<div class="card">
  <ul class="pain-list">
    ${c.likelyPainPoints.map(p => `<li>${p}</li>`).join('\n    ')}
  </ul>
  ${c.growthSignals.length ? `<h3 style="margin-top:16px">Growth Signals</h3><ul class="signal-list">${c.growthSignals.map(g => `<li>📈 ${g}</li>`).join('')}</ul>` : ''}
  ${c.techStackHints.length ? `<h3 style="margin-top:16px">Tech / Tools</h3><ul class="signal-list">${c.techStackHints.map(t => `<li>🔧 ${t}</li>`).join('')}</ul>` : ''}
</div>

<h2>Personalisation Hooks</h2>
${hookHtml}

<h2>Email Sequence (${report.emailSequence.length} emails)</h2>
${emailHtml}

<h2>LinkedIn Messages</h2>
<div class="linkedin-section">
  <div class="lk-box"><div class="lk-label">Connection Request (≤300 chars)</div><div class="lk-text">${report.linkedInMessages.connectionRequest}</div></div>
  <div class="lk-box"><div class="lk-label">Immediate Follow-Up (post-connect)</div><div class="lk-text">${report.linkedInMessages.immediateFollowUp}</div></div>
  <div class="lk-box"><div class="lk-label">Value Message (5 days, no reply)</div><div class="lk-text">${report.linkedInMessages.valueMessage}</div></div>
  <div class="lk-box"><div class="lk-label">Voice Note Script (60 sec)</div><div class="lk-text">${report.linkedInMessages.voiceNoteScript}</div></div>
</div>

<h2>Objection Handling</h2>
${objHtml}

<h2>Campaign Strategy</h2>
<div class="card">
  <p style="margin-bottom:16px">${report.campaignStrategy.recommendedApproach}</p>
  <div class="strategy-grid">
    <div class="strategy-box"><div class="strategy-label">Primary Channel</div><div class="strategy-val">${report.campaignStrategy.primaryChannel}</div></div>
    <div class="strategy-box"><div class="strategy-label">Secondary Channel</div><div class="strategy-val">${report.campaignStrategy.secondaryChannel}</div></div>
    <div class="strategy-box"><div class="strategy-label">Ideal Send Times</div><div class="strategy-val">${report.campaignStrategy.idealSendTimes}</div></div>
    <div class="strategy-box"><div class="strategy-label">Sequence</div><div class="strategy-val">${report.campaignStrategy.sequenceOverview}</div></div>
  </div>
  <h3 style="margin-top:16px">Key Messages</h3>
  <ul class="strat-list">${report.campaignStrategy.keyMessages.map(m => `<li>${m}</li>`).join('')}</ul>
  <h3 style="margin-top:12px">Do NOT</h3>
  <ul class="strat-list">${report.campaignStrategy.doNots.map(d => `<li>🚫 ${d}</li>`).join('')}</ul>
</div>

<footer>Cold Outreach Intelligence · Powered by Claude AI · Always verify before sending</footer>
</body>
</html>`
}
