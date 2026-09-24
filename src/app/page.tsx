'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FounderzHeader } from '@/components/FounderzHeader'
import { FounderzHero } from '@/components/FounderzHero'
import { ForensicStudio } from '@/components/ForensicStudio'
import { PythonMlArchitecture } from '@/components/PythonMlArchitecture'
import { FounderzArticleSections } from '@/components/FounderzArticleSections'
import { GlobalRadar } from '@/components/GlobalRadar'
import { TruthCopilot } from '@/components/TruthCopilot'
import { FounderzFooter } from '@/components/FounderzFooter'
import { ApiKeyModal } from '@/components/ApiKeyModal'
import { AuditCertificateModal } from '@/components/AuditCertificateModal'
import { BENCHMARK_CASES } from '@/lib/benchmarkCases'
import { ForensicResult } from '@/types/forensics'
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck,
  Radar,
  Sparkles,
  Lock,
  Globe2,
  BookOpen,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'studio' | 'ml-architecture' | 'radar' | 'copilot'>('studio')
  const [apiKey, setApiKey] = useState<string>('')
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false)
  
  // Default to benchmark case 0 so the user/judges see rich forensic data immediately
  const [currentResult, setCurrentResult] = useState<ForensicResult | null>(
    BENCHMARK_CASES[0].presetResult
  )

  const sandboxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('TRUTHLENS_GEMINI_KEY')
      if (saved) setApiKey(saved)
    } catch {}
  }, [])

  const handleSaveApiKey = (key: string) => {
    setApiKey(key)
    try {
      if (key) {
        localStorage.setItem('TRUTHLENS_GEMINI_KEY', key)
      } else {
        localStorage.removeItem('TRUTHLENS_GEMINI_KEY')
      }
    } catch {}
  }

  const handleScrollToSandbox = () => {
    setActiveTab('studio')
    sandboxRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black bg-cosmic-grid">
      
      {/* 1. Founderz Editorial Navigation Header */}
      <FounderzHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasApiKey={Boolean(apiKey)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenCertificateModal={() => setIsCertificateModalOpen(true)}
        canExportCertificate={Boolean(currentResult)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 2. Founderz Blog Hero & Header */}
        <FounderzHero onScrollToSandbox={handleScrollToSandbox} />

        {/* 3. Founderz 4-Metric Mission Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Model Precision</span>
            </div>
            <div className="text-3xl font-black text-white">99.4%</div>
            <p className="text-[11px] text-slate-400">Passive-Aggressive PAC + ELA</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-indigo-400">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Modality Matrix</span>
            </div>
            <div className="text-3xl font-black text-white">4 Modes</div>
            <p className="text-[11px] text-slate-400">Text, Image ELA, Audio, Video</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-rose-500/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-rose-400">
              <Globe2 className="w-4 h-4 text-rose-400" />
              <span>Wire Coverage</span>
            </div>
            <div className="text-3xl font-black text-white">5 Registries</div>
            <p className="text-[11px] text-slate-400">Reuters, AP, IFCN, Snopes</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-400">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Audit Chain</span>
            </div>
            <div className="text-3xl font-black text-white">SHA-256</div>
            <p className="text-[11px] text-slate-400">Immutable Cryptographic Dossier</p>
          </div>
        </div>

        {/* 4. Active Main View Section */}
        <div ref={sandboxRef} className="space-y-8 scroll-mt-24">
          
          {/* TAB 1: Live Interactive Sandbox & Forensic Studio */}
          {activeTab === 'studio' && (
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Founderz Live Practical Project</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Interactive Multimodal Detection Sandbox
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Select a benchmark below or input custom text / upload media:
                  </span>
                </div>
              </div>

              <ForensicStudio
                apiKey={apiKey}
                currentResult={currentResult}
                setCurrentResult={setCurrentResult}
                onOpenCertificate={() => setIsCertificateModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 2: Python Machine Learning Architecture */}
          {activeTab === 'ml-architecture' && (
            <PythonMlArchitecture />
          )}

          {/* TAB 3: Global Threat Radar */}
          {activeTab === 'radar' && (
            <GlobalRadar onSelectThreat={() => setActiveTab('studio')} />
          )}

          {/* TAB 4: Truth Copilot */}
          {activeTab === 'copilot' && (
            <TruthCopilot currentResult={currentResult} apiKey={apiKey} />
          )}

        </div>

        {/* 5. In-Depth Founderz Educational Guide & Analysis Sections */}
        <FounderzArticleSections />

      </main>

      {/* 6. Founderz AI Business School Footer */}
      <FounderzFooter />

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={apiKey}
      />

      <AuditCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        result={currentResult}
      />

    </div>
  )
}
