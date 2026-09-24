import { BenchmarkCase } from '@/types/forensics'

export const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: 'case-war-video',
    title: 'Viral Aerial Combat Footage in Active Conflict Zone',
    category: 'Video Deepfake / CGI Re-purposing',
    modality: 'video',
    tag: 'Simulated Military Action',
    description: 'Circulating clip on X and Telegram claiming to show 5th-generation stealth fighters evading surface-to-air missile batteries during yesterday’s airspace skirmish.',
    sampleText: 'BREAKING: Uncensored cockpit and ground footage showing advanced air-defense interception over border skies. Mainstream media refused to air this.',
    mockVerdict: 'HIGH_CONFIDENCE_DEEPFAKE',
    mockScore: 8,
    presetResult: {
      id: 'res-war-video',
      timestamp: new Date().toISOString(),
      title: 'Viral Aerial Combat Footage in Active Conflict Zone',
      modality: 'video',
      verdict: 'HIGH_CONFIDENCE_DEEPFAKE',
      authenticityScore: 6,
      deepfakeProbability: 94,
      confidenceLevel: 98,
      executiveSummary: 'CRITICAL ALERT: Forensic video analysis reveals this footage is NOT authentic military telemetry or cockpit recording. Geometric physics trajectories, particle smoke volumetric sprites, and shader rasterization match the ARMA 3 video game rendering engine with artificial film grain overlay applied to simulate night-vision sensor feeds.',
      manipulationTechniques: [
        '3D Game Engine (ARMA 3 / DCS World) Capture',
        'Synthetic Shaky-Cam Post-Processing',
        'Artificial Digital Compression Grain & Vignette',
        'Desaturated Color Grading to Imitate FLIR Thermal Optics'
      ],
      metrics: [
        { label: 'Photometric & Lighting Physics', score: 12, weight: 30, status: 'CRITICAL', description: 'Light reflections on fuselage defy real physical atmospheric dispersion; uniform shadow rasterization.' },
        { label: 'Temporal Frame Coherence', score: 18, weight: 25, status: 'CRITICAL', description: 'Locked 60fps internal engine timing inconsistent with military HUD telemetry cameras.' },
        { label: 'Source Provenance & Wire Verification', score: 4, weight: 25, status: 'CRITICAL', description: 'Zero corroboration from accredited defense correspondents, satellite feeds, or radar tracking.' },
        { label: 'Acoustic Shockwave Signature', score: 15, weight: 20, status: 'CRITICAL', description: 'Sound effects recycled from popular commercial audio soundpack; lacks authentic Doppler atmospheric attenuation.' }
      ],
      claims: [
        {
          id: 'c1',
          claim: 'Stealth fighter shot down over eastern border during combat sortie',
          status: 'DEBUNKED_FALSE',
          confidence: 99,
          explanation: 'Identical sequence published 11 months ago by a YouTube gaming creator demonstrating modded flight simulators.',
          corroboratingSources: [
            { name: 'Reuters Fact Check', url: 'https://reuters.com/fact-check', credibilityRating: 'HIGH' },
            { name: 'Bellingcat Geolocation & Verification', url: 'https://bellingcat.com', credibilityRating: 'HIGH' }
          ]
        },
        {
          id: 'c2',
          claim: 'Mainstream news embargo on event',
          status: 'DEBUNKED_FALSE',
          confidence: 96,
          explanation: 'Standard conspiracy amplification trope designed to deter audience from cross-checking reliable wires.'
        }
      ],
      forensicEvidence: {
        heatmapType: 'face_landmark',
        findings: [
          'Engine polygon vertex density matches Bohemia Interactive simulation asset meshes.',
          'Missing physical thermal dissipation bloom in supposed infrared imagery.',
          'Audio telemetry timestamp font is standard Arial, incompatible with mil-spec Rockwell avionics displays.'
        ],
        technicalDetails: {
          'Rendering Engine': 'DirectX 11 Shader Pipeline',
          'Frame Rate Jitter': '0.00% (Pure digital render)',
          'EXIF/Metadata': 'Stripped via Telegram re-encoding',
          'Debunk Status': 'Corroborated 100% synthetic'
        }
      },
      provenance: {
        originAssessment: 'Originally created as PC simulation fan video; hijacked by disinformation botnet on Telegram.',
        syntheticModelLikelihood: 'Synthetic 3D Engine + Post-FX Filter',
        firstSeenApprox: 'First uploaded 48 hours ago',
        viralVelocity: 'CRITICAL'
      },
      auditCertificate: {
        hash: 'e89a531f872c918a5e808291fbc5b34d920a65389657bcf22a6135649f874bc1',
        blockVerificationId: 'TL-CERT-2026-V8932',
        timestampISO: new Date().toISOString(),
        examinerEngine: 'TruthLens Multimodal Forensic Neural Suite v4.2'
      }
    }
  },
  {
    id: 'case-audio-clone',
    title: 'Leaked CEO Audio Declaring Insolvency Before Market Open',
    category: 'Voice Clone / Audio Deepfake',
    modality: 'audio',
    tag: 'Synthetic Voice Impersonation',
    description: 'An alarming 42-second audio recording purportedly of a Fortune 500 Chief Executive speaking to board members about immediate chapter 11 filing and accounting fraud.',
    sampleText: 'Audio snippet: "Look guys, the audit committee found the off-balance sheet derivatives. We need to prepare insolvency declarations before the bell rings Monday morning."',
    mockVerdict: 'HIGH_CONFIDENCE_DEEPFAKE',
    mockScore: 11,
    presetResult: {
      id: 'res-audio-clone',
      timestamp: new Date().toISOString(),
      title: 'Leaked CEO Audio Declaring Insolvency Before Market Open',
      modality: 'audio',
      verdict: 'HIGH_CONFIDENCE_DEEPFAKE',
      authenticityScore: 11,
      deepfakeProbability: 92,
      confidenceLevel: 95,
      executiveSummary: 'CRITICAL ALERT: Forensic acoustic analysis proves this voice sample is an artificial neural speech clone (Zero-Shot TTS). Spectral analysis exhibits a distinct 16.0 kHz brickwall frequency cutoff, unnatural phoneme pitch transitions, and zero biological respiration artifacts (glottal intake pauses).',
      manipulationTechniques: [
        'Neural Voice Cloning (ElevenLabs / VALL-E Architecture)',
        'Spectrogram High-Frequency 16kHz Cutoff',
        'Robotic Pitch Micro-Jitter Invariance',
        'Artificial Ambient Room Reverb Filter to Mask Synthesis'
      ],
      metrics: [
        { label: 'Acoustic Pitch Micro-Tremor', score: 14, weight: 30, status: 'CRITICAL', description: 'Human vocal cords exhibit 2-4% natural frequency flutter under stress; sample shows unnatural mathematical flatness.' },
        { label: 'Spectral Frequency Envelope', score: 8, weight: 30, status: 'CRITICAL', description: 'Hard cutoff at 16,000 Hz characteristic of neural vocoder re-sampling.' },
        { label: 'Biological Breathing Cadence', score: 9, weight: 20, status: 'CRITICAL', description: 'Zero sub-glottal inhalation pressure signals or micro-pauses between sentences.' },
        { label: 'Regulatory & SEC Filings Match', score: 5, weight: 20, status: 'CRITICAL', description: 'No 8-K disclosure, no auditor resignation notice, stock traded normally.' }
      ],
      claims: [
        {
          id: 'ca1',
          claim: 'Company declared secret insolvency during emergency weekend board call',
          status: 'DEBUNKED_FALSE',
          confidence: 98,
          explanation: 'Official statement confirmed false; SEC filing shows healthy Q3 operating cash balance of $1.4B.',
          corroboratingSources: [
            { name: 'SEC EDGAR Database', url: 'https://sec.gov', credibilityRating: 'HIGH' },
            { name: 'Bloomberg Financial Wire', url: 'https://bloomberg.com', credibilityRating: 'HIGH' }
          ]
        }
      ],
      forensicEvidence: {
        heatmapType: 'spectrogram',
        findings: [
          'Mel-spectrogram highlights zero acoustic reverberation in voice fundamentals (F0 curve unnatural).',
          'Phase discrepancy between left and right synthetic channels.',
          'Phoneme transitions between consonants and vowels lack human formantic glide.'
        ],
        technicalDetails: {
          'Vocoder Type': 'HiFi-GAN / Diffusion Waveform',
          'Sampling Rate': '32kHz upscaled to 44.1kHz',
          'Acoustic Formant Shift': 'Abnormal +3.8 semitones',
          'Glottal Pulse Coherence': '0.12 (Severe anomaly)'
        }
      },
      provenance: {
        originAssessment: 'Generated targeting retail investors ahead of options expiry to trigger short squeeze.',
        syntheticModelLikelihood: 'Diffusion Audio / VITS-based Voice Clone',
        viralVelocity: 'HIGH'
      },
      auditCertificate: {
        hash: 'b149fbc0281c3e108e498c47192a543ef8109d3b879c4a896d8b0e774128f645',
        blockVerificationId: 'TL-CERT-2026-A1094',
        timestampISO: new Date().toISOString(),
        examinerEngine: 'TruthLens Acoustic Forensics & Spectral Analyzer v4.2'
      }
    }
  },
  {
    id: 'case-synth-image',
    title: 'Synthetic Photo: Dramatic Global Protest With Spliced Landmarks',
    category: 'Generative AI Image / Diffusion',
    modality: 'image',
    tag: 'Generative Diffusion Photo',
    description: 'Viral high-contrast photograph showing massive crowds carrying smoke flares in front of an iconic cathedral, claiming to be an ongoing rebellion.',
    sampleText: 'Photo Caption: "Massive uprising right now in the capital city! Thousands occupying public squares while authorities shut down cell towers."',
    mockVerdict: 'HIGH_CONFIDENCE_DEEPFAKE',
    mockScore: 14,
    presetResult: {
      id: 'res-synth-image',
      timestamp: new Date().toISOString(),
      title: 'Synthetic Photo: Dramatic Global Protest With Spliced Landmarks',
      modality: 'image',
      verdict: 'HIGH_CONFIDENCE_DEEPFAKE',
      authenticityScore: 14,
      deepfakeProbability: 89,
      confidenceLevel: 94,
      executiveSummary: 'CRITICAL ALERT: Error Level Analysis (ELA) and Frequency Domain Transform (FFT) demonstrate widespread generative diffusion patterns (Midjourney v6 / Flux.1). Structural discrepancies include non-Euclidean architectural arches, surrealist crowd hand anatomy (6-fingered hands, melted fingers), and contradictory shadow casting angles.',
      manipulationTechniques: [
        'Latent Diffusion Model Synthesis (Midjourney / Flux)',
        'Asymmetrical Facial Splicing in Background Crowds',
        'Contradictory Dual Light Source Reflections',
        'Incoherent Text Gibberish on Protest Banners'
      ],
      metrics: [
        { label: 'Error Level Analysis (ELA) Discrepancy', score: 16, weight: 30, status: 'CRITICAL', description: 'Compression error gradients display high-frequency noise spikes around human subjects.' },
        { label: 'Anatomical Consistency (Hands/Facial)', score: 9, weight: 25, status: 'CRITICAL', description: 'Background figures display deformed earlobes, conjoined fingers, and asymmetrical eyewear.' },
        { label: 'Photometric Consistency & Shadow Raytracing', score: 18, weight: 25, status: 'CRITICAL', description: 'Directional shadow vectors diverge by 42 degrees between left and right subjects.' },
        { label: 'EXIF & Sensor Chromatic Aberration', score: 10, weight: 20, status: 'CRITICAL', description: 'Absence of camera sensor bayer pattern noise; sterile zero-Bayer pixel interpolation.' }
      ],
      claims: [
        {
          id: 'ci1',
          claim: 'Historic capital under military blockade during violent protest today',
          status: 'DEBUNKED_FALSE',
          confidence: 99,
          explanation: 'Live traffic webcams and metropolitan police feeds confirm standard peaceful city traffic with zero demonstrations.',
          corroboratingSources: [
            { name: 'Associated Press News Wire', url: 'https://apnews.com', credibilityRating: 'HIGH' },
            { name: 'City Municipal Public Cameras', url: 'https://gov.city-webcams.org', credibilityRating: 'HIGH' }
          ]
        }
      ],
      forensicEvidence: {
        heatmapType: 'ela',
        findings: [
          'Text on protest placards contains generated pseudo-glyphs rather than actual alphabet characters.',
          'Atmospheric haze fails to occlude the background spire according to optical depth laws.',
          'Identical facial features duplicated across three adjacent bystanders in background crowd.'
        ],
        technicalDetails: {
          'Diffusion Artifact Likelihood': '96.4%',
          'ELA Error Delta': '38.2 dB (High divergence)',
          'Color Space Subsampling': '4:4:4 (Synthetic raster)',
          'EXIF Tag': 'No hardware camera tags found'
        }
      },
      provenance: {
        originAssessment: 'Generated on Discord / Midjourney community channel, reposted by propaganda account.',
        syntheticModelLikelihood: 'Midjourney v6 / FLUX.1 Pro',
        viralVelocity: 'HIGH'
      },
      auditCertificate: {
        hash: 'c498715da8b376c098ef763189a7402be461f893d5678c12a8901bcf55447192',
        blockVerificationId: 'TL-CERT-2026-I4729',
        timestampISO: new Date().toISOString(),
        examinerEngine: 'TruthLens Optical & ELA Forensic Kernel v4.2'
      }
    }
  },
  {
    id: 'case-fake-news',
    title: 'Fabricated WHO Pandemic Bulletin & Forced Medication Notice',
    category: 'Fake News / Coordinated Disinformation',
    modality: 'text',
    tag: 'Viral WhatsApp Medical Disinformation',
    description: 'A viral message circulating across WhatsApp groups with simulated United Nations header, claiming tap water contains banned cognitive suppressants.',
    sampleText: 'URGENT CIRCULAR: World Health Organization emergency bulletin #4092-B. As of midnight tonight, municipal authorities are ordering immediate shutdown of household tap water supplies due to unauthorized chemical biocides. Forward this to 10 family groups immediately before social networks block it!',
    mockVerdict: 'FABRICATED_NEWS',
    mockScore: 4,
    presetResult: {
      id: 'res-fake-news',
      timestamp: new Date().toISOString(),
      title: 'Fabricated WHO Pandemic Bulletin & Forced Medication Notice',
      modality: 'text',
      verdict: 'FABRICATED_NEWS',
      authenticityScore: 3,
      deepfakeProbability: 97,
      confidenceLevel: 99,
      executiveSummary: 'FABRICATED HOAX: NLP sentiment and linguistic deception analysis flags extreme urgency manipulation ("Forward to 10 family groups immediately"), synthetic authority spoofing ("Bulletin #4092-B does not exist"), and complete absence of corroborating public health registry notices. Directly identified as recurring chain-letter disinformation.',
      manipulationTechniques: [
        'Emotional Fearmongering & Urgency Baiting',
        'Fabricated Institutional Identity (Spoofed WHO Credentials)',
        'Chain-Letter Forward Amplification Trigger',
        'Conspiracy Inoculation ("Before social media blocks this")'
      ],
      metrics: [
        { label: 'Factual Accuracy & Registry Search', score: 2, weight: 35, status: 'CRITICAL', description: 'Zero matching documents in WHO Official Bulletins, CDC, or national water utilities.' },
        { label: 'Linguistic Urgency & Fear Index', score: 96, weight: 25, status: 'CRITICAL', description: '96th percentile for emotional manipulation, sensational vocabulary, and call-to-panic.' },
        { label: 'Source Provenance & Authority Validity', score: 0, weight: 20, status: 'CRITICAL', description: 'No attributable scientific spokesperson, peer-reviewed study, or accredited press release.' },
        { label: 'Chain Disinformation Pattern Match', score: 98, weight: 20, status: 'CRITICAL', description: '98% structural match to classic WhatsApp forward hoaxes documented by IFCN fact-checkers.' }
      ],
      claims: [
        {
          id: 'cf1',
          claim: 'WHO issued Emergency Bulletin 4092-B shutting down water supplies',
          status: 'DEBUNKED_FALSE',
          confidence: 100,
          explanation: 'Official WHO spokesperson confirmed no such bulletin exists; WHO does not have jurisdiction over municipal water grids.',
          corroboratingSources: [
            { name: 'World Health Organization (WHO) Official Clarification', url: 'https://who.int', credibilityRating: 'HIGH' },
            { name: 'Poynter International Fact-Checking Network (IFCN)', url: 'https://poynter.org/ifcn', credibilityRating: 'HIGH' }
          ]
        },
        {
          id: 'cf2',
          claim: 'Municipal water systems are contaminated with chemical biocides',
          status: 'DEBUNKED_FALSE',
          confidence: 99,
          explanation: 'Water quality regulatory agencies continuously publish real-time open laboratory sensor telemetry confirming potable standards.'
        }
      ],
      forensicEvidence: {
        heatmapType: 'linguistic_sentiment',
        findings: [
          'High concentration of imperative verbs ("Forward", "Boil", "Act Now").',
          'Use of pseudo-technical gibberish designed to intimidate lay audiences.',
          'Classic viral disinformation vector optimized for private encrypted messaging apps.'
        ],
        technicalDetails: {
          'Clickbait / Urgency Score': '98/100 (Extreme)',
          'Flesch-Kincaid Grade': '6.4 (Designed for fast viral scanning)',
          'Perplexity Variance': 'Characteristic of low-effort spam templates',
          'Database Match': 'Found in 14 previous fact-checking debunks since 2022'
        }
      },
      provenance: {
        originAssessment: 'Private messaging network chain hoax with no verifiable root author.',
        viralVelocity: 'CRITICAL'
      },
      auditCertificate: {
        hash: 'a9018471bde49102c98231fca028476d091e2b589417c809e17326fa08932461',
        blockVerificationId: 'TL-CERT-2026-T8810',
        timestampISO: new Date().toISOString(),
        examinerEngine: 'TruthLens NLP Deception & Claim Graph Engine v4.2'
      }
    }
  },
  {
    id: 'case-verified-real',
    title: 'NASA James Webb Space Telescope Detects Atmospheric Carbon Dioxide on Exoplanet',
    category: 'Verified Authentic Science Reporting',
    modality: 'text',
    tag: 'Control Benchmark: Verified Authentic',
    description: 'Accredited science news release reporting the detection of carbon dioxide in the atmosphere of exoplanet WASP-39b using transmission spectroscopy.',
    sampleText: 'NASA’s James Webb Space Telescope has provided the first clear evidence for carbon dioxide in an exoplanet’s atmosphere. The observations of gas giant WASP-39 b, which orbits a Sun-like star 700 light-years away, were published in the journal Nature by an international team of over 300 researchers.',
    mockVerdict: 'VERIFIED_AUTHENTIC',
    mockScore: 97,
    presetResult: {
      id: 'res-verified-real',
      timestamp: new Date().toISOString(),
      title: 'NASA James Webb Space Telescope Detects Atmospheric Carbon Dioxide on Exoplanet',
      modality: 'text',
      verdict: 'VERIFIED_AUTHENTIC',
      authenticityScore: 97,
      deepfakeProbability: 3,
      confidenceLevel: 98,
      executiveSummary: 'VERIFIED AUTHENTIC: High-confidence scientific reporting validated across multiple independent authoritative repositories. Claims correspond verbatim to peer-reviewed publication in Nature, matching European Space Agency (ESA) and NASA Goddard Space Flight Center telemetry releases with transparent scientific authorship.',
      manipulationTechniques: [],
      metrics: [
        { label: 'Scientific Peer Review & Source Credibility', score: 99, weight: 35, status: 'SAFE', description: 'Corroborated by Nature paper DOI:10.1038/s41586-022-05269-w with 300+ co-signers.' },
        { label: 'Linguistic Neutrality & Objectivity', score: 96, weight: 25, status: 'SAFE', description: 'Balanced scientific tone, measurable empirical assertions, transparent methodology.' },
        { label: 'Wire Service & Institutional Consensus', score: 98, weight: 20, status: 'SAFE', description: 'Universal confirmation from NASA, ESA, CSA, and international astronomical observatories.' },
        { label: 'Absence of Deceptive Emotion Levers', score: 95, weight: 20, status: 'SAFE', description: 'Zero clickbait phrasing, zero artificial urgency or rage-inducing psychological hooks.' }
      ],
      claims: [
        {
          id: 'cr1',
          claim: 'James Webb telescope detected carbon dioxide on exoplanet WASP-39 b',
          status: 'VERIFIED_TRUE',
          confidence: 100,
          explanation: 'Confirmed by primary peer-reviewed dataset in Nature (Aug 2022) with NIRSpec transmission spectroscopy.',
          corroboratingSources: [
            { name: 'Nature Journal Publication', url: 'https://nature.com/articles/s41586-022-05269-w', credibilityRating: 'HIGH' },
            { name: 'NASA Official Press Release', url: 'https://nasa.gov/webb', credibilityRating: 'HIGH' }
          ]
        }
      ],
      forensicEvidence: {
        heatmapType: 'linguistic_sentiment',
        findings: [
          'High scientific semantic coherence with domain-specific terminology (transmission spectroscopy, exoplanet atmosphere).',
          'Named institutions and citations cross-verify perfectly against astronomical database ADS.',
          'Text exhibits standard journalistic attribution without sensational adjectives.'
        ],
        technicalDetails: {
          'DOI Cross-Ref': '10.1038/s41586-022-05269-w (Valid)',
          'Sentiment Polarity': '+0.12 (Objective / Neutral)',
          'Source Integrity Index': '99.4/100 (Tier-1 Institutional)',
          'Hallucination Risk': '< 1.0%'
        }
      },
      provenance: {
        originAssessment: 'Official Science Directorate release published simultaneously across global academic servers.',
        viralVelocity: 'MEDIUM'
      },
      auditCertificate: {
        hash: '1098471bce897103fa7231498cbe7821094da68102374e9812bc897103847a91',
        blockVerificationId: 'TL-CERT-2026-S1902',
        timestampISO: new Date().toISOString(),
        examinerEngine: 'TruthLens Scientific & Provenance Verification Engine v4.2'
      }
    }
  }
]
