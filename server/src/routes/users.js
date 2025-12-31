const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /users/me
 * Get current authenticated user's profile
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await req.prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                _count: {
                    select: { sessions: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            ...user,
            sessionCount: user._count.sessions
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

/**
 * PUT /users/me
 * Update current user's profile
 */
router.put('/me', authenticate, async (req, res) => {
    try {
        const { name } = req.body;

        const user = await req.prisma.user.update({
            where: { id: req.userId },
            data: { name },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

module.exports = router;
