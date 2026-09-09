import { prisma } from '@/lib/db';
import { callGeminiJSON } from '@/lib/gemini';
import type { AnswerEvaluation, DiagnosticResult } from '@/types';
import { findRootPrerequisites } from './prerequisiteAnalyzer';

/**
 * DiagnosticEngine / ConceptGapDetector
 * Aggregates AnswerEvaluator output into a structured diagnosis.
 */

const SYSTEM_PROMPT = `You are a JEE diagnostic engine. Given evaluation results for 5 diagnostic questions,
produce a structured analysis identifying the student's exact conceptual gaps.

You MUST respond with JSON matching this schema:
{
  "overall_score": number (0-100, percentage correct),
  "confidence": number (0.0-1.0, how confident you are in the diagnosis),
  "mastered_concepts": ["concept names where student showed strong understanding"],
  "weak_concepts": ["concept names where student showed weakness or misconception"],
  "root_prerequisite": ["concept names that are likely root causes of the weakness"],
  "error_types": ["Conceptual misconception" | "Formula confusion" | "Application error" | "Calculation mistake" | "Incomplete understanding"],
  "recommended_intervention": ["specific recommendations like 'Short explanation of X', 'Formula sheet for Y', '2 targeted problems on Z'"]
}

Be SPECIFIC. Don't say "student is weak in physics". Say "Student confuses static friction with kinetic friction in the context of rolling motion".`;

export async function runDiagnosticEngine(
  evaluations: AnswerEvaluation[],
  topicId: string,
  userId: string
): Promise<DiagnosticResult> {
  // Calculate basic score
  const correctCount = evaluations.filter((e) => e.isCorrect).length;
  const overallScore = Math.round((correctCount / evaluations.length) * 100);

  // Get concept names for weak areas
  const weakQuestions = evaluations.filter((e) => !e.isCorrect || e.conceptStrength === 'weak');
  const strongQuestions = evaluations.filter((e) => e.isCorrect && e.conceptStrength !== 'weak');

  // Get concept info from DB
  const questionData = await Promise.all(
    evaluations.map(async (e) => {
      const question = await prisma.question.findUnique({
        where: { id: e.questionId },
        include: { concept: { include: { subtopic: true } } },
      });
      return { ...e, concept: question?.concept };
    })
  );

  const weakConceptIds = questionData
    .filter((q) => !q.isCorrect || q.conceptStrength === 'weak')
    .map((q) => q.concept?.id)
    .filter((id): id is string => !!id);

  // Find root prerequisites
  const rootPrereqIds = await findRootPrerequisites(weakConceptIds, userId);
  const rootPrereqs = await prisma.concept.findMany({
    where: { id: { in: rootPrereqIds } },
  });

  // Call Gemini for detailed analysis
  const userPrompt = `Student completed a ${evaluations.length}-question diagnostic.
Score: ${correctCount}/${evaluations.length} (${overallScore}%)

Detailed evaluations:
${questionData
  .map(
    (q, i) => `
Q${i + 1}: ${q.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
Concept: ${q.concept?.name || 'Unknown'}
Subtopic: ${q.concept?.subtopic?.name || 'Unknown'}
Strength: ${q.conceptStrength}
Misconception: ${q.detectedMisconception}
Reasoning: ${q.reasoning}
`
  )
  .join('\n---\n')}

Root prerequisite concepts that may need attention: ${rootPrereqs.map((r) => r.name).join(', ') || 'None identified'}`;

  try {
    const aiResult = await callGeminiJSON<DiagnosticResult>(SYSTEM_PROMPT, userPrompt);

    // Merge AI results with our computed data
    return {
      overall_score: overallScore,
      confidence: aiResult.confidence || (evaluations.length >= 5 ? 0.85 : 0.65),
      mastered_concepts:
        aiResult.mastered_concepts.length > 0
          ? aiResult.mastered_concepts
          : strongQuestions.map((q) => {
              const qd = questionData.find((qd) => qd.questionId === q.questionId);
              return qd?.concept?.name || 'Unknown concept';
            }),
      weak_concepts:
        aiResult.weak_concepts.length > 0
          ? aiResult.weak_concepts
          : weakQuestions.map((q) => {
              const qd = questionData.find((qd) => qd.questionId === q.questionId);
              return qd?.concept?.name || 'Unknown concept';
            }),
      root_prerequisite:
        aiResult.root_prerequisite.length > 0
          ? aiResult.root_prerequisite
          : rootPrereqs.map((r) => r.name),
      error_types: aiResult.error_types || ['Conceptual misconception'],
      recommended_intervention:
        aiResult.recommended_intervention || [
          'Short explanation of the weak concept',
          'Formula sheet review',
          '2-4 targeted practice problems',
        ],
    };
  } catch {
    // Fallback if AI fails — still return a useful result from our own analysis
    return {
      overall_score: overallScore,
      confidence: 0.6,
      mastered_concepts: strongQuestions.map((q) => {
        const qd = questionData.find((qd) => qd.questionId === q.questionId);
        return qd?.concept?.name || 'Unknown concept';
      }),
      weak_concepts: weakQuestions.map((q) => {
        const qd = questionData.find((qd) => qd.questionId === q.questionId);
        return qd?.concept?.name || 'Unknown concept';
      }),
      root_prerequisite: rootPrereqs.map((r) => r.name),
      error_types: ['Conceptual misconception'],
      recommended_intervention: [
        'Review the weak concepts',
        'Practice targeted problems',
      ],
    };
  }
}
