'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  sessionId: string;
  topicId: string;
}

export function GenerateStackButton({ sessionId, topicId }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/recovery/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, topicId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate recovery stack');
      }

      const data = await response.json();
      router.push(`/recovery/${data.stackId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`btn-primary text-base px-10 py-3.5 w-full sm:w-auto ${
          isGenerating ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Assembling Recovery Stack...
          </span>
        ) : (
          'Fix This Now →'
        )}
      </button>

      {isGenerating && (
        <div className="mt-6 p-4 rounded-xl border border-border bg-white text-left space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-obsidian-subtle">
            <span className="font-medium text-crimson animate-pulse">
              Curating targeted explanation &amp; formulas...
            </span>
            <span>~15 min fix</span>
          </div>
          <div className="space-y-2">
            <div className="skeleton-box h-4 w-5/6 rounded" />
            <div className="skeleton-box h-3 w-4/6 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="skeleton-box h-8 rounded-lg" />
            <div className="skeleton-box h-8 rounded-lg" />
            <div className="skeleton-box h-8 rounded-lg" />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-crimson mt-3">{error}</p>
      )}
    </div>
  );
}
