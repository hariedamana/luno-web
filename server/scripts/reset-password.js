require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'test@luno.app';
    const newPassword = 'password123';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log(`✅ Password reset for ${email}`);
    console.log(`New password: ${newPassword}`);

    await prisma.$disconnect();
}

resetPassword().catch(e => {
    console.error('Error:', e);
    process.exit(1);
});
