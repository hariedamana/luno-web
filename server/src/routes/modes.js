const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /modes
 * List all available capture modes
 */
router.get('/', async (req, res) => {
    try {
        const modes = await req.prisma.mode.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                icon: true,
                color: true,
                _count: {
                    select: { sessions: true }
                }
            }
        });

        res.json(modes.map(mode => ({
            ...mode,
            sessionCount: mode._count.sessions
        })));
    } catch (error) {
        console.error('List modes error:', error);
        res.status(500).json({ error: 'Failed to fetch modes' });
    }
});

/**
 * GET /modes/:slug
 * Get a single mode by slug
 */
router.get('/:slug', async (req, res) => {
    try {
        const mode = await req.prisma.mode.findUnique({
            where: { slug: req.params.slug },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                icon: true,
                color: true
            }
        });

        if (!mode) {
            return res.status(404).json({ error: 'Mode not found' });
        }

        res.json(mode);
    } catch (error) {
        console.error('Get mode error:', error);
        res.status(500).json({ error: 'Failed to fetch mode' });
    }
});

/**
 * GET /modes/:slug/sessions
 * Get mode with all its sessions (requires authentication)
 * Returns mode details plus all user's sessions for this mode with transcripts/notes
 */
router.get('/:slug/sessions', authenticate, async (req, res) => {
    try {
        // First get the mode
        const mode = await req.prisma.mode.findUnique({
            where: { slug: req.params.slug },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                icon: true,
                color: true
            }
        });

        if (!mode) {
            return res.status(404).json({ error: 'Mode not found' });
        }

        // Get all sessions for this mode belonging to the authenticated user
        const sessions = await req.prisma.session.findMany({
            where: {
                modeId: mode.id,
                userId: req.userId
            },
            select: {
                id: true,
                title: true,
                duration: true,
                transcript: true,
                notes: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            mode,
            sessions,
            totalSessions: sessions.length
        });
    } catch (error) {
        console.error('Get mode sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch mode sessions' });
    }
});

module.exports = router;

