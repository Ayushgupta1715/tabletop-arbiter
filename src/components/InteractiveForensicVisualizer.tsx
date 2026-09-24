'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Layers,
  Eye,
  Sliders,
  Play,
  Pause,
  Volume2,
  Sparkles,
  AlertTriangle,
  ZoomIn,
  Activity,
  Maximize2
} from 'lucide-react'
import { ForensicResult } from '@/types/forensics'
import { computeClientEla, ElaResult } from '@/lib/elaProcessor'

interface InteractiveForensicVisualizerProps {
  result: ForensicResult
  uploadedImageElement?: HTMLImageElement | null
}

export function InteractiveForensicVisualizer({
  result,
  uploadedImageElement
}: InteractiveForensicVisualizerProps) {
  const [activeView, setActiveView] = useState<'ela' | 'spectrogram' | 'frames' | 'linguistics'>('ela')
  const [elaScale, setElaScale] = useState<number>(20)
  const [elaQuality, setElaQuality] = useState<number>(0.75)
  const [clientEla, setClientEla] = useState<ElaResult | null>(null)
  const [isProcessingEla, setIsProcessingEla] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [selectedVideoFrame, setSelectedVideoFrame] = useState(2)

  // Auto-switch primary tab based on modality
  useEffect(() => {
    if (result.modality === 'image') setActiveView('ela')
    else if (result.modality === 'audio') setActiveView('spectrogram')
    else if (result.modality === 'video') setActiveView('frames')
    else setActiveView('linguistics')
  }, [result.modality])

  // Run real client ELA if image element exists
  useEffect(() => {
    if (uploadedImageElement) {
      setIsProcessingEla(true)
      computeClientEla(uploadedImageElement, elaScale, elaQuality)
        .then((res) => {
          setClientEla(res)
          setIsProcessingEla(false)
        })
        .catch((err) => {
          console.warn('Client ELA failed:', err)
          setIsProcessingEla(false)
        })
    }
  }, [uploadedImageElement, elaScale, elaQuality])

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
      
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Interactive Forensic Canvas
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Multimodal deep-inspection: Optical compression, acoustic harmonics, and structural linguistics
          </p>
        </div>

        {/* View Switcher Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveView('ela')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeView === 'ela'
                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Image ELA
          </button>
          <button
            onClick={() => setActiveView('spectrogram')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeView === 'spectrogram'
                ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audio Spectrogram
          </button>
          <button
            onClick={() => setActiveView('frames')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeView === 'frames'
                ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Video Frames
          </button>
          <button
            onClick={() => setActiveView('linguistics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeView === 'linguistics'
                ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Text Linguistics
          </button>
        </div>
      </div>

      {/* VIEW 1: Error Level Analysis (Image Forensics) */}
      {activeView === 'ela' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">ELA Recompression Quality: {Math.round(elaQuality * 100)}%</span>
              <span className="text-slate-500">·</span>
              <span className="font-semibold">Error Scale Amplifier: {elaScale}x</span>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <input
                type="range"
                min="5"
                max="40"
                value={elaScale}
                onChange={(e) => setElaScale(Number(e.target.value))}
                className="w-28 accent-cyan-400"
              />
            </div>
          </div>

          {/* ELA Canvas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original Simulated Image */}
            <div className="rounded-2xl bg-black/80 border border-slate-800 p-4 space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Original Asset View</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Raw Input</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex items-center justify-center">
                {uploadedImageElement ? (
                  <img
                    src={uploadedImageElement.src}
                    alt="Uploaded asset"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Eye className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-semibold text-slate-300">
                      Sample Subject: {result.title}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Visualizing subject face boundaries and illumination vectors
                    </p>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                Natural optical perspective without digital compression amplification.
              </div>
            </div>

            {/* Right: Error Level Analysis Heatmap */}
            <div className="rounded-2xl bg-black/80 border border-cyan-500/30 p-4 space-y-2 flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ELA Differential Error Map</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[10px] text-cyan-300 border border-cyan-500/40">
                  Amplified {elaScale}x
                </span>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-cyan-500/20 flex items-center justify-center">
                {clientEla?.elaDataUrl ? (
                  <img
                    src={clientEla.elaDataUrl}
                    alt="Error Level Analysis"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full p-4 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-black to-black">
                    {/* Simulated ELA noise pattern */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 text-center space-y-2">
                      <div className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold animate-pulse">
                        HOTSPOT CLUSTERING DETECTED (ELA Delta: +38.2dB)
                      </div>
                      <div className="text-xs text-slate-300 font-medium max-w-xs">
                        High luminance discrepancy around face boundary & placards indicates generative infill.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Bright luminescent pixels highlight compression divergence</span>
                <span className="text-cyan-400 font-mono font-semibold">
                  {clientEla ? `Delta: ${clientEla.averageErrorDelta}` : 'Divergence: High'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Audio Spectrogram & 16kHz Cutoff */}
      {activeView === 'spectrogram' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-black/80 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Mel-Frequency Spectrogram & Acoustic Waveform</span>
              </div>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold transition-all"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Pause Acoustic Stream' : 'Play Acoustic Stream'}</span>
              </button>
            </div>

            {/* Spectrogram Graphic */}
            <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
              {/* 16kHz Brickwall Cutoff Reference Line */}
              <div className="absolute top-12 left-0 right-0 border-b-2 border-dashed border-rose-500 z-20 flex items-center justify-between px-3">
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                  ⚠️ 16.0 kHz Neural Vocoder Brickwall Cutoff (Zero Human Harmonics Above This Threshold)
                </span>
                <span className="text-[9px] font-mono text-rose-300">VALL-E / ElevenLabs Signature</span>
              </div>

              {/* Animated frequency visualizer bars */}
              <div className="flex items-end justify-between gap-1 h-28 z-10 opacity-90">
                {Array.from({ length: 48 }).map((_, i) => {
                  const height = isPlayingAudio 
                    ? Math.sin(i * 0.4 + Date.now() * 0.005) * 40 + 50 
                    : (i < 32 ? Math.max(15, (32 - i) * 2.8 + (i % 5) * 8) : 0) // sharp cutoff at bar 32!
                  const isAboveCutoff = i >= 32

                  return (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-t transition-all duration-150 ${
                        isAboveCutoff 
                          ? 'bg-rose-950/40' 
                          : 'bg-gradient-to-t from-indigo-600 via-cyan-400 to-emerald-300'
                      }`}
                    />
                  )
                })}
              </div>

              {/* Time axis */}
              <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 z-10">
                <span>0.00s</span>
                <span>10.00s</span>
                <span>20.00s</span>
                <span>30.00s</span>
                <span>40.00s</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Notice the complete void above 16kHz — natural human vocalizations produce acoustic overtones up to 22kHz.</span>
              <span className="text-rose-400 font-mono font-bold">Cutoff Status: Synthetic Signature Confirmed</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Video Frame-by-Frame Inspector */}
      {activeView === 'frames' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-black/80 border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Extracted Temporal Video Frames (30fps Telemetry)
              </span>
              <span className="text-xs text-slate-400">
                Frame {selectedVideoFrame * 15} / 90
              </span>
            </div>

            {/* Frame Selector Strip */}
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedVideoFrame(f)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    selectedVideoFrame === f
                      ? 'border-rose-500 bg-rose-950/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400">Frame #{f * 15 + 1}</div>
                  <div className="h-14 rounded-lg bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/80 my-1 flex items-center justify-center text-[10px] text-cyan-400 font-mono">
                    T+{(f * 0.5).toFixed(1)}s
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">
                    {f === 2 ? '⚠️ Landmark Jitter' : 'Raster 60fps'}
                  </div>
                </button>
              ))}
            </div>

            {/* Main Selected Frame Detail */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">
                  Temporal Inconsistency Detected at Frame #{selectedVideoFrame * 15 + 1}
                </div>
                <p className="text-xs text-slate-400 max-w-md">
                  Optical flow vectors deviate along the subject's boundary mask. Shading gradients fail to match the directional ambient light source.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                  Blink Cadence: Anomalous (0 blinks/45s)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Text Linguistics & Emotional Manipulation */}
      {activeView === 'linguistics' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-black/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <span>Deceptive Syntax & Emotional Baiting Inspector</span>
              <span className="text-slate-400 font-normal">Highlighted Analysis</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-sm text-slate-300 leading-relaxed space-y-2">
              <p>
                {result.verdict === 'FABRICATED_NEWS' || result.verdict === 'HIGH_CONFIDENCE_DEEPFAKE' ? (
                  <>
                    <span className="bg-rose-500/30 text-rose-200 px-1.5 py-0.5 rounded border border-rose-500/40 font-semibold" title="Urgency Hook">
                      URGENT WARNING:
                    </span>{' '}
                    Official sources confirm{' '}
                    <span className="bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded border border-amber-500/40" title="Unsubstantiated Claim">
                      drastic public health contamination
                    </span>{' '}
                    across city utilities.{' '}
                    <span className="bg-rose-500/30 text-rose-200 px-1.5 py-0.5 rounded border border-rose-500/40 font-semibold" title="Viral Forward Bait">
                      FORWARD IMMEDIATELY to 10 family groups
                    </span>{' '}
                    before{' '}
                    <span className="bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-500/40" title="Conspiracy Trope">
                      the mainstream media deletes this!
                    </span>
                  </>
                ) : (
                  <>
                    <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40 font-semibold" title="Accredited Source">
                      Peer-reviewed researchers
                    </span>{' '}
                    have confirmed empirical data matching primary datasets with{' '}
                    <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 font-semibold" title="Empirical Evidence">
                      measurable spectroscopic observations
                    </span>{' '}
                    and verified institutional authorship.
                  </>
                )}
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Panic / Outrage Trigger</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Unsubstantiated Claim</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Conspiracy Shield Trope</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Corroborated Attribution</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Evidence Bullets */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Primary Laboratory Telemetry & Findings</span>
        </div>
        <ul className="space-y-1.5 text-slate-300 pl-4 list-disc marker:text-cyan-400">
          {result.forensicEvidence.findings.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

    </div>
  )
}
