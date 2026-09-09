import { prisma } from '@/lib/db';
import Link from 'next/link';
import { DEMO_USER_ID } from '@/types';

export const metadata = {
  title: 'Dashboard — Resourcify',
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
            <Link href="/topics" className="text-sm text-obsidian-subtle hover:text-obsidian transition-colors">
              Topics
            </Link>
            <Link href="/progress" className="text-sm text-obsidian-subtle hover:text-obsidian transition-colors">
              Progress
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* ─── Welcome ─── */}
        <div className="mb-8 animate-fade-in">
          <span className="tag tag-sand text-xs uppercase tracking-widest mb-2 inline-block">Dashboard</span>
          <h1 className="text-3xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-2">
            Welcome <span className="crimson-underline text-crimson">Back</span>
          </h1>
          <p className="text-sm text-obsidian-subtle">
            {activeStacks.length > 0
              ? `You have ${activeStacks.length} active recovery stack${activeStacks.length > 1 ? 's' : ''} (~${totalActiveMinutes} min remaining).`
              : 'Start a diagnostic to find your conceptual gaps.'}
          </p>
        </div>

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Mastery</p>
            <p className={`mono-number text-3xl font-bold ${
              avgMastery >= 70 ? 'text-mastery-high' : avgMastery >= 40 ? 'text-mastery-mid' : totalConcepts > 0 ? 'text-mastery-low' : 'text-obsidian'
            }`}>
              {totalConcepts > 0 ? `${avgMastery}%` : '—'}
            </p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Diagnostics</p>
            <p className="mono-number text-3xl font-bold text-obsidian">{totalDiagnostics}</p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Gaps Fixed</p>
            <p className="mono-number text-3xl font-bold text-mastery-high">{totalStacksCompleted}</p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Concepts</p>
            <p className="mono-number text-3xl font-bold text-obsidian">{totalConcepts}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left Column: Today's Route ─── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Recovery Stacks */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-crimson" />
                Today&apos;s Route
              </h2>

              {activeStacks.length > 0 ? (
                <div className="space-y-3">
                  {activeStacks.map((stack) => (
                    <Link
                      key={stack.id}
                      href={`/recovery/${stack.id}`}
                      className="card p-5 flex items-center justify-between group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-obsidian group-hover:text-crimson transition-colors">
                          Fix: {stack.concept.name}
                        </p>
                        <p className="text-xs text-obsidian-subtle truncate">
                          {stack.concept.subtopic.topic.chapter.subject.name} → {stack.concept.subtopic.topic.chapter.name} → {stack.concept.subtopic.topic.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="mono-number text-xs text-sand bg-sand-50 px-2.5 py-1 rounded-full">
                          ~{stack.estimatedMinutes} min
                        </span>
                        <span className="text-crimson text-sm group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="card-elevated p-8 text-center">
                  <p className="text-sm text-obsidian-subtle mb-4">No active recovery stacks.</p>
                  <Link href="/topics" className="btn-primary px-6 py-2.5">
                    Start a Diagnostic →
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Diagnostics */}
            {recentSessions.length > 0 && (
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)] mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sand" />
                  Recent Diagnostics
                </h2>
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/diagnostic/${session.topicId}/result?sessionId=${session.id}`}
                      className="card p-4 flex items-center justify-between group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-obsidian group-hover:text-crimson transition-colors truncate">
                          {session.topic.name}
                        </p>
                        <p className="text-xs text-obsidian-subtle">
                          {session.topic.chapter.subject.name} · {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`mono-number text-lg font-bold flex-shrink-0 ml-4 ${
                        session.overallScore >= 70 ? 'text-mastery-high' : session.overallScore >= 40 ? 'text-mastery-mid' : 'text-mastery-low'
                      }`}>
                        {session.overallScore}%
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right Column: Weak Concepts + Recent Wins ─── */}
          <div className="space-y-6">
            {/* Weak Concepts */}
            {weakConcepts.length > 0 && (
              <div className="card-elevated p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <h3 className="text-base font-bold text-crimson font-[family-name:var(--font-serif)] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mastery-low" />
                  Needs Attention
                </h3>
                <div className="space-y-2.5">
                  {weakConcepts.map((ks) => (
                    <div key={ks.id} className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-obsidian truncate">{ks.concept.name}</p>
                        <p className="text-xs text-obsidian-subtle truncate">
                          {ks.concept.subtopic.topic.chapter.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <div className="w-12 h-1.5 rounded-full bg-pearl-dark overflow-hidden">
                          <div
                            className="h-full rounded-full bg-mastery-low transition-all"
                            style={{ width: `${ks.masteryPercent}%` }}
                          />
                        </div>
                        <span className="mono-number text-xs text-mastery-low font-bold w-7 text-right">
                          {ks.masteryPercent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Wins */}
            {completedStacks.length > 0 && (
              <div className="card-elevated p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                <h3 className="text-base font-bold text-mastery-high font-[family-name:var(--font-serif)] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mastery-high" />
                  Recent Fixes
                </h3>
                <div className="space-y-2.5">
                  {completedStacks.map((stack) => (
                    <div key={stack.id} className="flex items-center justify-between">
                      <p className="text-sm text-obsidian truncate flex-1">{stack.concept.name}</p>
                      <span className={`mono-number text-xs font-bold flex-shrink-0 ml-3 ${
                        (stack.recheckScore ?? 0) >= 70 ? 'text-mastery-high' : 'text-mastery-mid'
                      }`}>
                        {stack.recheckScore !== null ? `${stack.recheckScore}%` : '✓'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action */}
            <div className="card-elevated p-5 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm text-obsidian-subtle mb-3">Ready for precision learning?</p>
              <Link href="/topics" className="btn-primary px-6 py-2.5 w-full inline-block text-center">
                New Diagnostic →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
