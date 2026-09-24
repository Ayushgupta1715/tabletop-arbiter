# 🛡️ TruthLens AI — Multimodal Deepfake & Fake News Forensic Intelligence Platform

*Hackathon Project Submission — AI Fake News & Deepfake Detection Sentinel*

---

## 💡 What I Built

**TruthLens AI** is an autonomous, multimodal digital forensic intelligence platform built to counter the modern epidemic of AI-generated disinformation, synthetic voice cloning, photorealistic image manipulation, and video deepfakes.

Unlike legacy fact-checkers that rely on manual reviews or unimodal text search, TruthLens AI provides:
1. **Multimodal Analysis Suite:** Examines **Text articles**, **Images/Photos**, **Audio voice notes**, and **Video footage** in a single unified dashboard.
2. **Real Browser-Based Error Level Analysis (ELA):** Runs client-side HTML5 canvas JPEG re-compression and differential error analysis to illuminate generative infill and spliced photo boundaries without server lag.
3. **Acoustic Spectrogram Voice Clone Detection:** Identifies the telltale **16.0 kHz brickwall cutoff** and absent glottal breathing pulses typical of neural TTS models (ElevenLabs, VALL-E).
4. **Wire Service Fact-Check Registry Corroboration:** Cross-references extracted claims against verified signatories of the International Fact-Checking Network (Reuters Fact Check, Associated Press, Snopes, Poynter IFCN).
5. **Cryptographic SHA-256 Forensic Audit Certificate:** Produces a downloadable, immutable forensic audit report with media fingerprint hashes and verifiable chain-of-custody data.
6. **Dual-Core Autonomous Engine:** Functions 100% out-of-the-box using deterministic local forensic heuristics, and seamlessly connects to **Google Gemini 2.0 Flash** for live deep multimodal semantic reasoning.

---

## ⚡ Why Existing Tools Fail (The Problem)

- **Disinformation is Multimodal:** A modern propaganda campaign pairs an AI voice clone with a CGI video clip and a sensationalized WhatsApp forward. Text-only fact checkers fail to catch the audio/video component.
- **Latency Kills Truth:** Traditional fact-checkers take 24–72 hours to publish a debunk. By then, a fabricated bank run or election claim has spread to millions of users.
- **Lack of Explainability:** Simply telling a user "This is 85% fake" causes distrust. TruthLens AI provides **Explainable AI (XAI)**: highlighting specific ELA hotspots, spectrogram frequency voids, manipulative punctuation, and corroborated wire sources.

---

## 🔬 Core Features & User Journey

### 1. ⚡ Benchmark Arena (5 Ground-Truth Case Studies)
Judges and users can instantly test the system with pre-calibrated real-world scenarios:
- **Case 1 (Video):** *Viral War Combat Footage* — ARMA 3 video game capture disguised as active missile defense interception.
- **Case 2 (Audio):** *Leaked CEO Insolvency Tape* — AI voice clone targeting retail stock markets.
- **Case 3 (Image):** *Synthetic Cathedral Protest* — Midjourney v6 photorealistic generation with anatomical flaws and contradictory lighting.
- **Case 4 (Text):** *Fabricated WHO Water Warning* — Viral WhatsApp forward engineered with emotional panic triggers.
- **Case 5 (Control Benchmark):** *NASA Exoplanet Discovery* — Verified authentic scientific research published in Nature.

### 2. 🎛️ Interactive Forensic Canvas
- **For Images:** Side-by-side Original vs Differential Error Level Analysis (ELA) map with live amplifier slider (5x–40x) and quality adjustment.
- **For Audio:** Real-time Mel-spectrogram frequency visualizer highlighting the 16.0 kHz neural vocoder cutoff.
- **For Video:** 30fps frame-by-frame telemetry scrubber detecting optical flow and facial landmark distortion.
- **For Text:** Deceptive syntax inspector highlighting emotional outrage triggers, unsubstantiated assertions, and verified citations.

### 3. 🌐 Global Disinformation Threat Radar
A live threat index tracking active disinformation campaigns, target vectors (finance, healthcare, elections), viral velocity, and instant forensic debunks.

### 4. 🤖 TruthLens AI Forensic Copilot
An interactive chatbot powered by Gemini 2.0 Flash and forensic heuristic knowledge, answering user inquiries on detection techniques, C2PA standards, and evidence interpretation.

### 5. 📜 Official Forensic Audit Certificate
Generates a cryptographically hashed (SHA-256) audit dossier exportable to JSON or printable as an official forensic certificate.

---

## 🛠️ How It Was Built (Tech Stack)

- **Frontend & App Engine:** Next.js 16.3.5 (Turbopack, React 19, App Router)
- **Styling & UI:** Tailwind CSS v4, Lucide Icons, Glassmorphism 3D styling
- **Forensic Computation:**
  - Client-side Canvas Error Level Analysis (`src/lib/elaProcessor.ts`)
  - Discrete frequency & acoustic harmonic modeling (`src/lib/audioAnalysis.ts`)
  - Linguistic deception & viral contagion heuristic algorithms (`src/lib/forensicEngine.ts`)
- **Multimodal AI Reasoning:** Google Gemini 2.0 Flash API integration (`src/app/api/detect/route.ts` & `src/app/api/chat/route.ts`)
- **Standards:** C2PA Content Provenance & IFCN Verification Protocols

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to explore the live platform.
