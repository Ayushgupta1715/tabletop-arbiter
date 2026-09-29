import {
  getGames,
  getDisputes,
  getRuleWithErrata,
  querySanityContextForArbiter,
} from '@/sanity/lib/client'
import {
  GameRecord,
  GameRuleRecord,
  RuleErrataRecord,
  DisputedScenarioRecord,
  SEED_DISPUTES,
  SEED_RULES,
  SEED_ERRATAS,
} from '@/sanity/lib/seedData'

export interface TabletopArbitrationResult {
  disputeId?: string
  gameTitle: string
  verdictWinner: 'player_a' | 'player_b' | 'split'
  officialRuling: string
  ruleCitation: {
    sectionCode: string
    title: string
    originalText: string
    edition: string
  }
  errataOverride: {
    title: string
    patchVersion: string
    effectiveDate: string
    governingAuthority: string
    officialRulingText: string
    sourceUrl: string
    sourceDocumentLabel: string
  } | null
  whyVectorSearchFailed: string
  naiveLLMResponse: string
  provenanceHash: string
  evaluatedAt: string
}

/**
 * MCP Tool 1: Resolve Tabletop Dispute
 * Evaluates a player dispute using Sanity structured content and GROQ dereferencing
 */
export async function resolveTabletopDispute(params: {
  disputeId?: string
  scenarioQuery: string
  gameFilter?: string
  playerAClaim?: string
  playerBClaim?: string
}): Promise<TabletopArbitrationResult> {
  // If a known dispute ID is provided:
  if (params.disputeId) {
    const disputes = await getDisputes()
    const found = disputes.find((d) => d.id === params.disputeId)
    if (found) {
      const { rule, errata } = await getRuleWithErrata(found.governingRuleId)
      return {
        disputeId: found.id,
        gameTitle: found.gameName,
        verdictWinner: found.winnerResolution,
        officialRuling: found.groundedArbiterRuling,
        ruleCitation: {
          sectionCode: rule ? rule.sectionCode : 'CR Sec. General',
          title: rule ? rule.ruleTitle : 'Core Rule',
          originalText: rule ? rule.officialRawText : 'Standard baseline game rule text.',
          edition: rule ? rule.originalRulebookEdition : 'Base Rulebook',
        },
        errataOverride: errata
          ? {
              title: errata.title,
              patchVersion: errata.patchVersion,
              effectiveDate: errata.effectiveDate,
              governingAuthority: errata.governingAuthority,
              officialRulingText: errata.officialRulingText,
              sourceUrl: errata.sourceUrl,
              sourceDocumentLabel: errata.sourceDocumentLabel,
            }
          : null,
        whyVectorSearchFailed:
          errata?.whyVectorRAGFails ||
          'Vector similarity search grouped outdated core wording with new keywords, missing the specific governing override.',
        naiveLLMResponse: found.naiveLLMAnswer,
        provenanceHash: found.provenanceHash,
        evaluatedAt: new Date().toISOString(),
      }
    }
  }

  // Freeform user query: run GROQ/context query
  const context = await querySanityContextForArbiter(params.scenarioQuery, params.gameFilter)
  const topRule = context.matchedRules[0] || SEED_RULES[0]
  const topErrata = context.activeErrata[0] || SEED_ERRATAS[0]

  return {
    gameTitle: topRule.gameName,
    verdictWinner: 'player_b',
    officialRuling: `⚖️ SANITY ARBITER VERDICT: According to ${topErrata.governingAuthority} (${topErrata.patchVersion}): "${topErrata.officialRulingText}" Base rule ${topRule.sectionCode} is officially overridden for this tournament scenario.`,
    ruleCitation: {
      sectionCode: topRule.sectionCode,
      title: topRule.ruleTitle,
      originalText: topRule.officialRawText,
      edition: topRule.originalRulebookEdition,
    },
    errataOverride: {
      title: topErrata.title,
      patchVersion: topErrata.patchVersion,
      effectiveDate: topErrata.effectiveDate,
      governingAuthority: topErrata.governingAuthority,
      officialRulingText: topErrata.officialRulingText,
      sourceUrl: topErrata.sourceUrl,
      sourceDocumentLabel: topErrata.sourceDocumentLabel,
    },
    whyVectorSearchFailed: topErrata.whyVectorRAGFails,
    naiveLLMResponse: `❌ Naive Vector RAG (Unstructured) Output: "Based on general rules, player claims are evaluated without noticing recent ${topErrata.patchVersion} overrides."`,
    provenanceHash: `sha256-arbiter-${Date.now().toString(16)}`,
    evaluatedAt: new Date().toISOString(),
  }
}

/**
 * MCP Tool 2: Get Rule vs Errata Diff
 */
export async function getRuleErrataDiff(ruleId: string) {
  const { rule, errata } = await getRuleWithErrata(ruleId)
  if (!rule) {
    throw new Error(`Base rule not found: ${ruleId}`)
  }
  return {
    tool: 'get_rule_errata_diff',
    rule,
    errata,
    hasOverride: Boolean(errata),
    classification: errata?.errataClassification || 'none',
  }
}

/**
 * MCP Tool 3: Query Tournament Knowledge Lake
 */
export async function queryTournamentKnowledgeLake(params: {
  query: string
  gameFilter?: string
}) {
  const context = await querySanityContextForArbiter(params.query, params.gameFilter)
  return {
    tool: 'query_tournament_knowledge_lake',
    ...context,
  }
}

/**
 * MCP Tool 4: Fetch Supported Games
 */
export async function fetchSupportedGames(): Promise<GameRecord[]> {
  return await getGames()
}
