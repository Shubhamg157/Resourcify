import { prisma } from '@/lib/db';
import Link from 'next/link';
import { TopicSelector } from './TopicSelector';

export const metadata = {
  title: 'Select Topic — Resourcify',
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
            <Link href="/dashboard" className="text-sm text-obsidian-subtle hover:text-obsidian transition-colors">
              Dashboard
            </Link>
            <Link href="/progress" className="text-sm text-obsidian-subtle hover:text-obsidian transition-colors">
              Progress
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Page Title ─── */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="mb-1">
          <span className="tag tag-sand text-xs uppercase tracking-widest">Micro Diagnostic</span>
        </div>
        <h1 className="text-3xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-2">
          Choose a <span className="crimson-underline text-crimson">Topic</span>
        </h1>
        <p className="text-sm text-obsidian-subtle">
          Select a topic to take a 5-question diagnostic. We&apos;ll find your exact conceptual gap.
        </p>
      </div>

      {/* ─── Topic Selector (Client Component) ─── */}
      <TopicSelector subjects={subjects} />
    </div>
  );
}
