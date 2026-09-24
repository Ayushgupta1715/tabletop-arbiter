import {
  getVersionDrifts,
  getLibraries,
  getKnowledgeSources,
  recordDriftDecision,
} from '@/sanity/lib/client'
import {
  VersionDriftRecord,
  LibraryProfileRecord,
  KnowledgeSourceRecord,
} from '@/sanity/lib/seedData'

export interface DriftDetectionResult {
  hasDrift: boolean
  matchedRecord?: VersionDriftRecord
  allMatches: VersionDriftRecord[]
  breakingSeverity: VersionDriftRecord['driftSeverity'] | 'none'
  legacyVersusModern: {
    legacySyntax: string
    modernSyntax: string
    legacySource: { label: string; url: string }
    modernSource: { label: string; url: string }
  } | null
  whyKeywordSearchFailed: string
  activeDecision: string
  compilerErrorSimulation?: string
  migrationDiff?: string
  evaluatedAt: string
}

/**
 * MCP Tool 1: Detect Version Drift & Breaking Contradictions
 * Evaluates developer question or code snippet against structured Sanity KB.
 */
export async function detectVersionDrift(params: {
  query: string
  codeSnippet?: string
  library?: string
}): Promise<DriftDetectionResult> {
  const combinedSearch = `${params.query} ${params.codeSnippet || ''}`.trim()
  const matches = await getVersionDrifts({
    search: combinedSearch,
    library: params.library,
  })

  if (matches.length === 0) {
    return {
      hasDrift: false,
      allMatches: [],
      breakingSeverity: 'none',
      legacyVersusModern: null,
      whyKeywordSearchFailed: 'No active version drift conflict identified for this query.',
      activeDecision: 'No contradictory claims detected. Proceed with standard documentation.',
      evaluatedAt: new Date().toISOString(),
    }
  }

  const top = matches[0]

  return {
    hasDrift: true,
    matchedRecord: top,
    allMatches: matches,
    breakingSeverity: top.driftSeverity,
    legacyVersusModern: {
      legacySyntax: top.legacyCode,
      modernSyntax: top.currentCode,
      legacySource: { label: top.legacySourceLabel, url: top.legacySourceUrl },
      modernSource: { label: top.currentSourceLabel, url: top.currentSourceUrl },
    },
    whyKeywordSearchFailed: top.whyKeywordSearchFails,
    activeDecision: top.resolutionDecision,
    compilerErrorSimulation: top.compilerError,
    migrationDiff: top.migrationDiff,
    evaluatedAt: new Date().toISOString(),
  }
}

/**
 * MCP Tool 2: Query Knowledge Base for Multi-Source Contradictions
 */
export async function queryDriftKnowledgeBase(params: {
  query: string
  library?: string
}) {
  const records = await getVersionDrifts({
    search: params.query,
    library: params.library,
  })
  const topMatch = records[0]

  return {
    tool: 'drift_query_knowledge_base',
    matchedRecords: records,
    topMatch,
    citations: topMatch
      ? {
          modern: { label: topMatch.currentSourceLabel, url: topMatch.currentSourceUrl },
          legacy: { label: topMatch.legacySourceLabel, url: topMatch.legacySourceUrl },
          community: { label: topMatch.communitySourceLabel, url: topMatch.communitySourceUrl },
          verifiedBySanity: topMatch.verifiedBySanity,
        }
      : undefined,
  }
}

/**
 * MCP Tool 3: Get Migration Diff
 */
export async function getMigrationDiff(params: { driftId: string }) {
  const records = await getVersionDrifts()
  const record = records.find((r) => r.id === params.driftId)
  if (!record) {
    throw new Error(`Drift record not found: ${params.driftId}`)
  }
  return {
    driftId: record.id,
    title: record.title,
    libraryName: record.libraryName,
    legacyVersion: record.legacyVersion,
    currentVersion: record.currentVersion,
    diff: record.migrationDiff,
    activeDecision: record.resolutionDecision,
  }
}

/**
 * MCP Tool 4: Record & Persist Decision for Future Builds
 */
export async function recordDecision(params: {
  driftId: string
  decision: string
  status?: VersionDriftRecord['decisionStatus']
}) {
  return await recordDriftDecision(params.driftId, params.decision, params.status)
}

/**
 * MCP Tool 5: Inspect Ingested Sources & Freshness
 */
export async function inspectKnowledgeSources(params?: {
  library?: string
  freshness?: string
  search?: string
}): Promise<KnowledgeSourceRecord[]> {
  return await getKnowledgeSources(params)
}

/**
 * MCP Tool 6: Fetch Supported Libraries
 */
export async function fetchLibraries(): Promise<LibraryProfileRecord[]> {
  return await getLibraries()
}
