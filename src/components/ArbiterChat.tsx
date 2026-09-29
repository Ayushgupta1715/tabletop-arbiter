'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Scale,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { SEED_GAMES } from '@/sanity/lib/seedData'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  groundedSources?: Array<{
    title: string
    version: string
    authority: string
    ruling: string
    source: string
  }>
  timestamp: string
}

interface ArbiterChatProps {
  apiKey: string
  onOpenApiKeyModal: () => void
}

const PRESET_QUERIES = [
  'Can an uncounterable spell like Carnage Tyrant be countered by Ward in Magic?',
  'Does an Infiltrator Omni-scrambler stop 9" Deep Strike arrivals in Warhammer 10th Ed?',
  'If someone builds a settlement on my road in Catan, do I lose Longest Road immediately?',
  'Can a ranged attack line of sight touch a vertex shared by two wall hexes in Gloomhaven?',
  'Can I cast Misty Step as a bonus action and then Fireball using Action Surge in D&D 2024?',
]

export function ArbiterChat({ apiKey, onOpenApiKeyModal }: ArbiterChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Greetings, Tabletop Player!** I am **TableTop Arbiter**, your AI Head Tournament Judge powered by **Sanity's Structured Content Lake** and **Model Context Protocol (MCP)**.
      
Ask me any rulebook ambiguity, card interaction, or tournament table dispute. I evaluate official printed base rules against active tournament errata overrides to provide **authoritative, hallucination-free rulings**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const [input, setInput] = useState('')
  const [selectedGame, setSelectedGame] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          apiKey,
          gameFilter: selectedGame === 'all' ? undefined : selectedGame,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          groundedSources: data.groundedSources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error('Arbiter endpoint failed')
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Tournament Ruling Failed to Process**: Please check your network or verify your question context. The Arbiter local grounding engine remains active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetChat = () => {
    setMessages([messages[0]])
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0c101b] p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col h-[750px]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>TableTop Arbiter AI Copilot</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                MCP GROUNDED
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {apiKey
                ? '🟢 Live Gemini 2.0 Flash + Sanity Context Lake'
                : '🟡 Local Heuristic Arbiter + Sanity Knowledge Lake (Add API key for live Gemini)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Game filter */}
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Games</option>
            {SEED_GAMES.map((g) => (
              <option key={g.id} value={g.title}>
                {g.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Scenarios:</span>
        </span>
        {PRESET_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500 hover:text-white transition-colors truncate max-w-[260px] sm:max-w-none"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message History Viewport */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4 text-slate-950" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-slate-950 font-medium'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {/* Grounded Errata Sources Badge */}
              {msg.groundedSources && msg.groundedSources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Grounded in Sanity Structured Errata Lake:</span>
                  </div>
                  {msg.groundedSources.map((src, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-black/40 border border-emerald-900/30 text-[11px] text-slate-300 font-mono"
                    >
                      <div className="text-amber-400 font-semibold">{src.title}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">
                        Authority: {src.authority} | Patch: {src.version}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`text-[10px] font-mono mt-1 ${
                  msg.role === 'user' ? 'text-amber-950' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                <User className="w-4 h-4 text-amber-400" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-amber-400 animate-spin" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-amber-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Querying Sanity Context MCP & Evaluating Errata Hierarchy...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        className="relative shrink-0 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe any tabletop dispute or card interaction (e.g. Catan robber trade, MTG stack priority)..."
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>Rule On It</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  )
}
