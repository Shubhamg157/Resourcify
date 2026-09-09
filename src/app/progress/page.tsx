import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DEMO_USER_ID } from '@/types';
import { MasteryChart } from './MasteryChart';

export const metadata = {
  title: 'Progress — Resourcify',
  description: 'Track your concept mastery across all subjects.',
};

export default async function ProgressPage() {
  // Get all knowledge states for the demo user
  const knowledgeStates = await prisma.knowledgeState.findMany({
    where: { userId: DEMO_USER_ID },
    include: {
      concept: {
        include: {
          subtopic: {
            include: {
              topic: {
                include: {
                  chapter: { include: { subject: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { lastUpdated: 'desc' },
  });

  // Get total diagnostic sessions
  const sessionCount = await prisma.diagnosticSession.count({
    where: { userId: DEMO_USER_ID },
  });

  // Get completed recovery stacks
  const completedStacks = await prisma.learningStack.count({
    where: { userId: DEMO_USER_ID, completed: true },
  });

  const totalStacks = await prisma.learningStack.count({
    where: { userId: DEMO_USER_ID },
  });

  // Group by subject
  const subjectMap = new Map<string, {
    name: string;
    concepts: { name: string; mastery: number; topicName: string; chapterName: string }[];
  }>();

  for (const ks of knowledgeStates) {
    const subjectName = ks.concept.subtopic.topic.chapter.subject.name;
    if (!subjectMap.has(subjectName)) {
      subjectMap.set(subjectName, { name: subjectName, concepts: [] });
    }
    subjectMap.get(subjectName)!.concepts.push({
      name: ks.concept.name,
      mastery: ks.masteryPercent,
      topicName: ks.concept.subtopic.topic.name,
      chapterName: ks.concept.subtopic.topic.chapter.name,
    });
  }

  const subjects = Array.from(subjectMap.values());

  // Calculate overall mastery
  const overallMastery = knowledgeStates.length > 0
    ? Math.round(knowledgeStates.reduce((sum, ks) => sum + ks.masteryPercent, 0) / knowledgeStates.length)
    : 0;

  const SUBJECT_ICONS: Record<string, string> = {
    Physics: '⚡',
    Chemistry: '🧪',
    Mathematics: '📐',
  };

  return (
    <div className="min-h-screen bg-pearl">
      {/* ─── Header ─── */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-crimson rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs font-[family-name:var(--font-serif)]">R</span>
            </div>
            <span className="text-base font-bold text-obsidian font-[family-name:var(--font-serif)]">
              Resourcify
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-obsidian-subtle hover:text-obsidian transition-colors">
              Dashboard
            </Link>
            <Link href="/topics" className="text-sm text-obsidian-subtle hover:text-obsidian transition-colors">
              Topics
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* ─── Title ─── */}
        <div className="mb-8 animate-fade-in">
          <span className="tag tag-sand text-xs uppercase tracking-widest mb-2 inline-block">Knowledge Graph</span>
          <h1 className="text-3xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-2">
            Your <span className="crimson-underline text-crimson">Progress</span>
          </h1>
          <p className="text-sm text-obsidian-subtle">
            Concept mastery tracked across diagnostics and recovery rechecks.
          </p>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Overall Mastery</p>
            <p className={`mono-number text-3xl font-bold ${
              overallMastery >= 70 ? 'text-mastery-high' : overallMastery >= 40 ? 'text-mastery-mid' : 'text-mastery-low'
            }`}>
              {knowledgeStates.length > 0 ? `${overallMastery}%` : '—'}
            </p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Concepts Tracked</p>
            <p className="mono-number text-3xl font-bold text-obsidian">{knowledgeStates.length}</p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Diagnostics Taken</p>
            <p className="mono-number text-3xl font-bold text-obsidian">{sessionCount}</p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Stacks Completed</p>
            <p className="mono-number text-3xl font-bold text-obsidian">
              {completedStacks}<span className="text-base text-obsidian-subtle">/{totalStacks}</span>
            </p>
          </div>
        </div>

        {/* ─── No data state ─── */}
        {knowledgeStates.length === 0 && (
          <div className="card-elevated p-12 text-center animate-fade-in">
            <h2 className="text-xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-3">
              No Progress Yet
            </h2>
            <p className="text-sm text-obsidian-subtle mb-6">
              Take your first diagnostic to start tracking concept mastery.
            </p>
            <Link href="/topics" className="btn-primary px-8 py-3">
              Start a Diagnostic →
            </Link>
          </div>
        )}

        {/* ─── Subject Breakdown ─── */}
        {subjects.length > 0 && (
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {subjects.map((subject) => {
              const avgMastery = Math.round(
                subject.concepts.reduce((s, c) => s + c.mastery, 0) / subject.concepts.length
              );
              const mastered = subject.concepts.filter((c) => c.mastery >= 70).length;
              const weak = subject.concepts.filter((c) => c.mastery < 40).length;

              return (
                <div key={subject.name} className="card-elevated p-6">
                  {/* Subject Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{SUBJECT_ICONS[subject.name] || '📚'}</span>
                      <div>
                        <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)]">
                          {subject.name}
                        </h2>
                        <p className="text-xs text-obsidian-subtle">
                          {subject.concepts.length} concepts · {mastered} mastered · {weak} weak
                        </p>
                      </div>
                    </div>
                    <span className={`mono-number text-2xl font-bold ${
                      avgMastery >= 70 ? 'text-mastery-high' : avgMastery >= 40 ? 'text-mastery-mid' : 'text-mastery-low'
                    }`}>
                      {avgMastery}%
                    </span>
                  </div>

                  {/* Overall bar */}
                  <div className="mastery-bar mb-5">
                    <div
                      className="mastery-bar-fill"
                      style={{
                        width: `${avgMastery}%`,
                        backgroundColor: avgMastery >= 70 ? 'var(--color-mastery-high)' : avgMastery >= 40 ? 'var(--color-mastery-mid)' : 'var(--color-mastery-low)',
                      }}
                    />
                  </div>

                  {/* Concept List */}
                  <MasteryChart concepts={subject.concepts} />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
