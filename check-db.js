// Script to check database contents
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');

    // Check users
    console.log('👥 Users:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        subscriptionTier: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (users.length === 0) {
      console.log('   No users found');
    } else {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.firstName || 'No name'}) - ${user.createdAt.toISOString()}`);
      });
    }

    console.log(`\n   Total users: ${users.length}`);

    // Check assistants
    console.log('\n🤖 Assistants:');
    const assistants = await prisma.assistant.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        isActive: true,
      }
    });

    if (assistants.length === 0) {
      console.log('   No assistants found');
    } else {
      assistants.forEach((assistant, index) => {
        console.log(`   ${index + 1}. ${assistant.name} (${assistant.category}) - ${assistant.isActive ? 'Active' : 'Inactive'}`);
      });
    }

    console.log(`\n   Total assistants: ${assistants.length}`);

    // Check orders
    console.log('\n📦 Orders:');
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (orders.length === 0) {
      console.log('   No orders found');
    } else {
      orders.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.status} - $${order.totalAmount} - ${order.createdAt.toISOString()}`);
      });
    }

    console.log(`\n   Total orders: ${orders.length}`);

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
