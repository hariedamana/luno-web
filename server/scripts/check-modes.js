require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function check() {
    let output = '';

    const modes = await prisma.mode.findMany({
        select: { id: true, name: true, slug: true }
    });

    output += '=== MODES ===\n';
    modes.forEach(m => {
        output += `ID: ${m.id} | Name: ${m.name} | Slug: ${m.slug}\n`;
    });
    output += '\n';

    // Check a session's modeId
    const session = await prisma.session.findFirst({
        where: { title: 'Untitled' },
        select: { id: true, title: true, modeId: true }
    });

    if (session) {
        output += '=== UNTITLED SESSION ===\n';
        output += `ID: ${session.id}\n`;
        output += `Title: ${session.title}\n`;
        output += `ModeId: ${session.modeId}\n`;

        // Find matching mode
        const mode = modes.find(m => m.id === session.modeId);
        output += `Mode Match: ${mode ? `${mode.name} (slug: ${mode.slug})` : 'NOT FOUND'}\n`;
    }

    fs.writeFileSync('scripts/mode-check.txt', output);
    console.log('Results written to scripts/mode-check.txt');

    await prisma.$disconnect();
}

check();
