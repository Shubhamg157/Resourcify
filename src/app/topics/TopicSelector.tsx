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

const SUBJECT_COLORS: Record<string, { bg: string, text: string, hover: string }> = {
  Physics: { bg: 'bg-retroTeal', text: 'text-white', hover: 'hover:bg-retroTeal-dark' },
  Chemistry: { bg: 'bg-kraftBrown', text: 'text-white', hover: 'hover:bg-kraftBrown-dark' },
  Mathematics: { bg: 'bg-schoolYellow', text: 'text-brutalBlack', hover: 'hover:bg-schoolYellow-deep' },
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
    <div className="pb-12 space-y-8">
      {/* ─── Brutalist Search Bar ─── */}
      <div className="bg-white border-[3px] border-brutalBlack p-2 shadow-brutal flex items-center relative">
        <span className="material-symbols-outlined text-brutalBlack ml-3 mr-2 font-black">search</span>
        <input
          type="text"
          placeholder="SEARCH INDEXED TOPICS, CHAPTERS, CONCEPTS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 font-mono text-sm font-bold placeholder:text-neutral-400 py-3 uppercase tracking-wider outline-none"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="w-8 h-8 bg-paper-200 border-[2px] border-brutalBlack flex items-center justify-center font-bold text-xs hover:bg-brutalBlack hover:text-white transition-colors cursor-pointer mr-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* ─── Search Results ─── */}
      {search.trim() && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-brutalBlack text-white px-2 py-0.5 font-mono text-xs font-black uppercase">
              SEARCH RESULTS
            </span>
            <span className="font-mono text-xs font-bold text-neutral-500">
              [{filteredTopics.length} FOUND]
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map(({ topic, chapter, subject }) => {
              const color = SUBJECT_COLORS[subject.name] || { bg: 'bg-brutalBlack', text: 'text-white' };
              
              return (
                <Link
                  key={topic.id}
                  href={`/diagnostic/${topic.id}`}
                  className="bg-white border-[3px] border-brutalBlack shadow-brutal flex flex-col justify-between relative group hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform"
                >
                  <div className={`${color.bg} ${color.text} p-3.5 border-b-[2.5px] border-brutalBlack flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] ${subject.name === 'Mathematics' ? 'bg-brutalBlack text-white' : 'bg-white text-brutalBlack'} px-1.5 py-0.5 border border-brutalBlack font-black uppercase`}>
                        {subject.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-tight block truncate">
                      {chapter.name}
                    </span>
                    <h3 className="text-lg font-black text-brutalBlack tracking-tight leading-snug">
                      {topic.name}
                    </h3>
                  </div>
                  <div className="p-5 pt-0 mt-auto">
                    <div className="border-t-[2px] border-brutalBlack pt-3 flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-neutral-500">{conceptCount(topic)} Concepts</span>
                      <span className="bg-paper-200 text-brutalBlack px-2 py-0.5 border border-brutalBlack group-hover:bg-brutalBlack group-hover:text-white transition-colors">START ➔</span>
                    </div>
                  </div>
                </Link>
              );
            })}
            {filteredTopics.length === 0 && (
              <div className="col-span-full bg-white border-[3px] border-brutalBlack p-8 text-center shadow-brutal">
                <p className="font-mono text-sm font-bold text-neutral-500 uppercase">NO INDEXED TOPICS FOUND.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Manila Folder Subject Selection ─── */}
      {!search.trim() && !selectedSubject && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center gap-2 border-b-[2.5px] border-brutalBlack pb-2">
            <span className="text-lg">📚</span>
            <span className="font-black text-lg text-brutalBlack uppercase tracking-wider">
              1. Select Diagnostic Domain
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {subjects.map((subject, idx) => {
              const totalTopics = subject.chapters.reduce((acc, ch) => acc + ch.topics.length, 0);
              const color = SUBJECT_COLORS[subject.name] || { bg: 'bg-brutalBlack', text: 'text-white' };
              
              return (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className="bg-white border-[3px] border-brutalBlack shadow-brutal flex flex-col justify-between relative group text-left cursor-pointer transition-all hover:translate-y-[-2px] hover:translate-x-[-2px]"
                >
                  <div className={`${color.bg} ${color.text} p-4 border-b-[2.5px] border-brutalBlack flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs ${subject.name === 'Mathematics' ? 'bg-brutalBlack text-white' : 'bg-white text-brutalBlack'} px-1.5 py-0.5 border border-brutalBlack font-black`}>
                        0{idx + 1}
                      </span>
                      <span className="font-black text-sm tracking-wider uppercase">DOMAIN</span>
                    </div>
                    <span className="text-xl">{SUBJECT_ICONS[subject.name]}</span>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-black text-brutalBlack tracking-tight uppercase">
                      {subject.name}
                    </h2>
                  </div>
                  
                  <div className="p-6 pt-0 mt-auto">
                    <div className="border-t-[2px] border-neutral-200 pt-3 grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                      <div className="flex flex-col">
                        <span className="text-neutral-500">CHAPTERS</span>
                        <span className="text-brutalBlack text-sm">{subject.chapters.length}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-neutral-500">TOPICS</span>
                        <span className="text-brutalBlack text-sm">{totalTopics}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Chapter Selection ─── */}
      {!search.trim() && selectedSubject && !selectedChapter && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedSubject(null)}
              className="bg-paper-200 border-[2px] border-brutalBlack px-3 py-1.5 font-mono text-xs font-black uppercase hover:bg-brutalBlack hover:text-white transition-colors cursor-pointer"
            >
              ← BACK TO DOMAINS
            </button>
            <span className={`font-mono text-xs font-black px-2.5 py-1 border-[2px] border-brutalBlack uppercase shadow-brutal-sm ${SUBJECT_COLORS[selectedSubject.name]?.bg || 'bg-brutalBlack'} ${SUBJECT_COLORS[selectedSubject.name]?.text || 'text-white'}`}>
              {selectedSubject.name} DOMAIN
            </span>
          </div>
          
          <div className="flex items-center gap-2 border-b-[2.5px] border-brutalBlack pb-2">
            <span className="text-lg">📑</span>
            <span className="font-black text-lg text-brutalBlack uppercase tracking-wider">
              2. Select Chapter Module
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {selectedSubject.chapters.map((chapter, idx) => {
              const totalConcepts = chapter.topics.reduce((a, t) => a + conceptCount(t), 0);
              return (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter)}
                  className="bg-white border-[2.5px] border-brutalBlack p-4 flex items-center justify-between group hover:bg-paper-100 cursor-pointer shadow-brutal-sm transition-all hover:translate-y-[-1px] hover:translate-x-[-1px]"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-paper-200 border-[2px] border-brutalBlack flex items-center justify-center font-mono font-black text-sm shrink-0 group-hover:bg-schoolYellow transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-brutalBlack uppercase tracking-tight">
                        {chapter.name}
                      </h3>
                      <p className="font-mono text-[10px] font-bold text-neutral-500 mt-1 uppercase">
                        {chapter.topics.length} Topics • {totalConcepts} Concepts
                      </p>
                    </div>
                  </div>
                  <span className="bg-white border-[2px] border-brutalBlack w-8 h-8 flex items-center justify-center font-black group-hover:bg-brutalBlack group-hover:text-white transition-colors">
                    ➔
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Topic Selection ─── */}
      {!search.trim() && selectedSubject && selectedChapter && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedChapter(null)}
              className="bg-paper-200 border-[2px] border-brutalBlack px-3 py-1.5 font-mono text-xs font-black uppercase hover:bg-brutalBlack hover:text-white transition-colors cursor-pointer"
            >
              ← BACK TO CHAPTERS
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline bg-paper-200 border-[2px] border-brutalBlack font-mono text-xs font-bold px-2 py-1 uppercase shadow-brutal-sm">
                {selectedSubject.name}
              </span>
              <span className="font-mono text-xs font-black px-2.5 py-1 border-[2px] border-brutalBlack uppercase shadow-brutal-sm bg-white">
                {selectedChapter.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b-[2.5px] border-brutalBlack pb-2">
            <span className="text-lg">🎯</span>
            <span className="font-black text-lg text-brutalBlack uppercase tracking-wider">
              3. Launch Micro-Diagnostic
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {selectedChapter.topics.map((topic) => (
              <div key={topic.id} className="bg-white border-[3px] border-brutalBlack shadow-brutal flex flex-col justify-between">
                <div className="p-5 border-b-[2.5px] border-brutalBlack bg-paper-100 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-brutalBlack tracking-tight leading-snug">
                      {topic.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-white border border-brutalBlack font-mono text-[10px] font-bold px-1.5 py-0.5">
                        {topic.subtopics.length} SUBTOPICS
                      </span>
                      <span className="bg-white border border-brutalBlack font-mono text-[10px] font-bold px-1.5 py-0.5">
                        {conceptCount(topic)} CONCEPTS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtopics Listing */}
                <div className="p-5 space-y-2 bg-white">
                  {topic.subtopics.map((subtopic) => (
                    <div key={subtopic.id} className="flex items-start gap-2">
                      <span className="text-retroTeal font-bold mt-0.5">↳</span>
                      <div>
                        <span className="text-sm font-bold text-neutral-800">{subtopic.name}</span>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {subtopic.concepts.map((c) => (
                            <span key={c.id} className="font-mono text-[9px] bg-paper-100 border border-neutral-300 px-1 py-0.5 uppercase tracking-wider text-neutral-500">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 pt-0 mt-auto">
                  <Link
                    href={`/diagnostic/${topic.id}`}
                    className="w-full bg-brutalBlack hover:bg-neutral-800 text-white font-black text-sm px-4 py-3 border-[2.5px] border-brutalBlack shadow-brutal-sm btn-brutal flex items-center justify-center gap-2 tracking-wide uppercase transition-colors"
                  >
                    <span>START 12-MIN DIAGNOSTIC</span>
                    <span className="text-lg leading-none">➔</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
