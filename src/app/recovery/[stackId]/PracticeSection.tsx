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
      <div className="bg-paper-200 border-[2px] border-brutalBlack p-6 text-center shadow-brutal-sm">
        <p className="font-mono text-xs font-bold text-neutral-600 uppercase">
          No practice questions available for this concept yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {questions.map((q, qIndex) => {
        const isRevealed = revealed.has(q.id);
        const isCorrect = answers[q.id] === q.correctOptionIndex;
        const hasAnswered = answers[q.id] !== undefined;

        return (
          <div key={q.id} className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative">
            <div className="absolute top-0 right-0 bg-retroTeal text-white font-mono text-xs font-black uppercase tracking-wider px-3 py-1 border-b-[3px] border-l-[3px] border-brutalBlack">
              PROBE {qIndex + 1}
            </div>
            
            <div className="mb-4 pt-2">
              <span className="bg-paper-200 text-brutalBlack font-mono text-[10px] font-black px-2 py-0.5 border-[1.5px] border-brutalBlack uppercase">
                {q.conceptName}
              </span>
            </div>
            
            <p className="text-lg font-serif font-black text-brutalBlack leading-relaxed mb-6">{q.prompt}</p>

            <div className="space-y-3 mb-6">
              {q.options.map((option, i) => {
                let btnStyle = 'bg-white border-brutalBlack hover:bg-paper-200';
                let checkMark = null;

                if (isRevealed) {
                  if (i === q.correctOptionIndex) {
                    btnStyle = 'bg-retroTeal text-white border-brutalBlack shadow-brutal-sm';
                    checkMark = <span className="text-white font-black">✓</span>;
                  } else if (i === answers[q.id] && !isCorrect) {
                    btnStyle = 'bg-red-500 text-white border-brutalBlack shadow-brutal-sm';
                    checkMark = <span className="text-white font-black">✗</span>;
                  } else {
                    btnStyle = 'bg-white text-neutral-400 border-neutral-300 opacity-50';
                  }
                } else if (answers[q.id] === i) {
                  btnStyle = 'bg-schoolYellow text-brutalBlack border-brutalBlack shadow-brutal-sm';
                  checkMark = <span className="text-brutalBlack font-black text-xs">SELECTED</span>;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(q.id, i)}
                    disabled={isRevealed}
                    className={`w-full text-left p-4 border-[2.5px] font-serif text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle} ${
                      isRevealed ? 'cursor-default' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 flex items-center justify-center border-[2px] border-current font-mono text-xs font-black shrink-0 ${isRevealed && i === q.correctOptionIndex ? 'bg-white text-retroTeal' : ''}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {checkMark && <div className="ml-4 font-mono">{checkMark}</div>}
                  </button>
                );
              })}
            </div>

            {hasAnswered && !isRevealed && (
              <button
                onClick={() => handleReveal(q.id)}
                className="w-full bg-brutalBlack text-white hover:bg-neutral-800 font-mono text-sm font-black uppercase py-4 border-[3px] border-brutalBlack shadow-brutal transition-colors btn-brutal"
              >
                CHECK ANSWER ➔
              </button>
            )}

            {isRevealed && (
              <div className={`mt-6 p-4 border-[3px] border-brutalBlack shadow-brutal ${isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
                <div className="flex items-center gap-2 mb-2 font-mono text-sm font-black uppercase">
                  <span className="text-lg">{isCorrect ? '🎯' : '⚠️'}</span>
                  <span>{isCorrect ? 'CORRECT! SOLID GRASP.' : 'DEFECT DETECTED'}</span>
                </div>
                {!isCorrect && (
                  <div className="text-sm font-semibold space-y-2 mt-3">
                    <p>
                      <span className="font-mono font-bold bg-white px-1 border border-current mr-1">CORRECT ANSWER</span> 
                      {String.fromCharCode(65 + q.correctOptionIndex)}) {q.options[q.correctOptionIndex]}
                    </p>
                    {q.commonMisconception && (
                      <div className="bg-white/50 p-3 border-l-[3px] border-current mt-2">
                        <span className="font-mono text-xs font-bold block mb-1">LOGGED MISCONCEPTION:</span>
                        <p className="italic">{q.commonMisconception}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
