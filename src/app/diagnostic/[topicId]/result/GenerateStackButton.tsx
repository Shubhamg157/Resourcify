'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  sessionId: string;
  topicId: string;
  existingStackId?: string;
}

export function GenerateStackButton({ sessionId, topicId, existingStackId }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (existingStackId) {
      router.push(`/recovery/${existingStackId}`);
      return;
    }

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
    <div className="w-full sm:w-auto relative">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`w-full sm:w-auto bg-schoolYellow hover:bg-schoolYellow-deep text-brutalBlack font-black font-mono text-sm px-6 py-4 border-[3px] border-brutalBlack shadow-brutal inline-flex items-center justify-center gap-2 tracking-wide uppercase ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'btn-brutal'}`}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-[3px] border-brutalBlack border-t-transparent rounded-full animate-spin"></div>
            <span>ASSEMBLING RECOVERY...</span>
          </>
        ) : (
          <>
            <span>{existingStackId ? 'OPEN RECOVERY STACK' : 'GENERATE RECOVERY STACK (3 MICRO-ARTIFACTS)'}</span>
            <span className="text-lg">➔</span>
          </>
        )}
      </button>

      {error && (
        <div className="absolute top-full mt-4 left-0 w-full bg-red-50 p-2 border-[2px] border-red-500 text-xs font-bold text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
