import { prisma } from '@/lib/db';
import { TopicSelector } from './TopicSelector';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'Select Topic — GapZero',
  description: 'Choose a topic to diagnose your conceptual understanding',
};

export default async function TopicsPage() {
  const subjects = await prisma.subject.findMany({
    include: {
      chapters: {
        orderBy: { sortOrder: 'asc' },
        include: {
          topics: {
            orderBy: { sortOrder: 'asc' },
            include: {
              subtopics: {
                orderBy: { sortOrder: 'asc' },
                include: {
                  concepts: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ─── Page Title ─── */}
        <div className="mb-8 border-l-[6px] border-brutalBlack pl-4 py-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-schoolYellow text-brutalBlack font-mono font-black text-xs px-2 py-0.5 border border-brutalBlack uppercase">
              TRIAGE BLUEPRINT
            </span>
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase">Micro Diagnostic</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brutalBlack tracking-tight">
            Choose a Topic
          </h1>
          <p className="text-neutral-700 font-bold text-sm sm:text-base mt-2 max-w-2xl">
            Select a topic to take a 12-minute diagnostic probe. We'll locate your exact conceptual gap.
          </p>
        </div>

        {/* ─── Topic Selector (Client Component) ─── */}
        <TopicSelector subjects={subjects} />
      </main>
    </>
  );
}
