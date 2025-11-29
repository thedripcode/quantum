import { NavItem, StatItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Academics', href: '#academics' },
  { label: 'Results', href: '#stats' },
  { label: 'School Life', href: '#gallery' },
  { label: 'Admissions', href: '#contact' },
];

export const SCHOOL_STATS: StatItem[] = [
  { value: '98%', label: 'Pass Rate', description: 'Consistently creating future leaders.' },
  { value: '1:25', label: 'Teacher Ratio', description: 'Personalized attention for every learner.' },
  { value: '30+', label: 'Distinctions', description: 'Academic excellence in the 2024 Matric finals.' },
  { value: '100%', label: 'University Access', description: 'Of our top performing students.' },
];

// Curated assets for South African High School context
// Theme: Blue uniforms, brick buildings, diverse students, success/awards
export const ASSETS = {
  // Placeholder for the school crest/shield
  logo: 'https://cdn-icons-png.flaticon.com/512/8074/8074800.png', 
  
  // Hero Slides matching user request:
  // 1. Awards/Success (Ceremony vibe)
  hero_awards: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2600&auto=format&fit=crop',
  // 2. Group of students in blazers/uniforms (Community)
  hero_group: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2600&auto=format&fit=crop',
  // 3. Classroom/Learning (Academic focus)
  hero_classroom: 'https://images.unsplash.com/photo-1427504746074-be4799569306?q=80&w=2600&auto=format&fit=crop',
  
  // Classroom feature image
  classroom: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2600&auto=format&fit=crop',
  
  // Specific activities
  science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2600&auto=format&fit=crop',
  sports: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2600&auto=format&fit=crop',
  choir: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2600&auto=format&fit=crop',
  group_study: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2600&auto=format&fit=crop', // Group study outside
  arts: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2600&auto=format&fit=crop'
};

export const HERO_SLIDES = [
  ASSETS.hero_awards,     // Slide 1: Celebrating Success (Awards)
  ASSETS.hero_group,      // Slide 2: School Life (Group in uniforms)
  ASSETS.hero_classroom,  // Slide 3: Academics (Classroom)
];

export const GEMINI_SYSTEM_INSTRUCTION = `
You are the AI Admissions Assistant for Sidelile High School. 
Your tone is professional, warm, encouraging, and trustworthy.
Sidelile High School is a top-performing public school in South Africa with a 98% pass rate.
Key facts:
- Focus on Science, Mathematics, and Technology.
- Excellent extracurriculars including Soccer, Netball, Debate, and Choir.
- Motto: "Excellence in Motion".
- Admissions open in April for the following year.
- Keep answers concise (under 100 words) and helpful.
If asked about fees or specific dates, advise them to contact the administration office directly via the form on the website.
`;