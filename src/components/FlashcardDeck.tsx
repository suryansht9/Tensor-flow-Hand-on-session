"use client";

import React, { useState } from "react";
import { Layers, Sparkles, RotateCw, CheckCircle2, ChevronLeft, ChevronRight, BookmarkCheck } from "lucide-react";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardDeckProps {
  initialTopic?: string;
}

export function FlashcardDeck({ initialTopic = "" }: FlashcardDeckProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCards = async () => {
    if (!topic.trim()) {
      setError("Please specify a topic to generate flashcards.");
      return;
    }

    setLoading(true);
    setError(null);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMastered({});

    try {
      const response = await fetch("/api/gemma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "flashcard",
          topic: topic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate flashcards");
      }

      if (Array.isArray(data.result)) {
        setCards(data.result);
      } else {
        throw new Error("Invalid flashcard format received.");
      }
    } catch (err: any) {
      setError(err.message || "Error generating flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMastered = (cardId: number) => {
    setMastered((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const currentCard = cards[currentIndex];
  const masteredCount = Object.values(mastered).filter(Boolean).length;

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">3D Interactive Flashcards Deck</h2>
            <p className="text-xs text-slate-400">Master key terms & definitions with smooth flippable memory cards.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Organic Chemistry Reactions, Data Structures, European History..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />

          <button
            onClick={handleGenerateCards}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 shrink-0 !bg-gradient-to-r !from-emerald-600 !to-teal-600 shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Building Deck...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Deck</span>
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

      {/* Deck Display */}
      {cards.length > 0 && currentCard && (
        <div className="space-y-6">
          
          {/* Deck Counter Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">{masteredCount} Mastered</span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(masteredCount / cards.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div className="perspective-1000 w-full min-h-[280px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full min-h-[280px] transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front of Card */}
              <div className="absolute inset-0 glass-panel rounded-2xl p-8 border border-slate-700/80 flex flex-col justify-between backface-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                  <span>Question / Concept</span>
                  <RotateCw className="w-4 h-4 text-slate-500" />
                </div>

                <div className="text-center my-6">
                  <h3 className="text-xl font-bold text-slate-100 leading-snug">{currentCard.question}</h3>
                </div>

                <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                  <span>Click card to flip answer</span>
                </div>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 glass-panel rounded-2xl p-8 border border-emerald-500/40 flex flex-col justify-between backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-950/40 via-slate-900/95 to-slate-950">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <span>Answer / Explanation</span>
                  <RotateCw className="w-4 h-4 text-slate-500" />
                </div>

                <div className="text-center my-6">
                  <p className="text-base text-emerald-100 leading-relaxed">{currentCard.answer}</p>
                </div>

                <div className="text-center text-xs text-slate-500">
                  <span>Click to flip back</span>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => toggleMastered(currentCard.id || currentIndex)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                mastered[currentCard.id || currentIndex]
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{mastered[currentCard.id || currentIndex] ? "Mastered ✓" : "Mark as Mastered"}</span>
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
