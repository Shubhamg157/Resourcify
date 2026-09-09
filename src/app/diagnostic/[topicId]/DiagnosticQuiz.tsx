'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: string;
  conceptId: string;
  conceptName: string;
  subtopicName: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: number;
  questionType: string;
  commonMisconception: string;
}

interface Props {
  topicId: string;
  topicName: string;
  chapterName: string;
  subjectName: string;
  questions: Question[];
}

export function DiagnosticQuiz({ topicId, topicName, chapterName, subjectName, questions }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(12 * 60); // 12 mins

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
      setTotalSeconds((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts 1-4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQuestion && currentQuestion.options[idx]) {
          handleSelect(idx);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;

  const handleSelect = (optionIndex: number) => {
    if (isSubmitting) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/diagnostic/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
            questionId,
            selectedOptionIndex,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit diagnostic');
      }

      const data = await response.json();
      router.push(`/diagnostic/${topicId}/result?sessionId=${data.sessionId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't complete the diagnosis right now. Your answers have been saved. Try again."
      );
      setIsSubmitting(false);
    }
  }, [topicId, answers, router]);

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Quiz Header ─── */}
      <header className="w-full bg-white border-b-[3px] border-brutalBlack sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-schoolYellow border-[2.5px] border-brutalBlack shadow-brutal-sm flex items-center justify-center text-lg transform group-hover:-rotate-6 transition-transform">
                📢
              </div>
              <span className="text-2xl font-black tracking-tight text-brutalBlack ml-0.5">GapZero</span>
            </div>
            <span className="bg-schoolYellow text-brutalBlack font-mono font-bold text-xs sm:text-sm px-2.5 py-0.5 border-[2.5px] border-brutalBlack shadow-brutal-sm uppercase tracking-wider hidden sm:inline-block">
              QUIZ PROBE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-paper-200 px-3 py-1.5 border-[2px] border-brutalBlack font-mono text-xs font-bold uppercase">
            <span className="w-2.5 h-2.5 bg-retroTeal border border-brutalBlack inline-block animate-pulse"></span>
            <span>TESTBED: JEE ADVANCED</span>
            <span className="text-neutral-400">|</span>
            <span className="text-retroTeal-dark">{topicName}</span>
          </div>

          <nav className="flex items-center gap-3 font-bold text-sm">
            <Link href="/topics" className="hidden sm:inline-flex items-center gap-1.5 bg-white text-brutalBlack px-3 py-2 border-[2.5px] border-brutalBlack shadow-brutal-sm btn-brutal hover:bg-paper-200 text-xs font-mono font-bold">
              <span>HUB</span>
            </Link>
            <div className="flex items-center gap-1.5 pl-1">
              <span className="bg-paper-200 text-brutalBlack px-3 py-1.5 border-[2.5px] border-brutalBlack shadow-brutal-sm flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ACTIVE
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="w-full flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {isSubmitting ? (
            <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-8 sm:p-12 text-center animate-fade-in relative overflow-hidden">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 skeleton-box opacity-50 z-0"></div>
              
              <div className="relative z-10 space-y-6 max-w-xl mx-auto">
                <span className="font-mono text-xs font-black uppercase text-retroTeal bg-white px-2 py-0.5 border border-brutalBlack">
                  DIAGNOSTIC ENGINE v4.2
                </span>
                <h2 className="text-3xl font-black text-brutalBlack tracking-tight">
                  Analyzing Your Conceptual Gaps...
                </h2>
                <p className="text-sm font-bold text-neutral-700 leading-relaxed">
                  Evaluating responses against JEE Advanced trap options. Identifying root misconceptions.
                </p>
                <div className="flex justify-center mt-8">
                  <div className="w-16 h-16 border-[4px] border-paper-200 border-t-brutalBlack rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ─── Top Control & Progress Strip ─── */}
              <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-retroTeal text-white text-[11px] font-mono px-2 py-0.5 font-bold uppercase tracking-wider border border-brutalBlack">
                        PROBE 0{currentIndex + 1} / 0{questions.length}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-neutral-600 uppercase tracking-tight truncate max-w-[200px] sm:max-w-none">
                        {currentQuestion.questionType} • {subjectName}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black text-brutalBlack hidden sm:block">
                      {Math.round((currentIndex / questions.length) * 100)}% COMPLETED
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 w-full h-3.5 bg-paper-200 p-0.5 border-[2px] border-brutalBlack">
                    {questions.map((q, i) => (
                      <div
                        key={q.id}
                        className={`h-full border border-brutalBlack transition-all ${
                          i < currentIndex
                            ? 'bg-retroTeal'
                            : i === currentIndex
                            ? 'bg-schoolYellow animate-pulse'
                            : answers[q.id] !== undefined
                            ? 'bg-kraftBrown'
                            : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                  <div className="bg-paper-200 px-3 py-1.5 border-[2px] border-brutalBlack shadow-brutal-sm flex items-center gap-1.5 font-mono text-xs font-black">
                    <span className="text-emerald-700">+4.0</span>
                    <span className="text-neutral-400">/</span>
                    <span className="text-red-700">-1.0</span>
                  </div>
                  <div className="bg-schoolYellow px-3.5 py-1.5 border-[2.5px] border-brutalBlack shadow-brutal-sm flex items-center gap-2">
                    <span className="text-base">⏱</span>
                    <span className="font-mono font-black text-xs sm:text-sm text-brutalBlack tracking-wider">
                      {formatCountdown(totalSeconds)} REMAINING
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── Main Question Workspace ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
                {/* Left Column: Physical Clipboard */}
                <div className="lg:col-span-7 bg-white border-[3px] border-brutalBlack shadow-brutal p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-3.5 bg-paper-200 border-b-[2.5px] border-x-[2.5px] border-brutalBlack flex items-center justify-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brutalBlack"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brutalBlack"></span>
                  </div>
                  <div className="absolute left-4 top-0 bottom-0 w-[2.5px] bg-red-500/80"></div>
                  
                  <div className="pl-4 sm:pl-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b-2 border-neutral-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-retroTeal text-white font-mono text-xs font-black px-2 py-0.5 border border-brutalBlack uppercase">
                          {subjectName} • SEC-A
                        </span>
                        <span className="font-mono text-[10px] font-bold text-neutral-600 tracking-tight uppercase">
                          {currentQuestion.subtopicName}
                        </span>
                      </div>
                      <span className="bg-paper-200 font-mono text-[10px] font-black text-brutalBlack px-2 py-0.5 border border-brutalBlack uppercase">
                        ID: {currentQuestion.id.slice(0,8)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <span className="font-mono text-xs font-extrabold text-kraftBrown tracking-wider uppercase flex items-center gap-1.5">
                        <span>⚡</span> PROBLEM STATEMENT
                      </span>
                      <p className="text-lg sm:text-xl font-extrabold text-brutalBlack leading-relaxed font-serif whitespace-pre-wrap">
                        {currentQuestion.prompt}
                      </p>
                    </div>

                    {error && (
                      <div className="mt-4 bg-red-50 p-3 border-[2px] border-red-500 text-sm font-bold text-red-700">
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Brutalist Answer Tiles */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-brutalBlack text-white p-3.5 border-[2.5px] border-brutalBlack shadow-brutal flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-black text-sm tracking-wider uppercase">PUNCH YOUR ANSWER</span>
                    </div>
                    <span className="font-mono text-[11px] bg-white text-brutalBlack px-2 py-0.5 font-bold">
                      KEYS [1 - 4]
                    </span>
                  </div>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => {
                      const isSelected = answers[currentQuestion.id] === i;
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(i)}
                          disabled={isSubmitting}
                          className={`w-full text-left p-4 border-[2.5px] border-brutalBlack shadow-brutal flex items-center justify-between cursor-pointer group ${isSelected ? 'is-selected bg-retroTeal-soft' : 'bg-white hover:bg-paper-200 option-btn'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 border-[2px] border-brutalBlack flex items-center justify-center font-mono text-base font-black shrink-0 ${isSelected ? 'bg-retroTeal text-white shadow-brutal-sm' : 'bg-paper-200 text-brutalBlack group-hover:bg-schoolYellow transition-colors'}`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <div className="font-serif text-[15px] font-bold text-brutalBlack tracking-wide leading-tight">
                              {option}
                            </div>
                          </div>
                          
                          {isSelected ? (
                            <div className="flex items-center gap-1.5 bg-white text-retroTeal-dark font-mono text-xs font-black px-2.5 py-1 border-[1.5px] border-brutalBlack shadow-brutal-sm">
                              <span className="material-symbols-outlined text-base font-black">check</span>
                              <span>SELECTED</span>
                            </div>
                          ) : (
                            <div className="font-mono text-xs font-bold text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              [PRESS {i + 1}]
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ─── Bottom Control Bar ─── */}
              <div className="w-full bg-white border-[3px] border-brutalBlack shadow-brutal p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 animate-fade-in">
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center gap-2 font-mono text-xs text-neutral-600 bg-paper-200 px-3 py-2 border border-brutalBlack">
                    <span className="text-base leading-none">⌨️</span>
                    <span className="font-bold">SHORTCUTS:</span>
                    <span>Press [1-4] to punch</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center gap-3">
                  {!isLastQuestion ? (
                    <button
                      onClick={handleNext}
                      disabled={!hasAnswered}
                      className={`w-full sm:w-auto bg-brutalBlack hover:bg-neutral-800 text-white font-black text-sm sm:text-base px-6 py-3 border-[3px] border-brutalBlack shadow-brutal flex items-center justify-center gap-2 uppercase ${!hasAnswered ? 'opacity-50 cursor-not-allowed' : 'btn-brutal'}`}
                    >
                      <span>NEXT PROBE</span>
                      <span className="text-lg leading-none font-black">➔</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!hasAnswered || isSubmitting}
                      className={`w-full sm:w-auto bg-schoolYellow hover:bg-schoolYellow-deep text-brutalBlack font-black text-sm sm:text-base px-6 py-3 border-[3px] border-brutalBlack shadow-brutal flex items-center justify-center gap-2 uppercase ${!hasAnswered || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'btn-brutal'}`}
                    >
                      <span>SUBMIT &amp; ANALYZE</span>
                      <span className="text-lg leading-none font-black">➔</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
