/**
 * Seed script — creates test accounts for every role.
 * Run:  npx prisma db seed
 *
 * Test credentials:
 *   Student  → STU2024001 / student123
 *   Teacher  → TCH001     / teacher123
 *   Parent   → parent@sidelile.edu.za / parent123
 *   Admin    → admin@sidelile.edu.za  / admin123
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const SALT = 12;

  const users = [
    {
      name:     'Sipho Dlamini',
      email:    'sipho.dlamini@sidelile.edu.za',
      portalId: 'STU2024001',
      role:     'student',
      grade:    'Grade 11',
      password: await bcrypt.hash('student123', SALT),
    },
    {
      name:     'Nomsa Khumalo',
      email:    'nomsa.khumalo@sidelile.edu.za',
      portalId: 'STU2024002',
      role:     'student',
      grade:    'Grade 12',
      password: await bcrypt.hash('student123', SALT),
    },
    {
      name:     'Mr. Nkosi',
      email:    'nkosi@sidelile.edu.za',
      portalId: 'TCH001',
      role:     'teacher',
      password: await bcrypt.hash('teacher123', SALT),
    },
    {
      name:     'Ms. Zulu',
      email:    'zulu@sidelile.edu.za',
      portalId: 'TCH002',
      role:     'teacher',
      password: await bcrypt.hash('teacher123', SALT),
    },
    {
      name:     'Mrs. Dlamini (Parent)',
      email:    'parent@sidelile.edu.za',
      portalId: 'PAR2024001',
      role:     'parent',
      password: await bcrypt.hash('parent123', SALT),
    },
    {
      name:     'Admin User',
      email:    'admin@sidelile.edu.za',
      portalId: 'ADM001',
      role:     'admin',
      password: await bcrypt.hash('admin123', SALT),
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where:  { email: u.email },
      update: {},
      create: u,
    });
    console.log(`✓ ${u.role.padEnd(8)} ${u.portalId} — ${u.email}`);
  }

  console.log('\n✅ Seed complete. Test accounts ready.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
