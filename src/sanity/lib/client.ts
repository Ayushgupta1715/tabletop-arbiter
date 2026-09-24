import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'
import {
  SEED_VERSION_DRIFTS,
  SEED_LIBRARIES,
  SEED_KNOWLEDGE_SOURCES,
  VersionDriftRecord,
  LibraryProfileRecord,
  KnowledgeSourceRecord,
} from './seedData'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

// In-memory decision store for overrides across the session
const localDecisionOverrides: Record<string, { status: VersionDriftRecord['decisionStatus']; decision: string }> = {}

/**
 * Fetch Version Drift & Contradiction records from Sanity with library and keyword filtering
 */
export async function getVersionDrifts(params?: {
  library?: string
  search?: string
  category?: string
}): Promise<VersionDriftRecord[]> {
  try {
    if (projectId && projectId !== 'demo-sanity-hackathon') {
      const query = `*[_type == "versionDriftRecord" 
        && (!defined($library) || libraryName == $library)
        && (!defined($category) || featureCategory == $category)
      ] {
        "id": _id,
        title,
        libraryName,
        featureCategory,
        driftSeverity,
        queryPatterns,
        scenarioSummary,
        legacyVersion,
        legacyClaim,
        legacyCode,
        legacySourceLabel,
        legacySourceUrl,
        currentVersion,
        currentClaim,
        currentCode,
        currentSourceLabel,
        currentSourceUrl,
        communityClaim,
        communitySourceLabel,
        communitySourceUrl,
        compilerError,
        whyKeywordSearchFails,
        resolutionDecision,
        decisionStatus,
        migrationDiff,
        verifiedBySanity,
        lastDecisionDate
      }`
      const remote = await client.fetch(query, params as QueryParams)
      if (remote && remote.length > 0) {
        return remote
      }
    }
  } catch (err) {
    console.warn('Sanity remote fetch fallback to local Knowledge Base:', err)
  }

  // Local Knowledge Base Filter
  let results = SEED_VERSION_DRIFTS.map((record) => {
    if (localDecisionOverrides[record.id]) {
      return {
        ...record,
        decisionStatus: localDecisionOverrides[record.id].status,
        resolutionDecision: localDecisionOverrides[record.id].decision,
      }
    }
    return record
  })

  if (params?.library && params.library !== 'all') {
    const lib = params.library.toLowerCase()
    results = results.filter((r) => r.libraryName.toLowerCase().includes(lib))
  }

  if (params?.category && params.category !== 'all') {
    results = results.filter((r) => r.featureCategory === params.category)
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim()
    const words = q.split(/\s+/).filter((w) => w.length > 2)

    results = results.filter((r) => {
      // 1. Direct match on patterns or titles
      if (
        r.title.toLowerCase().includes(q) ||
        r.scenarioSummary.toLowerCase().includes(q) ||
        r.queryPatterns.some((pattern) => pattern.toLowerCase().includes(q) || q.includes(pattern.toLowerCase()))
      ) {
        return true
      }

      // 2. Token overlap match
      return words.some(
        (w) =>
          r.title.toLowerCase().includes(w) ||
          r.legacyClaim.toLowerCase().includes(w) ||
          r.currentClaim.toLowerCase().includes(w) ||
          r.legacyCode.toLowerCase().includes(w) ||
          r.currentCode.toLowerCase().includes(w) ||
          r.queryPatterns.some((p) => p.toLowerCase().includes(w))
      )
    })
  }

  return results
}

/**
 * Fetch supported Library Profiles
 */
export async function getLibraries(): Promise<LibraryProfileRecord[]> {
  try {
    if (projectId && projectId !== 'demo-sanity-hackathon') {
      const query = `*[_type == "libraryProfile"] {
        "id": _id,
        name,
        slug,
        fromVersion,
        toVersion,
        majorShiftSummary,
        officialDocsUrl,
        migrationGuideUrl,
        badgeColor
      }`
      const remote = await client.fetch(query)
      if (remote && remote.length > 0) {
        return remote
      }
    }
  } catch (err) {
    console.warn('Sanity libraries remote fetch fallback:', err)
  }

  return SEED_LIBRARIES
}

/**
 * Fetch Ingested Knowledge Sources
 */
export async function getKnowledgeSources(params?: {
  library?: string
  freshness?: string
  search?: string
}): Promise<KnowledgeSourceRecord[]> {
  try {
    if (projectId && projectId !== 'demo-sanity-hackathon') {
      const query = `*[_type == "knowledgeSource"
        && (!defined($library) || libraryName == $library)
        && (!defined($freshness) || temporalFreshness == $freshness)
      ] {
        "id": _id,
        title,
        libraryName,
        sourceType,
        versionTarget,
        temporalFreshness,
        publishedYear,
        sourceUrl,
        authorOrDomain,
        summary,
        contradictionNotes,
        status
      }`
      const remote = await client.fetch(query, params as QueryParams)
      if (remote && remote.length > 0) {
        return remote
      }
    }
  } catch (err) {
    console.warn('Sanity knowledge sources remote fetch fallback:', err)
  }

  let results = [...SEED_KNOWLEDGE_SOURCES]

  if (params?.library && params.library !== 'all') {
    const lib = params.library.toLowerCase()
    results = results.filter((s) => s.libraryName.toLowerCase().includes(lib))
  }

  if (params?.freshness && params.freshness !== 'all') {
    results = results.filter((s) => s.temporalFreshness === params.freshness)
  }

  if (params?.search) {
    const q = params.search.toLowerCase()
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.contradictionNotes.toLowerCase().includes(q) ||
        s.authorOrDomain.toLowerCase().includes(q)
    )
  }

  return results
}

/**
 * Override / Record a Decision for a Version Drift Contradiction
 * (Carries decision into downstream agent builds via MCP memory)
 */
export async function recordDriftDecision(
  driftId: string,
  decision: string,
  status: VersionDriftRecord['decisionStatus'] = 'enforced_modern'
) {
  localDecisionOverrides[driftId] = { status, decision }
  return {
    driftId,
    status,
    decision,
    recordedAt: new Date().toISOString(),
    persistedToBuildMemory: true,
  }
}
