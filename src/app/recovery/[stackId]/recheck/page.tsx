import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { RecheckQuiz } from './RecheckQuiz';

interface PageProps {
  params: Promise<{ stackId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { stackId } = await params;
  const stack = await prisma.learningStack.findUnique({
    where: { id: stackId },
    include: { concept: true },
  });
  return {
    title: `Recheck: ${stack?.concept.name || 'Concept'} — Resourcify`,
  };
}

export default async function RecheckPage({ params }: PageProps) {
  const { stackId } = await params;

  const stack = await prisma.learningStack.findUnique({
    where: { id: stackId },
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
      diagnosticSession: true,
    },
  });

  if (!stack) notFound();

  // If already rechecked, show results directly
  if (stack.recheckScore !== null) {
    return (
      <div className="min-h-screen bg-pearl">
        <header className="bg-white border-b border-border">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href={`/recovery/${stackId}`}
              className="text-sm text-crimson hover:text-crimson-light transition-colors"
            >
              ← Back to Recovery Stack
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-crimson rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs font-[family-name:var(--font-serif)]">R</span>
              </div>
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12 text-center animate-fade-in">
          <span className="tag tag-crimson text-xs uppercase tracking-widest mb-3 inline-block">
            Recheck Complete
          </span>
          <h1 className="text-3xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-3">
            {stack.concept.name}
          </h1>

          <div className={`mono-number text-6xl font-bold my-8 ${
            stack.recheckScore >= 70 ? 'text-mastery-high' : stack.recheckScore >= 40 ? 'text-mastery-mid' : 'text-mastery-low'
          }`}>
            {stack.recheckScore}%
          </div>

          <p className="text-obsidian-subtle mb-8">
            {stack.recheckScore >= 70
              ? '🎉 Great work! The gap has been fixed. This concept is now mastered.'
              : stack.recheckScore >= 40
              ? '📈 Good progress! Consider reviewing the recovery stack once more.'
              : '🔄 Keep practicing. Review the explanation and try again.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/topics" className="btn-primary px-8 py-3">
              Diagnose Another Topic →
            </Link>
            <Link href="/progress" className="btn-secondary px-8 py-3">
              View Progress
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Get 3 recheck questions — same concept, different from diagnostic
  const diagnosticAttemptQuestionIds = await prisma.questionAttempt.findMany({
    where: { sessionId: stack.diagnosticSessionId },
    select: { questionId: true },
  });
  const usedIds = diagnosticAttemptQuestionIds.map((a) => a.questionId);

  // Also exclude practice questions already in the stack
  const practiceIds = JSON.parse(stack.practiceQuestionIds || '[]') as string[];
  const excludeIds = [...usedIds, ...practiceIds];

  let recheckQuestions = await prisma.question.findMany({
    where: {
      conceptId: stack.conceptId,
      id: { notIn: excludeIds },
    },
    take: 3,
    include: { concept: true },
  });

  // Fallback: if not enough fresh questions, allow reuse of practice questions
  if (recheckQuestions.length < 2) {
    recheckQuestions = await prisma.question.findMany({
      where: {
        conceptId: stack.conceptId,
        id: { notIn: usedIds },
      },
      take: 3,
      include: { concept: true },
    });
  }

  // Ultimate fallback: grab any questions for this concept
  if (recheckQuestions.length === 0) {
    recheckQuestions = await prisma.question.findMany({
      where: { conceptId: stack.conceptId },
      take: 3,
      include: { concept: true },
    });
  }

  const breadcrumb = `${stack.concept.subtopic.topic.chapter.subject.name} → ${stack.concept.subtopic.topic.chapter.name} → ${stack.concept.subtopic.topic.name}`;

  return (
    <div className="min-h-screen bg-pearl">
      {/* ─── Header ─── */}
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/recovery/${stackId}`}
            className="text-sm text-crimson hover:text-crimson-light transition-colors"
          >
            ← Back to Recovery Stack
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-crimson rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs font-[family-name:var(--font-serif)]">R</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* ─── Title ─── */}
        <div className="mb-8 animate-fade-in">
          <span className="tag tag-crimson text-xs uppercase tracking-widest mb-2 inline-block">
            Recheck Quiz
          </span>
          <h1 className="text-3xl font-bold text-obsidian font-[family-name:var(--font-serif)]">
            Verify: <span className="crimson-underline text-crimson">{stack.concept.name}</span>
          </h1>
          <p className="text-sm text-obsidian-subtle mt-2">
            {breadcrumb}
          </p>
          <p className="text-sm text-obsidian-subtle mt-1">
            Answer {recheckQuestions.length} questions to verify the fix worked. Score ≥70% to pass.
          </p>
        </div>

        <RecheckQuiz
          stackId={stackId}
          questions={recheckQuestions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            options: JSON.parse(q.options) as string[],
            correctOptionIndex: q.correctOptionIndex,
            conceptName: q.concept.name,
          }))}
        />
      </main>
    </div>
  );
}
