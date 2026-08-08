import React from "react";
import { Sparkles, ShieldCheck, ExternalLink, GraduationCap, Github } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                LearnCraft <span className="text-indigo-400">Gemma</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                TFUG Hackathon
              </span>
            </div>
            <p className="text-xs text-slate-400">Adaptive AI Study Companion & Quiz Engine</p>
          </div>
        </div>

        {/* Model Badge & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs text-emerald-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Gemma (`gemma-4-26b-a4b-it`) Verified</span>
          </div>

          <a 
            href="https://aistudio.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors px-2 py-1"
          >
            Google AI Studio
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </header>
  );
}
