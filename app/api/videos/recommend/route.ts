import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const SYSTEM = `You are SIDI, the AI study companion for Sidelile High School (KwaZulu-Natal, South Africa, CAPS curriculum, Grades 8-12).

A student asks for video recommendations on a topic. Recommend 3-4 educational videos or channels.

Rules:
- Only recommend well-known, long-running educational channels that genuinely cover the topic (e.g. Khan Academy, Organic Chemistry Tutor, Mindset Learn, FreeScienceLessons, Crash Course, 3Blue1Brown, Professor Leonard, Eddie Woo, Math Antics, Amoeba Sisters, Bozeman Science, Mr Salles for English, etc.). Prefer channels relevant to the South African CAPS curriculum where possible (Mindset Learn is South African).
- Do NOT invent specific video URLs or IDs. Instead give a precise YouTube search phrase for each recommendation.
- Respond ONLY with valid JSON, no markdown fences, matching exactly:
{"recommendations":[{"title":"what the video/series is about","channel":"channel name","why":"one sentence on why this helps for this topic and grade","search":"precise youtube search phrase"}]}`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { topic, grade } = await req.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Tell Sidi what topic you need a video for.' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'PASTE_YOUR_KEY_HERE') {
      // Demo fallback so the page still works without a key
      return NextResponse.json({
        recommendations: [
          {
            title: `${topic} — full explanation`,
            channel: 'Khan Academy',
            why: 'Clear step-by-step lessons that match most CAPS topics.',
            search: `khan academy ${topic}`,
          },
          {
            title: `${topic} for South African learners`,
            channel: 'Mindset Learn',
            why: 'South African channel aligned to the CAPS curriculum.',
            search: `mindset learn ${topic}`,
          },
        ],
      });
    }

    const userMsg = `Topic: ${topic}${grade ? `\nStudent grade: ${grade}` : ''}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Anthropic API error:', data);
      return NextResponse.json({ error: data.error?.message || 'AI service error.' }, { status: 500 });
    }

    const text: string = data.content?.[0]?.text ?? '';
    // Parse the model's JSON (tolerate stray text around it)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Sidi gave an unexpected answer — try again.' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const recommendations = (parsed.recommendations ?? [])
      .filter((r: any) => r?.title && r?.search)
      .slice(0, 5)
      .map((r: any) => ({
        title:   String(r.title),
        channel: r.channel ? String(r.channel) : null,
        why:     r.why ? String(r.why) : null,
        search:  String(r.search),
        searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(String(r.search))}`,
      }));

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error('Video recommend error:', err);
    return NextResponse.json({ error: 'Sidi is unavailable right now.' }, { status: 500 });
  }
}
