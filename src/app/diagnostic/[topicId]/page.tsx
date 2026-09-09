import { prisma } from '@/lib/db';
import { selectDiagnosticQuestions } from '@/lib/services/questionGenerator';
import { notFound } from 'next/navigation';
import { DiagnosticQuiz } from './DiagnosticQuiz';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { chapter: { include: { subject: true } } },
  });
  if (!topic) return { title: 'Diagnostic — Resourcify' };
  return {
    title: `Diagnostic: ${topic.name} — Resourcify`,
    description: `5-question micro diagnostic for ${topic.name}`,
  };
}

export default async function DiagnosticPage({ params }: PageProps) {
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { chapter: { include: { subject: true } } },
  });

  if (!topic) notFound();

  const questions = await selectDiagnosticQuestions(topicId);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-obsidian font-[family-name:var(--font-serif)] mb-2">
            No Questions Available
          </h1>
          <p className="text-obsidian-subtle">
            We don&apos;t have diagnostic questions for this topic yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DiagnosticQuiz
      topicId={topicId}
      topicName={topic.name}
      chapterName={topic.chapter.name}
      subjectName={topic.chapter.subject.name}
      questions={questions}
    />
  );
}
