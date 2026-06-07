import StudentProfilePage from '@/components/teacher/students/StudentProfilePage';

export const metadata = {
  title: 'Student Profile — Teacher Portal | Sidelile High School',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentProfilePage studentId={id} />;
}
