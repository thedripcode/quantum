import type { Metadata } from 'next';
import LoginForm from '@/components/forms/LoginForm';
import ChatBot   from '@/components/chatbot/ChatBot';

export const metadata: Metadata = {
  title: 'Student Portal Login | Sidelile High School',
  description: 'Sign in to the Sidelile High School Student Portal to access your subjects, assignments, attendance records, and results.',
};

export default function StudentPortalPage() {
  return (
    <>
      <LoginForm type="student" />
      <ChatBot context="student" />
    </>
  );
}
