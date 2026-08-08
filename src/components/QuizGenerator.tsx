"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle, XCircle, RefreshCw, Sparkles, HelpCircle as HintIcon, Award, ChevronRight } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
  explanation?: string;
}

interface QuizGeneratorProps {
  initialTopic?: string;
}

export function QuizGenerator({ initialTopic = "" }: QuizGeneratorProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [rawFallback, setRawFallback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please specify a topic to generate a quiz.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);
    setUserAnswers({});
    setRawFallback(null);

    try {
      const response = await fetch("/api/gemma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "quiz",
          topic: topic
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      if (data.isRawFallback || typeof data.result === "string") {
        setRawFallback(data.result);
      } else if (Array.isArray(data.result)) {
        setQuestions(data.result);
      } else {
        throw new Error("Unexpected quiz data format received.");
      }
    } catch (err: any) {
      setError(err.message || "Error generating quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (userAnswers[qIndex] !== undefined) return; // Answered already
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const toggleHint = (qIndex: number) => {
    setShowHints((prev) => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };

  // Calculate score
  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* Input Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Interactive Gemma MCQ Engine</h2>
            <p className="text-xs text-slate-400">Generate custom multiple choice quizzes with instant feedback & explanations.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Machine Learning Basics, Cell Biology, Microeconomics..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />

          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 5 MCQs</span>
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

      {/* Score Summary Header */}
      {questions.length > 0 && (
        <div className="glass-panel rounded-xl p-4 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-xs text-slate-400">Quiz Progress</p>
              <p className="text-sm font-bold text-slate-100">
                Score: <span className="text-indigo-400">{correctCount}</span> / {questions.length} ({totalAnswered} Answered)
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateQuiz}
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Quiz</span>
          </button>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = userAnswers[qIndex] !== undefined;
            const selectedIdx = userAnswers[qIndex];

            return (
              <div
                key={q.id || qIndex}
                className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                      Q{qIndex + 1}
                    </span>
                    <h3 className="text-base font-semibold text-slate-100">{q.question}</h3>
                  </div>

                  {q.hint && (
                    <button
                      onClick={() => toggleHint(qIndex)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20"
                    >
                      <HintIcon className="w-3.5 h-3.5" />
                      <span>{showHints[qIndex] ? "Hide Hint" : "Hint"}</span>
                    </button>
                  )}
                </div>

                {/* Hint Box */}
                {showHints[qIndex] && q.hint && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs italic">
                    💡 Hint: {q.hint}
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = "bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-200";

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20";
                      } else if (selectedIdx === optIdx) {
                        btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
                      } else {
                        btnStyle = "bg-slate-900/30 border-slate-800 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(qIndex, optIdx)}
                        disabled={isAnswered}
                        className={`text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && selectedIdx === optIdx && optIdx !== q.correctIndex && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswered && q.explanation && (
                  <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                    <span className="font-bold text-indigo-300">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Raw Fallback Display */}
      {rawFallback && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 whitespace-pre-line text-sm text-slate-300">
          <h3 className="font-bold text-slate-100 mb-2">Quiz Response</h3>
          {rawFallback}
        </div>
      )}

    </div>
  );
}
