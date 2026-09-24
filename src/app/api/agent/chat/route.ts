import { NextResponse } from 'next/server'
import { detectVersionDrift, inspectKnowledgeSources } from '@/lib/mcp/sanityContext'

export async function POST(req: Request) {
  try {
    const { message, library } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message query is required' }, { status: 400 })
    }

    const driftResult = await detectVersionDrift({ query: message, library })
    const topRecord = driftResult.matchedRecord
    const sources = await inspectKnowledgeSources()

    let agentResponseText = ''
    let citations: Array<{ label: string; url: string; category: string }> = []

    if (topRecord) {
      citations.push(
        { label: `📘 Modern v4: ${topRecord.currentSourceLabel}`, url: topRecord.currentSourceUrl, category: 'Official Modern Documentation' },
        { label: `📜 Legacy v3: ${topRecord.legacySourceLabel}`, url: topRecord.legacySourceUrl, category: 'Legacy Archive / Outdated Tutorial' },
        { label: `💬 Community: ${topRecord.communitySourceLabel}`, url: topRecord.communitySourceUrl, category: 'GitHub Discussion & Pitfalls' }
      )

      const severityBadge = topRecord.driftSeverity.toUpperCase().replace(/_/g, ' ')

      agentResponseText = `### ⚡ Version-Drift Agent — Canonical Truth & Migration Resolution

**Target Framework:** \`${topRecord.libraryName}\`  
**Breaking Severity:** **${severityBadge}**  
**Sanity Document Ref:** \`sanity://version-drift/${topRecord.id}\`  
**Active Decision:** \`${topRecord.resolutionDecision}\`

---

#### ⚖️ Side-by-Side Contradiction Breakdown:

1. **📜 Legacy v3 Claim (What Outdated Tutorials & ChatGPT Recommend):**  
   ${topRecord.legacyClaim}  
   🔗 [View Legacy Source](${topRecord.legacySourceUrl})

\`\`\`css
${topRecord.legacyCode}
\`\`\`

2. **📘 Modern v4 Canonical Standard (What Current Docs & Oxide Engine Enforce):**  
   ${topRecord.currentClaim}  
   🔗 [View Official Modern Source](${topRecord.currentSourceUrl})

\`\`\`css
${topRecord.currentCode}
\`\`\`

---

#### 🚨 Why Keyword Search & Generic LLMs Get This Wrong:
${topRecord.whyKeywordSearchFails}

---

#### 🛠️ Compiler Failure When Using Old Syntax:
\`\`\`text
${topRecord.compilerError}
\`\`\`

---

#### ⚡ Canonical Migration Diff (- Legacy v3 / + Modern v4):
\`\`\`diff
${topRecord.migrationDiff}
\`\`\`
`
    } else {
      agentResponseText = `I queried the **Sanity Context Knowledge Base**, but could not find a verified version drift conflict directly matching *"${message}"*.

### 🔍 Try asking one of these common breaking change questions:
1. **"Tailwind mein @apply ab bhi chalta hai kya?"** (Does @apply still work in Tailwind v4?)
2. **"Where is tailwind.config.js in Tailwind v4 and how do I configure content paths?"**
3. **"Why is @tailwind base; @tailwind components; failing in my stylesheet?"**
4. **"How do I install plugins like @tailwindcss/typography in Tailwind v4?"**
5. **"How to configure class-based dark mode in Tailwind v4?"**
6. **"React Router v7: Is react-router-dom deprecated?"**
7. **"Next.js 15: Why is cookies() or params throwing a Promise warning?"**
`
    }

    return NextResponse.json({
      text: agentResponseText,
      toolUsed: 'drift_detect_version_conflict',
      verifiedBySanity: topRecord ? topRecord.verifiedBySanity : true,
      citations,
      matchedCount: driftResult.allMatches.length,
      sourcesCount: sources.length,
      topRecord,
      hasDrift: driftResult.hasDrift,
    })
  } catch (err: unknown) {
    console.error('Drift Chat API Error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error during agent chat'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
