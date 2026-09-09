import { prisma } from '@/lib/db';
import type { QuestionType } from '@/types';

/**
 * QuestionGenerator
 * Selects 5 questions for a topic, covering all 5 question types.
 * Falls back to adjacent concepts if < 5 questions exist for exact topic.
 */

const DESIRED_TYPES: QuestionType[] = [
  'fundamental',
  'formula',
  'application',
  'misconception',
  'jee_style',
];

export async function selectDiagnosticQuestions(topicId: string) {
  // Get all concepts under this topic (via subtopics)
  const subtopics = await prisma.subtopic.findMany({
    where: { topicId },
    include: { concepts: true },
  });

  const conceptIds = subtopics.flatMap((st) => st.concepts.map((c) => c.id));

  if (conceptIds.length === 0) {
    throw new Error(`No concepts found for topic ${topicId}`);
  }

  // Fetch all questions for these concepts
  const allQuestions = await prisma.question.findMany({
    where: { conceptId: { in: conceptIds } },
    include: { concept: { include: { subtopic: true } } },
  });

  // Try to pick one of each type
  const selected: typeof allQuestions = [];
  const usedIds = new Set<string>();

  for (const type of DESIRED_TYPES) {
    const candidates = allQuestions.filter(
      (q) => q.questionType === type && !usedIds.has(q.id)
    );
    if (candidates.length > 0) {
      // Pick random from candidates
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      selected.push(pick);
      usedIds.add(pick.id);
    }
  }

  // If we have fewer than 5, fill with remaining questions (different concepts preferred)
  if (selected.length < 5) {
    const remaining = allQuestions
      .filter((q) => !usedIds.has(q.id))
      .sort(() => Math.random() - 0.5);

    for (const q of remaining) {
      if (selected.length >= 5) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // If still fewer than 5, try adjacent topics in the same chapter
  if (selected.length < 5) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { chapter: { include: { topics: true } } },
    });

    if (topic) {
      const adjacentTopicIds = topic.chapter.topics
        .filter((t) => t.id !== topicId)
        .map((t) => t.id);

      const adjacentSubtopics = await prisma.subtopic.findMany({
        where: { topicId: { in: adjacentTopicIds } },
        include: { concepts: true },
      });

      const adjConceptIds = adjacentSubtopics.flatMap((st) => st.concepts.map((c) => c.id));
      const adjQuestions = await prisma.question.findMany({
        where: {
          conceptId: { in: adjConceptIds },
          id: { notIn: Array.from(usedIds) },
        },
        include: { concept: { include: { subtopic: true } } },
      });

      for (const q of adjQuestions.sort(() => Math.random() - 0.5)) {
        if (selected.length >= 5) break;
        selected.push(q);
        usedIds.add(q.id);
      }
    }
  }

  return selected.slice(0, 5).map((q) => ({
    id: q.id,
    conceptId: q.conceptId,
    conceptName: q.concept.name,
    subtopicName: q.concept.subtopic.name,
    prompt: q.prompt,
    options: JSON.parse(q.options) as string[],
    correctOptionIndex: q.correctOptionIndex,
    difficulty: q.difficulty,
    questionType: q.questionType as QuestionType,
    commonMisconception: q.commonMisconception,
  }));
}
