// Simple database connection test
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing database connection...');

    // Try to connect
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    console.log('✅ Test user created:', testUser.id);

    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Test user cleaned up');

    console.log('🎉 Database test passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
