'use client'

import React, { useState, useEffect } from 'react'
import { Key, Sparkles, X, Check, ShieldCheck, AlertCircle } from 'lucide-react'

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveKey: (key: string) => void
  currentKey: string
}

export function ApiKeyModal({ isOpen, onClose, onSaveKey, currentKey }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(currentKey)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    setKeyInput(currentKey)
  }, [currentKey])

  if (!isOpen) return null

  const handleSave = () => {
    onSaveKey(keyInput.trim())
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      onClose()
    }, 800)
  }

  const handleClear = () => {
    setKeyInput('')
    onSaveKey('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-[#0a1224] to-[#050b18] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Key className="w-6 h-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              AI Engine Configuration
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Google Gemini 2.0 Flash Multimodal Sentinel
            </p>
          </div>
        </div>

        {/* Informative Alert */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Dual-Engine Architecture:</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            TruthLens works in <strong>two autonomous modes</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li>
              <strong className="text-white">Local Forensic Engine:</strong> Deterministic ELA canvas, acoustic spectrogram Fourier transform, and lexical disinformation heuristics (Works 100% offline & out-of-the-box).
            </li>
            <li>
              <strong className="text-cyan-300">Live Gemini Multimodal AI:</strong> Deep semantic reasoning, claim extraction, and cross-verification using your Google Gemini API Key.
            </li>
          </ul>
        </div>

        {/* Input Field */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Get Free Key <Sparkles className="w-3 h-3" />
            </a>
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-3 bg-black/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3">
          {keyInput && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/30 transition-all"
            >
              Clear Key
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all font-sans"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 font-black" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-cyan-950 font-black" />
                  <span>Activate Engine</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
