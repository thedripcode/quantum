// ─── Sidelile Assignment / Exam Store ────────────────────────────────────────
// localStorage-backed shared store. When backend is ready, replace with
// Supabase queries — the types and function signatures stay the same.

export type QuestionType = 'essay' | 'short_answer' | 'mcq' | 'calculation';

export interface Question {
  id:       string;
  text:     string;
  type:     QuestionType;
  marks:    number;
  options?: string[];          // MCQ only
  hint?:    string;            // shown to student after submission
}

export interface TeacherWork {
  id:          string;
  type:        'assignment' | 'exam';
  title:       string;
  subject:     string;
  subjectCode: string;
  grade:       string;
  dueDate:     string;
  totalMarks:  number;
  timeLimit?:  number;         // exam only — minutes
  instructions:string;
  questions:   Question[];
  published:   boolean;
  createdAt:   string;
  teacherName: string;
}

export interface StudentAnswer {
  questionId:      string;
  answer:          string;
  selectedOption?: number;     // MCQ
}

export interface SIDIAnalysis {
  score:             number;
  totalMarks:        number;
  percentage:        number;
  overallFeedback:   string;
  weakAreas:         string[];
  flashcards:        { q: string; a: string }[];
  practiceProblems:  { question: string; answer: string }[];
  studyTopics:       string[];
}

export interface Submission {
  id:          string;
  workId:      string;
  studentName: string;
  answers:     StudentAnswer[];
  submittedAt: string;
  analysis?:   SIDIAnalysis;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────
const WORKS_KEY = 'sidelile_teacher_works';
const SUBS_KEY  = 'sidelile_submissions';

// ─── Works (assignments + exams) ─────────────────────────────────────────────
export function getWorks(): TeacherWork[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(WORKS_KEY) ?? '[]'); } catch { return []; }
}

export function saveWork(work: TeacherWork): void {
  const works = getWorks().filter(w => w.id !== work.id);
  localStorage.setItem(WORKS_KEY, JSON.stringify([work, ...works]));
}

export function deleteWork(id: string): void {
  localStorage.setItem(WORKS_KEY, JSON.stringify(getWorks().filter(w => w.id !== id)));
}

export function publishWork(id: string): void {
  const works = getWorks().map(w => w.id === id ? { ...w, published: true } : w);
  localStorage.setItem(WORKS_KEY, JSON.stringify(works));
}

// ─── Submissions ──────────────────────────────────────────────────────────────
export function getSubmissions(workId?: string): Submission[] {
  if (typeof window === 'undefined') return [];
  try {
    const all: Submission[] = JSON.parse(localStorage.getItem(SUBS_KEY) ?? '[]');
    return workId ? all.filter(s => s.workId === workId) : all;
  } catch { return []; }
}

export function saveSubmission(sub: Submission): void {
  const all = getSubmissions().filter(s => s.id !== sub.id);
  localStorage.setItem(SUBS_KEY, JSON.stringify([sub, ...all]));
}

// ─── SIDI Analysis generator (simulated — swap for Claude API call) ───────────
export function generateSIDIAnalysis(work: TeacherWork, answers: StudentAnswer[]): SIDIAnalysis {
  const score = Math.round(work.totalMarks * (0.45 + Math.random() * 0.45)); // 45-90%
  const percentage = Math.round((score / work.totalMarks) * 100);

  const subjectFlashcards: Record<string, { q: string; a: string }[]> = {
    Mathematics: [
      { q: `What is the key formula related to ${work.title}?`,     a: 'Always start from first principles — identify what is given and what is asked before choosing a formula.' },
      { q: 'How do you check your answer in Mathematics?',          a: 'Substitute your answer back into the original equation or problem to verify it satisfies all conditions.' },
      { q: 'What is the difference between an equation and an expression?', a: 'An equation has an equals sign (=) and can be solved. An expression is a mathematical phrase with no equals sign.' },
    ],
    'Physical Sciences': [
      { q: 'What is the first step in any Physics problem?',         a: 'Draw a free-body diagram. Identify all forces, define a positive direction, then apply Newton\'s Second Law.' },
      { q: 'How do you convert between units?',                      a: 'Use conversion factors. Multiply by (desired unit / current unit) so the unwanted units cancel.' },
      { q: `Define the key concept in ${work.title}`,               a: 'Refer to your textbook glossary and CAPS definitions — exam markers look for specific scientific vocabulary.' },
    ],
    default: [
      { q: `What is the main topic covered in "${work.title}"?`,     a: `This assessment focused on ${work.subject}. Review your notes and ensure you understand all the key concepts tested.` },
      { q: 'How should you structure a long-answer response?',       a: 'Introduction → Key points with evidence → Analysis → Conclusion. Always address what the question is asking directly.' },
      { q: 'What technique helps with exam time management?',        a: 'Allocate 1 minute per mark. Read the whole paper first. Attempt every question — partial marks count.' },
    ],
  };

  const flashcards = (subjectFlashcards[work.subject] ?? subjectFlashcards.default).concat([
    { q: `Which section of "${work.title}" needs the most revision?`, a: `Focus on the questions you found hardest. Re-read those topics in your textbook before the next assessment.` },
  ]);

  const practiceProblems = work.questions.slice(0, 3).map(q => ({
    question: `Practice: ${q.text}`,
    answer:   q.hint ?? `Refer to your ${work.subject} notes on this topic and attempt the similar examples in your textbook.`,
  }));

  const weakAreas = percentage < 60
    ? [`${work.subject} core concepts`, `Application questions in ${work.title}`, 'Time management under exam conditions']
    : [`Advanced application in ${work.subject}`, 'Extended-response structure'];

  const studyTopics = work.questions.map(q => q.text.split(' ').slice(0, 4).join(' ')).slice(0, 4);

  const overallFeedback = percentage >= 80
    ? `Excellent work on "${work.title}"! You scored ${percentage}%. Your understanding is strong — focus on the practice problems below to push beyond 90%.`
    : percentage >= 60
    ? `Good effort on "${work.title}". You scored ${percentage}%. There are clear areas to strengthen — SIDI has prepared targeted flashcards and practice problems based on your answers.`
    : `You scored ${percentage}% on "${work.title}". Don't be discouraged — SIDI has identified the key weak areas and created a personalised study plan to help you improve before the next assessment.`;

  return { score, totalMarks: work.totalMarks, percentage, overallFeedback, weakAreas, flashcards, practiceProblems, studyTopics };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
