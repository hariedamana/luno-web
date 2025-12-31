const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function checkDatabase() {
    let output = '';
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true }
        });

        output += '--- USERS ---\n';
        users.forEach(u => {
            output += `ID: ${u.id} | Email: ${u.email} | Role: ${u.role}\n`;
        });
        output += '\n';

        const sessions = await prisma.session.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } }, mode: true }
        });

        output += '--- LATEST SESSIONS ---\n';
        sessions.forEach(s => {
            output += `ID: ${s.id}\n`;
            output += `Title: ${s.title}\n`;
            output += `User: ${s.user.email} (ID: ${s.userId})\n`;
            output += `Mode: ${s.mode.name}\n`;
            output += `Created: ${s.createdAt}\n`;
            output += '------------------------\n';
        });

    } catch (error) {
        output += `Error: ${error.message}\n`;
    } finally {
        fs.writeFileSync('scripts/results.txt', output);
        await prisma.$disconnect();
    }
}

checkDatabase();
