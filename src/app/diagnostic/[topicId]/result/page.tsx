import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { DEMO_USER_ID } from '@/types';
import { GenerateStackButton } from './GenerateStackButton';

interface PageProps {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ sessionId?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  return {
    title: `Gap Analysis: ${topic?.name || 'Topic'} — Resourcify`,
  };
}

export default async function ResultPage({ params, searchParams }: PageProps) {
  const { topicId } = await params;
  const { sessionId } = await searchParams;

  if (!sessionId) redirect(`/diagnostic/${topicId}`);

  const session = await prisma.diagnosticSession.findUnique({
    where: { id: sessionId },
    include: {
      topic: {
        include: { chapter: { include: { subject: true } } },
      },
    },
  });

  if (!session) notFound();

  // Get question attempts for this session
  const attempts = await prisma.questionAttempt.findMany({
    where: { sessionId },
    include: {
      question: {
        include: { concept: { include: { subtopic: true } } },
      },
    },
  });

  const masteredConcepts = JSON.parse(session.masteredConcepts || '[]') as string[];
  const weakConcepts = JSON.parse(session.weakConcepts || '[]') as string[];
  const rootCause = JSON.parse(session.rootCause || '[]') as string[];
  const errorTypes = JSON.parse(session.errorType || '[]') as string[];

  // Check if a learning stack already exists for this session
  const existingStack = await prisma.learningStack.findFirst({
    where: { diagnosticSessionId: sessionId },
  });

  const scoreColor =
    session.overallScore >= 70
      ? 'text-mastery-high'
      : session.overallScore >= 40
      ? 'text-mastery-mid'
      : 'text-mastery-low';

  return (
    <div className="min-h-screen bg-pearl">
      {/* ─── Header ─── */}
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/topics" className="text-sm text-crimson hover:text-crimson-light transition-colors">
            ← Back to Topics
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-crimson rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs font-[family-name:var(--font-serif)]">R</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* ─── Title ─── */}
        <div className="mb-8 animate-fade-in">
          <span className="tag tag-crimson text-xs uppercase tracking-widest mb-2 inline-block">
            Gap Analysis
          </span>
          <h1 className="text-3xl font-bold text-obsidian font-[family-name:var(--font-serif)]">
            {session.topic.name} — <span className="crimson-underline text-crimson">Diagnosis</span>
          </h1>
          <p className="text-sm text-obsidian-subtle mt-2">
            {session.topic.chapter.subject.name} → {session.topic.chapter.name} → {session.topic.name}
          </p>
        </div>

        {/* ─── Score + Confidence ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Score</p>
            <p className={`mono-number text-4xl font-bold ${scoreColor}`}>
              {session.overallScore}%
            </p>
            <p className="text-xs text-obsidian-subtle mt-1">
              {attempts.filter((a) => a.isCorrect).length}/{attempts.length} correct
            </p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Confidence</p>
            <p className="mono-number text-4xl font-bold text-obsidian">
              {Math.round(session.confidence * 100)}%
            </p>
            <p className="text-xs text-obsidian-subtle mt-1">diagnosis reliability</p>
          </div>
          <div className="card-elevated p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-1">Error Type</p>
            <p className="text-sm font-semibold text-crimson mt-2">
              {errorTypes[0] || 'Not determined'}
            </p>
          </div>
        </div>

        {/* ─── Question-by-Question Breakdown ─── */}
        <div className="card-elevated p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)] mb-4">
            Question Breakdown
          </h2>
          <div className="space-y-3">
            {attempts.map((attempt, i) => (
              <div
                key={attempt.id}
                className={`flex items-start gap-4 p-4 rounded-lg ${
                  attempt.isCorrect ? 'bg-green-50' : 'bg-crimson-50'
                }`}
              >
                <span
                  className={`mono-number text-sm font-bold flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    attempt.isCorrect
                      ? 'bg-mastery-high text-white'
                      : 'bg-crimson text-white'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-obsidian mb-1">
                    {attempt.question.concept.name}
                  </p>
                  <p className="text-xs text-obsidian-subtle truncate">
                    {attempt.question.prompt}
                  </p>
                  {!attempt.isCorrect && attempt.question.commonMisconception && (
                    <p className="text-xs text-crimson mt-1 italic">
                      💡 {attempt.question.commonMisconception}
                    </p>
                  )}
                </div>
                <span className="text-sm flex-shrink-0">
                  {attempt.isCorrect ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Conceptual Gap Analysis ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Weak Concepts */}
          {weakConcepts.length > 0 && (
            <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-base font-bold text-crimson font-[family-name:var(--font-serif)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-crimson" />
                Weak Concepts
              </h2>
              <ul className="space-y-2">
                {weakConcepts.map((concept, i) => (
                  <li key={i} className="text-sm text-obsidian flex items-start gap-2">
                    <span className="text-crimson mt-0.5">—</span>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mastered Concepts */}
          {masteredConcepts.length > 0 && (
            <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <h2 className="text-base font-bold text-mastery-high font-[family-name:var(--font-serif)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mastery-high" />
                Mastered Concepts
              </h2>
              <ul className="space-y-2">
                {masteredConcepts.map((concept, i) => (
                  <li key={i} className="text-sm text-obsidian flex items-start gap-2">
                    <span className="text-mastery-high mt-0.5">✓</span>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ─── Root Cause Analysis ─── */}
        {rootCause.length > 0 && (
          <div className="card-elevated p-6 mb-8 border-l-4 border-l-crimson animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-base font-bold text-obsidian font-[family-name:var(--font-serif)] mb-2">
              🔍 Root Cause — Prerequisite Gaps
            </h2>
            <p className="text-sm text-obsidian-subtle mb-3">
              Your weakness may stem from gaps in these foundational concepts:
            </p>
            <div className="flex flex-wrap gap-2">
              {rootCause.map((concept, i) => (
                <span key={i} className="tag tag-crimson">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── CTA: Fix This Now ─── */}
        <div className="text-center py-8 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          {existingStack ? (
            <Link
              href={`/recovery/${existingStack.id}`}
              className="btn-primary text-base px-10 py-3.5 inline-block"
            >
              Continue Recovery Stack →
            </Link>
          ) : (
            <GenerateStackButton sessionId={sessionId} topicId={topicId} />
          )}
          <p className="text-xs text-obsidian-subtle mt-3">
            We&apos;ll build a personalized recovery plan to fix your specific gaps.
          </p>
        </div>
      </main>
    </div>
  );
}
