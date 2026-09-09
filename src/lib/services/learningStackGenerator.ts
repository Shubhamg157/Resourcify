import { prisma } from '@/lib/db';
import { callGeminiJSON } from '@/lib/gemini';
import { retrieveResources, retrievePrerequisiteResources } from './resourceRetriever';
import { rankResources, getBestResource } from './resourceRanker';
import type { FormulaCard } from '@/types';
import { DEMO_USER_ID } from '@/types';

/**
 * LearningStackGenerator
 * Assembles explanation, formula card, top resource, and practice questions
 * into one LearningStack record.
 *
 * Time budget:
 * - Explanation: ~4-5 min
 * - Formula card: ~2 min
 * - Video/Resource: actual duration
 * - Practice questions: ~5 min
 * - Recheck: ~2 min
 * Target: under 30 minutes total
 */

const EXPLANATION_PROMPT = `You are a JEE tutor writing a concise, targeted explanation for a student who has a specific misconception.

Given the student's diagnostic results, write:
1. A clear explanation of the correct concept (2-3 paragraphs, ~500 words max)
2. Address the SPECIFIC misconception identified
3. Use a real-world analogy if helpful
4. End with a "Key Insight" one-liner

Respond with JSON:
{
  "explanation": "Full explanation text with line breaks",
  "keyInsight": "One sentence that captures the core concept"
}`;

const FORMULA_PROMPT = `You are a JEE tutor creating a formula card for a specific concept.

Create a focused formula card with:
- 3-5 most relevant formulas
- Each formula with a brief description, conditions for use, and common mistake to avoid
- 2-3 quick tips

Respond with JSON:
{
  "title": "Formula card title",
  "formulas": [
    {
      "expression": "The formula (use simple text notation, e.g. 'v = Rω', 'KE = ½mv² + ½Iω²')",
      "description": "What this formula means",
      "conditions": "When to use this formula",
      "commonMistake": "What students often get wrong"
    }
  ],
  "tips": ["Quick tip 1", "Quick tip 2"]
}`;

export async function generateLearningStack(sessionId: string) {
  // Get diagnostic session with full context
  const session = await prisma.diagnosticSession.findUnique({
    where: { id: sessionId },
    include: {
      topic: {
        include: {
          chapter: { include: { subject: true } },
          subtopics: { include: { concepts: true } },
        },
      },
    },
  });

  if (!session) throw new Error('Session not found');

  const weakConcepts = JSON.parse(session.weakConcepts || '[]') as string[];
  const errorTypes = JSON.parse(session.errorType || '[]') as string[];

  // Find the primary weak concept (first one)
  const primaryWeakName = weakConcepts[0] || session.topic.name;

  // Find the concept in DB
  const allConcepts = session.topic.subtopics.flatMap((st) => st.concepts);
  const primaryConcept =
    allConcepts.find((c) => c.name === primaryWeakName) ||
    allConcepts.find((c) => weakConcepts.some((w) => c.name.toLowerCase().includes(w.toLowerCase()))) ||
    allConcepts[0];

  if (!primaryConcept) throw new Error('Could not identify primary weak concept');

  // Get prerequisite concept IDs
  const prereqs = await prisma.prerequisite.findMany({
    where: { conceptId: primaryConcept.id },
  });
  const prereqConceptIds = prereqs.map((p) => p.prerequisiteConceptId);

  // ─── Generate explanation ───
  let explanationText = '';
  let keyInsight = '';
  try {
    const explanationResult = await callGeminiJSON<{
      explanation: string;
      keyInsight: string;
    }>(
      EXPLANATION_PROMPT,
      `Student is weak in: ${primaryConcept.name} (${primaryConcept.description})
Weak concepts: ${weakConcepts.join(', ')}
Error types: ${errorTypes.join(', ')}
Topic: ${session.topic.name}
Subject: ${session.topic.chapter.subject.name}

Write the explanation addressing these specific gaps.`
    );
    explanationText = explanationResult.explanation;
    keyInsight = explanationResult.keyInsight;
  } catch {
    explanationText = `${primaryConcept.description}\n\nThis concept is commonly misunderstood in JEE preparation. Review the fundamental principles and practice with targeted problems.`;
    keyInsight = 'Focus on understanding the core principle before attempting complex problems.';
  }

  // ─── Generate formula card ───
  let formulaCard: FormulaCard;
  try {
    formulaCard = await callGeminiJSON<FormulaCard>(
      FORMULA_PROMPT,
      `Create a formula card for: ${primaryConcept.name}
Description: ${primaryConcept.description}
Topic: ${session.topic.name}
Chapter: ${session.topic.chapter.name}`
    );
  } catch {
    formulaCard = {
      title: `${primaryConcept.name} — Key Formulas`,
      formulas: [
        {
          expression: 'See textbook for relevant formulas',
          description: primaryConcept.description,
          conditions: 'Apply when relevant',
          commonMistake: 'Always check units and conditions',
        },
      ],
      tips: ['Review the derivation', 'Practice with numerical problems'],
    };
  }

  // ─── Get and rank resources ───
  const conceptResources = await retrieveResources(primaryConcept.id, 10);
  const prereqResources = await retrievePrerequisiteResources(primaryConcept.id);
  const allResources = [...conceptResources, ...prereqResources];

  const rankedResources = rankResources(allResources, {
    targetConceptId: primaryConcept.id,
    prerequisiteConceptIds: prereqConceptIds,
    studentDifficulty: session.overallScore >= 70 ? 4 : session.overallScore >= 40 ? 3 : 2,
  });

  const bestResource = getBestResource(rankedResources);

  // ─── Select practice questions ───
  const practiceQuestions = await prisma.question.findMany({
    where: {
      conceptId: primaryConcept.id,
      // Exclude questions already used in this diagnostic
      id: {
        notIn: (
          await prisma.questionAttempt.findMany({
            where: { sessionId },
            select: { questionId: true },
          })
        ).map((a) => a.questionId),
      },
    },
    take: 4,
    orderBy: { difficulty: 'asc' },
  });

  // If fewer than 2, include prerequisite concept questions
  let allPracticeQuestions = practiceQuestions;
  if (practiceQuestions.length < 2 && prereqConceptIds.length > 0) {
    const prereqQuestions = await prisma.question.findMany({
      where: {
        conceptId: { in: prereqConceptIds },
        id: {
          notIn: [
            ...practiceQuestions.map((q) => q.id),
            ...(
              await prisma.questionAttempt.findMany({
                where: { sessionId },
                select: { questionId: true },
              })
            ).map((a) => a.questionId),
          ],
        },
      },
      take: 4 - practiceQuestions.length,
      orderBy: { difficulty: 'asc' },
    });
    allPracticeQuestions = [...practiceQuestions, ...prereqQuestions];
  }

  // ─── Calculate estimated time ───
  const explanationMinutes = 5;
  const formulaMinutes = 2;
  const resourceMinutes = bestResource
    ? Math.ceil(bestResource.resource.durationSeconds / 60)
    : 0;
  const practiceMinutes = allPracticeQuestions.length * 2;
  const recheckMinutes = 2;
  const totalMinutes = explanationMinutes + formulaMinutes + resourceMinutes + practiceMinutes + recheckMinutes;

  // ─── Create LearningStack record ───
  const stack = await prisma.learningStack.create({
    data: {
      userId: DEMO_USER_ID,
      diagnosticSessionId: sessionId,
      conceptId: primaryConcept.id,
      estimatedMinutes: Math.min(totalMinutes, 30),
      explanationText: `${explanationText}\n\n**Key Insight:** ${keyInsight}`,
      formulaCardJson: JSON.stringify(formulaCard),
      resourceId: bestResource?.resource.id || null,
      practiceQuestionIds: JSON.stringify(allPracticeQuestions.map((q) => q.id)),
    },
  });

  return stack;
}
