import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const STUDENT_SYSTEM = `You are SIDI - Sidelile Intelligent Digital Intelligence - the AI study companion for students at Sidelile High School in KwaZulu-Natal, South Africa.

You help students with:
- Explaining concepts from the South African CAPS curriculum (Mathematics, Physical Sciences, English, IsiZulu, Life Orientation, History, Geography, etc.)
- Answering questions about past exam papers and their solutions
- Generating study notes and summaries aligned to CAPS
- Providing exam tips and study strategies
- Working through problems step by step
- Encouraging and motivating students

Guidelines:
- Be warm, encouraging, and age-appropriate for high school students (Grade 8-12)
- Use South African curriculum terminology (CAPS, matric, NSC, DoE, etc.)
- When solving maths or science problems, show full working
- Keep answers clear and structured with headings when helpful
- Always be positive and build student confidence`;

const ADMIN_SYSTEM = `You are SIDI - the AI assistant for Sidelile High School's admin team in KwaZulu-Natal, South Africa. You help with:
- Drafting parent emails and school notices
- Stream placement recommendations based on student marks
- Writing rejection or approval messages for applications
- School policy and CAPS curriculum questions
- Any general admin support

Keep responses concise, professional, and appropriate for a South African high school context.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { messages, system: customSystem } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required.' }, { status: 400 });
    }

    const systemPrompt = customSystem ||
      (session.user.role === 'student' ? STUDENT_SYSTEM : ADMIN_SYSTEM);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'PASTE_YOUR_KEY_HERE') {
      return NextResponse.json({ content: demoResponse(messages, session.user.role ?? 'student') });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Anthropic API error:', data);
      return NextResponse.json({ error: data.error?.message || 'AI service error.' }, { status: 500 });
    }

    const content = data.content?.[0]?.text ?? '';
    return NextResponse.json({ content });
  } catch (err: unknown) {
    console.error('Sidi API error:', err);
    return NextResponse.json({ error: 'Sidi is unavailable right now.' }, { status: 500 });
  }
}

function demoResponse(messages: { role: string; content: string }[], role: string): string {
  const last = messages[messages.length - 1]?.content?.toLowerCase() ?? '';
  if (role === 'student') {
    if (last.includes('quadratic') || last.includes('maths') || last.includes('math')) {
      return 'Great question! For quadratic equations ax^2 + bx + c = 0, use the quadratic formula:\n\nx = (-b +/- sqrt(b^2-4ac)) / 2a\n\nSteps:\n1. Identify a, b, and c\n2. Calculate the discriminant: D = b^2-4ac\n3. Substitute into the formula\n\nIf D > 0: two real roots | D = 0: one repeated root | D < 0: no real roots.\n\n(Add your ANTHROPIC_API_KEY to .env.local to unlock full AI responses!)';
    }
    if (last.includes('note') || last.includes('summar')) {
      return 'Here is a summary of the topic you requested.\n\nKey Concepts:\n- Concept 1: [definition]\n- Concept 2: [definition]\n- Concept 3: [definition]\n\nExam Tips:\n- Always show your working\n- Read the question twice before answering\n- Check your units in science\n\n(Add your ANTHROPIC_API_KEY to .env.local to unlock full AI responses!)';
    }
    return 'Hi! I\'m SIDI, your study companion at Sidelile High School. I can help you with CAPS curriculum topics, past paper questions, study notes, and exam tips. Ask me anything!\n\n(Add your ANTHROPIC_API_KEY to .env.local to unlock full AI responses.)';
  }
  if (last.includes('reject')) return 'Subject: Application Outcome\n\nDear Parent/Guardian,\n\nAfter careful review, we regret we cannot offer your child a place at this time.\n\nKind regards,\nAdmissions Office, Sidelile High School';
  return 'I\'m SIDI, your admin assistant. I can help draft emails, write notices, recommend stream placements, and more.\n\n(Add your ANTHROPIC_API_KEY to .env.local to unlock full AI responses.)';
}
