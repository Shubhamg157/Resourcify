import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateChatResponse } from '@/lib/services/tutorChatbot';
import { DEMO_USER_ID } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { message, contextTopicId } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Persist user message
    await prisma.chatMessage.create({
      data: {
        userId: DEMO_USER_ID,
        role: 'user',
        content: message.trim(),
        contextTopicId: contextTopicId || null,
      },
    });

    // Generate response
    const response = await generateChatResponse(message.trim(), contextTopicId);

    // Persist assistant response
    await prisma.chatMessage.create({
      data: {
        userId: DEMO_USER_ID,
        role: 'assistant',
        content: response.content,
        contextTopicId: contextTopicId || null,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// GET recent chat history
export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: DEMO_USER_ID },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ messages: [] });
  }
}
