export type ModalityType = 'text' | 'image' | 'audio' | 'video'

export type ForensicVerdict = 
  | 'HIGH_CONFIDENCE_DEEPFAKE'
  | 'MANIPULATED_MEDIA'
  | 'SUSPICIOUS_UNVERIFIED'
  | 'VERIFIED_AUTHENTIC'
  | 'FABRICATED_NEWS'

export interface ClaimVerificationItem {
  id: string
  claim: string
  status: 'VERIFIED_TRUE' | 'DEBUNKED_FALSE' | 'MISLEADING' | 'UNSUBSTANTIATED'
  confidence: number
  explanation: string
  corroboratingSources?: {
    name: string
    url: string
    credibilityRating: 'HIGH' | 'MEDIUM' | 'LOW'
  }[]
}

export interface MetricBreakdown {
  label: string
  score: number // 0 - 100
  weight: number
  status: 'SAFE' | 'WARNING' | 'CRITICAL'
  description: string
}

export interface ForensicResult {
  id: string
  timestamp: string
  title: string
  modality: ModalityType
  verdict: ForensicVerdict
  authenticityScore: number // 0-100 (100 = completely authentic)
  deepfakeProbability: number // 0-100 (100 = definitely synthetic/deepfake)
  confidenceLevel: number // 0-100
  executiveSummary: string
  manipulationTechniques: string[]
  metrics: MetricBreakdown[]
  claims: ClaimVerificationItem[]
  forensicEvidence: {
    heatmapType: 'ela' | 'face_landmark' | 'spectrogram' | 'linguistic_sentiment'
    findings: string[]
    technicalDetails: Record<string, string | number | boolean>
  }
  provenance: {
    originAssessment: string
    syntheticModelLikelihood?: string
    firstSeenApprox?: string
    viralVelocity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }
  auditCertificate: {
    hash: string
    blockVerificationId: string
    timestampISO: string
    examinerEngine: string
  }
}

export interface BenchmarkCase {
  id: string
  title: string
  category: string
  modality: ModalityType
  description: string
  tag: string
  sampleText?: string
  mediaUrl?: string
  mockVerdict: ForensicVerdict
  mockScore: number
  presetResult: ForensicResult
}
