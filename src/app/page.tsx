"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { FeynmanExplainer } from "@/components/FeynmanExplainer";
import { QuizGenerator } from "@/components/QuizGenerator";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { MindMapOutline } from "@/components/MindMapOutline";
import { BookOpen, HelpCircle, Layers, GitFork, Sparkles, ExternalLink, ShieldAlert, Award } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"feynman" | "quiz" | "flashcard" | "mindmap">("feynman");
  const [currentTopic, setCurrentTopic] = useState("");

  const handleTopicSelected = (topic: string) => {
    setCurrentTopic(topic);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner */}
        <section className="glass-panel rounded-3xl p-6 lg:p-10 border border-slate-800/80 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900/90">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Built for TFUG Prayagraj - Build with Gemma Event</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 leading-tight tracking-tight">
              Master Any Subject with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Gemma AI</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Turn dense study notes into interactive multiple-choice quizzes, 3D flip flashcards, Feynman analogies, and visual concept maps in seconds.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Strictly Gemma Model (`gemma-4-26b-a4b-it`)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span>Server-Side Secure API Route</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center justify-start sm:justify-center border-b border-slate-800 pb-1 overflow-x-auto gap-2">
          {[
            { id: "feynman", label: "Feynman Simplifier", icon: BookOpen },
            { id: "quiz", label: "Interactive Quiz Engine", icon: HelpCircle },
            { id: "flashcard", label: "3D Flashcard Deck", icon: Layers },
            { id: "mindmap", label: "Mind Map Hierarchy", icon: GitFork },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Active Tab View */}
        <section className="min-h-[400px]">
          {activeTab === "feynman" && <FeynmanExplainer onSelectTopic={handleTopicSelected} />}
          {activeTab === "quiz" && <QuizGenerator initialTopic={currentTopic} />}
          {activeTab === "flashcard" && <FlashcardDeck initialTopic={currentTopic} />}
          {activeTab === "mindmap" && <MindMapOutline initialTopic={currentTopic} />}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-12 py-6 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>LearnCraft Gemma • Built for Google AI Studio Hackathon</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.kaggle.com/competitions/build-with-gemma-tfug-prayagraj-ai-prayagraj-in-person"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              Kaggle Event <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://forms.gle/xz9Zu7VWn8aEvM6k8"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              Google Form Submission <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
