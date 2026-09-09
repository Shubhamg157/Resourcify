'use client';

import { useState } from 'react';

interface ConceptMastery {
  name: string;
  mastery: number;
  topicName: string;
  chapterName: string;
}

export function MasteryChart({ concepts }: { concepts: ConceptMastery[] }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...concepts].sort((a, b) => a.mastery - b.mastery);
  const displayed = showAll ? sorted : sorted.slice(0, 6);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayed.map((concept) => {
          const isHigh = concept.mastery >= 70;
          const isMid = concept.mastery >= 40 && concept.mastery < 70;
          const isLow = concept.mastery < 40;
          
          let colorClass = 'bg-brutalBlack';
          let textColor = 'text-brutalBlack';
          if (isHigh) { colorClass = 'bg-retroTeal'; textColor = 'text-retroTeal'; }
          if (isMid) { colorClass = 'bg-schoolYellow-deep'; textColor = 'text-schoolYellow-deep'; }
          if (isLow) { colorClass = 'bg-red-500'; textColor = 'text-red-600'; }

          return (
            <div
              key={concept.name}
              className="bg-white border-[2px] border-brutalBlack p-4 hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform shadow-brutal-sm"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-brutalBlack truncate uppercase tracking-tight">{concept.name}</p>
                    <p className="font-mono text-[10px] font-bold text-neutral-500 truncate uppercase mt-0.5">
                      {concept.chapterName} // {concept.topicName}
                    </p>
                  </div>
                  <span className={`font-mono text-sm font-black ${textColor} bg-paper-200 px-1 border border-brutalBlack shrink-0`}>
                    {concept.mastery}%
                  </span>
                </div>
                <div className="w-full h-3.5 bg-paper-200 border-[1.5px] border-brutalBlack p-[1.5px]">
                  <div
                    className={`h-full border border-brutalBlack transition-all duration-500 ${colorClass}`}
                    style={{ width: `${concept.mastery}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {concepts.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full bg-paper-200 hover:bg-brutalBlack hover:text-white text-brutalBlack font-mono text-xs font-black uppercase py-3 border-[2.5px] border-brutalBlack mt-6 transition-colors shadow-brutal-sm"
        >
          {showAll ? 'Collapse Directory ↑' : `Expand Directory (${concepts.length - 6} Hidden) ↓`}
        </button>
      )}
    </div>
  );
}
