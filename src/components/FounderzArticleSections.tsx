'use client'

import React from 'react'
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Layers,
  Cpu,
  Brain,
  Eye,
  Volume2,
  FileCheck,
  ShieldCheck,
  Zap
} from 'lucide-react'

export function FounderzArticleSections() {
  return (
    <div className="space-y-12 py-8 text-slate-300 font-sans leading-relaxed text-sm sm:text-base border-t border-slate-800">
      
      {/* SECTION 1 */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Part 1: The Disinformation Challenge</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Why Traditional Fact-Checking Fails in the Modern Era
        </h2>

        <p>
          In an era where synthetic media models generate photorealistic images in under three seconds and neural voice cloning produces indistinguishable audio from a 3-second sample, <strong>manual fact-checking has hit a mathematical bottleneck</strong>.
        </p>

        <p>
          A viral disinformation campaign spreads across social networks at an exponential rate. Traditional journalistic verification pipelines, which rely on manual phone calls, document requests, and cross-source corroboration, typically take <strong>24 to 72 hours</strong>. By the time a debunk article is indexed by search engines, the original fake news item has already logged millions of impressions and influenced public sentiment.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm space-y-2">
          <strong className="text-white">The Speed Mismatch:</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400">
            <div className="p-3 rounded-xl bg-black/60 border border-rose-500/30">
              <span className="text-rose-400 font-bold block mb-1">Viral Disinformation</span>
              Reaches peak velocity within 45 minutes of publication on Telegram, X, and encrypted messaging groups.
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30">
              <span className="text-cyan-400 font-bold block mb-1">Manual Journalistic Debunk</span>
              Takes 12–48 hours to research, author, and publish through editorial boards.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
          <Brain className="w-3.5 h-3.5" />
          <span>Part 2: The Core AI Detection Pillars</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          How AI Detects Fake News: Wording, Tone & Advanced Signals
        </h2>

        <p>
          Machine learning classifiers trained on true and false corpora do not simply look for keywords; they evaluate high-dimensional statistical patterns across three primary axes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">1. Wording & Structure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Disinformation uses repetitive linguistic templates, unusual punctuation density (excessive exclamation points), high uppercase ratios, and lack of verifiable named entities.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">2. Emotional Tone</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sentiment scoring flags aggressive urgency hooks (“Forward before this gets deleted!”, “They don’t want you to know”) engineered to trigger emotional panic before logic kicks in.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">3. Advanced Signals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-referencing claims in real-time against verified wire registries (Reuters, AP, Poynter IFCN) and inspecting cryptographic C2PA content provenance manifests.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3 */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
          <Eye className="w-3.5 h-3.5" />
          <span>Part 3: Beyond Text to Multimodal Deepfakes</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Visual & Acoustic Forensics: ELA, Spectrograms & Frame Jitter
        </h2>

        <p>
          The most dangerous disinformation is multimodal: an AI voice clone paired with a synthetic photo or modified video clip. TruthLens AI introduces three physical-layer forensic techniques directly in the browser:
        </p>

        <ul className="space-y-3 pl-2">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Error Level Analysis (ELA):</strong> JPEG compression saves data in 8x8 pixel blocks at known quantization ratios. When an image is spliced or generative diffusion is filled in, the modified pixels compress with a distinct error rate compared to the untouched backdrop.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">The 16.0 kHz Acoustic Cutoff:</strong> Neural vocoders and zero-shot voice clones frequently downsample audio with a sharp mathematical cutoff at 16kHz, lacking the organic sub-glottal air flow and micro-flutter of genuine vocal cords.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Temporal Frame Coherence:</strong> Deepfake video models often struggle with eye-blink regularity (under 15 blinks/min) and facial landmark jitter when an actor’s head rotates past 45 degrees.
            </div>
          </li>
        </ul>
      </section>

      {/* SECTION 4 */}
      <section className="space-y-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Part 4: The Triage Layer & Human-in-the-Loop</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Why AI is a Triage Layer, Not a Final Judge
        </h3>

        <p className="text-xs sm:text-sm text-slate-300">
          As emphasized throughout Founderz AI courses, <strong>no machine learning model is 100% infallible</strong>. False positives and false negatives occur when satire, parody, or nuanced sarcasm are tested.
        </p>

        <p className="text-xs sm:text-sm text-slate-300">
          The best defense architecture uses AI as an automated <strong>triage funnel</strong>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30">
            <strong className="text-emerald-400 block mb-1">Clear Real (&gt;85% Score)</strong>
            Passes immediately through automated delivery systems without friction.
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
            <strong className="text-amber-400 block mb-1">Borderline (40% - 85%)</strong>
            Queued for human-in-the-loop review by specialized trust & safety analysts.
          </div>
          <div className="p-3 rounded-xl bg-black/60 border border-rose-500/30">
            <strong className="text-rose-400 block mb-1">High Risk (&lt;40% Score)</strong>
            Attached with a verified warning badge and forwarded to IFCN fact-checking networks.
          </div>
        </div>
      </section>

    </div>
  )
}
