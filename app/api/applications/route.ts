import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { sendApplicationConfirmationEmail, sendAccountCreatedEmail } from '@/lib/email';

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

    // Send confirmation email to parent or applicant
    const confirmTo = body.parentEmail || body.email;
    if (confirmTo) {
      try {
        await sendApplicationConfirmationEmail(confirmTo, firstName, ref, applyingGrade);
      } catch (emailErr) {
        console.error('Failed to send application confirmation email:', emailErr);
      }
    }

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

    // Auto-create student account when approved
    let createdAccount: { portalId: string; schoolEmail: string; tempPassword: string } | null = null;
    if (status === 'Approved') {
      // Check if an account already exists for this applicant's email
      const existingEmail = application.email?.trim().toLowerCase();
      const alreadyExists = existingEmail
        ? await prisma.user.findUnique({ where: { email: existingEmail } })
        : null;

      if (!alreadyExists) {
        // Generate portal ID: STU + year + 3-digit sequence
        const year = new Date().getFullYear();
        const stuCount = await prisma.user.count({ where: { role: 'student' } });
        const portalId = `STU${year}${String(stuCount + 1).padStart(3, '0')}`;
        const schoolEmail = `${portalId.toLowerCase()}@sidelile.edu.za`;

        // Temporary password = first name + last 4 digits of ID number (or 1234)
        const idSuffix = application.idNumber ? application.idNumber.slice(-4) : '1234';
        const tempPassword = `${application.firstName}${idSuffix}`;
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        const fullName = `${application.firstName} ${application.lastName}`;
        const accountEmail = existingEmail || schoolEmail;

        await prisma.user.create({
          data: {
            name: fullName,
            email: accountEmail,
            schoolEmail,
            portalId,
            password: hashedPassword,
            role: 'student',
            grade: application.applyingGrade,
            active: true,
          },
        });

        createdAccount = { portalId, schoolEmail, tempPassword };

        // Email the student their login credentials
        const accountEmailTo = existingEmail || application.parentEmail || null;
        if (accountEmailTo) {
          try {
            await sendAccountCreatedEmail(
              accountEmailTo,
              `${application.firstName} ${application.lastName}`,
              portalId,
              schoolEmail,
              tempPassword,
            );
          } catch (emailErr) {
            console.error('Failed to send account created email:', emailErr);
          }
        }
      }
    }

    return NextResponse.json({ success: true, application, createdAccount });
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
