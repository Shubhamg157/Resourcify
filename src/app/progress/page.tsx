import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DEMO_USER_ID } from '@/types';
import { MasteryChart } from './MasteryChart';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'Progress — GapZero',
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

  const SUBJECT_COLORS: Record<string, { bg: string, text: string }> = {
    Physics: { bg: 'bg-retroTeal', text: 'text-white' },
    Chemistry: { bg: 'bg-kraftBrown', text: 'text-white' },
    Mathematics: { bg: 'bg-schoolYellow', text: 'text-brutalBlack' },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
        {/* ─── Top Context Ribbon ─── */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[2.5px] border-brutalBlack pb-4 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black bg-brutalBlack text-white px-2.5 py-1 border-[2px] border-brutalBlack shadow-brutal-sm uppercase">
              KNOWLEDGE GRAPH
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-neutral-600 uppercase">
            CONCEPT MASTERY AUDIT
          </div>
        </section>

        {/* ─── Title ─── */}
        <div className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 bg-schoolYellow border-l-[3px] border-b-[3px] border-brutalBlack px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider">
            GLOBAL PROGRESS
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brutalBlack tracking-tight leading-tight mt-2">
            Your <span className="bg-schoolYellow px-2 py-0.5 border-[2px] border-brutalBlack shadow-brutal-sm inline-block">Progress</span>
          </h1>
          <p className="text-base sm:text-lg font-semibold text-neutral-800 leading-relaxed pt-2">
            Concept mastery mapped across all diagnostics and validated recovery rechecks.
          </p>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-[10px] font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              OVERALL MASTERY
            </div>
            <p className={`font-mono text-4xl font-black mt-4 ${
              overallMastery >= 70 ? 'text-retroTeal' : overallMastery >= 40 ? 'text-schoolYellow-deep' : knowledgeStates.length > 0 ? 'text-red-600' : 'text-brutalBlack'
            }`}>
              {knowledgeStates.length > 0 ? `${overallMastery}%` : '—'}
            </p>
          </div>
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-[10px] font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              CONCEPTS TRACKED
            </div>
            <p className="font-mono text-4xl font-black text-brutalBlack mt-4">{knowledgeStates.length}</p>
          </div>
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-[10px] font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              DIAGNOSTICS TAKEN
            </div>
            <p className="font-mono text-4xl font-black text-brutalBlack mt-4">{sessionCount}</p>
          </div>
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-[10px] font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              STACKS COMPLETED
            </div>
            <p className="font-mono text-4xl font-black text-retroTeal mt-4">
              {completedStacks}<span className="text-xl text-neutral-400">/{totalStacks}</span>
            </p>
          </div>
        </div>

        {/* ─── No data state ─── */}
        {knowledgeStates.length === 0 && (
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-12 text-center animate-fade-in">
            <h2 className="text-2xl font-black text-brutalBlack tracking-tight uppercase mb-3">
              No Progress Yet
            </h2>
            <p className="text-sm font-bold text-neutral-600 mb-6 uppercase">
              Take your first diagnostic to start tracking concept mastery.
            </p>
            <Link href="/topics" className="bg-brutalBlack text-white font-black px-8 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal uppercase inline-block">
              START A DIAGNOSTIC ➔
            </Link>
          </div>
        )}

        {/* ─── Subject Breakdown ─── */}
        {subjects.length > 0 && (
          <div className="space-y-8 animate-slide-up pt-4">
            {subjects.map((subject) => {
              const avgMastery = Math.round(
                subject.concepts.reduce((s, c) => s + c.mastery, 0) / subject.concepts.length
              );
              const mastered = subject.concepts.filter((c) => c.mastery >= 70).length;
              const weak = subject.concepts.filter((c) => c.mastery < 40).length;
              
              const color = SUBJECT_COLORS[subject.name] || { bg: 'bg-brutalBlack', text: 'text-white' };

              return (
                <div key={subject.name} className="bg-white border-[3px] border-brutalBlack shadow-brutal">
                  {/* Subject Header - Manila Style */}
                  <div className={`${color.bg} ${color.text} p-5 border-b-[3px] border-brutalBlack flex justify-between items-center`}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{SUBJECT_ICONS[subject.name] || '📚'}</span>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">
                          {subject.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-brutalBlack uppercase ${subject.name === 'Mathematics' ? 'bg-brutalBlack text-white' : 'bg-white text-brutalBlack'}`}>
                            {subject.concepts.length} CONCEPTS
                          </span>
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-brutalBlack uppercase ${subject.name === 'Mathematics' ? 'bg-brutalBlack text-white' : 'bg-white text-brutalBlack'}`}>
                            {mastered} MASTERED
                          </span>
                          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-brutalBlack uppercase ${subject.name === 'Mathematics' ? 'bg-brutalBlack text-white' : 'bg-white text-brutalBlack'}`}>
                            {weak} WEAK
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`font-mono text-3xl font-black bg-white text-brutalBlack px-3 py-1 border-[2.5px] border-brutalBlack shadow-brutal-sm`}>
                      {avgMastery}%
                    </span>
                  </div>

                  {/* Subject Content */}
                  <div className="p-6 space-y-6">
                    {/* Overall bar */}
                    <div>
                      <div className="flex justify-between font-mono text-xs font-bold text-neutral-600 mb-2 uppercase">
                        <span>Domain Mastery Aggregate</span>
                        <span>{avgMastery}%</span>
                      </div>
                      <div className="w-full h-4 bg-paper-200 border-[2px] border-brutalBlack p-[2px]">
                        <div
                          className={`h-full border border-brutalBlack ${avgMastery >= 70 ? 'bg-retroTeal' : avgMastery >= 40 ? 'bg-schoolYellow' : 'bg-red-500'}`}
                          style={{ width: `${avgMastery}%` }}
                        />
                      </div>
                    </div>

                    <div className="border-t-[2.5px] border-dashed border-brutalBlack pt-6">
                      <MasteryChart concepts={subject.concepts} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
