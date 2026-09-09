import { NextRequest, NextResponse } from 'next/server';
import { generateLearningStack } from '@/lib/services/learningStackGenerator';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    const stack = await generateLearningStack(sessionId);

    return NextResponse.json({ stackId: stack.id });
  } catch (error) {
    console.error('Recovery stack generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recovery stack. Please try again.' },
      { status: 500 }
    );
  }
}
