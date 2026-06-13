import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Public: submit a new application from the Apply Now form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, applyingGrade, academicYear } = body;

    if (!firstName || !lastName || !applyingGrade) {
      return NextResponse.json({ error: 'First name, last name and grade are required.' }, { status: 400 });
    }

    const year = academicYear || String(new Date().getFullYear() + 1);
    const count = await prisma.application.count();
    const ref = `SHS-${year}-${String(count + 1).padStart(3, '0')}`;

    const application = await prisma.application.create({
      data: {
        ref,
        firstName,
        lastName,
        dob:              body.dob || null,
        gender:           body.gender || null,
        idNumber:         body.idNumber || null,
        email:            body.email || null,
        phone:            body.phone || null,
        address:          body.address || null,
        city:             body.city || null,
        province:         body.province || null,
        parentName:       body.parentName || null,
        parentRelation:   body.parentRelation || null,
        parentPhone:      body.parentPhone || null,
        parentEmail:      body.parentEmail || null,
        parentOccupation: body.parentOccupation || null,
        previousSchool:   body.previousSchool || null,
        previousGrade:    body.previousGrade || null,
        previousYear:     body.previousYear || null,
        applyingGrade,
        academicYear: year,
      },
    });

    return NextResponse.json({ success: true, ref: application.ref });
  } catch (err) {
    console.error('Application submit error:', err);
    return NextResponse.json({ error: 'Could not submit application. Please try again.' }, { status: 500 });
  }
}

// Admin only: update application status / admin note
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, status, adminNote } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'id and status are required.' }, { status: 400 });
    const application = await prisma.application.update({
      where: { id },
      data: { status, ...(adminNote !== undefined ? { adminNote } : {}) },
    });
    return NextResponse.json({ success: true, application });
  } catch (err) {
    console.error('Application update error:', err);
    return NextResponse.json({ error: 'Could not update application.' }, { status: 500 });
  }
}

// Admin only: list all applications
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const applications = await prisma.application.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ applications });
}
