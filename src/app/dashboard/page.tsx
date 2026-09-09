import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DEMO_USER_ID } from '@/types';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'Dashboard — GapZero',
  description: 'Your personalized study dashboard.',
};

export default async function DashboardPage() {
  // Fetch recent diagnostic sessions
  const recentSessions = await prisma.diagnosticSession.findMany({
    where: { userId: DEMO_USER_ID },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      topic: {
        include: { chapter: { include: { subject: true } } },
      },
    },
  });

  // Fetch active (incomplete) recovery stacks
  const activeStacks = await prisma.learningStack.findMany({
    where: { userId: DEMO_USER_ID, completed: false },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      concept: {
        include: {
          subtopic: {
            include: {
              topic: { include: { chapter: { include: { subject: true } } } },
            },
          },
        },
      },
      diagnosticSession: true,
    },
  });

  // Fetch completed stacks (recent wins)
  const completedStacks = await prisma.learningStack.findMany({
    where: { userId: DEMO_USER_ID, completed: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { concept: true },
  });

  // Fetch weak concepts (mastery < 40%)
  const weakConcepts = await prisma.knowledgeState.findMany({
    where: { userId: DEMO_USER_ID, masteryPercent: { lt: 40 } },
    orderBy: { masteryPercent: 'asc' },
    take: 5,
    include: {
      concept: {
        include: {
          subtopic: {
            include: {
              topic: { include: { chapter: { include: { subject: true } } } },
            },
          },
        },
      },
    },
  });

  // Stats
  const totalDiagnostics = await prisma.diagnosticSession.count({
    where: { userId: DEMO_USER_ID },
  });
  const totalStacksCompleted = await prisma.learningStack.count({
    where: { userId: DEMO_USER_ID, completed: true },
  });
  const totalConcepts = await prisma.knowledgeState.count({
    where: { userId: DEMO_USER_ID },
  });
  const allMastery = await prisma.knowledgeState.findMany({
    where: { userId: DEMO_USER_ID },
    select: { masteryPercent: true },
  });
  const avgMastery = allMastery.length > 0
    ? Math.round(allMastery.reduce((s, k) => s + k.masteryPercent, 0) / allMastery.length)
    : 0;

  // Estimate time for active stacks
  const totalActiveMinutes = activeStacks.reduce((s, st) => s + st.estimatedMinutes, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
        {/* ─── Top Context Ribbon ─── */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[2.5px] border-brutalBlack pb-4 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black bg-brutalBlack text-white px-2.5 py-1 border-[2px] border-brutalBlack shadow-brutal-sm uppercase">
              STUDENT TERMINAL
            </span>
            <span className="font-mono text-xs font-bold text-neutral-600 bg-paper-200 px-2.5 py-1 border-[2px] border-brutalBlack uppercase">
              COHORT 2027
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-neutral-600 uppercase">
            STATUS: ACTIVE TRACKING
          </div>
        </section>

        {/* ─── Welcome ─── */}
        <div className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 bg-schoolYellow border-l-[3px] border-b-[3px] border-brutalBlack px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider">
            ANALYTICAL DASHBOARD
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brutalBlack tracking-tight leading-tight mt-2">
            Welcome <span className="bg-schoolYellow px-2 py-0.5 border-[2px] border-brutalBlack shadow-brutal-sm inline-block">Back</span>
          </h1>
          <p className="text-base sm:text-lg font-semibold text-neutral-800 leading-relaxed pt-2">
            {activeStacks.length > 0
              ? `You have ${activeStacks.length} active recovery stack${activeStacks.length > 1 ? 's' : ''} (~${totalActiveMinutes} min remaining).`
              : 'Start a diagnostic to find your conceptual gaps.'}
          </p>
        </div>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-xs font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              Mastery Score
            </div>
            <p className={`font-mono text-4xl font-black mt-4 ${
              avgMastery >= 70 ? 'text-retroTeal' : avgMastery >= 40 ? 'text-schoolYellow-deep' : totalConcepts > 0 ? 'text-red-600' : 'text-brutalBlack'
            }`}>
              {totalConcepts > 0 ? `${avgMastery}%` : '—'}
            </p>
          </div>
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-xs font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              Diagnostics Run
            </div>
            <p className="font-mono text-4xl font-black text-brutalBlack mt-4">{totalDiagnostics}</p>
          </div>
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-xs font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              Gaps Fixed
            </div>
            <p className="font-mono text-4xl font-black text-retroTeal mt-4">{totalStacksCompleted}</p>
          </div>
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between">
            <div className="font-mono text-xs font-black uppercase text-neutral-600 bg-paper-200 px-2 py-0.5 border-[1.5px] border-brutalBlack mx-auto w-fit">
              Indexed Concepts
            </div>
            <p className="font-mono text-4xl font-black text-brutalBlack mt-4">{totalConcepts}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── Left Column (8 cols): Today's Route ─── */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Recovery Stacks */}
            <div className="animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📍</span>
                <h2 className="text-xl font-black text-brutalBlack uppercase tracking-tight">Today's Route</h2>
              </div>

              {activeStacks.length > 0 ? (
                <div className="space-y-4">
                  {activeStacks.map((stack) => (
                    <Link
                      key={stack.id}
                      href={`/recovery/${stack.id}`}
                      className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform cursor-pointer"
                    >
                      <div className="min-w-0 flex-1 space-y-1.5 mb-3 sm:mb-0">
                        <p className="text-lg font-black text-brutalBlack group-hover:text-retroTeal-dark transition-colors uppercase">
                          Fix: {stack.concept.name}
                        </p>
                        <p className="font-mono text-xs font-bold text-neutral-600 truncate uppercase">
                          {stack.concept.subtopic.topic.chapter.subject.name} // {stack.concept.subtopic.topic.chapter.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-mono text-xs font-black text-brutalBlack bg-schoolYellow px-2.5 py-1 border-[2px] border-brutalBlack uppercase shadow-brutal-sm">
                          ~{stack.estimatedMinutes} MIN
                        </span>
                        <span className="bg-brutalBlack text-white w-8 h-8 flex items-center justify-center font-black group-hover:bg-retroTeal transition-colors border-[2px] border-brutalBlack">
                          ➔
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-8 text-center">
                  <p className="font-mono text-sm font-bold text-neutral-600 uppercase mb-4">No active recovery stacks.</p>
                  <Link href="/topics" className="bg-brutalBlack text-white font-black px-6 py-3 border-[2.5px] border-brutalBlack shadow-brutal btn-brutal uppercase inline-block">
                    START A DIAGNOSTIC ➔
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Diagnostics */}
            {recentSessions.length > 0 && (
              <div className="animate-slide-up">
                <div className="flex items-center gap-2 mb-4 pt-2">
                  <span className="text-xl">🗂️</span>
                  <h2 className="text-xl font-black text-brutalBlack uppercase tracking-tight">Recent Diagnostics</h2>
                </div>
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/diagnostic/${session.topicId}/result?sessionId=${session.id}`}
                      className="bg-paper-100 border-[2.5px] border-brutalBlack p-4 flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-white transition-colors"
                    >
                      <div className="min-w-0 flex-1 mb-2 sm:mb-0">
                        <p className="text-base font-black text-brutalBlack group-hover:underline uppercase">
                          {session.topic.name}
                        </p>
                        <p className="font-mono text-[10px] font-bold text-neutral-500 uppercase mt-1">
                          {session.topic.chapter.subject.name} • {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-mono text-lg font-black flex-shrink-0 sm:ml-4 px-2 py-0.5 border-[2px] border-brutalBlack w-fit ${
                        session.overallScore >= 70 ? 'bg-retroTeal-soft text-retroTeal-dark' : session.overallScore >= 40 ? 'bg-schoolYellow text-brutalBlack' : 'bg-red-100 text-red-700'
                      }`}>
                        {session.overallScore}%
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right Column (4 cols): Weak Concepts + Recent Wins ─── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Weak Concepts */}
            {weakConcepts.length > 0 && (
              <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-red-500 border-l-[3px] border-brutalBlack"></div>
                <h3 className="text-sm font-black text-brutalBlack uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>⚠️</span> NEEDS ATTENTION
                </h3>
                <div className="space-y-4 pr-3">
                  {weakConcepts.map((ks) => (
                    <div key={ks.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-brutalBlack uppercase truncate pr-2">{ks.concept.name}</p>
                        <span className="font-mono text-[10px] font-black text-red-600 bg-red-50 px-1 border border-brutalBlack shrink-0">
                          {ks.masteryPercent}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-paper-200 border-[1.5px] border-brutalBlack p-[1px]">
                        <div
                          className="h-full bg-red-500 border border-brutalBlack"
                          style={{ width: `${ks.masteryPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Wins */}
            {completedStacks.length > 0 && (
              <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-retroTeal border-l-[3px] border-brutalBlack"></div>
                <h3 className="text-sm font-black text-brutalBlack uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🏆</span> RECENT FIXES
                </h3>
                <div className="space-y-3 pr-3">
                  {completedStacks.map((stack) => (
                    <div key={stack.id} className="flex items-center justify-between border-b-[1.5px] border-neutral-200 pb-2 last:border-0 last:pb-0">
                      <p className="text-xs font-black text-brutalBlack uppercase truncate flex-1">{stack.concept.name}</p>
                      <span className={`font-mono text-[10px] font-black px-1.5 py-0.5 border border-brutalBlack ml-2 ${
                        (stack.recheckScore ?? 0) >= 70 ? 'bg-retroTeal text-white' : 'bg-schoolYellow text-brutalBlack'
                      }`}>
                        {stack.recheckScore !== null ? `${stack.recheckScore}%` : '✓'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action */}
            <div className="bg-schoolYellow border-[3px] border-brutalBlack p-5 shadow-brutal text-center animate-slide-up">
              <p className="font-mono text-xs font-bold text-brutalBlack uppercase mb-3">Ready for precision learning?</p>
              <Link href="/topics" className="bg-brutalBlack hover:bg-neutral-800 text-white font-black text-sm px-4 py-3 border-[2.5px] border-brutalBlack shadow-brutal-sm btn-brutal uppercase block w-full">
                NEW DIAGNOSTIC ➔
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
