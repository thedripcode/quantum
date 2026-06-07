import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { system, messages } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Demo mode: return canned responses when no API key
      const last = messages[messages.length - 1]?.content?.toLowerCase() ?? '';
      let reply = "I'm SIDI, your Sidelile admin assistant. I can help draft emails, write notices, recommend streams, and more. (Set ANTHROPIC_API_KEY to enable full AI responses.)";

      if (last.includes('reject')) reply = "Subject: Application Outcome — Sidelile High School\n\nDear Parent/Guardian,\n\nThank you for your interest in Sidelile High School. After careful review of your application, we regret to inform you that we are unable to offer your child a place at this time.\n\nReason: The academic average does not meet our minimum entry requirement of 60%.\n\nWe encourage you to explore other schooling options and wish your child every success.\n\nKind regards,\nThe Admissions Office\nSidelile High School";
      else if (last.includes('welcome') || last.includes('approval')) reply = "Subject: Welcome to Sidelile High School!\n\nDear Parent/Guardian,\n\nWe are delighted to confirm that your child has been accepted at Sidelile High School for the 2025 academic year.\n\nPlease find the following details:\n• Student Number: [Auto-generated]\n• Grade: [Grade]\n• Class: [Class]\n• Start Date: Monday, 13 January 2025\n\nPlease bring the following documents on the first day:\n✓ Certified copy of birth certificate\n✓ Previous school report\n✓ 2 passport photographs\n\nWe look forward to welcoming your child to the Sidelile family!\n\nWarm regards,\nSchool Admin\nSidelile High School";
      else if (last.includes('notice') || last.includes('exam')) reply = "NOTICE: EXAMINATION TIMETABLE — TERM 3 2025\n\nDear Learners and Parents,\n\nPlease note the following examination schedule for Term 3:\n\n• Grade 12: 3 November – 21 November 2025\n• Grade 11: 10 November – 28 November 2025\n• Grades 8–10: 17 November – 4 December 2025\n\nAll learners must:\n1. Arrive 15 minutes before each paper\n2. Bring their student card and stationery\n3. Switch off all mobile devices\n\nStudy guides are available from the library.\n\nGood luck to all our learners!\n\nMs. T. Mthembu\nDeputy Principal";
      else if (last.includes('stream')) reply = "Stream Placement Recommendations:\n\n• Pure Sciences (10A): Maths ≥ 70% AND Science ≥ 70%\n• Applied Sciences (10B): Maths ≥ 60% AND Science ≥ 60%\n• Commerce (10C): Maths ≥ 55% and interest in business\n• Humanities (10D): English strong, Social Sciences preferred\n• General (10E): Below 60% average, supportive environment\n\nFor borderline cases, consider:\n- Student's stated preference\n- Teacher recommendations\n- Class capacity\n- Student's work ethic and attitude";
      else if (last.includes('newsletter')) reply = "SIDELILE HIGH SCHOOL PARENT NEWSLETTER\nTerm 3 · September 2025\n\nDear Sidelile Family,\n\nTerm 3 has been an exciting period of academic growth and school community activities.\n\n📚 ACADEMIC UPDATE\nOur school average stands at 71% — up from 68% last term. We are especially proud of our Grade 12 learners who are preparing for final examinations.\n\n🏆 ACHIEVEMENTS\n• 3 learners selected for provincial mathematics olympiad\n• U16 soccer team reached the district finals\n\n📋 REMINDERS\n• Term 4 fees due: 31 October 2025\n• Grade 9 stream selection closes: 20 October 2025\n• Prize Giving Ceremony: 28 November at 18:00\n\nThank you for your continued partnership in education.\n\nMr. T. Mthembu\nPrincipal, Sidelile High School";

      return NextResponse.json({ content: reply });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    const data = await res.json();
    const content = data.content?.[0]?.text ?? 'No response received.';
    return NextResponse.json({ content });
  } catch (err) {
    console.error('SIDI API error:', err);
    return NextResponse.json({ content: 'Error processing request.' }, { status: 500 });
  }
}
