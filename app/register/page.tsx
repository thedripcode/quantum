import type { Metadata } from 'next';
import RegisterForm from '@/components/forms/RegisterForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Register — Sidelile High School',
  description: 'Create your Sidelile High School portal account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
