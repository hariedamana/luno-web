require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const sessions = await prisma.session.findMany({
        where: { title: 'Untitled' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, notes: true, userId: true }
    });

    console.log('=== UNTITLED SESSIONS ===');
    sessions.forEach(s => {
        console.log('ID:', s.id);
        console.log('Notes:', s.notes);
        console.log('UserID:', s.userId);
        console.log('---');
    });

    await prisma.$disconnect();
}

check();
