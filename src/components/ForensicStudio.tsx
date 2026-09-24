'use client'

import React, { useState, useRef } from 'react'
import {
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  UploadCloud,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Scale,
  Activity,
  Cpu,
  Scan
} from 'lucide-react'
import { ModalityType, ForensicResult, BenchmarkCase } from '@/types/forensics'
import { BENCHMARK_CASES } from '@/lib/benchmarkCases'
import { InteractiveForensicVisualizer } from './InteractiveForensicVisualizer'
import { FactCheckMatrix } from './FactCheckMatrix'

interface ForensicStudioProps {
  apiKey: string
  currentResult: ForensicResult | null
  setCurrentResult: (result: ForensicResult | null) => void
  onOpenCertificate: () => void
}

export function ForensicStudio({
  apiKey,
  currentResult,
  setCurrentResult,
  onOpenCertificate
}: ForensicStudioProps) {
  const [activeModality, setActiveModality] = useState<ModalityType>('text')
  const [textInput, setTextInput] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [uploadedImageElement, setUploadedImageElement] = useState<HTMLImageElement | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanStage, setScanStage] = useState('')
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle benchmark selection
  const handleSelectBenchmark = (bench: BenchmarkCase) => {
    setActiveBenchmarkId(bench.id)
    setActiveModality(bench.modality)
    setTextInput(bench.sampleText || '')
    setSelectedFileName(bench.title)
    setUploadedImageElement(null)
    setCurrentResult(bench.presetResult)
  }

  // Handle file drop / upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    setActiveBenchmarkId(null)

    if (file.type.startsWith('image/')) {
      setActiveModality('image')
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          setUploadedImageElement(img)
        }
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith('audio/')) {
      setActiveModality('audio')
      setUploadedImageElement(null)
    } else if (file.type.startsWith('video/')) {
      setActiveModality('video')
      setUploadedImageElement(null)
    }
  }

  // Execute scan
  const handleExecuteScan = async () => {
    setIsScanning(true)
    setScanStage('Initializing Neural Diagnostic Pipeline...')

    try {
      // Multi-stage scan animation steps
      await new Promise(r => setTimeout(r, 400))
      setScanStage(
        activeModality === 'image'
          ? 'Computing Error Level Analysis (ELA) & Discrete Cosine Transforms...'
          : activeModality === 'audio'
          ? 'Analyzing Mel-Spectrogram & High-Frequency Spectral Decay...'
          : activeModality === 'video'
          ? 'Extracting Temporal Flow Vectors & Facial Landmark Trajectories...'
          : 'Parsing Lexical Sensationalism & Cross-Referencing Fact Registries...'
      )
      await new Promise(r => setTimeout(r, 600))
      setScanStage('Corroborating Wire Service Registries (Reuters, AP, IFCN)...')
      await new Promise(r => setTimeout(r, 500))
      setScanStage('Generating Cryptographic SHA-256 Forensic Fingerprint...')

      const payload = {
        modality: activeModality,
        content: textInput,
        fileName: selectedFileName,
        benchmarkId: activeBenchmarkId,
        apiKey
      }

      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success && data.result) {
        setCurrentResult(data.result)
      } else {
        throw new Error(data.error || 'Scan failed')
      }
    } catch (err: any) {
      console.error('Scan execution error:', err)
    } finally {
      setIsScanning(false)
      setScanStage('')
    }
  }

  return (
    <div className="space-y-8">
      
      {/* 1. Benchmark Scenarios Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Scan className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Viral Disinformation Benchmarks (Click to Load)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            5 Ground-Truth Calibrated Case Studies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BENCHMARK_CASES.map((bench) => {
            const isSelected = activeBenchmarkId === bench.id
            const isControl = bench.id === 'case-verified-real'

            return (
              <button
                key={bench.id}
                onClick={() => handleSelectBenchmark(bench)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : isControl
                    ? 'bg-slate-900/60 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      bench.modality === 'video' ? 'bg-rose-500/20 text-rose-300' :
                      bench.modality === 'audio' ? 'bg-indigo-500/20 text-indigo-300' :
                      bench.modality === 'image' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {bench.modality}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase truncate">
                      {bench.tag}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {bench.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className={bench.mockScore > 50 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {bench.mockVerdict === 'VERIFIED_AUTHENTIC' ? '✓ Authentic' : '⚠️ Deepfake / Hoax'}
                  </span>
                  <span className="text-slate-500 group-hover:text-white transition-colors">
                    Inspect →
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Main Input & Analysis Console */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Modality Selector Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Target Modality:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-slate-800 rounded-2xl">
              {[
                { id: 'text', label: 'News / Claim Text', icon: FileText },
                { id: 'image', label: 'Image / Photo', icon: ImageIcon },
                { id: 'audio', label: 'Audio / Voice', icon: Mic },
                { id: 'video', label: 'Video / Media', icon: Video },
              ].map((m) => {
                const Icon = m.icon
                const isActive = activeModality === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveModality(m.id as ModalityType)
                      setActiveBenchmarkId(null)
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {activeBenchmarkId && (
            <button
              onClick={() => {
                setActiveBenchmarkId(null)
                setTextInput('')
                setSelectedFileName('')
                setUploadedImageElement(null)
                setCurrentResult(null)
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Custom Input</span>
            </button>
          )}
        </div>

        {/* Input Interface based on modality */}
        {activeModality === 'text' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Paste article text, viral headline, social media post, or WhatsApp forward:</span>
              <span>{textInput.length} characters</span>
            </div>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value)
                setActiveBenchmarkId(null)
              }}
              placeholder="e.g. 'BREAKING: Health authorities issue emergency advisory on tap water chemicals. Share this urgently before it gets deleted!'"
              className="w-full p-4 rounded-2xl bg-black/60 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans leading-relaxed"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={
                activeModality === 'image'
                  ? 'image/*'
                  : activeModality === 'audio'
                  ? 'audio/*'
                  : 'video/*'
              }
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-3xl p-8 sm:p-12 text-center cursor-pointer bg-black/40 hover:bg-slate-900/40 transition-all group"
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="mt-4 space-y-1">
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {selectedFileName ? (
                    <span className="text-cyan-400 font-mono">Selected: {selectedFileName}</span>
                  ) : (
                    <span>Click or Drag & Drop {activeModality.toUpperCase()} file to inspect</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Supports JPG, PNG, WEBP, MP3, WAV, FLAC, MP4, MOV (Local ELA & Spectrogram Inspection)
                </p>
              </div>
            </div>

            {uploadedImageElement && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-cyan-500/30">
                <img
                  src={uploadedImageElement.src}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-xl border border-slate-800"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-white block">{selectedFileName}</span>
                  <span className="text-slate-400 block font-mono">
                    {uploadedImageElement.naturalWidth} x {uploadedImageElement.naturalHeight} px · Canvas ELA Ready
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan Button & Scanning Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>
              Engine: <strong className="text-white">{apiKey ? 'Google Gemini 2.0 + Local Kernel' : 'TruthLens Local Forensic Kernel'}</strong>
            </span>
          </div>

          <button
            onClick={handleExecuteScan}
            disabled={isScanning || (activeModality === 'text' && !textInput.trim() && !selectedFileName)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Activity className="w-4 h-4 animate-spin text-black" />
                <span>Running Forensic Scan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Initiate Multimodal Forensic Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Scan Animation Status */}
        {isScanning && (
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-xs font-mono text-cyan-300 animate-pulse flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{scanStage}</span>
          </div>
        )}

      </div>

      {/* 3. Forensic Results Presentation */}
      {currentResult && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main Verdict & KPI Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl relative overflow-hidden ${
            currentResult.verdict === 'HIGH_CONFIDENCE_DEEPFAKE' || currentResult.verdict === 'FABRICATED_NEWS'
              ? 'bg-gradient-to-br from-rose-950/50 via-slate-900 to-[#070b14] border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.2)]'
              : currentResult.verdict === 'VERIFIED_AUTHENTIC'
              ? 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-[#070b14] border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)]'
              : 'bg-gradient-to-br from-amber-950/50 via-slate-900 to-[#070b14] border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)]'
          }`}>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Verdict Summary */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                    currentResult.verdict === 'HIGH_CONFIDENCE_DEEPFAKE' || currentResult.verdict === 'FABRICATED_NEWS'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : currentResult.verdict === 'VERIFIED_AUTHENTIC'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {currentResult.verdict === 'VERIFIED_AUTHENTIC' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{currentResult.verdict.replace(/_/g, ' ')}</span>
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    Confidence: {currentResult.confidenceLevel}%
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentResult.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {currentResult.executiveSummary}
                </p>

                {/* Manipulation Techniques Chips */}
                {currentResult.manipulationTechniques.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Detected Signatures:
                    </span>
                    {currentResult.manipulationTechniques.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-black/60 border border-slate-700/80 text-cyan-300 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Radial Gauges & Action */}
              <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
                
                {/* Authenticity vs Deepfake Probability Gauges */}
                <div className="p-4 rounded-2xl bg-black/70 border border-slate-800 text-center min-w-[140px] space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Authenticity Rating
                  </div>
                  <div className={`text-4xl font-black tracking-tight ${
                    currentResult.authenticityScore > 70 ? 'text-emerald-400' :
                    currentResult.authenticityScore > 35 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {currentResult.authenticityScore}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Deepfake Risk: {currentResult.deepfakeProbability}%
                  </div>
                </div>

                {/* Audit Certificate Trigger */}
                <button
                  onClick={onOpenCertificate}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <span>View Official Audit Certificate</span>
                </button>

              </div>

            </div>

            {/* Diagnostic Metrics Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
              {currentResult.metrics.map((metric, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="truncate">{metric.label}</span>
                    <span className={metric.status === 'SAFE' ? 'text-emerald-400' : metric.status === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}>
                      {metric.score}/100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${metric.score}%` }}
                      className={`h-full rounded-full ${
                        metric.status === 'SAFE' ? 'bg-emerald-400' :
                        metric.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 leading-tight">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Interactive Forensic Canvas (ELA / Spectrogram / Frames / Linguistics) */}
          <InteractiveForensicVisualizer
            result={currentResult}
            uploadedImageElement={uploadedImageElement}
          />

          {/* Fact-Checking Matrix & Wire Verification */}
          <FactCheckMatrix result={currentResult} />

        </div>
      )}

    </div>
  )
}
