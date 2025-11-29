export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  colSpan?: string;
  delay?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
