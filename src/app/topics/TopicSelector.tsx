'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

// Types matching the Prisma query shape
interface Concept {
  id: string;
  name: string;
}

interface Subtopic {
  id: string;
  name: string;
  concepts: Concept[];
}

interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

const SUBJECT_ICONS: Record<string, string> = {
  Physics: '⚡',
  Chemistry: '🧪',
  Mathematics: '📐',
};

export function TopicSelector({ subjects }: { subjects: Subject[] }) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [search, setSearch] = useState('');

  // Flatten all topics for search
  const allTopics = useMemo(() => {
    const topics: { topic: Topic; chapter: Chapter; subject: Subject }[] = [];
    for (const subject of subjects) {
      for (const chapter of subject.chapters) {
        for (const topic of chapter.topics) {
          topics.push({ topic, chapter, subject });
        }
      }
    }
    return topics;
  }, [subjects]);

  const filteredTopics = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allTopics.filter(
      ({ topic, chapter, subject }) =>
        topic.name.toLowerCase().includes(q) ||
        chapter.name.toLowerCase().includes(q) ||
        subject.name.toLowerCase().includes(q) ||
        topic.subtopics.some(st => st.name.toLowerCase().includes(q))
    );
  }, [search, allTopics]);

  const conceptCount = (topic: Topic) =>
    topic.subtopics.reduce((acc, st) => acc + st.concepts.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 pb-12">
      {/* ─── Search ─── */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search topics, chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 text-sm bg-white border border-border rounded-lg
                       focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson
                       placeholder:text-obsidian-subtle/50"
          />
          <svg className="absolute left-3 top-3 w-4 h-4 text-obsidian-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* ─── Search Results ─── */}
      {search.trim() && (
        <div className="mb-8 animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-4">
            {filteredTopics.length} result{filteredTopics.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTopics.map(({ topic, chapter, subject }) => (
              <Link
                key={topic.id}
                href={`/diagnostic/${topic.id}`}
                className="card p-4 hover:border-crimson transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-sand font-medium">
                      {subject.name} → {chapter.name}
                    </span>
                    <h3 className="text-sm font-semibold text-obsidian mt-1 group-hover:text-crimson transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-obsidian-subtle mt-1">
                      {conceptCount(topic)} concepts · {topic.subtopics.length} subtopics
                    </p>
                  </div>
                  <span className="text-crimson opacity-0 group-hover:opacity-100 transition-opacity text-lg">→</span>
                </div>
              </Link>
            ))}
            {filteredTopics.length === 0 && (
              <p className="text-sm text-obsidian-subtle col-span-full">No topics found.</p>
            )}
          </div>
        </div>
      )}

      {/* ─── Subject Selection ─── */}
      {!search.trim() && !selectedSubject && (
        <div className="animate-fade-in">
          <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-4 font-semibold">
            Select Subject
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const totalTopics = subject.chapters.reduce((acc, ch) => acc + ch.topics.length, 0);
              const totalConcepts = subject.chapters.reduce(
                (acc, ch) => acc + ch.topics.reduce((a, t) => a + conceptCount(t), 0),
                0
              );
              return (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className="card p-6 text-left hover:border-crimson transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{SUBJECT_ICONS[subject.name] || '📚'}</span>
                    <h2 className="text-xl font-bold text-obsidian font-[family-name:var(--font-serif)] group-hover:text-crimson transition-colors">
                      {subject.name}
                    </h2>
                  </div>
                  <div className="flex gap-4 text-xs text-obsidian-subtle">
                    <span className="mono-number">{subject.chapters.length} chapters</span>
                    <span className="mono-number">{totalTopics} topics</span>
                    <span className="mono-number">{totalConcepts} concepts</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Chapter Selection ─── */}
      {!search.trim() && selectedSubject && !selectedChapter && (
        <div className="animate-fade-in">
          <button
            onClick={() => setSelectedSubject(null)}
            className="text-sm text-crimson hover:text-crimson-light transition-colors mb-4 flex items-center gap-1 cursor-pointer"
          >
            ← Back to Subjects
          </button>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{SUBJECT_ICONS[selectedSubject.name] || '📚'}</span>
            <h2 className="text-2xl font-bold text-obsidian font-[family-name:var(--font-serif)]">
              {selectedSubject.name}
            </h2>
          </div>
          <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-4 font-semibold">
            Select Chapter
          </p>
          <div className="space-y-3">
            {selectedSubject.chapters.map((chapter, idx) => {
              const totalConcepts = chapter.topics.reduce((a, t) => a + conceptCount(t), 0);
              return (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter)}
                  className="card p-5 w-full text-left hover:border-crimson transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="mono-number text-sm text-crimson font-semibold w-8">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-obsidian group-hover:text-crimson transition-colors">
                          {chapter.name}
                        </h3>
                        <p className="text-xs text-obsidian-subtle mt-0.5">
                          {chapter.topics.length} topics · {totalConcepts} concepts
                        </p>
                      </div>
                    </div>
                    <span className="text-crimson opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Topic & Subtopic Selection ─── */}
      {!search.trim() && selectedSubject && selectedChapter && (
        <div className="animate-fade-in">
          <button
            onClick={() => setSelectedChapter(null)}
            className="text-sm text-crimson hover:text-crimson-light transition-colors mb-4 flex items-center gap-1 cursor-pointer"
          >
            ← Back to {selectedSubject.name}
          </button>
          <div className="mb-6">
            <span className="text-xs text-sand font-medium">{selectedSubject.name}</span>
            <h2 className="text-2xl font-bold text-obsidian font-[family-name:var(--font-serif)]">
              {selectedChapter.name}
            </h2>
          </div>

          <div className="space-y-6">
            {selectedChapter.topics.map((topic) => (
              <div key={topic.id} className="card-elevated p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-obsidian font-[family-name:var(--font-serif)]">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-obsidian-subtle mt-1">
                      {conceptCount(topic)} concepts across {topic.subtopics.length} subtopics
                    </p>
                  </div>
                  <Link
                    href={`/diagnostic/${topic.id}`}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Start Diagnostic
                  </Link>
                </div>

                {/* Subtopics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  {topic.subtopics.map((subtopic) => (
                    <div
                      key={subtopic.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-pearl hover:bg-pearl-dark transition-colors"
                    >
                      <div>
                        <span className="text-sm text-obsidian">{subtopic.name}</span>
                        <span className="text-xs text-obsidian-subtle ml-2">
                          {subtopic.concepts.length} concept{subtopic.concepts.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {subtopic.concepts.map((c) => (
                          <div
                            key={c.id}
                            className="w-2 h-2 rounded-full bg-sand-200"
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
