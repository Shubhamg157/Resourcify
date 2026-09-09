import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { FormulaCard } from '@/types';
import { PracticeSection } from './PracticeSection';

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
    title: `Recovery: ${stack?.concept.name || 'Stack'} — GapZero`,
  };
}

export default async function RecoveryPage({ params }: PageProps) {
  const { stackId } = await params;

  const stack = await prisma.learningStack.findUnique({
    where: { id: stackId },
    include: {
      concept: { include: { subtopic: { include: { topic: { include: { chapter: { include: { subject: true } } } } } } } },
      resource: true,
      diagnosticSession: true,
    },
  });

  if (!stack) notFound();

  const formulaCard: FormulaCard = JSON.parse(stack.formulaCardJson || '{}');
  const practiceQuestionIds = JSON.parse(stack.practiceQuestionIds || '[]') as string[];

  // Fetch practice questions
  const practiceQuestions = await prisma.question.findMany({
    where: { id: { in: practiceQuestionIds } },
    include: { concept: true },
  });

  return (
    <div className="min-h-screen bg-pearl">
      {/* ─── Header ─── */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/diagnostic/${stack.diagnosticSession.topicId}/result?sessionId=${stack.diagnosticSessionId}`}
            className="text-sm text-crimson hover:text-crimson-light transition-colors"
          >
            ← Back to Diagnosis
          </Link>
          <div className="flex items-center gap-3">
            <span className="mono-number text-xs text-sand bg-sand-50 px-3 py-1 rounded-full">
              ~{stack.estimatedMinutes} min
            </span>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-crimson rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs font-[family-name:var(--font-serif)]">G</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* ─── Title ─── */}
        <div className="mb-8 animate-fade-in">
          <span className="tag tag-crimson text-xs uppercase tracking-widest mb-2 inline-block">
            Recovery Stack
          </span>
          <h1 className="text-3xl font-bold text-obsidian font-[family-name:var(--font-serif)]">
            Fix: <span className="crimson-underline text-crimson">{stack.concept.name}</span>
          </h1>
          <p className="text-sm text-obsidian-subtle mt-2">
            {stack.concept.subtopic.topic.chapter.subject.name} → {stack.concept.subtopic.topic.chapter.name} → {stack.concept.subtopic.topic.name}
          </p>
        </div>

        {/* ─── Progress Steps ─── */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {['Explanation', 'Formulas', 'Resource', 'Practice', 'Recheck'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="mono-number text-xs text-crimson font-bold bg-crimson-50 w-6 h-6 rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-xs font-medium text-obsidian">{step}</span>
              </div>
              {i < 4 && <span className="text-pearl-dark text-xs">→</span>}
            </div>
          ))}
        </div>

        {/* ─── Step 1: Explanation ─── */}
        <section className="card-elevated p-6 mb-6 animate-slide-up" id="explanation">
          <div className="flex items-center gap-2 mb-4">
            <span className="mono-number text-xs text-crimson font-bold bg-crimson-50 w-6 h-6 rounded-full flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)]">
              Understanding the Concept
            </h2>
            <span className="tag tag-sand text-xs ml-auto">~5 min read</span>
          </div>
          <div className="prose prose-sm max-w-none ruled-line">
            {stack.explanationText.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={i} className="font-semibold text-crimson text-sm mt-4 mb-1">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (paragraph.trim() === '') return <br key={i} />;
              return (
                <p key={i} className="text-sm text-obsidian leading-relaxed mb-3">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </section>

        {/* ─── Step 2: Formula Card ─── */}
        <section className="card-elevated p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }} id="formulas">
          <div className="flex items-center gap-2 mb-4">
            <span className="mono-number text-xs text-crimson font-bold bg-crimson-50 w-6 h-6 rounded-full flex items-center justify-center">
              2
            </span>
            <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)]">
              {formulaCard.title || 'Key Formulas'}
            </h2>
            <span className="tag tag-sand text-xs ml-auto">~2 min</span>
          </div>

          <div className="space-y-4">
            {formulaCard.formulas?.map((formula, i) => (
              <div key={i} className="bg-pearl rounded-lg p-4 border border-border">
                <p className="mono-number text-base font-bold text-crimson mb-1">
                  {formula.expression}
                </p>
                <p className="text-sm text-obsidian mb-2">{formula.description}</p>
                {formula.conditions && (
                  <p className="text-xs text-sand-dark">
                    <span className="font-semibold">When to use:</span> {formula.conditions}
                  </p>
                )}
                {formula.commonMistake && (
                  <p className="text-xs text-crimson-600 mt-1">
                    ⚠️ {formula.commonMistake}
                  </p>
                )}
              </div>
            ))}
          </div>

          {formulaCard.tips && formulaCard.tips.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs uppercase tracking-widest text-obsidian-subtle mb-2 font-semibold">Quick Tips</p>
              <ul className="space-y-1">
                {formulaCard.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-obsidian flex items-start gap-2">
                    <span className="text-sand mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ─── Step 3: Resource ─── */}
        <section className="card-elevated p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }} id="resource">
          <div className="flex items-center gap-2 mb-4">
            <span className="mono-number text-xs text-crimson font-bold bg-crimson-50 w-6 h-6 rounded-full flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)]">
              Recommended Resource
            </h2>
            {stack.resource && (
              <span className="tag tag-sand text-xs ml-auto">
                ~{Math.ceil(stack.resource.durationSeconds / 60)} min
              </span>
            )}
          </div>

          {stack.resource ? (
            <div className="bg-pearl rounded-lg p-5 border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="tag tag-sand text-xs">{stack.resource.type.replace(/_/g, ' ')}</span>
                    {!stack.resource.verified && (
                      <span className="tag tag-unverified text-xs">⚠️ UNVERIFIED</span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-obsidian mb-1">
                    {stack.resource.title}
                  </h3>
                  <p className="text-xs text-obsidian-subtle">
                    Source: {stack.resource.source} · {Math.ceil(stack.resource.durationSeconds / 60)} min
                    {stack.resource.language !== 'en' && ` · ${stack.resource.language}`}
                  </p>
                </div>
              </div>
              {stack.resource.url && (
                <a
                  href={stack.resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs mt-4 inline-block"
                >
                  Open Resource ↗
                </a>
              )}
              {!stack.resource.url && (
                <p className="text-xs text-obsidian-subtle mt-3 italic">
                  This is an offline resource. Check your study material collection.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-obsidian-subtle">
              No specific resource available for this concept. Focus on the explanation and practice.
            </p>
          )}
        </section>

        {/* ─── Step 4: Practice ─── */}
        <section className="card-elevated p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }} id="practice">
          <div className="flex items-center gap-2 mb-4">
            <span className="mono-number text-xs text-crimson font-bold bg-crimson-50 w-6 h-6 rounded-full flex items-center justify-center">
              4
            </span>
            <h2 className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)]">
              Practice Questions
            </h2>
            <span className="tag tag-sand text-xs ml-auto">~{practiceQuestions.length * 2} min</span>
          </div>

          <PracticeSection
            questions={practiceQuestions.map((q) => ({
              id: q.id,
              prompt: q.prompt,
              options: JSON.parse(q.options) as string[],
              correctOptionIndex: q.correctOptionIndex,
              conceptName: q.concept.name,
              commonMisconception: q.commonMisconception,
            }))}
          />
        </section>

        {/* ─── Step 5: Recheck CTA ─── */}
        <div className="text-center py-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-obsidian-subtle mb-4">
            Done reviewing? Let&apos;s verify the fix worked.
          </p>
          <Link
            href={`/recovery/${stackId}/recheck`}
            className="btn-primary text-base px-10 py-3.5 inline-block"
          >
            Ready for Recheck →
          </Link>
        </div>
      </main>
    </div>
  );
}
