'use client'

import React from 'react'
import {
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  GraduationCap
} from 'lucide-react'

export function FounderzFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070b14]/95 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Callout Box: Founderz AI Business School */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-[#070b14] border-2 border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_15px_40px_-10px_rgba(99,102,241,0.15)]">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Founderz AI Business School</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Master Practical AI, Deepfake Forensics & Machine Learning
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Join thousands of professionals mastering generative AI, prompt engineering, and machine learning pipelines with our recognized micro-degrees and executive programs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://founderz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm text-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:brightness-110 transition-all text-center shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
            >
              <span>Explore Founderz Programs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
          <div className="space-y-3">
            <div className="text-sm font-black text-white font-sans">
              founderz<span className="text-amber-500">.</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Global online AI business school co-founded by Pau Garcia-Milà and Anna Cejudo. Recognized by MIT & FPdGI.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Educational Docz
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="hover:text-amber-400 cursor-pointer">Detecting Fake News with AI</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Machine Learning Python Projects</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Error Level Analysis (ELA) Basics</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Acoustic Speech & Voice Clones</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Core Capabilities
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="hover:text-amber-400 cursor-pointer">TF-IDF & Passive-Aggressive Classifier</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">Interactive Client-Side Canvas ELA</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">16.0 kHz Neural Vocoder Cutoff Filter</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer">IFCN Fact-Checking Registry</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Accreditations
            </div>
            <div className="space-y-1 text-[11px] text-slate-500">
              <p>• Official Microsoft AI Partner</p>
              <p>• OpenAI Education Ecosystem</p>
              <p>• C2PA Provenance Standards</p>
              <p>• IFCN Signatory Protocols</p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Founderz AI, S.L. & TruthLens AI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Settings</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
