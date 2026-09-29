'use client'

import React, { useState, useEffect } from 'react'
import { Key, X, Check, Sparkles } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="plaque-3d-active relative w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl text-[var(--parchment)] space-y-5">
        
        {/* Authentic 3D Brass Corner Brackets */}
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-tr" />
        <div className="corner-bracket-bl" />
        <div className="corner-bracket-br" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-3d-surface absolute top-4 right-4 p-1.5 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5 text-[var(--brass-light)]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#e5ba55] to-[#8a6f34] p-[1px] shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <div className="w-full h-full rounded-[11px] bg-[var(--felt-1)] flex items-center justify-center text-[var(--brass-light)] shadow-inner">
              <Key className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-serif text-[var(--parchment-bright)] font-bold">
              Gemini AI Key Configuration
            </h3>
            <p className="eyebrow-label text-[var(--brass-light)] mt-0.5 font-bold">
              Google Gemini 2.0 Flash Copilot
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3.5 rounded-lg bg-[var(--felt-0)] border border-[var(--border)] space-y-1.5 text-xs">
          <span className="eyebrow-label text-[var(--brass)]">Dual-Engine Mode</span>
          <p className="text-[var(--parchment)] leading-relaxed">
            TableTop Arbiter functions <strong>100% out-of-the-box</strong> using our built-in deterministic Sanity Knowledge Lake engine.
            Adding your own Gemini API key enables live natural language reasoning grounded directly by Sanity’s Context MCP tools.
          </p>
          <p className="text-[11px] font-mono text-[var(--muted)]">
            Saved exclusively in browser local storage.
          </p>
        </div>

        {/* Key Input Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="eyebrow-label">Gemini API Key</label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brass)] hover:underline font-mono text-[11px]"
            >
              Get free Gemini Key →
            </a>
          </div>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-[var(--felt-0)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--parchment)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--brass)] transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          {keyInput ? (
            <button
              onClick={handleClear}
              className="text-xs font-mono text-[var(--superseded)] hover:underline cursor-pointer"
            >
              Clear Key
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-3d-surface px-3.5 py-2 rounded-lg text-xs font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-3d-brass flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Key</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
