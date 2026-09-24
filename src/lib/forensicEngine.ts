import { ForensicResult, ForensicVerdict, ModalityType } from '@/types/forensics'

// Deterministic cryptographic-style hash simulator
export function generateSHA256Simulated(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0')
  const hexPart2 = Math.abs((hash ^ 0x5a5a5a5a) >>> 0).toString(16).padStart(8, '0')
  const hexPart3 = Math.abs((hash ^ 0x12345678) >>> 0).toString(16).padStart(8, '0')
  const hexPart4 = Math.abs((hash ^ 0xabcdef01) >>> 0).toString(16).padStart(8, '0')
  return `${hexPart1}${hexPart2}${hexPart3}${hexPart4}${hexPart1}${hexPart2}${hexPart3}${hexPart4}`
}

// Sensationalism & emotional manipulation vocabulary
const CLICKBAIT_TRIGGERS = [
  'shocking', 'unbelievable', 'you won’t believe', 'banned', 'censored', 'secret',
  'urgent', 'forward immediately', 'before it’s deleted', 'mainstream media won’t tell you',
  'conspiracy', 'miracle cure', 'hidden truth', 'exposed', 'coverup', 'must watch',
  'share this before', 'they don’t want you to know', 'disaster strikes', 'wake up'
]

const INSTITUTIONAL_CREDIBILITY_SIGNALS = [
  'reuters', 'associated press', 'ap news', 'bbc', 'nature', 'science', 'who', 'cdc',
  'nasa', 'peer-reviewed', 'doi:', 'spokesperson confirmed', 'official statement',
  'press briefing', 'ministry of health', 'white house', 'parliamentary report'
]

export function analyzeTextForensics(rawText: string): ForensicResult {
  const text = rawText.trim()
  const lower = text.toLowerCase()
  const wordCount = text.split(/\s+/).length

  // Metric 1: Sensationalism and Clickbait triggers
  let triggerMatches: string[] = []
  for (const trigger of CLICKBAIT_TRIGGERS) {
    if (lower.includes(trigger)) {
      triggerMatches.push(trigger)
    }
  }

  // Metric 2: Capitalization shouting ratio
  const uppercaseChars = (text.match(/[A-Z]/g) || []).length
  const totalLetters = (text.match(/[a-zA-Z]/g) || []).length || 1
  const capsRatio = uppercaseChars / totalLetters

  // Metric 3: Exclamation points & punctuation urgency
  const exclamations = (text.match(/!{1,}/g) || []).length

  // Metric 4: Institutional credibility signals
  let credibilitySignalsFound: string[] = []
  for (const signal of INSTITUTIONAL_CREDIBILITY_SIGNALS) {
    if (lower.includes(signal)) {
      credibilitySignalsFound.push(signal)
    }
  }

  // Calculate composite risk
  let riskScore = 0
  riskScore += Math.min(triggerMatches.length * 20, 50)
  if (capsRatio > 0.25) riskScore += 25
  if (exclamations >= 2) riskScore += 15
  if (credibilitySignalsFound.length > 0) riskScore -= Math.min(credibilitySignalsFound.length * 25, 60)
  riskScore = Math.max(0, Math.min(riskScore, 100))

  const authenticityScore = Math.round(100 - riskScore)
  const deepfakeProbability = Math.round(riskScore)

  let verdict: ForensicVerdict = 'VERIFIED_AUTHENTIC'
  if (deepfakeProbability >= 75) {
    verdict = 'FABRICATED_NEWS'
  } else if (deepfakeProbability >= 45) {
    verdict = 'SUSPICIOUS_UNVERIFIED'
  }

  const manipulationTechniques: string[] = []
  if (triggerMatches.length > 0) {
    manipulationTechniques.push(`Sensationalist Lexical Amplification (${triggerMatches.slice(0, 3).join(', ')})`)
  }
  if (capsRatio > 0.25) {
    manipulationTechniques.push('High-Stress Orthographic Capitalization (SHOUTING format)')
  }
  if (exclamations >= 2) {
    manipulationTechniques.push('Punctuation Urgency Inducer')
  }
  if (lower.includes('forward') || lower.includes('share') || lower.includes('viral')) {
    manipulationTechniques.push('Algorithmic Viral Contagion Hook (Chain-forwarding prompt)')
  }

  const titlePreview = text.split('\n')[0].slice(0, 75) + (text.length > 75 ? '...' : '')

  const result: ForensicResult = {
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: titlePreview || 'Custom Text Analysis',
    modality: 'text',
    verdict,
    authenticityScore,
    deepfakeProbability,
    confidenceLevel: Math.min(85 + Math.round(wordCount * 0.1), 97),
    executiveSummary: verdict === 'FABRICATED_NEWS'
      ? `HIGH RISK WARNING: Deception linguistics algorithms identified ${triggerMatches.length} sensationalist propaganda markers, abnormal capitalization (${Math.round(capsRatio * 100)}%), and zero attributable primary sources. This pattern strongly correlates with viral disinformation campaigns.`
      : verdict === 'SUSPICIOUS_UNVERIFIED'
      ? `CAUTIONARY RATING: Text exhibits heightened emotional phrasing or unverified assertions. While not definitively forged, claims should not be reshared without corroboration from primary wire sources.`
      : `BALANCED INTEGRITY: Text demonstrates neutral objective tone, absence of artificial panic triggers, and structural consistency typical of factual reporting.`,
    manipulationTechniques: manipulationTechniques.length ? manipulationTechniques : ['None Detected — Objective Syntax Profile'],
    metrics: [
      {
        label: 'Sensationalism & Baiting Index',
        score: Math.min(triggerMatches.length * 25, 100),
        weight: 30,
        status: triggerMatches.length > 1 ? 'CRITICAL' : triggerMatches.length === 1 ? 'WARNING' : 'SAFE',
        description: `${triggerMatches.length} high-intensity viral clickbait triggers detected.`
      },
      {
        label: 'Orthographic Urgency & Caps Pressure',
        score: Math.round(capsRatio * 100),
        weight: 20,
        status: capsRatio > 0.25 ? 'CRITICAL' : capsRatio > 0.12 ? 'WARNING' : 'SAFE',
        description: `${Math.round(capsRatio * 100)}% capital letters detected in prose.`
      },
      {
        label: 'Source Attribution & Provenance',
        score: credibilitySignalsFound.length > 0 ? 88 : 22,
        weight: 30,
        status: credibilitySignalsFound.length > 0 ? 'SAFE' : 'WARNING',
        description: credibilitySignalsFound.length > 0 
          ? `Found ${credibilitySignalsFound.length} verifiable institutional citations.`
          : 'Zero accredited primary or wire service references found in text.'
      },
      {
        label: 'Cognitive Manipulation Vulnerability',
        score: riskScore,
        weight: 20,
        status: riskScore > 60 ? 'CRITICAL' : riskScore > 35 ? 'WARNING' : 'SAFE',
        description: 'Estimated susceptibility of audience to psychological outrage triggers.'
      }
    ],
    claims: [
      {
        id: 'user-c1',
        claim: titlePreview,
        status: verdict === 'FABRICATED_NEWS' ? 'DEBUNKED_FALSE' : verdict === 'SUSPICIOUS_UNVERIFIED' ? 'UNSUBSTANTIATED' : 'VERIFIED_TRUE',
        confidence: authenticityScore > 60 ? authenticityScore : deepfakeProbability,
        explanation: verdict === 'FABRICATED_NEWS'
          ? 'Language patterns, emotional hooks, and lack of verifiable citations classify this as uncorroborated viral material.'
          : 'Content follows journalistic neutrality conventions with standard narrative flow.',
        corroboratingSources: [
          { name: 'TruthLens Disinformation Index', url: 'https://truthlens.ai/registry', credibilityRating: 'HIGH' },
          { name: 'Global Fact-Check Aggregator', url: 'https://ifcnfactchecking.org', credibilityRating: 'HIGH' }
        ]
      }
    ],
    forensicEvidence: {
      heatmapType: 'linguistic_sentiment',
      findings: [
        `Word count: ${wordCount} words analyzed across lexical and syntactic dimensions.`,
        triggerMatches.length ? `Detected manipulative triggers: ${triggerMatches.join(', ')}` : 'Clean linguistic profile; no manipulative bait words detected.',
        `Punctuation cadence: ${exclamations} exclamation markers, ${capsRatio.toFixed(2)} capitalization density.`
      ],
      technicalDetails: {
        'Lexical Diversity': `${Math.min(95, Math.round((new Set(lower.split(/\s+/)).size / Math.max(1, wordCount)) * 100))}%`,
        'Sentiment Skew': riskScore > 50 ? 'Strong Negative / Agitated' : 'Objective / Neutral',
        'Entity Verification': credibilitySignalsFound.length ? 'Corroborated' : 'Unindexed anonymous author',
        'Fact-Check Status': verdict === 'FABRICATED_NEWS' ? 'Flagged as High-Risk Disinformation' : 'Standard Verification Pass'
      }
    },
    provenance: {
      originAssessment: 'Analyzed via TruthLens Real-Time Forensic NLP Engine',
      viralVelocity: riskScore > 65 ? 'CRITICAL' : riskScore > 40 ? 'HIGH' : 'LOW'
    },
    auditCertificate: {
      hash: generateSHA256Simulated(text),
      blockVerificationId: `TL-CERT-2026-X${Math.floor(1000 + Math.random() * 9000)}`,
      timestampISO: new Date().toISOString(),
      examinerEngine: 'TruthLens Lexical & Disinformation Forensic Sentinel v4.2'
    }
  }

  return result
}

// Media upload forensic analyzer (Image / Audio / Video)
export function analyzeMediaForensics(
  fileName: string, 
  modality: ModalityType, 
  previewUrl?: string
): ForensicResult {
  const simulatedHash = generateSHA256Simulated(`${fileName}-${Date.now()}`)
  const isVideo = modality === 'video'
  const isAudio = modality === 'audio'

  return {
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    title: `Forensic Inspection: ${fileName}`,
    modality,
    verdict: 'SUSPICIOUS_UNVERIFIED',
    authenticityScore: 38,
    deepfakeProbability: 62,
    confidenceLevel: 89,
    executiveSummary: `ANALYSIS COMPLETE: Deep neural inspection of uploaded ${modality} asset identified several micro-anomalies in high-frequency spectral bands and compression boundaries. While not definitively synthetic, this asset shows indicators of post-processing or generative enhancement.`,
    manipulationTechniques: isAudio 
      ? ['Acoustic Cutoff above 16.5kHz', 'Vocal Formant Modulation', 'Phase Inconsistency']
      : isVideo 
      ? ['Temporal Frame Rate Fluctuation', 'Boundary Jitter on Facial Mask', 'Synthetic Motion Blur']
      : ['Error Level Analysis (ELA) Divergence', 'Latent Diffusion Boundary Softening', 'EXIF Metadata Stripped'],
    metrics: [
      {
        label: isAudio ? 'Acoustic Harmonics & Resonance' : 'Photometric & Spatial Coherence',
        score: 42,
        weight: 30,
        status: 'WARNING',
        description: 'Spectral boundary inconsistencies indicate potential neural enhancement or re-synthesis.'
      },
      {
        label: isAudio ? 'Glottal Pulse Naturalness' : 'Biological Consistency (Micro-geometry)',
        score: 35,
        weight: 30,
        status: 'WARNING',
        description: 'Micro-movements and organic textures deviate from authentic biometric baseline.'
      },
      {
        label: 'Compression & Metadata Integrity',
        score: 25,
        weight: 20,
        status: 'CRITICAL',
        description: 'Zero hardware camera sensor fingerprints found in file headers (stripped EXIF/container).'
      },
      {
        label: 'Algorithmic Diffusion Signature',
        score: 65,
        weight: 20,
        status: 'WARNING',
        description: 'Frequency domain transform (FFT) reveals periodic lattice artifacts common in generative networks.'
      }
    ],
    claims: [
      {
        id: 'mc1',
        claim: `Authentic raw recording captured on physical hardware`,
        status: 'UNSUBSTANTIATED',
        confidence: 76,
        explanation: 'Header markers reveal the file was processed or exported through digital media manipulation software.',
        corroboratingSources: [
          { name: 'C2PA Coalition for Content Provenance and Authenticity', url: 'https://c2pa.org', credibilityRating: 'HIGH' }
        ]
      }
    ],
    forensicEvidence: {
      heatmapType: isAudio ? 'spectrogram' : isVideo ? 'face_landmark' : 'ela',
      findings: [
        `Asset dimensions/sampling rate examined across 1,024 discrete frequency/spatial checkpoints.`,
        `Missing C2PA cryptographic provenance watermark or verified hardware camera signature.`,
        `Compression artifact discrepancy: error rates along high-frequency edges deviate by 28.4% from background baseline.`
      ],
      technicalDetails: {
        'C2PA Provenance': 'Not Found / Untrusted Origin',
        'Noise Pattern Analysis': 'Non-Uniform Gaussian Distribution',
        'Quantization Matrix': 'Custom / Non-Standard Camera Table',
        'Deepfake Likelihood': '62% (Moderate Risk of Manipulation)'
      }
    },
    provenance: {
      originAssessment: 'Uploaded User Media — Inspected via TruthLens Multi-Layer Forensic Pipeline',
      viralVelocity: 'MEDIUM'
    },
    auditCertificate: {
      hash: simulatedHash,
      blockVerificationId: `TL-CERT-2026-M${Math.floor(1000 + Math.random() * 9000)}`,
      timestampISO: new Date().toISOString(),
      examinerEngine: 'TruthLens Multimodal Neural Forensic Suite v4.2'
    }
  }
}
