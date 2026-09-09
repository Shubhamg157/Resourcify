import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { GenerateStackButton } from './GenerateStackButton';

interface PageProps {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ sessionId?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  return {
    title: `Gap Analysis: ${topic?.name || 'Topic'} — GapZero`,
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

  const isCritical = session.overallScore < 60;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
        {/* ─── Top Context & Metadata Ribbon ─── */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[2.5px] border-brutalBlack pb-4 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black bg-kraftBrown text-white px-2.5 py-1 border-[2px] border-brutalBlack shadow-brutal-sm uppercase">
              {session.topic.chapter.subject.name} // {session.topic.chapter.name}
            </span>
            <span className="font-mono text-xs font-bold text-neutral-600 bg-paper-200 px-2.5 py-1 border-[2px] border-brutalBlack uppercase">
              ARCHIVE REF: #{sessionId.slice(-8)}
            </span>
            <span className={`font-mono text-xs font-bold px-2.5 py-1 border-[2px] border-brutalBlack shadow-brutal-sm uppercase ${isCritical ? 'bg-red-200 text-red-900' : 'bg-schoolYellow text-brutalBlack'}`}>
              {isCritical ? 'LEVEL 3 — CRITICAL DEFECT' : 'LEVEL 2 — APPLICATION GAP'}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-neutral-600 uppercase">
            TARGET: JEE ADVANCED PROTOCOL
          </div>
        </section>

        {/* ─── Main Title Card / Editorial Problem Statement ─── */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 bg-schoolYellow border-l-[3px] border-b-[3px] border-brutalBlack px-4 py-1.5 font-mono text-xs font-black uppercase tracking-wider">
            EVALUATIVE DIAGNOSIS REPORT
          </div>
          <div className="max-w-4xl space-y-3 mt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brutalBlack tracking-tight leading-tight">
              {session.topic.name} <span className="bg-schoolYellow px-2 py-0.5 border-[2px] border-brutalBlack shadow-brutal-sm inline-block">Analysis</span>
            </h1>
            <p className="text-base sm:text-lg font-semibold text-neutral-800 leading-relaxed pt-1">
              Candidate audit reveals {weakConcepts.length > 0 ? `foundations compromised by an intuitive heuristic fallacy in ${weakConcepts[0]}` : `strong foundations with minor edge-case ambiguity`}. 
              {rootCause.length > 0 && <span className="font-mono font-black text-kraftBrown underline decoration-[3px] ml-1">PREREQ GAP: {rootCause[0]}</span>}
            </p>
          </div>
        </section>

        {/* ─── Asymmetric Dual Pane Grid (65% Left / 35% Right) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* LEFT MAIN PANEL: Graded Stepwise Exam Audit (65% -> col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Answer Sheet Card Container */}
            <div className="bg-white border-[3px] border-brutalBlack shadow-brutal">
              {/* Answer Sheet Header Banner */}
              <div className="bg-chalkboard text-white px-5 py-3.5 border-b-[3px] border-brutalBlack flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  <span className="font-mono font-bold text-xs sm:text-sm tracking-wider uppercase text-schoolYellow">
                    GRADED COGNITIVE AUDIT // STEPWISE BREAKDOWN
                  </span>
                </div>
                <span className="bg-retroTeal text-white font-mono text-xs font-black px-2.5 py-0.5 border border-white">
                  {attempts.filter(a => a.isCorrect).length} OF {attempts.length} VALIDATED [{session.overallScore}%]
                </span>
              </div>

              {/* Graded Steps List (Annotated Exam Sheet Style) */}
              <div className="divide-y-[2.5px] divide-brutalBlack">
                {attempts.map((attempt, idx) => (
                  <div key={attempt.id}>
                    {attempt.isCorrect ? (
                      <div className="p-5 hover:bg-neutral-50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs bg-paper-200 text-brutalBlack px-2 py-0.5 border-[1.5px] border-brutalBlack">
                              PROBE 0{idx + 1}
                            </span>
                            <h4 className="font-extrabold text-base text-brutalBlack">
                              {attempt.question.concept.name}
                            </h4>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-neutral-700 pl-1">
                            Validated. Solid grasp of {attempt.question.concept.subtopic.name} principles correctly accounted for.
                          </p>
                        </div>
                        <div className="shrink-0 self-start sm:self-center">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border-[2px] border-brutalBlack px-3 py-1 font-mono text-xs font-black shadow-brutal-sm">
                            <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                            VALIDATED [✓]
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-red-50 relative overflow-hidden border-l-[6px] border-l-red-600">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-xs bg-red-600 text-white px-2 py-0.5 border-[1.5px] border-brutalBlack">
                              PROBE 0{idx + 1} [DEFECT]
                            </span>
                            <span className="bg-red-200 text-red-950 font-mono text-xs font-black px-2.5 py-0.5 border-[2px] border-red-700 uppercase">
                              CRITICAL FAILURE: {attempt.question.concept.name}
                            </span>
                          </div>
                          <div className="shrink-0">
                            <span className="inline-flex items-center gap-1 bg-red-600 text-white border-[2px] border-brutalBlack px-3 py-1 font-mono text-xs font-black shadow-brutal-sm">
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              FAILED [✗]
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-neutral-900 leading-normal">
                            <strong className="text-red-700">Intuition Breakdown:</strong> {attempt.question.prompt}
                          </p>
                          {attempt.question.commonMisconception && (
                            <div className="bg-chalkboard text-neutral-100 p-3.5 border-[2px] border-brutalBlack font-mono text-xs space-y-1.5">
                              <div className="flex items-center gap-2 text-red-400 font-bold">
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                <span>LOGGED ERROR: {attempt.question.commonMisconception}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PROFESSOR'S RED-PEN MEMO BOX: Root Cause Diagnosis */}
            {rootCause.length > 0 && (
              <section className="bg-schoolYellow border-[3px] border-brutalBlack p-6 shadow-brutal relative">
                <div className="flex items-center justify-between pb-3 border-b-2 border-brutalBlack">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✍️</span>
                    <span className="font-mono font-black text-xs uppercase tracking-wider text-brutalBlack">
                      PROFESSOR'S EVALUATION NOTE // ROOT CAUSE MEMO
                    </span>
                  </div>
                  <span className="bg-white text-brutalBlack font-mono text-xs font-bold px-2 py-0.5 border-[1.5px] border-brutalBlack hidden sm:block">
                    CONFIDENTIAL AUDIT
                  </span>
                </div>
                <div className="pt-4 space-y-3">
                  <p className="text-xl sm:text-2xl font-script text-red-700 font-bold leading-relaxed tracking-wide">
                    "Your primary bottleneck stems from an incomplete foundational grasp of {rootCause[0]}. This is not a calculation slip; it's a structural conceptual defect that must be repaired before advancing."
                  </p>
                  <div className="pt-3 border-t-[2px] border-dashed border-brutalBlack flex flex-wrap items-center justify-between gap-2 font-mono text-xs font-bold text-neutral-900">
                    <span className="bg-white px-2 py-1 border border-brutalBlack uppercase">
                      CLASSIFICATION: {errorTypes[0] || 'PREREQUISITE'} MISCONCEPTION
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR PANEL: Chunky Telemetry (35% -> col-span-4) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* TELEMETRY CARD 1: Confidence Gauge */}
            <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal space-y-4">
              <div className="flex items-center justify-between border-b-[2px] border-brutalBlack pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📊</span>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-brutalBlack">Confidence Telemetry</h3>
                </div>
                {isCritical && (
                  <span className="bg-red-100 text-red-800 font-mono text-[11px] font-black px-2 py-0.5 border border-brutalBlack">
                    CRITICAL
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-neutral-600 uppercase font-mono">Retention Index</span>
                  <span className={`font-mono text-2xl font-black ${isCritical ? 'text-red-600' : 'text-retroTeal'}`}>
                    {session.overallScore}%
                  </span>
                </div>
                {/* Brutalist segmented bar gauge */}
                <div className="grid grid-cols-5 gap-1.5 p-1 bg-paper-100 border-[2px] border-brutalBlack">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-4 border ${i < (session.overallScore / 20) ? (isCritical ? 'bg-red-500 border-brutalBlack' : 'bg-retroTeal border-brutalBlack') : 'bg-neutral-200 border-neutral-300'}`}></div>
                  ))}
                </div>
                <div className="flex justify-between font-mono text-[11px] font-bold text-neutral-600 pt-1">
                  <span>TARGET: 80%</span>
                  <span className={isCritical ? 'text-red-700' : 'text-retroTeal-dark'}>
                    {isCritical ? `DEFICIT: -${80 - session.overallScore}%` : 'PASS MARK ACHIEVED'}
                  </span>
                </div>
              </div>

              {/* Repair Duration Box */}
              <div className="bg-paper-100 border-[2px] border-brutalBlack p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">Estimated Repair Time</span>
                  <span className="font-mono text-base font-black text-brutalBlack">18 MINUTES</span>
                </div>
                <div className="w-8 h-8 bg-schoolYellow border-[2px] border-brutalBlack flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
              </div>
            </div>

            {/* TELEMETRY CARD 2: Engine Confidence */}
            <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal space-y-3">
              <div className="flex items-center justify-between border-b-[2px] border-brutalBlack pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🧠</span>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-brutalBlack">Engine Certainty</h3>
                </div>
                <span className="font-mono text-xs font-bold text-neutral-500">v4.2</span>
              </div>
              <div className="flex items-center gap-4 py-1">
                <div className="w-16 h-16 bg-kraftBrown text-white border-[2.5px] border-brutalBlack shadow-brutal-sm flex flex-col items-center justify-center shrink-0">
                  <span className="font-mono text-xl font-black leading-none">{Math.round(session.confidence * 100)}%</span>
                  <span className="font-mono text-[9px] font-bold uppercase mt-1">CONF</span>
                </div>
                <p className="text-xs font-semibold text-neutral-800 leading-snug">
                  The diagnostic engine has {Math.round(session.confidence * 100)}% confidence in this assessment based on trap-option entropy.
                </p>
              </div>
            </div>

          </aside>
        </div>

        {/* ─── BOTTOM ACTION DOCK ─── */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 shadow-brutal flex flex-col md:flex-row items-center justify-between gap-4 mt-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-retroTeal text-white border-[2px] border-brutalBlack shadow-brutal-sm flex items-center justify-center text-xl shrink-0">
              🛠️
            </div>
            <div>
              <h4 className="font-black text-base sm:text-lg text-brutalBlack tracking-tight">
                Remediation Protocol Ready for Immediate Execution
              </h4>
              <p className="font-mono text-xs font-semibold text-neutral-600">
                Curated 3-stage micro-sequence targeting your specific intuition repair.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            <GenerateStackButton 
              sessionId={sessionId} 
              topicId={topicId} 
              existingStackId={existingStack?.id}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
