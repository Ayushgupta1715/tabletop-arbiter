'use client'

import React from 'react'
import {
  ChevronRight,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowDown
} from 'lucide-react'

interface FounderzHeroProps {
  onScrollToSandbox: () => void
}

export function FounderzHero({ onScrollToSandbox }: FounderzHeroProps) {
  return (
    <div className="space-y-6 pt-2 pb-6 border-b border-slate-800/80">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium overflow-x-auto whitespace-nowrap">
        <a href="/" className="hover:text-amber-400 transition-colors">Home</a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <a href="/" className="hover:text-amber-400 transition-colors">Blog</a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-amber-400 font-semibold">Artificial Intelligence</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-slate-300 truncate">Detecting Fake News with AI</span>
      </nav>

      {/* 2. Category & Tag Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30">
          Artificial Intelligence
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Machine Learning & NLP
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          Multimodal Forensics
        </span>
      </div>

      {/* 3. Main Title (H1) & Subtitle */}
      <div className="space-y-3 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          AI Fake News Detection: Build a Machine Learning Platform
        </h1>
        <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
          Explore how modern artificial intelligence combines natural language processing, Error Level Analysis (ELA), acoustic voice clone detection, and IFCN registry verification to catch deepfakes before they go viral.
        </p>
      </div>

      {/* 4. Author & Meta Information Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-800/80 text-xs text-slate-400">
        
        {/* Author Avatar & Bio */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-indigo-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                PG
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#070b14]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Pau Garcia-Milà</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                Founderz Co-founder & MIT Innovator
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Founderz AI Business School · In collaboration with Founderz AI Lab
            </p>
          </div>
        </div>

        {/* Reading Time & Date */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>14 min read</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Updated Sept 2026</span>
          </span>
          <button
            onClick={onScrollToSandbox}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-bold"
          >
            <span>Live Sandbox</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 5. Founderz Signature Key Takeaway Callout Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0e1428] to-[#120f26] border-2 border-amber-500/30 shadow-[0_15px_40px_-10px_rgba(245,158,11,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Key Takeaway from Founderz AI Research:</span>
          </div>

          <blockquote className="text-base sm:text-lg font-bold text-white leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
            “AI algorithms do not replace human discernment—they act as an ultra-fast triage layer that flags syntactic sensationalism, anomalous compression artifacts, and acoustic frequency voids before fake news spreads to millions.”
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Wording & Syntax:</strong> Passive-Aggressive TF-IDF</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span><strong>Visual Forensics:</strong> Canvas Error Level Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Acoustic Clones:</strong> 16kHz Cutoff Detection</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
