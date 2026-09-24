'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
  Terminal,
  Loader2
} from 'lucide-react'
import { ForensicResult } from '@/types/forensics'

interface TruthCopilotProps {
  currentResult?: ForensicResult | null
  apiKey: string
}

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

export function TruthCopilot({ currentResult, apiKey }: TruthCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `👋 Hello! I am the **TruthLens AI Forensic Copilot**. I specialize in detecting synthetic media, neural voice clones, video deepfakes, and viral disinformation campaigns.

You can ask me to explain forensic telemetry, interpret Error Level Analysis (ELA) maps, walk through the 16.0 kHz acoustic cutoff, or advise on cross-verifying breaking claims.`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input
    if (!textToSend.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend.trim()
    }

    setMessages((prev) => [...prev, userMsg])
    if (!customText) setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          apiKey,
          forensicContext: currentResult
            ? {
                title: currentResult.title,
                verdict: currentResult.verdict,
                authenticityScore: currentResult.authenticityScore,
                modality: currentResult.modality,
                findings: currentResult.forensicEvidence.findings
              }
            : null
        })
      })

      const data = await res.json()
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: data.reply
          }
        ])
      } else {
        throw new Error(data.error || 'Failed to fetch response')
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error during forensic query: ${err.message}. Please try again.`
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const QUICK_PROMPTS = [
    'How do I spot an AI voice clone?',
    'Explain Error Level Analysis (ELA)',
    'Why is the ARMA 3 video flagged as a deepfake?',
    'What are the key signs of synthetic Midjourney photos?'
  ]

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col h-[700px] overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#070b14]/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Bot className="w-5 h-5 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>TruthLens Forensic Copilot</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {apiKey ? 'Gemini 2.0 AI' : 'Forensic Heuristic AI'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive Deepfake & Misinformation Investigator
            </p>
          </div>
        </div>

        {currentResult && (
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Current Subject</span>
            <span className="text-xs font-bold text-cyan-400 truncate max-w-[200px] block">
              {currentResult.title}
            </span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              m.role === 'user'
                ? 'bg-cyan-500 text-black font-black text-xs'
                : 'bg-indigo-600 text-white'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-medium shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-black/70 border border-slate-800 text-slate-200 shadow-md'
            }`}>
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span className="font-mono animate-pulse">
              TruthLens Forensic Copilot is cross-checking forensic evidence...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-2 bg-black/40 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">
          Forensic FAQs:
        </span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-[11px] whitespace-nowrap transition-all font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-[#070b14]/90 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a forensic question or paste a claim to dissect..."
          className="flex-1 px-4 py-3 bg-black/60 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="p-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-bold disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  )
}
