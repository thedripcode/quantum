import type {
  Announcement,
  Program,
  Testimonial,
  StatCard,
  GalleryItem,
  Assignment,
  Subject,
  AttendanceRecord,
  Notice,
  StudentResult,
  TeacherClass,
  TeacherStudent,
} from '@/types';

// ── School Stats ─────────────────────────────────────────────────────────────
export const SCHOOL_STATS: StatCard[] = [
  {
    label: 'Enrolled Students',
    value: '1,250+',
    description: 'Across all grades',
    icon: 'Users',
    color: 'blue',
  },
  {
    label: 'Qualified Teachers',
    value: '85+',
    description: 'Experienced educators',
    icon: 'BookOpen',
    color: 'gold',
  },
  {
    label: 'Matric Pass Rate',
    value: '98%',
    description: 'Class of 2024',
    icon: 'TrendingUp',
    color: 'green',
  },
  {
    label: 'Sports Codes',
    value: '24+',
    description: 'Clubs and activities',
    icon: 'Trophy',
    color: 'purple',
  },
];

// ── Announcements ─────────────────────────────────────────────────────────────
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: '2025 Matric Farewell Ceremony – Venue Confirmed',
    date: '2025-11-10',
    category: 'Events',
    excerpt:
      'The Grade 12 farewell ceremony will be held at the Civic Centre on 28 November. Parents and guardians are invited to attend.',
    urgent: false,
  },
  {
    id: '2',
    title: 'URGENT: Term 3 Examinations Timetable',
    date: '2025-10-01',
    category: 'Urgent',
    excerpt:
      'The Term 3 examination timetable has been released. All learners are required to download and review their schedules immediately.',
    urgent: true,
  },
  {
    id: '3',
    title: 'School Football Team Wins Provincial Championship',
    date: '2025-09-20',
    category: 'Sports',
    excerpt:
      'Congratulations to our boys football team for winning the Limpopo Provincial Championships for the third consecutive year!',
    urgent: false,
  },
  {
    id: '4',
    title: 'Applications Open for 2026 Academic Year',
    date: '2025-09-01',
    category: 'Admin',
    excerpt:
      'Admissions for the 2026 academic year are now open. Apply online through our portal or visit the school office.',
    urgent: false,
  },
  {
    id: '5',
    title: 'Science Olympiad – Learners Place Top 3 Nationally',
    date: '2025-08-15',
    category: 'Academic',
    excerpt:
      'Three of our learners placed in the top 10 at the National Science Olympiad, with one student earning first place.',
    urgent: false,
  },
  {
    id: '6',
    title: 'New Computer Lab Officially Opened',
    date: '2025-08-01',
    category: 'Events',
    excerpt:
      'The school has officially opened its new state-of-the-art computer lab with 40 workstations and high-speed internet.',
    urgent: false,
  },
];

// ── Programs ──────────────────────────────────────────────────────────────────
export const PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Mathematics & Science',
    description: 'Rigorous STEM curriculum preparing learners for careers in engineering, medicine, and technology.',
    subjects: ['Pure Mathematics', 'Physical Science', 'Life Science', 'Technical Mathematics'],
    color: 'blue',
    icon: 'Calculator',
  },
  {
    id: '2',
    name: 'Commerce & Economics',
    description: 'Business-focused subjects equipping learners with financial literacy and entrepreneurial skills.',
    subjects: ['Accounting', 'Business Studies', 'Economics', 'Mathematical Literacy'],
    color: 'gold',
    icon: 'TrendingUp',
  },
  {
    id: '3',
    name: 'Technology & Computing',
    description: 'Cutting-edge ICT education covering coding, data management, and digital innovation.',
    subjects: ['Information Technology', 'Computer Applications Technology', 'Technical Sciences'],
    color: 'cyan',
    icon: 'Monitor',
  },
  {
    id: '4',
    name: 'Arts & Culture',
    description: 'Creative subjects nurturing artistic talent, cultural awareness, and expressive skills.',
    subjects: ['Visual Arts', 'Music', 'Dramatic Arts', 'History', 'Geography'],
    color: 'purple',
    icon: 'Palette',
  },
  {
    id: '5',
    name: 'Languages & Humanities',
    description: 'Multilingual education in English, Sepedi, and Afrikaans with Life Orientation.',
    subjects: ['English Home Language', 'Sepedi HL', 'Afrikaans FAL', 'Life Orientation'],
    color: 'green',
    icon: 'Globe',
  },
  {
    id: '6',
    name: 'Sports & Life Skills',
    description: 'Comprehensive sports programme including soccer, netball, athletics, and leadership development.',
    subjects: ['Soccer', 'Netball', 'Athletics', 'Debate', 'Choir', 'Dance'],
    color: 'orange',
    icon: 'Trophy',
  },
];

// ── Gallery ───────────────────────────────────────────────────────────────────
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', title: 'Awards Ceremony 2024',     category: 'Events',   gradient: 'from-blue-600 to-blue-900' },
  { id: '2', title: 'Science Laboratory',        category: 'Academic', gradient: 'from-cyan-500 to-blue-700' },
  { id: '3', title: 'Provincial Football Win',   category: 'Sports',   gradient: 'from-green-600 to-emerald-900' },
  { id: '4', title: 'Graduation Day 2024',       category: 'Events',   gradient: 'from-amber-500 to-yellow-700' },
  { id: '5', title: 'Computer Lab Opening',      category: 'Academic', gradient: 'from-purple-600 to-indigo-900' },
  { id: '6', title: 'Cultural Day Celebrations', category: 'Events',   gradient: 'from-rose-500 to-pink-800' },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Naledi Dlamini',
    role: 'Parent of Grade 11 Learner',
    content:
      'Sidelile has transformed my daughter completely. The teachers are dedicated, caring, and truly invested in every child\'s success. Her marks improved from 60% to 85% within one year.',
    initials: 'ND',
    rating: 5,
  },
  {
    id: '2',
    name: 'Thabo Molefe',
    role: 'Class of 2023 – Now at University of Pretoria',
    content:
      'I walked into Sidelile with average grades and walked out with six distinctions. The school\'s motto "Excellence in Motion" is not just words – they live it every day.',
    initials: 'TM',
    rating: 5,
  },
  {
    id: '3',
    name: 'Grace Sithole',
    role: 'Parent & School Governing Body Member',
    content:
      'As a parent and SGB member, I see first-hand how this school invests in infrastructure, teacher training, and learner well-being. Sidelile is genuinely one of the best schools in Limpopo.',
    initials: 'GS',
    rating: 5,
  },
];

// ── Student Dashboard Data ────────────────────────────────────────────────────
export const STUDENT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics',       teacher: 'Mr. Nkosi',    grade: 'A',  color: 'blue',   progress: 87 },
  { id: '2', name: 'Physical Science',  teacher: 'Ms. Dube',     grade: 'B+', color: 'cyan',   progress: 76 },
  { id: '3', name: 'English HL',        teacher: 'Mrs. Botha',   grade: 'A',  color: 'green',  progress: 92 },
  { id: '4', name: 'Life Sciences',     teacher: 'Mr. Zulu',     grade: 'B',  color: 'emerald',progress: 71 },
  { id: '5', name: 'Sepedi HL',         teacher: 'Ms. Moloto',   grade: 'A-', color: 'purple', progress: 83 },
  { id: '6', name: 'Life Orientation',  teacher: 'Mr. Sithole',  grade: 'A',  color: 'gold',   progress: 95 },
];

export const STUDENT_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Quadratic Equations Assignment',   subject: 'Mathematics',      dueDate: '2025-11-15', status: 'pending',   color: 'blue'   },
  { id: '2', title: 'Photosynthesis Lab Report',         subject: 'Life Sciences',    dueDate: '2025-11-12', status: 'submitted', color: 'green'  },
  { id: '3', title: 'Essay: The Anglo-Boer War',         subject: 'English HL',       dueDate: '2025-11-08', status: 'graded',    grade: '89%', color: 'purple' },
  { id: '4', title: 'Chemical Equations Worksheet',      subject: 'Physical Science', dueDate: '2025-11-20', status: 'pending',   color: 'cyan'   },
  { id: '5', title: 'Business Plan Presentation',        subject: 'Business Studies', dueDate: '2025-11-25', status: 'pending',   color: 'gold'   },
];

export const STUDENT_ATTENDANCE: AttendanceRecord[] = [
  { month: 'Aug', attended: 22, total: 23, percentage: 96 },
  { month: 'Sep', attended: 20, total: 22, percentage: 91 },
  { month: 'Oct', attended: 21, total: 21, percentage: 100 },
  { month: 'Nov', attended: 10, total: 12, percentage: 83 },
];

export const STUDENT_RESULTS: StudentResult[] = [
  { subject: 'Mathematics',      mark: 87, grade: 'A',  color: 'blue'   },
  { subject: 'Physical Science', mark: 76, grade: 'B+', color: 'cyan'   },
  { subject: 'English HL',       mark: 92, grade: 'A',  color: 'green'  },
  { subject: 'Life Sciences',    mark: 71, grade: 'B',  color: 'emerald'},
  { subject: 'Sepedi HL',        mark: 83, grade: 'A-', color: 'purple' },
  { subject: 'Life Orientation', mark: 95, grade: 'A',  color: 'gold'   },
];

export const STUDENT_NOTICES: Notice[] = [
  { id: '1', title: 'Term 4 Exam Timetable Released',     date: '2025-11-01', priority: 'high',   content: 'Final examinations begin 17 November. Please check the timetable on the notice board.' },
  { id: '2', title: 'Library Extended Hours',              date: '2025-10-28', priority: 'low',    content: 'The library will be open until 18:00 on weekdays during exam preparation period.' },
  { id: '3', title: 'School Fees – Final Payment Reminder',date: '2025-10-20', priority: 'medium', content: 'All outstanding school fees must be settled by 30 November to avoid deregistration.' },
];

// ── Teacher Dashboard Data ────────────────────────────────────────────────────
export const TEACHER_CLASSES: TeacherClass[] = [
  { id: '1', name: 'Grade 12A', grade: '12', subject: 'Mathematics',      students: 32, schedule: 'Mon, Wed, Fri – 08:00', color: 'blue'   },
  { id: '2', name: 'Grade 11B', grade: '11', subject: 'Mathematics',      students: 35, schedule: 'Tue, Thu – 09:00',       color: 'cyan'   },
  { id: '3', name: 'Grade 10C', grade: '10', subject: 'Mathematics',      students: 38, schedule: 'Mon, Wed – 11:00',       color: 'purple' },
  { id: '4', name: 'Grade 12A', grade: '12', subject: 'Technical Maths',  students: 28, schedule: 'Tue, Thu – 13:00',       color: 'green'  },
];

export const TEACHER_STUDENTS: TeacherStudent[] = [
  { id: '1', name: 'Amahle Khumalo',   grade: '12A', attendance: 98, average: 91, status: 'excellent'      },
  { id: '2', name: 'Sipho Ndlovu',     grade: '12A', attendance: 95, average: 82, status: 'excellent'      },
  { id: '3', name: 'Lerato Mokoena',   grade: '12A', attendance: 88, average: 74, status: 'good'           },
  { id: '4', name: 'Bongani Dlamini',  grade: '12A', attendance: 72, average: 55, status: 'needs-attention'},
  { id: '5', name: 'Zanele Mthembu',   grade: '11B', attendance: 96, average: 88, status: 'excellent'      },
  { id: '6', name: 'Tebogo Sithole',   grade: '11B', attendance: 80, average: 62, status: 'good'           },
  { id: '7', name: 'Nomvula Shabalala',grade: '10C', attendance: 65, average: 48, status: 'needs-attention'},
  { id: '8', name: 'Kagiso Mahlangu',  grade: '10C', attendance: 93, average: 79, status: 'good'           },
];

export const TEACHER_NOTICES: Notice[] = [
  { id: '1', title: 'Staff Meeting – 12 November at 14:00', date: '2025-11-05', priority: 'high',   content: 'Mandatory staff meeting in the auditorium. Agenda: Term 4 exam marking guidelines.' },
  { id: '2', title: 'Mark Sheets Due – 25 November',        date: '2025-11-01', priority: 'high',   content: 'All final mark sheets must be submitted to HOD by 25 November at 16:00.' },
  { id: '3', title: 'Professional Development Workshop',    date: '2025-10-25', priority: 'medium', content: 'STEM teaching strategies workshop on 8 November. All Math and Science teachers must attend.' },
];

// ── Student Portal – Per-subject attendance ──────────────────────────────────
export const STUDENT_SUBJECT_ATTENDANCE = [
  { subject: 'Mathematics',      short: 'MATH', attended: 22, total: 23, color: '#3B82F6' },
  { subject: 'Physical Science', short: 'SCI',  attended: 19, total: 22, color: '#F59E0B' },
  { subject: 'English HL',       short: 'ENG',  attended: 21, total: 21, color: '#10B981' },
  { subject: 'Life Sciences',    short: 'BIO',  attended: 19, total: 23, color: '#8B5CF6' },
  { subject: 'Sepedi HL',        short: 'SEP',  attended: 18, total: 21, color: '#EC4899' },
  { subject: 'Life Orientation', short: 'LO',   attended: 23, total: 23, color: '#14B8A6' },
];

// ── Today's Timetable ─────────────────────────────────────────────────────────
export const STUDENT_TIMETABLE_TODAY = [
  { time: '07:30 – 08:30', room: 'A-101', subject: 'Mathematics',      type: 'Lesson', color: '#3B82F6' },
  { time: '08:30 – 09:30', room: 'B-205', subject: 'English HL',       type: 'Lesson', color: '#10B981' },
  { time: '10:00 – 11:00', room: 'C-310', subject: 'Physical Science', type: 'Lab',    color: '#F59E0B' },
  { time: '11:00 – 12:00', room: 'A-101', subject: 'Life Sciences',    type: 'Lesson', color: '#8B5CF6' },
  { time: '13:00 – 14:00', room: 'D-402', subject: 'Sepedi HL',        type: 'Lesson', color: '#EC4899' },
];

// ── Portal Announcements ──────────────────────────────────────────────────────
export const STUDENT_PORTAL_ANNOUNCEMENTS = [
  { id: '1', category: 'Academic',      title: 'Term 4 supplementary study materials now available on the portal.',  time: '2 mins ago'  },
  { id: '2', category: 'Co-curricular', title: 'Regional Science Olympiad — registrations close this Friday.',       time: '1 hour ago'  },
  { id: '3', category: 'Examination',   title: 'Final exam timetable posted — download your personal schedule now.', time: 'Yesterday'   },
  { id: '4', category: 'Academic',      title: 'Mathematics extra lessons every Wednesday at 14:00 in Room A-101.',  time: '2 days ago'  },
];

// ── Teachers on Leave ─────────────────────────────────────────────────────────
export const TEACHERS_ON_LEAVE = [
  { id: '1', name: 'Mr. Zulu',   subject: 'Life Sciences', duration: 'Full Day', initials: 'MZ', color: '#8B5CF6' },
  { id: '2', name: 'Ms. Moloto', subject: 'History',       duration: 'Half Day', initials: 'MM', color: '#EC4899' },
];

// ── Quick Links (Footer) ───────────────────────────────────────────────────────
export const QUICK_LINKS = [
  { label: 'About Us',       href: '#about'    },
  { label: 'Academics',      href: '#academics'},
  { label: 'Admissions',     href: '/apply'    },
  { label: 'Gallery',        href: '#gallery'  },
  { label: 'Contact',        href: '#contact'  },
  { label: 'Student Portal', href: '/student-portal' },
  { label: 'Teacher Portal', href: '/teacher-portal' },
];
