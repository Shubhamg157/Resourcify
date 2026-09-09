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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayed.map((concept) => (
          <div
            key={concept.name}
            className="flex items-center gap-3 p-3 rounded-lg bg-pearl border border-border/60 hover:border-sand transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-obsidian truncate">{concept.name}</p>
              <p className="text-xs text-obsidian-subtle truncate">
                {concept.chapterName} → {concept.topicName}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-pearl-dark overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${concept.mastery}%`,
                    backgroundColor:
                      concept.mastery >= 70
                        ? 'var(--color-mastery-high)'
                        : concept.mastery >= 40
                        ? 'var(--color-mastery-mid)'
                        : 'var(--color-mastery-low)',
                  }}
                />
              </div>
              <span
                className={`mono-number text-xs font-bold w-8 text-right ${
                  concept.mastery >= 70
                    ? 'text-mastery-high'
                    : concept.mastery >= 40
                    ? 'text-mastery-mid'
                    : 'text-mastery-low'
                }`}
              >
                {concept.mastery}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {concepts.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-crimson font-semibold hover:text-crimson-light mt-4 cursor-pointer"
        >
          {showAll ? 'Show less ↑' : `Show all ${concepts.length} concepts ↓`}
        </button>
      )}
    </div>
  );
}
