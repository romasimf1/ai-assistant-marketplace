import { beforeAll, afterAll, afterEach } from 'vitest';
import prisma from '@/utils/database';

// Setup test database
beforeAll(async () => {
  // Clean up database before tests
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up data after each test
  // Note: In a real application, you might want to use transactions or separate test database
  const tables = ['Review', 'Transaction', 'Order', 'Assistant', 'User'];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
});
