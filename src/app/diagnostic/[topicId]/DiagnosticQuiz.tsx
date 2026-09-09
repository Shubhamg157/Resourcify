'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
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
    <div className="min-h-screen bg-pearl flex flex-col">
      {/* ─── Top Bar ─── */}
      <div className="bg-white border-b border-border px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-sand font-medium">{subjectName} → {chapterName}</span>
            <h1 className="text-sm font-semibold text-obsidian">{topicName} Diagnostic</h1>
          </div>
          <div className="mono-number text-lg text-obsidian-subtle font-semibold">
            {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* ─── Progress Bar ─── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-1.5 py-3">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i < currentIndex
                    ? 'bg-crimson'
                    : i === currentIndex
                    ? 'bg-crimson-400'
                    : answers[q.id] !== undefined
                    ? 'bg-sand-300'
                    : 'bg-pearl-dark'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Question or Submission Skeleton ─── */}
      <main className="flex-1 flex items-start justify-center px-6 py-10">
        {isSubmitting ? (
          <div className="max-w-3xl w-full animate-fade-in card-elevated p-8 border border-border bg-white rounded-xl shadow-sm">
            <div className="text-center mb-8">
              <span className="tag tag-crimson text-xs uppercase tracking-widest mb-3 inline-block">
                AI Diagnostic Engine
              </span>
              <h2 className="text-2xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-2">
                Analyzing Your Conceptual Gaps...
              </h2>
              <p className="text-sm text-obsidian-subtle">
                Evaluating {questions.length} responses, identifying misconceptions, and mapping root prerequisites.
              </p>
            </div>

            {/* Skeleton Progress Animation */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3.5 bg-sand-50/60 rounded-lg border border-border/60">
                <div className="skeleton-box w-5 h-5 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton-box h-4 w-48 rounded" />
                  <div className="skeleton-box h-3 w-32 rounded" />
                </div>
                <span className="text-xs text-crimson font-medium animate-pulse">Evaluating</span>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-sand-50/40 rounded-lg border border-border/40">
                <div className="skeleton-box w-5 h-5 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton-box h-4 w-60 rounded" />
                  <div className="skeleton-box h-3 w-40 rounded" />
                </div>
                <span className="text-xs text-sand font-medium">Classifying</span>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-sand-50/20 rounded-lg border border-border/30">
                <div className="skeleton-box w-5 h-5 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton-box h-4 w-52 rounded" />
                  <div className="skeleton-box h-3 w-36 rounded" />
                </div>
                <span className="text-xs text-obsidian-subtle font-medium">Tracing Prereqs</span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-3 text-xs text-obsidian-subtle">
              <svg className="animate-spin w-4 h-4 text-crimson" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Generating diagnosis report...</span>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl w-full animate-fade-in" key={currentQuestion.id}>
            {/* Question metadata */}
            <div className="flex items-center gap-3 mb-6">
              <span className="mono-number text-xs text-crimson font-bold bg-crimson-50 px-2.5 py-1 rounded-md">
                Q{currentIndex + 1}/{questions.length}
              </span>
              <span className="tag tag-sand text-xs">{currentQuestion.questionType}</span>
              <span className="text-xs text-obsidian-subtle">
                {currentQuestion.subtopicName} → {currentQuestion.conceptName}
              </span>
            </div>

            {/* Question prompt */}
            <h2 className="text-xl font-semibold text-obsidian leading-relaxed mb-8 font-[family-name:var(--font-serif)]">
              {currentQuestion.prompt}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, i) => {
                const isSelected = answers[currentQuestion.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={isSubmitting}
                    className={`w-full text-left px-5 py-4 rounded-lg border transition-all cursor-pointer
                      ${
                        isSelected
                          ? 'border-crimson bg-crimson-50 text-obsidian'
                          : 'border-border bg-white hover:border-sand hover:bg-pearl-warm text-obsidian'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mono-number text-sm font-semibold mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                          ${isSelected ? 'bg-crimson text-white' : 'bg-pearl-dark text-obsidian-subtle'}
                        `}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm leading-relaxed">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-crimson-50 border border-crimson-200 rounded-lg px-4 py-3 mb-6">
                <p className="text-sm text-crimson">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              {!isLastQuestion ? (
                <button
                  onClick={handleNext}
                  disabled={!hasAnswered}
                  className={`btn-primary ${!hasAnswered ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!hasAnswered || isSubmitting}
                  className={`btn-primary px-8 ${
                    !hasAnswered || isSubmitting ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  Submit &amp; Analyze →
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
