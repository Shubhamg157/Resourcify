import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { FormulaCard } from '@/types';
import { PracticeSection } from './PracticeSection';
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
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ─── Persistent Action Bar (Sticky) ─── */}
      <div className="bg-schoolYellow border-b-[3px] border-brutalBlack sticky top-0 z-40 shadow-brutal-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href={`/diagnostic/${stack.diagnosticSession.topicId}/result?sessionId=${stack.diagnosticSessionId}`}
            className="font-mono text-xs font-black text-brutalBlack hover:underline uppercase flex items-center gap-1"
          >
            <span>←</span> ABORT TO DIAGNOSIS
          </Link>
          <div className="flex items-center gap-3">
            <span className="bg-white font-mono text-[10px] font-black px-2 py-0.5 border-[1.5px] border-brutalBlack uppercase">
              T-{stack.estimatedMinutes} MIN
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* ─── Title & Header ─── */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 bg-red-500 border-l-[3px] border-b-[3px] border-brutalBlack px-4 py-1.5 font-mono text-xs font-black text-white uppercase tracking-wider">
            ACTIVE RECOVERY STACK
          </div>
          <div className="max-w-3xl space-y-3 mt-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[10px] font-black bg-paper-200 px-2 py-0.5 border border-brutalBlack uppercase">
                {stack.concept.subtopic.topic.chapter.subject.name} // {stack.concept.subtopic.topic.chapter.name} // {stack.concept.subtopic.topic.name}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brutalBlack tracking-tight leading-tight">
              FIX: <span className="underline decoration-red-500 decoration-[4px] underline-offset-4">{stack.concept.name}</span>
            </h1>
          </div>
        </section>

        {/* ─── Progress Steps Ribbon ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {['Explanation', 'Formulas', 'Resource', 'Practice', 'Recheck'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 border-[2px] border-brutalBlack shadow-brutal-sm">
                <span className="font-mono text-xs text-white bg-brutalBlack px-1.5 py-0.5">
                  0{i + 1}
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-brutalBlack">{step}</span>
              </div>
              {i < 4 && <span className="text-brutalBlack font-black text-lg">➔</span>}
            </div>
          ))}
        </div>

        {/* ─── Step 1: Explanation ─── */}
        <section className="bg-white border-[3px] border-brutalBlack shadow-brutal animate-slide-up" id="explanation">
          <div className="bg-paper-200 border-b-[3px] border-brutalBlack px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-brutalBlack text-white px-2 py-1 font-black shadow-brutal-sm">01</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-brutalBlack">
                Concept Break-Down
              </h2>
            </div>
            <span className="font-mono text-[10px] font-black uppercase border-[1.5px] border-brutalBlack px-2 py-0.5 bg-white hidden sm:block">
              ~5 MIN READ
            </span>
          </div>
          <div className="p-6 sm:p-8 prose prose-brutal max-w-none font-serif text-lg leading-relaxed">
            {stack.explanationText.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h4 key={i} className="font-sans font-black text-brutalBlack uppercase text-base mt-6 mb-2 bg-schoolYellow inline-block px-2 border-l-[4px] border-brutalBlack">
                    {paragraph.replace(/\*\*/g, '')}
                  </h4>
                );
              }
              if (paragraph.trim() === '') return <br key={i} />;
              return (
                <p key={i} className="text-brutalBlack font-medium mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </section>

        {/* ─── Step 2: Formula Card ─── */}
        <section className="bg-white border-[3px] border-brutalBlack shadow-brutal animate-slide-up" style={{ animationDelay: '0.1s' }} id="formulas">
          <div className="bg-retroTeal border-b-[3px] border-brutalBlack px-5 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-white text-retroTeal px-2 py-1 font-black shadow-brutal-sm">02</span>
              <h2 className="text-xl font-black uppercase tracking-tight">
                {formulaCard.title || 'Key Formulas'}
              </h2>
            </div>
            <span className="font-mono text-[10px] font-black uppercase border-[1.5px] border-white px-2 py-0.5 text-white hidden sm:block">
              ~2 MIN
            </span>
          </div>
          <div className="p-6 sm:p-8 space-y-6 bg-paper-100">
            {formulaCard.formulas?.map((formula, i) => (
              <div key={i} className="bg-white border-[2.5px] border-brutalBlack p-5 shadow-brutal-sm">
                <div className="font-mono text-xl sm:text-2xl font-black text-retroTeal-dark bg-paper-200 px-3 py-2 border-[2px] border-brutalBlack mb-4 inline-block shadow-brutal-sm">
                  {formula.expression}
                </div>
                <p className="font-serif text-base font-bold text-brutalBlack mb-3">{formula.description}</p>
                
                <div className="space-y-2">
                  {formula.conditions && (
                    <div className="flex items-start gap-2 bg-schoolYellow/30 p-2 border-l-[3px] border-schoolYellow-deep">
                      <span className="font-mono text-[10px] font-black uppercase pt-0.5">WHEN:</span>
                      <span className="text-sm font-semibold">{formula.conditions}</span>
                    </div>
                  )}
                  {formula.commonMistake && (
                    <div className="flex items-start gap-2 bg-red-100 p-2 border-l-[3px] border-red-500 text-red-900">
                      <span className="font-mono text-[10px] font-black uppercase pt-0.5 shrink-0">⚠️ TRAP:</span>
                      <span className="text-sm font-semibold">{formula.commonMistake}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {formulaCard.tips && formulaCard.tips.length > 0 && (
              <div className="mt-8 pt-6 border-t-[3px] border-dashed border-brutalBlack">
                <p className="font-mono text-xs font-black uppercase tracking-wider text-brutalBlack mb-4 flex items-center gap-2">
                  <span className="text-lg">💡</span> Tactical Tips
                </p>
                <ul className="space-y-3">
                  {formulaCard.tips.map((tip, i) => (
                    <li key={i} className="text-sm font-bold text-brutalBlack flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-brutalBlack rounded-full mt-1.5 shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ─── Step 3: Resource ─── */}
        <section className="bg-white border-[3px] border-brutalBlack shadow-brutal animate-slide-up" style={{ animationDelay: '0.2s' }} id="resource">
          <div className="bg-kraftBrown border-b-[3px] border-brutalBlack px-5 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-white text-kraftBrown px-2 py-1 font-black shadow-brutal-sm">03</span>
              <h2 className="text-xl font-black uppercase tracking-tight">
                Recommended Resource
              </h2>
            </div>
            {stack.resource && (
              <span className="font-mono text-[10px] font-black uppercase border-[1.5px] border-white px-2 py-0.5 text-white hidden sm:block">
                ~{Math.ceil(stack.resource.durationSeconds / 60)} MIN
              </span>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {stack.resource ? (
              <div className="bg-paper-200 border-[2.5px] border-brutalBlack p-6 shadow-brutal">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="font-mono text-[10px] font-black bg-white px-2 py-0.5 border border-brutalBlack uppercase">
                        {stack.resource.type.replace(/_/g, ' ')}
                      </span>
                      {!stack.resource.verified && (
                        <span className="font-mono text-[10px] font-black bg-red-200 text-red-900 px-2 py-0.5 border border-red-900 uppercase">
                          ⚠️ UNVERIFIED SOURCE
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-brutalBlack mb-2 uppercase leading-tight">
                      {stack.resource.title}
                    </h3>
                    <p className="font-mono text-xs font-bold text-neutral-600 uppercase">
                      SOURCE: {stack.resource.source} // {Math.ceil(stack.resource.durationSeconds / 60)} MIN
                      {stack.resource.language !== 'en' && ` // ${stack.resource.language}`}
                    </p>
                  </div>
                  
                  {stack.resource.url && (
                    <a
                      href={stack.resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-brutalBlack text-white hover:bg-neutral-800 font-mono text-xs font-black uppercase px-6 py-3 border-[2px] border-brutalBlack shadow-brutal-sm transition-colors text-center"
                    >
                      OPEN MODULE ↗
                    </a>
                  )}
                </div>
                {!stack.resource.url && (
                  <div className="mt-4 bg-schoolYellow/30 border-l-[3px] border-schoolYellow-deep p-3 font-mono text-xs font-bold">
                    [OFFLINE RESOURCE] Check your physical study material collection for this reference.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-paper-200 border-[2.5px] border-brutalBlack p-6 shadow-brutal-sm text-center">
                <p className="font-mono text-sm font-bold text-neutral-600 uppercase">
                  No specific external resource mapped. Focus on the explanation and practice modules.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── Step 4: Practice ─── */}
        <section className="bg-white border-[3px] border-brutalBlack shadow-brutal animate-slide-up" style={{ animationDelay: '0.3s' }} id="practice">
          <div className="bg-brutalBlack border-b-[3px] border-brutalBlack px-5 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-schoolYellow text-brutalBlack px-2 py-1 font-black shadow-brutal-sm">04</span>
              <h2 className="text-xl font-black uppercase tracking-tight">
                Practice Probes
              </h2>
            </div>
            <span className="font-mono text-[10px] font-black uppercase border-[1.5px] border-white px-2 py-0.5 text-white hidden sm:block">
              ~{practiceQuestions.length * 2} MIN
            </span>
          </div>

          <div className="p-6 sm:p-8 bg-paper-100">
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
          </div>
        </section>

        {/* ─── Step 5: Recheck CTA ─── */}
        <section className="bg-schoolYellow border-[3px] border-brutalBlack p-8 shadow-brutal text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <span className="font-mono text-sm bg-white text-brutalBlack px-3 py-1 font-black shadow-brutal-sm border-[2px] border-brutalBlack mb-4 inline-block">05</span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-brutalBlack mb-3">
            VERIFY REPAIR
          </h2>
          <p className="font-mono text-sm font-bold text-neutral-800 mb-6 uppercase">
            Done reviewing? Let's test if the intuition fix holds under pressure.
          </p>
          <Link
            href={`/recovery/${stackId}/recheck`}
            className="bg-brutalBlack text-white hover:bg-neutral-800 font-black text-lg px-8 py-4 border-[3px] border-brutalBlack shadow-brutal transition-colors btn-brutal uppercase inline-flex items-center gap-3"
          >
            <span>COMMENCE RECHECK</span>
            <span className="text-2xl leading-none font-black">➔</span>
          </Link>
        </section>
        
      </main>
    </div>
  );
}
