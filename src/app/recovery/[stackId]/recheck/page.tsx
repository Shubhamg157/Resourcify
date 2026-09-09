import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { RecheckQuiz } from './RecheckQuiz';
import { Header } from '@/components/Header';

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
    title: `Recheck: ${stack?.concept.name || 'Concept'} — GapZero`,
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
    const passed = stack.recheckScore >= 70;
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="bg-schoolYellow border-b-[3px] border-brutalBlack sticky top-0 z-40 shadow-brutal-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Link
              href={`/recovery/${stackId}`}
              className="font-mono text-xs font-black text-brutalBlack hover:underline uppercase flex items-center gap-1"
            >
              <span>←</span> BACK TO RECOVERY STACK
            </Link>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow flex flex-col justify-center">
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-8 sm:p-12 text-center relative overflow-hidden max-w-3xl mx-auto w-full">
            <div className={`absolute top-0 right-0 border-l-[3px] border-b-[3px] border-brutalBlack px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider ${passed ? 'bg-retroTeal text-white' : 'bg-red-500 text-white'}`}>
              {passed ? 'VERIFICATION SUCCESS' : 'VERIFICATION FAILED'}
            </div>

            <span className="font-mono text-xs font-black uppercase tracking-widest mb-4 mt-6 inline-block bg-paper-200 border border-brutalBlack px-2 py-0.5">
              RECHECK AUDIT COMPLETE
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-black text-brutalBlack uppercase tracking-tight mb-4">
              {stack.concept.name}
            </h1>

            <div className={`font-mono text-6xl sm:text-8xl font-black tracking-tight my-6 ${
              passed ? 'text-retroTeal' : stack.recheckScore >= 40 ? 'text-schoolYellow-deep' : 'text-red-600'
            }`}>
              {stack.recheckScore}%
            </div>

            {passed ? (
              <div className="bg-retroTeal-soft border-[2.5px] border-retroTeal-dark text-retroTeal-dark p-5 mt-4 mb-8 text-left max-w-xl mx-auto shadow-brutal-sm">
                <p className="font-black text-base uppercase tracking-tight mb-1 flex items-center gap-2">
                  <span>🎉</span> CONCEPTUAL GAP FIXED
                </p>
                <p className="font-mono text-xs font-bold uppercase">
                  Great work! The gap has been fixed. This concept is now marked as mastered in your knowledge graph.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border-[2.5px] border-red-500 text-red-900 p-5 mt-4 mb-8 text-left max-w-xl mx-auto shadow-brutal-sm">
                <p className="font-black text-base uppercase tracking-tight mb-1 flex items-center gap-2">
                  <span>⚠️</span> REPAIR INCOMPLETE
                </p>
                <p className="font-mono text-xs font-bold uppercase">
                  {stack.recheckScore >= 40 
                    ? 'Good progress! However, the intuition is still shaky. Consider reviewing the recovery stack once more.'
                    : 'Keep practicing. Your intuition needs a structural repair. Review the explanation and try again.'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/topics" className="w-full sm:w-auto bg-brutalBlack text-white hover:bg-neutral-800 font-black px-8 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal uppercase text-sm">
                DIAGNOSE ANOTHER TOPIC ➔
              </Link>
              <Link href="/progress" className="w-full sm:w-auto bg-white text-brutalBlack hover:bg-paper-200 font-black px-8 py-4 border-[3px] border-brutalBlack shadow-brutal btn-brutal uppercase text-sm">
                VIEW PROGRESS LOG
              </Link>
            </div>
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

  const breadcrumb = `${stack.concept.subtopic.topic.chapter.subject.name} // ${stack.concept.subtopic.topic.chapter.name} // ${stack.concept.subtopic.topic.name}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-schoolYellow border-b-[3px] border-brutalBlack sticky top-0 z-40 shadow-brutal-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href={`/recovery/${stackId}`}
            className="font-mono text-xs font-black text-brutalBlack hover:underline uppercase flex items-center gap-1"
          >
            <span>←</span> ABORT TO RECOVERY STACK
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
        {/* ─── Title ─── */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 bg-retroTeal border-l-[3px] border-b-[3px] border-brutalBlack px-4 py-1.5 font-mono text-xs font-black text-white uppercase tracking-wider">
            RECHECK PROTOCOL
          </div>
          <div className="max-w-3xl space-y-3 mt-4">
            <span className="font-mono text-[10px] font-black bg-paper-200 px-2 py-0.5 border border-brutalBlack uppercase">
              {breadcrumb}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-brutalBlack tracking-tight leading-tight uppercase">
              VERIFY: <span className="underline decoration-retroTeal decoration-[4px] underline-offset-4">{stack.concept.name}</span>
            </h1>
            <p className="font-mono text-xs font-bold text-neutral-800 uppercase mt-2">
              Answer {recheckQuestions.length} probes to verify the fix. Score ≥70% to pass.
            </p>
          </div>
        </section>

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
