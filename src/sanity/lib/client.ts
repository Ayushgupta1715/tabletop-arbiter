import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'
import {
  SEED_GAMES,
  SEED_RULES,
  SEED_ERRATAS,
  SEED_DISPUTES,
  GameRecord,
  GameRuleRecord,
  RuleErrataRecord,
  DisputedScenarioRecord,
} from './seedData'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

/**
 * Fetch all games
 */
export async function getGames(): Promise<GameRecord[]> {
  try {
    if (projectId && projectId !== 'demo-sanity-hackathon') {
      const query = `*[_type == "game"] | order(title asc) {
        "id": _id,
        title,
        "slug": slug.current,
        publisher,
        currentEdition,
        category,
        tournamentCircuit,
        iconName,
        description
      }`
      const remote = await client.fetch<GameRecord[]>(query)
      if (remote && remote.length > 0) return remote
    }
  } catch (err) {
    console.warn('[TableTop Arbiter] Sanity client fetch games failed, falling back to seed data:', err)
  }
  return SEED_GAMES
}

/**
 * Fetch disputes with optional game filter
 */
export async function getDisputes(gameId?: string): Promise<DisputedScenarioRecord[]> {
  try {
    if (projectId && projectId !== 'demo-sanity-hackathon') {
      const query = `*[_type == "disputedScenario" ${gameId ? '&& game._ref == $gameId' : ''}] | order(_createdAt desc) {
        "id": _id,
        title,
        "slug": slug.current,
        "gameId": game._ref,
        gameName,
        stakesLevel,
        scenarioDescription,
        playerAClaim,
        playerBClaim,
        naiveLLMAnswer,
        groundedArbiterRuling,
        winnerResolution,
        "governingRuleId": governingRule._ref,
        "governingErrataId": governingErrata._ref,
        provenanceHash
      }`
      const remote = await client.fetch<DisputedScenarioRecord[]>(query, { gameId })
      if (remote && remote.length > 0) return remote
    }
  } catch (err) {
    console.warn('[TableTop Arbiter] Sanity client fetch disputes failed, falling back to seed data:', err)
  }

  if (gameId) {
    return SEED_DISPUTES.filter((d) => d.gameId === gameId)
  }
  return SEED_DISPUTES
}

/**
 * Fetch rule by ID with its overriding errata dereferenced via GROQ
 */
export async function getRuleWithErrata(ruleId: string): Promise<{
  rule: GameRuleRecord | null
  errata: RuleErrataRecord | null
}> {
  try {
    if (projectId && projectId !== 'demo-sanity-hackathon') {
      const query = `{
        "rule": *[_type == "gameRule" && _id == $ruleId][0] {
          "id": _id,
          ruleTitle,
          sectionCode,
          "gameId": game._ref,
          gameName,
          ruleCategory,
          originalRulebookEdition,
          officialRawText,
          apparentInterpretation,
          isSuperseded
        },
        "errata": *[_type == "ruleErrata" && references($ruleId)][0] {
          "id": _id,
          title,
          "slug": slug.current,
          "gameId": game._ref,
          gameName,
          "supersedesRuleIds": supersedesRules[]._ref,
          effectiveDate,
          patchVersion,
          governingAuthority,
          errataClassification,
          officialRulingText,
          rationale,
          sourceUrl,
          sourceDocumentLabel,
          whyVectorRAGFails
        }
      }`
      const result = await client.fetch<{ rule: GameRuleRecord; errata: RuleErrataRecord }>(query, { ruleId })
      if (result && result.rule) {
        return result
      }
    }
  } catch (err) {
    console.warn('[TableTop Arbiter] Sanity client fetch rule with errata failed, falling back to seed data:', err)
  }

  const rule = SEED_RULES.find((r) => r.id === ruleId) || null
  const errata = SEED_ERRATAS.find((e) => e.supersedesRuleIds.includes(ruleId)) || null

  return { rule, errata }
}

/**
 * Direct GROQ Search across Rules and Errata for the AI Agent
 */
export async function querySanityContextForArbiter(queryPrompt: string, gameFilter?: string): Promise<{
  matchedRules: GameRuleRecord[]
  activeErrata: RuleErrataRecord[]
  relevantDisputes: DisputedScenarioRecord[]
}> {
  const normalized = queryPrompt.toLowerCase()

  // 1. Filter relevant seed records if offline or demo
  const matchedRules = SEED_RULES.filter((r) => {
    if (gameFilter && r.gameId !== gameFilter && !r.gameName.toLowerCase().includes(gameFilter.toLowerCase())) {
      return false
    }
    return (
      r.ruleTitle.toLowerCase().includes(normalized) ||
      r.officialRawText.toLowerCase().includes(normalized) ||
      r.sectionCode.toLowerCase().includes(normalized) ||
      normalized.includes(r.gameName.toLowerCase()) ||
      normalized.split(' ').some((word) => word.length > 3 && r.ruleTitle.toLowerCase().includes(word))
    )
  })

  const matchedRuleIds = new Set(matchedRules.map((r) => r.id))

  const activeErrata = SEED_ERRATAS.filter((e) => {
    if (gameFilter && e.gameId !== gameFilter && !e.gameName.toLowerCase().includes(gameFilter.toLowerCase())) {
      return false
    }
    const supersedesMatch = e.supersedesRuleIds.some((id) => matchedRuleIds.has(id))
    const textMatch =
      e.title.toLowerCase().includes(normalized) ||
      e.officialRulingText.toLowerCase().includes(normalized) ||
      e.rationale.toLowerCase().includes(normalized)
    return supersedesMatch || textMatch
  })

  const relevantDisputes = SEED_DISPUTES.filter((d) => {
    if (gameFilter && d.gameId !== gameFilter && !d.gameName.toLowerCase().includes(gameFilter.toLowerCase())) {
      return false
    }
    return (
      d.title.toLowerCase().includes(normalized) ||
      d.scenarioDescription.toLowerCase().includes(normalized) ||
      normalized.split(' ').some((w) => w.length > 3 && d.title.toLowerCase().includes(w))
    )
  })

  // If no direct keyword match, return top relevant sample so the agent is always grounded
  return {
    matchedRules: matchedRules.length > 0 ? matchedRules : [SEED_RULES[0]],
    activeErrata: activeErrata.length > 0 ? activeErrata : [SEED_ERRATAS[0]],
    relevantDisputes: relevantDisputes.length > 0 ? relevantDisputes : [SEED_DISPUTES[0]],
  }
}
