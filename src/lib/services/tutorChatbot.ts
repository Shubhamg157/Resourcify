import { callGeminiJSON } from '@/lib/gemini';
import { prisma } from '@/lib/db';
import { DEMO_USER_ID } from '@/types';
import type { ChatResponse } from '@/types';

/**
 * TutorChatbot
 * Context-aware assistant that knows the student's current diagnostic/recovery state.
 * Two modes:
 * - academic: explains concepts, answers doubts, gives worked examples
 * - navigation: helps the student figure out what to do next in the app
 */

export async function generateChatResponse(
  message: string,
  contextTopicId?: string
): Promise<ChatResponse> {
  // Get recent context about the student
  const recentSessions = await prisma.diagnosticSession.findMany({
    where: { userId: DEMO_USER_ID },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      topic: {
        include: { chapter: { include: { subject: true } } },
      },
    },
  });

  const recentStacks = await prisma.learningStack.findMany({
    where: { userId: DEMO_USER_ID },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { concept: true },
  });

  // Build student context string
  const sessionContext = recentSessions.map((s) =>
    `${s.topic.chapter.subject.name} → ${s.topic.name}: Score ${s.overallScore}%, Weak: ${s.weakConcepts}`
  ).join('\n');

  const stackContext = recentStacks.map((s) =>
    `Recovery: ${s.concept.name} (${s.completed ? `done, recheck: ${s.recheckScore ?? 'pending'}` : 'in progress'})`
  ).join('\n');

  const prompt = `You are a JEE study assistant for the GapZero app. You help students understand concepts and navigate their learning.

STUDENT'S RECENT CONTEXT:
${sessionContext || 'No diagnostics taken yet.'}
${stackContext || 'No recovery stacks created yet.'}

RULES:
- If the student asks about a concept, formula, or problem: respond in "academic" mode with a clear, concise explanation. Use analogies for JEE-level Physics/Chemistry/Mathematics.
- If the student asks "what should I do next" or about the app: respond in "navigation" mode with a recommendation.
- Keep responses under 250 words. Be precise.
- Use LaTeX-style notation for formulas where helpful (e.g., F = ma, v = u + at).
- If you suggest resources, list 1-2 specific types (e.g., "Watch a short video on..." or "Practice 3-4 PYQs on...").

Student's message: "${message}"

Respond as JSON:
{
  "mode": "academic" | "navigation",
  "content": "your response text",
  "suggestedResources": ["optional resource suggestions"],
  "followUp": "optional follow-up question to keep the conversation going"
}`;

  try {
    const response = await callGeminiJSON(
      'You are a JEE study assistant for the GapZero app. Respond as JSON with keys: mode ("academic"|"navigation"), content, suggestedResources (optional array), followUp (optional string). Keep responses under 250 words.',
      prompt
    );
    return response as ChatResponse;
  } catch {
    // Fallback if AI is unavailable
    return {
      mode: 'academic',
      content: getSmartFallback(message, recentSessions, recentStacks),
      followUp: 'Would you like me to explain any specific concept?',
    };
  }
}

function getSmartFallback(
  message: string,
  sessions: Array<{ topic: { name: string }; overallScore: number; weakConcepts: string }>,
  stacks: Array<{ concept: { name: string }; completed: boolean }>
): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('what') && (lowerMsg.includes('next') || lowerMsg.includes('do'))) {
    if (stacks.length > 0) {
      const incomplete = stacks.find((s) => !s.completed);
      if (incomplete) {
        return `I'd recommend completing your recovery stack for "${incomplete.concept.name}" first. Once you've gone through the explanation, formulas, and practice — do the recheck to verify the fix.`;
      }
    }
    return 'Start a new diagnostic from the Topics page! Pick a subject and topic you want to assess.';
  }

  if (sessions.length > 0) {
    const latest = sessions[0];
    const weakConcepts = JSON.parse(latest.weakConcepts || '[]');
    if (weakConcepts.length > 0) {
      return `Based on your latest diagnostic on "${latest.topic.name}" (score: ${latest.overallScore}%), you have gaps in: ${weakConcepts.join(', ')}. I'd focus on these first. Want me to explain any of them?`;
    }
  }

  return 'I can help you understand concepts, solve problems, or figure out what to study next. Try asking about a specific topic like "Explain angular momentum" or "What should I study next?"';
}
