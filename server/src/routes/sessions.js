const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();



// All session routes require authentication
router.use(authenticate);

/**
 * GET /sessions
 * List all sessions for the authenticated user
 * Query params: mode, search, limit, offset
 */
router.get('/', async (req, res) => {
    try {
        const { mode, search, limit = 50, offset = 0 } = req.query;

        const where = { userId: req.userId };

        if (mode) {
            where.mode = { slug: mode };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [sessions, total] = await Promise.all([
            req.prisma.session.findMany({
                where,
                include: {
                    mode: {
                        select: { name: true, slug: true, icon: true, color: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit),
                skip: parseInt(offset)
            }),
            req.prisma.session.count({ where })
        ]);

        res.json({
            sessions,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('List sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

/**
 * DELETE /sessions/all
 * Delete all sessions for the authenticated user
 */
router.delete('/all', async (req, res) => {
    try {
        const result = await req.prisma.session.deleteMany({
            where: { userId: req.userId }
        });

        console.log(`🗑️ DELETE /sessions/all: User ${req.userId} deleted ${result.count} sessions`);

        res.json({
            message: 'All sessions deleted successfully',
            count: result.count
        });
    } catch (error) {
        console.error('Delete all sessions error:', error);
        res.status(500).json({ error: 'Failed to delete sessions' });
    }
});

/**
 * GET /sessions/:id
 * Get a single session by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const session = await req.prisma.session.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId
            },
            include: {
                mode: {
                    select: { name: true, slug: true, icon: true, color: true }
                }
            }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json(session);
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

/**
 * POST /sessions
 * Create a new session
 */
router.post('/', async (req, res) => {
    try {
        const { title, modeId, duration, transcript, notes } = req.body;

        if (!title || !modeId) {
            return res.status(400).json({ error: 'Title and mode are required' });
        }

        // Verify mode exists
        const mode = await req.prisma.mode.findUnique({ where: { id: modeId } });
        if (!mode) {
            return res.status(400).json({ error: 'Invalid mode' });
        }

        const session = await req.prisma.session.create({
            data: {
                title,
                modeId,
                duration: duration || 0,
                transcript,
                notes,
                userId: req.userId
            },
            include: {
                mode: {
                    select: { name: true, slug: true, icon: true, color: true }
                }
            }
        });

        res.status(201).json(session);
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

/**
 * PUT /sessions/:id
 * Update a session
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, notes, transcript, duration } = req.body;

        // Check ownership
        const existing = await req.prisma.session.findFirst({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const session = await req.prisma.session.update({
            where: { id: req.params.id },
            data: {
                ...(title && { title }),
                ...(notes !== undefined && { notes }),
                ...(transcript !== undefined && { transcript }),
                ...(duration !== undefined && { duration })
            },
            include: {
                mode: {
                    select: { name: true, slug: true, icon: true, color: true }
                }
            }
        });

        res.json(session);
    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({ error: 'Failed to update session' });
    }
});

/**
 * DELETE /sessions/:id
 * Delete a session
 */
router.delete('/:id', async (req, res) => {
    try {
        // Check ownership
        const existing = await req.prisma.session.findFirst({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Session not found' });
        }

        await req.prisma.session.delete({
            where: { id: req.params.id }
        });

        console.log(`🗑️ DELETE /sessions/:id: User ${req.userId} deleted session ${req.params.id}`);

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
});

/**
 * POST /sessions/:id/export
 * Export session data
 */
router.post('/:id/export', async (req, res) => {
    try {
        const session = await req.prisma.session.findFirst({
            where: { id: req.params.id, userId: req.userId },
            include: {
                mode: { select: { name: true, slug: true } }
            }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Format for export
        const exportData = {
            title: session.title,
            mode: session.mode.name,
            duration: session.duration,
            createdAt: session.createdAt,
            transcript: session.transcript || '',
            notes: session.notes || '',
            exportedAt: new Date().toISOString()
        };

        res.json(exportData);
    } catch (error) {
        console.error('Export session error:', error);
        res.status(500).json({ error: 'Failed to export session' });
    }
});

/**
 * POST /sessions/:id/transcribe
 * Transcribe audio for a session using Whisper AI
 */
router.post('/:id/transcribe', async (req, res) => {
    try {
        // Get the session
        const session = await req.prisma.session.findFirst({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Extract file ID from notes (format: "File ID: <uuid>")
        const fileIdMatch = session.notes?.match(/File ID: ([a-f0-9-]+)/);
        if (!fileIdMatch) {
            return res.status(400).json({ error: 'No audio file associated with this session' });
        }

        const fileId = fileIdMatch[1];
        console.log(`🎙️ Starting transcription for session ${req.params.id}, file: ${fileId}`);

        // Call AI server for transcription
        const aiServerUrl = process.env.AI_SERVER_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${aiServerUrl}/api/transcribe/${fileId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Transcription failed');
        }

        const result = await response.json();

        // Save transcript to session
        const updatedSession = await req.prisma.session.update({
            where: { id: req.params.id },
            data: { transcript: result.transcript },
            include: {
                mode: {
                    select: { name: true, slug: true, icon: true, color: true }
                }
            }
        });

        console.log(`✅ Transcription saved for session ${req.params.id}`);

        res.json({
            message: 'Transcription complete',
            transcript: result.transcript,
            session: updatedSession
        });
    } catch (error) {
        console.error('Transcribe session error:', error);
        res.status(500).json({ error: `Transcription failed: ${error.message}` });
    }
});

/**
 * POST /sessions/:id/pdf
 * Generate PDF for session transcript
 */
router.post('/:id/pdf', async (req, res) => {
    try {
        const session = await req.prisma.session.findFirst({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (!session.transcript) {
            return res.status(400).json({ error: 'No transcript available for this session' });
        }

        // Call AI server for PDF generation
        const aiServerUrl = process.env.AI_SERVER_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${aiServerUrl}/api/transcript/pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transcript: session.transcript,
                title: session.title,
                session_id: session.id
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'PDF generation failed');
        }

        const result = await response.json();

        console.log(`📄 PDF generated for session ${req.params.id}`);

        res.json({
            message: 'PDF generated',
            pdf_url: `${aiServerUrl}${result.pdf_url}`,
            filename: result.filename
        });
    } catch (error) {
        console.error('Generate PDF error:', error);
        res.status(500).json({ error: `PDF generation failed: ${error.message}` });
    }
});

module.exports = router;
