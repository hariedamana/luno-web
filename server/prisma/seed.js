const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const modes = [
  {
    name: 'LUNO Sync',
    slug: 'sync',
    description: 'Team meetings and real-time collaboration sessions',
    icon: 'users',
    color: '#6366f1'
  },
  {
    name: 'LUNO Scholar',
    slug: 'scholar',
    description: 'Classroom lectures and educational content capture',
    icon: 'graduation-cap',
    color: '#8b5cf6'
  },
  {
    name: 'LUNO Probe',
    slug: 'probe',
    description: 'Interviews, conversations, and in-depth discussions',
    icon: 'message-circle',
    color: '#ec4899'
  },
  {
    name: 'LUNO Reflect',
    slug: 'reflect',
    description: 'Personal reflection, journaling, and self-review',
    icon: 'brain',
    color: '#14b8a6'
  },
  {
    name: 'LUNO Care',
    slug: 'care',
    description: 'Healthcare consultations and therapy sessions',
    icon: 'heart',
    color: '#f43f5e'
  },
  {
    name: 'LUNO Verdict',
    slug: 'verdict',
    description: 'Legal proceedings, depositions, and formal records',
    icon: 'scale',
    color: '#f59e0b'
  },
  {
    name: 'LUNO Spark',
    slug: 'spark',
    description: 'Brainstorming, ideation, and creative sessions',
    icon: 'lightbulb',
    color: '#22c55e'
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const mode of modes) {
    await prisma.mode.upsert({
      where: { slug: mode.slug },
      update: mode,
      create: mode
    });
    console.log(`  ✓ Created mode: ${mode.name}`);
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@luno.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@luno.com',
      password: adminPassword,
      name: 'LUNO Admin',
      role: 'ADMIN'
    }
  });
  console.log('  ✓ Created admin user: admin@luno.com (password: admin123)');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
