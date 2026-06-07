import type { Metadata } from 'next';
import LoginForm from '@/components/forms/LoginForm';
import ChatBot   from '@/components/chatbot/ChatBot';

export const metadata: Metadata = {
  title: 'Parent Portal Login | Sidelile High School',
  description: "Sign in to the Sidelile High School Parent Portal to track your child's progress, attendance and results.",
};

export default function ParentPortalPage() {
  return (
    <>
      <LoginForm type="parent" />
      <ChatBot context="home" />
    </>
  );
}
