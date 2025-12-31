// Script to list all users
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true }
    });

    console.log('Registered users:');
    users.forEach(u => {
        console.log(`  - ${u.email} (${u.role})`);
    });

    if (users.length === 0) {
        console.log('  No users found. Please register first at http://localhost:5173/signup');
    }

    await prisma.$disconnect();
}

main();
