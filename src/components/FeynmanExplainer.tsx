"use client";

import React, { useState } from "react";
import { Sparkles, BookOpen, Lightbulb, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";

interface FeynmanExplainerProps {
  onSelectTopic: (topic: string) => void;
}

export function FeynmanExplainer({ onSelectTopic }: FeynmanExplainerProps) {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("High School");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleTopics = [
    "Quantum Entanglement & Superposition",
    "Transformer Architecture in Machine Learning",
    "Photosynthesis & Light-Dependent Reactions",
    "Inflation & Monetary Policy in Economics"
  ];

  const handleSimplify = async (overrideTopic?: string) => {
    const activeTopic = overrideTopic || topic;
    if (!activeTopic.trim() && !content.trim()) {
      setError("Please enter a study topic or paste text notes.");
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
          task: "simplify",
          topic: activeTopic,
          content: content,
          level: level
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate explanation");
      }

      setResult(data.result);
      if (activeTopic) onSelectTopic(activeTopic);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
      
      {/* Input Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Feynman Concept Simplifier</h2>
            <p className="text-xs text-slate-400">Break down any complex subject into intuitive analogies & clear takeaways.</p>
          </div>
        </div>

        {/* Level Select */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-300 mb-2">Comprehension Level</label>
          <div className="flex flex-wrap gap-2">
            {["ELI5 (5-Year-Old)", "High School", "College / Technical"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  level === lvl
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Study Topic or Question</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quantum Computing, Neural Networks, Supply and Demand..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Or Paste Text Notes / Textbook Passage (Optional)</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw notes, article snippets, or textbook paragraphs here..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Sample Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400">Try sample:</span>
          {sampleTopics.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setTopic(sample);
                handleSimplify(sample);
              }}
              className="text-[11px] bg-slate-800/60 hover:bg-indigo-950/60 hover:text-indigo-300 border border-slate-700/50 rounded-full px-2.5 py-1 text-slate-300 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => handleSimplify()}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gemma is thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simplify Concept with Gemma</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Output Display */}
      {result && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-md font-bold text-slate-100">Feynman Explanation ({level})</h3>
            </div>

            <button
              onClick={copyToClipboard}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Markdown"}</span>
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-3">
            {result}
          </div>
        </div>
      )}

    </div>
  );
}
