import { callGeminiJSON } from '@/lib/gemini';
import type { AnswerEvaluation } from '@/types';

interface QuestionWithAnswer {
  questionId: string;
  conceptName: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  selectedOptionIndex: number;
  questionType: string;
  commonMisconception: string;
}

const SYSTEM_PROMPT = `You are an expert JEE Physics/Chemistry/Mathematics tutor evaluating a student's diagnostic quiz answers.

For each question, analyze:
1. Whether the answer is correct
2. If incorrect, identify the SPECIFIC misconception or error in reasoning
3. Rate the student's strength on the underlying concept

You MUST respond with valid JSON matching this exact schema:
{
  "evaluations": [
    {
      "questionId": "string",
      "isCorrect": boolean,
      "detectedMisconception": "string — describe the specific misconception if wrong, or 'None' if correct",
      "conceptStrength": "strong" | "moderate" | "weak",
      "reasoning": "string — brief explanation of why you assessed this way"
    }
  ]
}

Be specific about misconceptions. Don't just say "wrong answer" — identify the conceptual error.
For example: "Student confuses rolling friction with kinetic friction" or "Student forgot to account for rotational kinetic energy".`;

export async function evaluateAnswers(
  questionsWithAnswers: QuestionWithAnswer[]
): Promise<AnswerEvaluation[]> {
  const userPrompt = `Evaluate these ${questionsWithAnswers.length} student answers:

${questionsWithAnswers
  .map(
    (q, i) => `
Question ${i + 1} (${q.questionType}):
Concept: ${q.conceptName}
Question: ${q.prompt}
Options: ${q.options.map((o, j) => `${String.fromCharCode(65 + j)}) ${o}`).join(', ')}
Correct Answer: ${String.fromCharCode(65 + q.correctOptionIndex)}) ${q.options[q.correctOptionIndex]}
Student's Answer: ${String.fromCharCode(65 + q.selectedOptionIndex)}) ${q.options[q.selectedOptionIndex]}
Known Common Misconception: ${q.commonMisconception || 'None documented'}
`
  )
  .join('\n---\n')}`;

  const result = await callGeminiJSON<{ evaluations: AnswerEvaluation[] }>(
    SYSTEM_PROMPT,
    userPrompt
  );

  // Ensure questionIds match
  return result.evaluations.map((evaluation, i) => ({
    ...evaluation,
    questionId: questionsWithAnswers[i].questionId,
    isCorrect: questionsWithAnswers[i].selectedOptionIndex === questionsWithAnswers[i].correctOptionIndex,
  }));
}
