import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { updateKnowledgeAfterRecheck } from '@/lib/services/knowledgeGraphUpdater';
import { DEMO_USER_ID } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { stackId, answers } = await request.json();

    if (!stackId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Missing stackId or answers array' },
        { status: 400 }
      );
    }

    const stack = await prisma.learningStack.findUnique({
      where: { id: stackId },
      include: { concept: true },
    });

    if (!stack) {
      return NextResponse.json({ error: 'Stack not found' }, { status: 404 });
    }

    // Fetch the recheck questions
    const questionIds = answers.map((a: { questionId: string }) => a.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    // Score the answers
    let correct = 0;
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question && question.correctOptionIndex === answer.selectedOptionIndex) {
        correct++;
      }

      // Persist each attempt
      await prisma.questionAttempt.create({
        data: {
          userId: DEMO_USER_ID,
          questionId: answer.questionId,
          sessionId: stack.diagnosticSessionId,
          selectedOptionIndex: answer.selectedOptionIndex,
          isCorrect: question
            ? question.correctOptionIndex === answer.selectedOptionIndex
            : false,
        },
      });
    }

    const recheckScore = questions.length > 0
      ? Math.round((correct / questions.length) * 100)
      : 0;

    // Update knowledge graph with recheck results
    await updateKnowledgeAfterRecheck(stackId, recheckScore);

    return NextResponse.json({
      recheckScore,
      correct,
      total: questions.length,
      passed: recheckScore >= 70,
    });
  } catch (error) {
    console.error('Recheck submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process recheck' },
      { status: 500 }
    );
  }
}
