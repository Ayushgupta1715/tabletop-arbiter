'use client'

import React from 'react'
import {
  ShieldAlert,
  Sparkles,
  Key,
  Radar,
  MessageSquareCode,
  Layers,
  FileCheck,
  ChevronDown,
  Globe2,
  ExternalLink,
  BookOpen
} from 'lucide-react'

interface FounderzHeaderProps {
  activeTab: 'studio' | 'ml-architecture' | 'radar' | 'copilot'
  setActiveTab: (tab: 'studio' | 'ml-architecture' | 'radar' | 'copilot') => void
  hasApiKey: boolean
  onOpenApiKeyModal: () => void
  onOpenCertificateModal?: () => void
  canExportCertificate?: boolean
}

export function FounderzHeader({
  activeTab,
  setActiveTab,
  hasApiKey,
  onOpenApiKeyModal,
  onOpenCertificateModal,
  canExportCertificate
}: FounderzHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Founderz Logo & Blog Badge */}
          <div className="flex items-center gap-3.5">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                founderz<span className="text-amber-500">.</span>
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                AI Lab & Blog
              </span>
            </a>
          </div>

          {/* Navigation Links (Founderz Style) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-inner text-xs font-semibold">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('ml-architecture')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'ml-architecture'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ML Architecture & Python</span>
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'radar'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-600 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-rose-400" />
              <span>Live Threat Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'copilot'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>AI Copilot</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-white">EN</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-500 hover:text-slate-300 cursor-pointer">ES</span>
            </div>

            {canExportCertificate && onOpenCertificateModal && (
              <button
                onClick={onOpenCertificateModal}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Certificate</span>
              </button>
            )}

            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                hasApiKey
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {hasApiKey ? 'Gemini 2.0' : 'AI Engine'}
              </span>
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
            </button>

            {/* Direct CTA */}
            <button
              onClick={() => setActiveTab('studio')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all"
            >
              <span>Try Live Sandbox</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-around py-2.5 border-t border-slate-800/60 text-xs">
          <button
            onClick={() => setActiveTab('studio')}
            className={`py-1 px-2 rounded-lg font-bold ${
              activeTab === 'studio' ? 'text-amber-400 bg-amber-950/40' : 'text-slate-400'
            }`}
          >
            Sandbox
          </button>
          <button
            onClick={() => setActiveTab('ml-architecture')}
            className={`py-1 px-2 rounded-lg font-bold ${
              activeTab === 'ml-architecture' ? 'text-indigo-400 bg-indigo-950/40' : 'text-slate-400'
            }`}
          >
            ML Code
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`py-1 px-2 rounded-lg font-bold ${
              activeTab === 'radar' ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400'
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-1 px-2 rounded-lg font-bold ${
              activeTab === 'copilot' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400'
            }`}
          >
            Copilot
          </button>
        </div>

      </div>
    </header>
  )
}
