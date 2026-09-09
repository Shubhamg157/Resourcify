'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  conceptName: string;
}

interface Props {
  stackId: string;
  questions: Question[];
}

export function RecheckQuiz({ stackId, questions }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    recheckScore: number;
    correct: number;
    total: number;
    passed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;

  const handleSelect = (optionIndex: number) => {
    if (isSubmitting || result) return;
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
      const response = await fetch('/api/recheck/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stackId,
          answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
            questionId,
            selectedOptionIndex,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit recheck');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  }, [stackId, answers]);

  if (questions.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <p className="text-obsidian-subtle mb-4">No recheck questions available for this concept.</p>
        <button
          onClick={() => router.push(`/recovery/${stackId}`)}
          className="btn-secondary"
        >
          ← Back to Recovery Stack
        </button>
      </div>
    );
  }

  // ─── Show Result ───
  if (result) {
    return (
      <div className="animate-fade-in">
        <div className="card-elevated p-8 text-center mb-6">
          <span className="tag tag-crimson text-xs uppercase tracking-widest mb-4 inline-block">
            Recheck Result
          </span>

          <div className={`mono-number text-6xl font-bold my-6 ${
            result.passed ? 'text-mastery-high' : result.recheckScore >= 40 ? 'text-mastery-mid' : 'text-mastery-low'
          }`}>
            {result.recheckScore}%
          </div>

          <p className="text-sm text-obsidian-subtle mb-2">
            {result.correct} of {result.total} correct
          </p>

          {result.passed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-mastery-high font-semibold text-sm">
                🎉 Concept gap fixed! Your mastery has been updated.
              </p>
              <p className="text-xs text-obsidian-subtle mt-1">
                This concept is now marked as recovered in your knowledge graph.
              </p>
            </div>
          ) : (
            <div className="bg-crimson-50 border border-crimson-200 rounded-lg p-4 mt-4">
              <p className="text-crimson font-semibold text-sm">
                Not quite there yet. Review the recovery stack and try again.
              </p>
              <p className="text-xs text-obsidian-subtle mt-1">
                Your mastery has still improved slightly from the attempt.
              </p>
            </div>
          )}
        </div>

        {/* ─── Question Review ─── */}
        <div className="card-elevated p-6 mb-6">
          <h2 className="text-base font-bold text-obsidian font-[family-name:var(--font-serif)] mb-4">
            Answer Review
          </h2>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const selectedIdx = answers[q.id];
              const isCorrect = selectedIdx === q.correctOptionIndex;
              return (
                <div
                  key={q.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    isCorrect ? 'bg-green-50' : 'bg-crimson-50'
                  }`}
                >
                  <span
                    className={`mono-number text-xs font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-mastery-high text-white' : 'bg-crimson text-white'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-obsidian mb-1 line-clamp-2">{q.prompt}</p>
                    {!isCorrect && (
                      <p className="text-xs text-crimson">
                        Your answer: {String.fromCharCode(65 + selectedIdx)}) {q.options[selectedIdx]}
                        <br />
                        Correct: {String.fromCharCode(65 + q.correctOptionIndex)}) {q.options[q.correctOptionIndex]}
                      </p>
                    )}
                  </div>
                  <span className="text-sm flex-shrink-0">{isCorrect ? '✓' : '✗'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── CTAs ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
          {result.passed ? (
            <>
              <button onClick={() => router.push('/topics')} className="btn-primary px-8 py-3">
                Diagnose Another Topic →
              </button>
              <button onClick={() => router.push('/progress')} className="btn-secondary px-8 py-3">
                View Progress
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push(`/recovery/${stackId}`)} className="btn-primary px-8 py-3">
                ← Review Recovery Stack
              </button>
              <button onClick={() => router.push('/topics')} className="btn-secondary px-8 py-3">
                Try Another Topic
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Submission Skeleton ───
  if (isSubmitting) {
    return (
      <div className="card-elevated p-8 text-center animate-fade-in">
        <span className="tag tag-crimson text-xs uppercase tracking-widest mb-3 inline-block">
          Verifying Fix
        </span>
        <h2 className="text-xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-4">
          Checking your understanding...
        </h2>
        <div className="space-y-3 max-w-sm mx-auto mb-6">
          <div className="skeleton-box h-4 w-4/5 mx-auto rounded" />
          <div className="skeleton-box h-3 w-3/5 mx-auto rounded" />
          <div className="skeleton-box h-3 w-2/5 mx-auto rounded" />
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-obsidian-subtle">
          <svg className="animate-spin w-4 h-4 text-crimson" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Updating knowledge graph...</span>
        </div>
      </div>
    );
  }

  // ─── Quiz UI ───
  return (
    <div className="animate-fade-in" key={currentQuestion.id}>
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
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

      {/* Question Card */}
      <div className="card-elevated p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="mono-number text-xs text-crimson font-bold bg-crimson-50 px-2.5 py-1 rounded-md">
            R{currentIndex + 1}/{questions.length}
          </span>
          <span className="text-xs text-obsidian-subtle">{currentQuestion.conceptName}</span>
        </div>

        <h2 className="text-lg font-semibold text-obsidian leading-relaxed mb-6 font-[family-name:var(--font-serif)]">
          {currentQuestion.prompt}
        </h2>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, i) => {
            const isSelected = answers[currentQuestion.id] === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-5 py-3.5 rounded-lg border transition-all cursor-pointer
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

        {error && (
          <div className="bg-crimson-50 border border-crimson-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-crimson">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className={`btn-primary ${!hasAnswered ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!hasAnswered}
              className={`btn-primary px-8 ${!hasAnswered ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Submit Recheck →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
