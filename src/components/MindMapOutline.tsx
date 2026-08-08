"use client";

import React, { useState } from "react";
import { GitFork, Sparkles, Copy, Check } from "lucide-react";

interface MindMapProps {
  initialTopic?: string;
}

export function MindMapOutline({ initialTopic = "" }: MindMapProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateMindMap = async () => {
    if (!topic.trim()) {
      setError("Please specify a topic for the mind map.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "mindmap",
          topic: topic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate mind map");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Error generating mind map.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Visual Mind Map & Concept Tree</h2>
            <p className="text-xs text-slate-400">Generate structured hierarchical outlines to organize complex learning concepts.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Distributed Systems Architecture, Cellular Respiration, World War II Causes..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          <button
            onClick={handleGenerateMindMap}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 shrink-0 !bg-gradient-to-r !from-cyan-600 !to-blue-600 shadow-cyan-500/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Mapping...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Build Mind Map</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Mind Map Result */}
      {result && (
        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <GitFork className="w-5 h-5 text-cyan-400" />
              <h3 className="text-md font-bold text-slate-100">Mind Map Hierarchy for "{topic}"</h3>
            </div>

            <button
              onClick={copyToClipboard}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Outline"}</span>
            </button>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 font-mono text-xs text-cyan-200 leading-relaxed overflow-x-auto whitespace-pre">
            {result}
          </div>
        </div>
      )}

    </div>
  );
}
