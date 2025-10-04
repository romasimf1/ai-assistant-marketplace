// Check users in database
const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Checking users in database...\n');

    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, createdAt: true }
    });

    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach(user => {
        console.log(`  - Email: ${user.email}`);
        console.log(`    Name: ${user.firstName} ${user.lastName || ''}`);
        console.log(`    ID: ${user.id}`);
        console.log(`    Created: ${user.createdAt}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
