import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { evaluateAnswers } from '@/lib/services/answerEvaluator';
import { runDiagnosticEngine } from '@/lib/services/diagnosticEngine';
import { DEMO_USER_ID } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, answers } = body as {
      topicId: string;
      answers: { questionId: string; selectedOptionIndex: number }[];
    };

    if (!topicId || !answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'Missing topicId or answers' },
        { status: 400 }
      );
    }

    // Create diagnostic session first (before AI call, so answers are persisted)
    const session = await prisma.diagnosticSession.create({
      data: {
        userId: DEMO_USER_ID,
        topicId,
      },
    });

    // Persist all question attempts BEFORE calling AI
    const questions = await prisma.question.findMany({
      where: { id: { in: answers.map((a) => a.questionId) } },
      include: { concept: { include: { subtopic: true } } },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) continue;

      await prisma.questionAttempt.create({
        data: {
          userId: DEMO_USER_ID,
          questionId: answer.questionId,
          sessionId: session.id,
          selectedOptionIndex: answer.selectedOptionIndex,
          isCorrect: answer.selectedOptionIndex === question.correctOptionIndex,
        },
      });
    }

    // Now call AI to evaluate answers
    const questionsWithAnswers = answers.map((a) => {
      const q = questionMap.get(a.questionId)!;
      return {
        questionId: q.id,
        conceptName: q.concept.name,
        prompt: q.prompt,
        options: JSON.parse(q.options) as string[],
        correctOptionIndex: q.correctOptionIndex,
        selectedOptionIndex: a.selectedOptionIndex,
        questionType: q.questionType,
        commonMisconception: q.commonMisconception,
      };
    });

    let diagnosticResult;
    try {
      const evaluations = await evaluateAnswers(questionsWithAnswers);
      diagnosticResult = await runDiagnosticEngine(evaluations, topicId, DEMO_USER_ID);
    } catch (aiError) {
      console.error('AI evaluation failed, using fallback:', aiError);
      // Fallback: use basic scoring without AI
      const correctCount = answers.filter((a) => {
        const q = questionMap.get(a.questionId);
        return q && a.selectedOptionIndex === q.correctOptionIndex;
      }).length;

      const weakConcepts = answers
        .filter((a) => {
          const q = questionMap.get(a.questionId);
          return q && a.selectedOptionIndex !== q.correctOptionIndex;
        })
        .map((a) => questionMap.get(a.questionId)?.concept.name || 'Unknown');

      const masteredConcepts = answers
        .filter((a) => {
          const q = questionMap.get(a.questionId);
          return q && a.selectedOptionIndex === q.correctOptionIndex;
        })
        .map((a) => questionMap.get(a.questionId)?.concept.name || 'Unknown');

      diagnosticResult = {
        overall_score: Math.round((correctCount / answers.length) * 100),
        confidence: 0.5,
        mastered_concepts: masteredConcepts,
        weak_concepts: weakConcepts,
        root_prerequisite: [] as string[],
        error_types: ['Unable to determine — AI evaluation unavailable'],
        recommended_intervention: [
          'Review incorrect answers',
          'Practice targeted problems',
        ],
      };
    }

    // Update diagnostic session with results
    await prisma.diagnosticSession.update({
      where: { id: session.id },
      data: {
        overallScore: diagnosticResult.overall_score,
        confidence: diagnosticResult.confidence,
        masteredConcepts: JSON.stringify(diagnosticResult.mastered_concepts),
        weakConcepts: JSON.stringify(diagnosticResult.weak_concepts),
        rootCause: JSON.stringify(diagnosticResult.root_prerequisite),
        errorType: JSON.stringify(diagnosticResult.error_types),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      result: diagnosticResult,
    });
  } catch (error) {
    console.error('Diagnostic submission error:', error);
    return NextResponse.json(
      {
        error:
          "We couldn't complete the diagnosis right now. Your answers have been saved. Try again.",
      },
      { status: 500 }
    );
  }
}
