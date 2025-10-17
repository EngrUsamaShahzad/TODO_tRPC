import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('Created user:', user.email);

  // Create sample todos
  const todos = await Promise.all([
    prisma.todo.create({
      data: {
        title: 'Complete Next.js tutorial',
        description: 'Learn about App Router and Server Components',
        priority: 'high',
        userId: user.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
    prisma.todo.create({
      data: {
        title: 'Setup PostgreSQL database',
        description: 'Install and configure local PostgreSQL instance',
        priority: 'medium',
        userId: user.id,
        completed: true,
      },
    }),
    prisma.todo.create({
      data: {
        title: 'Learn tRPC',
        description: 'Understand typesafe API calls with tRPC',
        priority: 'high',
        userId: user.id,
      },
    }),
    prisma.todo.create({
      data: {
        title: 'Build Todo Manager',
        description: 'Create a full-stack todo application',
        priority: 'high',
        userId: user.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
    }),
    prisma.todo.create({
      data: {
        title: 'Write documentation',
        description: 'Document the project setup and architecture',
        priority: 'low',
        userId: user.id,
      },
    }),
  ]);

  console.log(`Created ${todos.length} todos`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });