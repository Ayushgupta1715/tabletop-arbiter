'use client'

import React, { useState } from 'react'
import {
  ShieldAlert,
  Search,
  Sparkles,
  Key,
  Radar,
  MessageSquareCode,
  Layers,
  FileCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'

interface HeaderProps {
  activeTab: 'studio' | 'radar' | 'copilot'
  setActiveTab: (tab: 'studio' | 'radar' | 'copilot') => void
  hasApiKey: boolean
  onOpenApiKeyModal: () => void
  onOpenCertificateModal?: () => void
  canExportCertificate?: boolean
}

export function Header({
  activeTab,
  setActiveTab,
  hasApiKey,
  onOpenApiKeyModal,
  onOpenCertificateModal,
  canExportCertificate
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-rose-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#070b14]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Truth<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Lens</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AI Sentinel
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Multimodal Deepfake & Fake News Forensic Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Forensic Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'radar'
                  ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Global Threat Radar</span>
              <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 text-[10px] rounded-full border border-rose-500/30">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'copilot'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquareCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Forensic Copilot</span>
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {canExportCertificate && onOpenCertificateModal && (
              <button
                onClick={onOpenCertificateModal}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Audit Certificate</span>
              </button>
            )}

            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                hasApiKey
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {hasApiKey ? 'Gemini 2.0 Flash' : 'AI Engine'}
              </span>
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800/60 text-xs">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-bold ${
              activeTab === 'studio' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-bold ${
              activeTab === 'radar' ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400'
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>Threat Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-bold ${
              activeTab === 'copilot' ? 'text-indigo-400 bg-indigo-950/40' : 'text-slate-400'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>Copilot</span>
          </button>
        </div>

      </div>
    </header>
  )
}
