const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /recorder/session
 * Create a new session from the Luno Recorder app
 * This endpoint is specifically for the mobile/portable recorder
 */
router.post('/session', authenticate, async (req, res) => {
    try {
        const { fileId, modeSlug, duration } = req.body;

        if (!fileId) {
            return res.status(400).json({ error: 'File ID is required' });
        }

        // Default to 'sync' mode if not provided
        const targetSlug = modeSlug || 'sync';

        // Look up the mode by slug
        let mode = await req.prisma.mode.findUnique({
            where: { slug: targetSlug }
        });

        // If mode not found, try to find any mode as fallback
        if (!mode) {
            mode = await req.prisma.mode.findFirst();
            if (!mode) {
                return res.status(400).json({ error: 'No modes available. Please seed the database.' });
            }
        }

        // Create the session with "Untitled" as default title
        const session = await req.prisma.session.create({
            data: {
                title: 'Untitled',
                modeId: mode.id,
                duration: parseInt(duration) || 0,
                notes: `File ID: ${fileId}`,
                status: 'completed',
                userId: req.userId
            },
            include: {
                mode: {
                    select: { name: true, slug: true, icon: true, color: true }
                }
            }
        });

        console.log(`🎙️ Recorder session created: ${session.id} for user ${req.userId}`);

        res.status(201).json({
            success: true,
            sessionId: session.id,
            session
        });
    } catch (error) {
        console.error('Create recorder session error:', error);
        res.status(500).json({ error: 'Failed to create session from recorder' });
    }
});

/**
 * GET /recorder/modes
 * Get available modes for the recorder dropdown
 * This is a public endpoint (no auth required) so recorder can show modes
 */
router.get('/modes', async (req, res) => {
    try {
        const modes = await req.prisma.mode.findMany({
            where: { isEnabled: true },
            select: {
                id: true,
                name: true,
                slug: true,
                color: true,
                icon: true
            },
            orderBy: { name: 'asc' }
        });

        res.json(modes);
    } catch (error) {
        console.error('Get recorder modes error:', error);
        res.status(500).json({ error: 'Failed to fetch modes' });
    }
});

module.exports = router;
