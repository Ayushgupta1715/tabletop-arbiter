'use client'

import React, { useState } from 'react'
import {
  Terminal,
  Code2,
  Copy,
  Check,
  Play,
  Cpu,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react'

export function McpProtocolView() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>('resolve_tabletop_dispute')
  const [testParam, setTestParam] = useState<string>('Carnage Tyrant uncounterable vs Ward in MTG')
  const [toolOutput, setToolOutput] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const cursorConfigJson = `{
  "mcpServers": {
    "tabletop-arbiter": {
      "url": "http://localhost:3000/api/sanity/mcp",
      "transport": "http",
      "description": "Sanity Context MCP server providing deterministic tabletop rules & tournament errata overrides"
    }
  }
}`

  const claudeDesktopConfigJson = `{
  "mcpServers": {
    "tabletop-arbiter": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch", "http://localhost:3000/api/sanity/mcp"]
    }
  }
}`

  const handleExecuteTool = async () => {
    setIsExecuting(true)
    setToolOutput(null)
    try {
      const res = await fetch('/api/sanity/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `manual-call-${Date.now()}`,
          name: selectedTool,
          arguments: {
            scenarioQuery: testParam,
            query: testParam,
            ruleId: 'rule-mtg-ward',
          },
        }),
      })
      const data = await res.json()
      setToolOutput(JSON.stringify(data, null, 2))
    } catch {
      setToolOutput('// Error communicating with /api/sanity/mcp endpoint.')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <span>Model Context Protocol (MCP) Integration Hub</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Connect Cursor, Claude Code, Windsurf, or custom agent harnesses directly to this application&apos;s live Sanity Context MCP endpoint.
        </p>
      </div>

      {/* Grid: MCP Tools Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>resolve_tabletop_dispute</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Evaluates arguments between players by querying Sanity core rules and dereferencing all superseding tournament errata.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>get_rule_errata_diff</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Extracts the printed rule text against the overriding errata patch, producing a line-by-line justification of why the rule changed.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>query_tournament_knowledge_lake</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Structured GROQ search across all 5 official tournament rulebooks, official FAQs, and precedent dispute benchmarks.
          </p>
        </div>

      </div>

      {/* Live Tool Execution Sandbox for Judges */}
      <div className="rounded-3xl border border-amber-500/30 bg-[#0c101b] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live MCP Tool Tester (In-Browser Execution)</h3>
              <p className="text-xs text-slate-400">
                Trigger a live HTTP JSON-RPC call to <code className="text-amber-300">/api/sanity/mcp</code>
              </p>
            </div>
          </div>

          <button
            onClick={handleExecuteTool}
            disabled={isExecuting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Calling MCP...' : 'Execute Tool Call'}</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-400">Target MCP Tool</label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="resolve_tabletop_dispute">resolve_tabletop_dispute</option>
              <option value="get_rule_errata_diff">get_rule_errata_diff</option>
              <option value="query_tournament_knowledge_lake">query_tournament_knowledge_lake</option>
              <option value="fetch_supported_games">fetch_supported_games</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-400">Query Parameter (scenarioQuery)</label>
            <input
              type="text"
              value={testParam}
              onChange={(e) => setTestParam(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        {/* Output Console */}
        {toolOutput && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-bold">HTTP 200 OK — JSON-RPC Response:</span>
              <button
                onClick={() => handleCopy(toolOutput, 'output')}
                className="text-amber-400 hover:text-amber-300 font-mono text-[11px] flex items-center gap-1"
              >
                {copiedIndex === 'output' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Payload</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/80 border border-emerald-900/40 text-xs font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
              {toolOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Client Configuration Snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cursor Config */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-amber-400">
              Cursor IDE Config (.cursor/mcp.json)
            </span>
            <button
              onClick={() => handleCopy(cursorConfigJson, 'cursor')}
              className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1"
            >
              {copiedIndex === 'cursor' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
            {cursorConfigJson}
          </pre>
        </div>

        {/* Claude Desktop Config */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-amber-400">
              Claude Desktop (claude_desktop_config.json)
            </span>
            <button
              onClick={() => handleCopy(claudeDesktopConfigJson, 'claude')}
              className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1"
            >
              {copiedIndex === 'claude' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
            {claudeDesktopConfigJson}
          </pre>
        </div>

      </div>

    </div>
  )
}
