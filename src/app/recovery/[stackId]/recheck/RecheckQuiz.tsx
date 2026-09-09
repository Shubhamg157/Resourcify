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
      <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-8 text-center">
        <p className="font-mono text-sm font-bold text-neutral-600 uppercase mb-6">No recheck questions available for this concept.</p>
        <button
          onClick={() => router.push(`/recovery/${stackId}`)}
          className="bg-brutalBlack text-white hover:bg-neutral-800 font-mono text-sm font-black px-6 py-3 border-[2.5px] border-brutalBlack shadow-brutal-sm transition-colors uppercase btn-brutal"
        >
          ← ABORT TO RECOVERY STACK
        </button>
      </div>
    );
  }

  // ─── Show Result ───
  if (result) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="bg-white border-[3px] border-brutalBlack shadow-brutal relative overflow-hidden text-center p-8 sm:p-12">
          <div className={`absolute top-0 right-0 border-l-[3px] border-b-[3px] border-brutalBlack px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider ${result.passed ? 'bg-retroTeal text-white' : 'bg-red-500 text-white'}`}>
            {result.passed ? 'VERIFICATION SUCCESS' : 'VERIFICATION FAILED'}
          </div>

          <span className="font-mono text-xs font-black uppercase tracking-widest mb-4 inline-block bg-paper-200 border border-brutalBlack px-2 py-0.5">
            RECHECK AUDIT SCORE
          </span>

          <div className={`font-mono text-6xl sm:text-8xl font-black tracking-tight my-4 ${
            result.passed ? 'text-retroTeal' : result.recheckScore >= 40 ? 'text-schoolYellow-deep' : 'text-red-600'
          }`}>
            {result.recheckScore}%
          </div>

          <p className="font-mono text-sm font-bold text-neutral-600 uppercase mb-6">
            {result.correct} OF {result.total} VALIDATED
          </p>

          {result.passed ? (
            <div className="bg-retroTeal-soft border-[2.5px] border-retroTeal-dark text-retroTeal-dark p-5 mt-4 text-left max-w-xl mx-auto shadow-brutal-sm">
              <p className="font-black text-base uppercase tracking-tight mb-1 flex items-center gap-2">
                <span>🎉</span> CONCEPTUAL GAP FIXED
              </p>
              <p className="font-mono text-xs font-bold uppercase">
                Your Knowledge Graph has been updated. This concept is now marked as recovered.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border-[2.5px] border-red-500 text-red-900 p-5 mt-4 text-left max-w-xl mx-auto shadow-brutal-sm">
              <p className="font-black text-base uppercase tracking-tight mb-1 flex items-center gap-2">
                <span>⚠️</span> REPAIR INCOMPLETE
              </p>
              <p className="font-mono text-xs font-bold uppercase">
                Not quite there yet. Your mastery has improved slightly from the attempt, but the intuition is still shaky. Review the stack and try again.
              </p>
            </div>
          )}
        </div>

        {/* ─── Question Review ─── */}
        <div className="bg-white border-[3px] border-brutalBlack shadow-brutal">
          <div className="bg-brutalBlack text-white border-b-[3px] border-brutalBlack px-6 py-4">
            <h2 className="text-xl font-black uppercase tracking-tight">Answer Review</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {questions.map((q, i) => {
                const selectedIdx = answers[q.id];
                const isCorrect = selectedIdx === q.correctOptionIndex;
                return (
                  <div
                    key={q.id}
                    className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 border-[2.5px] border-brutalBlack shadow-brutal-sm ${
                      isCorrect ? 'bg-emerald-50' : 'bg-red-50'
                    }`}
                  >
                    <span
                      className={`font-mono text-sm font-black flex-shrink-0 w-8 h-8 flex items-center justify-center border-[2px] border-brutalBlack ${
                        isCorrect ? 'bg-retroTeal text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-brutalBlack mb-2 leading-snug">{q.prompt}</p>
                      {!isCorrect && (
                        <div className="font-mono text-xs font-bold space-y-1 mt-2 bg-white/50 p-2 border-[1.5px] border-brutalBlack">
                          <p className="text-red-700 break-words">
                            <span className="bg-red-200 px-1 border border-red-700 mr-2 inline-block mb-1">YOUR ANSWER</span> 
                            {String.fromCharCode(65 + selectedIdx)}) {q.options[selectedIdx]}
                          </p>
                          <p className="text-emerald-700 break-words">
                            <span className="bg-emerald-200 px-1 border border-emerald-700 mr-2 inline-block">CORRECT</span>
                            {String.fromCharCode(65 + q.correctOptionIndex)}) {q.options[q.correctOptionIndex]}
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="text-xl shrink-0 self-end sm:self-start">{isCorrect ? '✓' : '✗'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── CTAs ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {result.passed ? (
            <>
              <button onClick={() => router.push('/topics')} className="w-full sm:w-auto bg-brutalBlack text-white hover:bg-neutral-800 font-black px-8 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal uppercase text-sm">
                DIAGNOSE ANOTHER TOPIC ➔
              </button>
              <button onClick={() => router.push('/progress')} className="w-full sm:w-auto bg-white text-brutalBlack hover:bg-paper-200 font-black px-8 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal uppercase text-sm">
                VIEW PROGRESS LOG
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push(`/recovery/${stackId}`)} className="w-full sm:w-auto bg-schoolYellow text-brutalBlack hover:bg-schoolYellow-deep font-black px-8 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal uppercase text-sm">
                ← REVIEW RECOVERY STACK
              </button>
              <button onClick={() => router.push('/topics')} className="w-full sm:w-auto bg-white text-brutalBlack hover:bg-paper-200 font-black px-8 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal uppercase text-sm">
                TRY ANOTHER TOPIC
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
      <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-8 sm:p-12 text-center animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 skeleton-box opacity-50 z-0"></div>
        <div className="relative z-10 space-y-6 max-w-xl mx-auto">
          <span className="font-mono text-xs font-black uppercase text-white bg-brutalBlack px-3 py-1 border-[2px] border-brutalBlack">
            VERIFYING FIX
          </span>
          <h2 className="text-3xl font-black text-brutalBlack tracking-tight">
            Checking your understanding...
          </h2>
          <div className="flex justify-center mt-8">
            <div className="w-16 h-16 border-[4px] border-paper-200 border-t-brutalBlack rounded-full animate-spin"></div>
          </div>
          <div className="font-mono text-xs font-bold text-neutral-600 uppercase animate-pulse pt-4">
            UPDATING KNOWLEDGE GRAPH...
          </div>
        </div>
      </div>
    );
  }

  // ─── Quiz UI ───
  return (
    <div className="animate-fade-in" key={currentQuestion.id}>
      
      {/* ─── Top Control & Progress Strip ─── */}
      <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2 w-full sm:w-1/2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-retroTeal text-white text-[11px] font-mono px-2 py-0.5 font-bold uppercase tracking-wider border border-brutalBlack">
                RECHECK 0{currentIndex + 1} / 0{questions.length}
              </span>
              <span className="font-mono text-[10px] font-extrabold text-neutral-600 uppercase tracking-tight truncate max-w-[200px] sm:max-w-none">
                {currentQuestion.conceptName}
              </span>
            </div>
            <span className="font-mono text-xs font-black text-brutalBlack hidden md:block">
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
      </div>

      {/* ─── Main Question Workspace ─── */}
      <div className="bg-white border-[3px] border-brutalBlack shadow-brutal relative overflow-hidden mb-8">
        {/* Left Column: Physical Clipboard Effect */}
        <div className="p-6 sm:p-8 bg-paper-100 border-b-[3px] border-brutalBlack relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-3.5 bg-paper-200 border-b-[2.5px] border-x-[2.5px] border-brutalBlack flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brutalBlack"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-brutalBlack"></span>
          </div>
          <div className="absolute left-4 top-0 bottom-0 w-[2.5px] bg-red-500/80"></div>
          
          <div className="pl-4 sm:pl-6 space-y-4 pt-4">
            <span className="font-mono text-xs font-extrabold text-kraftBrown tracking-wider uppercase flex items-center gap-1.5">
              <span>⚡</span> PROBLEM STATEMENT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-brutalBlack leading-relaxed font-serif whitespace-pre-wrap">
              {currentQuestion.prompt}
            </h2>
          </div>
        </div>

        {/* Right Column: Brutalist Answer Tiles */}
        <div className="p-6 sm:p-8 space-y-3 bg-white">
          {currentQuestion.options.map((option, i) => {
            const isSelected = answers[currentQuestion.id] === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-4 border-[2.5px] border-brutalBlack shadow-brutal flex items-center justify-between cursor-pointer group transition-colors ${
                  isSelected ? 'bg-retroTeal-soft border-retroTeal-dark' : 'bg-white hover:bg-paper-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 border-[2px] border-brutalBlack flex items-center justify-center font-mono text-base font-black shrink-0 transition-colors ${
                    isSelected ? 'bg-retroTeal text-white shadow-brutal-sm' : 'bg-paper-200 text-brutalBlack group-hover:bg-schoolYellow'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="font-serif text-[15px] font-bold text-brutalBlack tracking-wide leading-tight pr-4">
                    {option}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="flex items-center gap-1.5 bg-white text-retroTeal-dark font-mono text-[10px] font-black px-2 py-1 border-[1.5px] border-brutalBlack shadow-brutal-sm shrink-0">
                    <span className="material-symbols-outlined text-sm font-black">check</span>
                    <span className="hidden sm:inline">SELECTED</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-[3px] border-red-500 p-4 mb-6 shadow-brutal-sm">
          <p className="font-mono text-sm font-bold text-red-700 uppercase">ERROR: {error}</p>
        </div>
      )}

      {/* ─── Actions ─── */}
      <div className="flex justify-end">
        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={`bg-brutalBlack text-white font-black text-sm px-8 py-4 border-[3px] border-brutalBlack shadow-brutal uppercase transition-colors btn-brutal ${
              !hasAnswered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'
            }`}
          >
            NEXT PROBE ➔
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswered}
            className={`bg-schoolYellow text-brutalBlack font-black text-sm px-8 py-4 border-[3px] border-brutalBlack shadow-brutal uppercase transition-colors btn-brutal flex items-center gap-2 ${
              !hasAnswered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-schoolYellow-deep'
            }`}
          >
            <span>SUBMIT RECHECK</span>
            <span className="text-xl leading-none">➔</span>
          </button>
        )}
      </div>
    </div>
  );
}
