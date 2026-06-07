import type { Metadata } from 'next';
import LoginForm from '@/components/forms/LoginForm';
import ChatBot   from '@/components/chatbot/ChatBot';

export const metadata: Metadata = {
  title: 'Teacher Portal Login | Sidelile High School',
  description: 'Sign in to the Sidelile High School Teacher Portal to manage your classes, learner records, attendance, and marks.',
};

export default function TeacherPortalPage() {
  return (
    <>
      <LoginForm type="teacher" />
      <ChatBot context="teacher" />
    </>
  );
}
