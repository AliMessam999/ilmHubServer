const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This script sets the role of a user to 'admin' by email
// Usage: node prisma/make-admin.js <email>
// Example: node prisma/make-admin.js admin@ilmhub.com

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log('Usage: node prisma/make-admin.js <email>');
    console.log('Example: node prisma/make-admin.js admin@ilmhub.com');
    
    // Show all users
    console.log('\nCurrent users in database:');
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    console.table(users);
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`User with email "${email}" not found.`);
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    console.log('\nAvailable users:');
    console.table(users);
    return;
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: 'admin' }
  });

  console.log(`✅ Success! User "${updated.name}" (${updated.email}) is now an admin.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
