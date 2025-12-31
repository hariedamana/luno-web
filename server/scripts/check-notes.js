require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function check() {
    let output = '';

    const sessions = await prisma.session.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
            id: true,
            title: true,
            notes: true,
            userId: true,
            createdAt: true
        }
    });

    output += '=== RECENT SESSIONS (with notes) ===\n\n';
    sessions.forEach(s => {
        output += `ID: ${s.id}\n`;
        output += `Title: ${s.title}\n`;
        output += `Notes: "${s.notes || '(empty)'}"\n`;
        output += `UserID: ${s.userId}\n`;
        output += `Created: ${s.createdAt}\n`;
        output += '---\n\n';
    });

    fs.writeFileSync('scripts/notes-check.txt', output);
    console.log('Results written to scripts/notes-check.txt');

    await prisma.$disconnect();
}

check();
