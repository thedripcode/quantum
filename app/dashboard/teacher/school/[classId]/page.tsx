import ClassDetail from '@/components/teacher/school/ClassDetail';

export const metadata = {
  title: 'Class Detail — Teacher Portal | Sidelile High School',
};

export default async function Page({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  return <ClassDetail classId={classId} />;
}
