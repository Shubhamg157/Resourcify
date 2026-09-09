'use client';

import { useState } from 'react';

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  conceptName: string;
  commonMisconception: string;
}

export function PracticeSection({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (revealed.has(questionId)) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleReveal = (questionId: string) => {
    setRevealed((prev) => new Set([...prev, questionId]));
  };

  if (questions.length === 0) {
    return (
      <p className="text-sm text-obsidian-subtle">
        No practice questions available for this concept yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => {
        const isRevealed = revealed.has(q.id);
        const isCorrect = answers[q.id] === q.correctOptionIndex;
        const hasAnswered = answers[q.id] !== undefined;

        return (
          <div key={q.id} className="bg-pearl rounded-lg p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="mono-number text-xs text-crimson font-bold">P{qIndex + 1}</span>
              <span className="text-xs text-obsidian-subtle">{q.conceptName}</span>
            </div>
            <p className="text-sm font-medium text-obsidian mb-4">{q.prompt}</p>

            <div className="space-y-2 mb-4">
              {q.options.map((option, i) => {
                let style = 'border-border bg-white hover:border-sand';
                if (isRevealed) {
                  if (i === q.correctOptionIndex) {
                    style = 'border-mastery-high bg-green-50';
                  } else if (i === answers[q.id] && !isCorrect) {
                    style = 'border-crimson bg-crimson-50';
                  }
                } else if (answers[q.id] === i) {
                  style = 'border-crimson bg-crimson-50';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, i)}
                    disabled={isRevealed}
                    className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-all cursor-pointer ${style} ${
                      isRevealed ? 'cursor-default' : ''
                    }`}
                  >
                    <span className="mono-number text-xs font-semibold mr-2 text-obsidian-subtle">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {hasAnswered && !isRevealed && (
              <button
                onClick={() => handleReveal(q.id)}
                className="text-xs text-crimson font-semibold hover:text-crimson-light cursor-pointer"
              >
                Check Answer →
              </button>
            )}

            {isRevealed && (
              <div className={`text-xs p-3 rounded-md mt-2 ${isCorrect ? 'bg-green-50 text-mastery-high' : 'bg-crimson-50 text-crimson'}`}>
                {isCorrect ? (
                  '✓ Correct! Great understanding.'
                ) : (
                  <>
                    ✗ Incorrect. Correct answer:{' '}
                    <strong>{String.fromCharCode(65 + q.correctOptionIndex)}) {q.options[q.correctOptionIndex]}</strong>
                    {q.commonMisconception && (
                      <p className="mt-1 italic">💡 {q.commonMisconception}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
