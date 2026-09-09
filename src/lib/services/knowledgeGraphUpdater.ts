import { prisma } from '@/lib/db';
import { DEMO_USER_ID } from '@/types';

/**
 * KnowledgeGraphUpdater
 * Updates KnowledgeState.masteryPercent after diagnostics and rechecks.
 * Uses exponential moving average so recent performance weighs more.
 */

const EMA_ALPHA = 0.4; // Weight for new observation (higher = more weight to recent)

export async function updateKnowledgeAfterDiagnostic(
  sessionId: string
) {
  const session = await prisma.diagnosticSession.findUnique({
    where: { id: sessionId },
    include: {
      topic: {
        include: {
          subtopics: { include: { concepts: true } },
        },
      },
    },
  });

  if (!session) return;

  const attempts = await prisma.questionAttempt.findMany({
    where: { sessionId },
    include: { question: true },
  });

  // Group attempts by concept
  const conceptResults = new Map<string, { correct: number; total: number }>();
  for (const attempt of attempts) {
    const conceptId = attempt.question.conceptId;
    const existing = conceptResults.get(conceptId) || { correct: 0, total: 0 };
    existing.total += 1;
    if (attempt.isCorrect) existing.correct += 1;
    conceptResults.set(conceptId, existing);
  }

  // Update each concept's mastery
  for (const [conceptId, result] of conceptResults) {
    const newObservation = Math.round((result.correct / result.total) * 100);
    await upsertMastery(conceptId, newObservation);
  }

  // Lightly update prerequisite concepts (±5-10%)
  const weakConcepts = JSON.parse(session.weakConcepts || '[]') as string[];
  const allConcepts = session.topic.subtopics.flatMap((st) => st.concepts);

  for (const weakName of weakConcepts) {
    const concept = allConcepts.find((c) => c.name === weakName);
    if (!concept) continue;

    const prereqs = await prisma.prerequisite.findMany({
      where: { conceptId: concept.id },
    });

    for (const prereq of prereqs) {
      // If the dependent concept is weak, slightly decrease prereq mastery confidence
      await adjustMastery(prereq.prerequisiteConceptId, -5);
    }
  }
}

export async function updateKnowledgeAfterRecheck(
  stackId: string,
  recheckScore: number // 0-100
) {
  const stack = await prisma.learningStack.findUnique({
    where: { id: stackId },
    include: { concept: true },
  });

  if (!stack) return;

  // Update the stack's recheck score
  await prisma.learningStack.update({
    where: { id: stackId },
    data: {
      recheckScore,
      completed: true,
    },
  });

  // Update mastery for the concept
  if (recheckScore >= 70) {
    // Significant mastery increase for good recheck
    await adjustMastery(stack.conceptId, 25);
  } else if (recheckScore >= 40) {
    // Moderate increase
    await adjustMastery(stack.conceptId, 10);
  } else {
    // Small increase for attempt
    await adjustMastery(stack.conceptId, 5);
  }

  // Also lightly boost prerequisite concepts on success
  if (recheckScore >= 60) {
    const prereqs = await prisma.prerequisite.findMany({
      where: { conceptId: stack.conceptId },
    });

    for (const prereq of prereqs) {
      await adjustMastery(prereq.prerequisiteConceptId, 5);
    }
  }
}

async function upsertMastery(conceptId: string, newObservation: number) {
  const existing = await prisma.knowledgeState.findUnique({
    where: {
      userId_conceptId: {
        userId: DEMO_USER_ID,
        conceptId,
      },
    },
  });

  if (existing) {
    // EMA: new_mastery = α * observation + (1 - α) * old_mastery
    const newMastery = Math.round(
      EMA_ALPHA * newObservation + (1 - EMA_ALPHA) * existing.masteryPercent
    );

    await prisma.knowledgeState.update({
      where: { id: existing.id },
      data: {
        masteryPercent: Math.max(0, Math.min(100, newMastery)),
        lastUpdated: new Date(),
      },
    });
  } else {
    await prisma.knowledgeState.create({
      data: {
        userId: DEMO_USER_ID,
        conceptId,
        masteryPercent: Math.max(0, Math.min(100, newObservation)),
      },
    });
  }
}

async function adjustMastery(conceptId: string, delta: number) {
  const existing = await prisma.knowledgeState.findUnique({
    where: {
      userId_conceptId: {
        userId: DEMO_USER_ID,
        conceptId,
      },
    },
  });

  if (existing) {
    await prisma.knowledgeState.update({
      where: { id: existing.id },
      data: {
        masteryPercent: Math.max(0, Math.min(100, existing.masteryPercent + delta)),
        lastUpdated: new Date(),
      },
    });
  } else if (delta > 0) {
    await prisma.knowledgeState.create({
      data: {
        userId: DEMO_USER_ID,
        conceptId,
        masteryPercent: Math.max(0, Math.min(100, delta)),
      },
    });
  }
}
