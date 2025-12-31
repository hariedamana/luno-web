const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminAuth');

// Apply admin auth to all routes
router.use(adminAuth);

// ============================================
// 1. DASHBOARD - Command Overview
// ============================================
router.get('/dashboard', async (req, res) => {
    try {
        const [
            totalRecordings,
            todayRecordings,
            weeklyRecordings,
            activeDevices,
            totalUsers,
            pendingSessions,
            completedSessions,
            failedSessions
        ] = await Promise.all([
            req.prisma.session.count(),
            req.prisma.session.count({
                where: {
                    createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                }
            }),
            req.prisma.session.count({
                where: {
                    createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            }),
            req.prisma.device.count({ where: { status: 'connected' } }),
            req.prisma.user.count(),
            req.prisma.session.count({ where: { status: 'pending' } }),
            req.prisma.session.count({ where: { status: 'completed' } }),
            req.prisma.session.count({ where: { status: 'failed' } })
        ]);

        // Get last sync from most recently synced device
        const lastSyncDevice = await req.prisma.device.findFirst({
            where: { lastSync: { not: null } },
            orderBy: { lastSync: 'desc' },
            select: { lastSync: true }
        });

        res.json({
            recordings: {
                total: totalRecordings,
                today: todayRecordings,
                weekly: weeklyRecordings
            },
            devices: {
                active: activeDevices,
                total: await req.prisma.device.count()
            },
            users: totalUsers,
            processing: {
                pending: pendingSessions,
                completed: completedSessions,
                failed: failedSessions
            },
            aiAccuracy: 98.5, // Placeholder - would come from AI metrics
            lastSync: lastSyncDevice?.lastSync || null
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// ============================================
// 2. USER MANAGEMENT
// ============================================
router.get('/users', async (req, res) => {
    try {
        const users = await req.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                lastLoginAt: true,
                lastLoginIp: true,
                createdAt: true,
                _count: {
                    select: { sessions: true, devices: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role } = req.body;

        const user = await req.prisma.user.update({
            where: { id },
            data: { name, role },
            select: { id: true, email: true, name: true, role: true }
        });

        // Log the action
        await req.prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'auth',
                message: `User ${user.email} role updated to ${role}`,
                userId: req.user.id
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent self-deletion
        if (id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const user = await req.prisma.user.delete({ where: { id } });

        await req.prisma.systemLog.create({
            data: {
                type: 'warning',
                category: 'auth',
                message: `User ${user.email} deleted`,
                userId: req.user.id
            }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// ============================================
// 3. DEVICE MANAGEMENT
// ============================================
router.get('/devices', async (req, res) => {
    try {
        const devices = await req.prisma.device.findMany({
            include: {
                user: { select: { id: true, email: true, name: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(devices);
    } catch (error) {
        console.error('Get devices error:', error);
        res.status(500).json({ error: 'Failed to fetch devices' });
    }
});

router.put('/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, status } = req.body;

        const device = await req.prisma.device.update({
            where: { id },
            data: { name, location, status }
        });

        res.json(device);
    } catch (error) {
        console.error('Update device error:', error);
        res.status(500).json({ error: 'Failed to update device' });
    }
});

router.post('/devices/:id/reboot', async (req, res) => {
    try {
        const { id } = req.params;

        await req.prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'device',
                message: `Device ${id} reboot triggered`,
                userId: req.user.id
            }
        });

        // In real implementation, this would send command to device
        res.json({ message: 'Reboot command sent' });
    } catch (error) {
        console.error('Reboot device error:', error);
        res.status(500).json({ error: 'Failed to reboot device' });
    }
});

// ============================================
// 4. RECORDING MANAGEMENT
// ============================================
router.get('/sessions', async (req, res) => {
    try {
        const { date, deviceId, userId, modeId, status } = req.query;

        const where = {};
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            where.createdAt = { gte: startDate, lt: endDate };
        }
        if (userId) where.userId = userId;
        if (modeId) where.modeId = modeId;
        if (status) where.status = status;

        const sessions = await req.prisma.session.findMany({
            where,
            include: {
                user: { select: { id: true, email: true, name: true } },
                mode: { select: { id: true, name: true, icon: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        });

        res.json(sessions);
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

router.delete('/sessions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.prisma.session.delete({ where: { id } });

        await req.prisma.systemLog.create({
            data: {
                type: 'warning',
                category: 'session',
                message: `Session ${id} deleted`,
                userId: req.user.id
            }
        });

        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
});

router.delete('/sessions', async (req, res) => {
    try {
        const { ids } = req.body;

        await req.prisma.session.deleteMany({
            where: { id: { in: ids } }
        });

        await req.prisma.systemLog.create({
            data: {
                type: 'warning',
                category: 'session',
                message: `${ids.length} sessions deleted`,
                userId: req.user.id
            }
        });

        res.json({ message: `${ids.length} sessions deleted` });
    } catch (error) {
        console.error('Bulk delete sessions error:', error);
        res.status(500).json({ error: 'Failed to delete sessions' });
    }
});

// ============================================
// 5. AI & PROCESSING CONTROLS
// ============================================
router.get('/ai/config', async (req, res) => {
    try {
        const settings = await req.prisma.systemSettings.findMany({
            where: { category: 'ai' }
        });

        // Convert to object
        const config = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});

        res.json({
            languageModel: config.languageModel || 'whisper-large',
            noiseSuppressionLevel: config.noiseSuppressionLevel || 'medium',
            speakerDiarization: config.speakerDiarization === 'true',
            offlineMode: config.offlineMode === 'true',
            wordErrorRate: 2.3, // Placeholder metrics
            averageConfidence: 98.5
        });
    } catch (error) {
        console.error('Get AI config error:', error);
        res.status(500).json({ error: 'Failed to fetch AI config' });
    }
});

router.put('/ai/config', async (req, res) => {
    try {
        const updates = req.body;

        for (const [key, value] of Object.entries(updates)) {
            await req.prisma.systemSettings.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value), category: 'ai' }
            });
        }

        res.json({ message: 'AI config updated' });
    } catch (error) {
        console.error('Update AI config error:', error);
        res.status(500).json({ error: 'Failed to update AI config' });
    }
});

// ============================================
// 6. MODES CONFIGURATION
// ============================================
router.get('/modes', async (req, res) => {
    try {
        const modes = await req.prisma.mode.findMany({
            include: {
                _count: { select: { sessions: true } }
            },
            orderBy: { name: 'asc' }
        });
        res.json(modes);
    } catch (error) {
        console.error('Get modes error:', error);
        res.status(500).json({ error: 'Failed to fetch modes' });
    }
});

router.put('/modes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isEnabled, summaryStyle, keywordExtract, autoTitle, color } = req.body;

        const mode = await req.prisma.mode.update({
            where: { id },
            data: { name, description, isEnabled, summaryStyle, keywordExtract, autoTitle, color }
        });

        res.json(mode);
    } catch (error) {
        console.error('Update mode error:', error);
        res.status(500).json({ error: 'Failed to update mode' });
    }
});

// ============================================
// 7. SECURITY & PRIVACY
// ============================================
router.get('/security', async (req, res) => {
    try {
        const settings = await req.prisma.systemSettings.findMany({
            where: { category: 'security' }
        });

        const config = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});

        // Get recent security logs
        const securityLogs = await req.prisma.systemLog.findMany({
            where: { category: 'security' },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.json({
            encryptionAtRest: true,
            encryptionInTransit: true,
            localOnlyMode: config.localOnlyMode === 'true',
            autoDeleteDays: parseInt(config.autoDeleteDays) || 0,
            autoDeleteAfterExport: config.autoDeleteAfterExport === 'true',
            logs: securityLogs
        });
    } catch (error) {
        console.error('Get security error:', error);
        res.status(500).json({ error: 'Failed to fetch security settings' });
    }
});

router.put('/security', async (req, res) => {
    try {
        const updates = req.body;

        for (const [key, value] of Object.entries(updates)) {
            await req.prisma.systemSettings.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value), category: 'security' }
            });
        }

        await req.prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'security',
                message: 'Security settings updated',
                userId: req.user.id
            }
        });

        res.json({ message: 'Security settings updated' });
    } catch (error) {
        console.error('Update security error:', error);
        res.status(500).json({ error: 'Failed to update security settings' });
    }
});

router.post('/security/purge', async (req, res) => {
    try {
        const { type } = req.body; // 'all', 'sessions', 'logs'

        let message = '';
        if (type === 'sessions' || type === 'all') {
            await req.prisma.session.deleteMany();
            message += 'All sessions purged. ';
        }
        if (type === 'logs' || type === 'all') {
            await req.prisma.systemLog.deleteMany();
            message += 'All logs purged. ';
        }

        await req.prisma.systemLog.create({
            data: {
                type: 'warning',
                category: 'security',
                message: `Data purge executed: ${type}`,
                userId: req.user.id
            }
        });

        res.json({ message: message.trim() });
    } catch (error) {
        console.error('Purge error:', error);
        res.status(500).json({ error: 'Failed to purge data' });
    }
});

// ============================================
// 8. STORAGE & BACKUP
// ============================================
router.get('/storage', async (req, res) => {
    try {
        const [totalSessions, devices] = await Promise.all([
            req.prisma.session.count(),
            req.prisma.device.findMany({
                select: { id: true, name: true, storage: true }
            })
        ]);

        // Calculate approximate storage (placeholder logic)
        const avgSessionSize = 2.5; // MB
        const totalUsedMB = totalSessions * avgSessionSize;
        const totalCapacityMB = 10000; // 10GB

        res.json({
            used: totalUsedMB,
            total: totalCapacityMB,
            percentage: Math.round((totalUsedMB / totalCapacityMB) * 100),
            devices: devices.map(d => ({
                id: d.id,
                name: d.name,
                storageRemaining: d.storage
            })),
            backupEnabled: false,
            lastBackup: null
        });
    } catch (error) {
        console.error('Get storage error:', error);
        res.status(500).json({ error: 'Failed to fetch storage info' });
    }
});

// ============================================
// 9. SYSTEM SETTINGS
// ============================================
router.get('/settings', async (req, res) => {
    try {
        const settings = await req.prisma.systemSettings.findMany({
            where: { category: 'general' }
        });

        const config = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});

        res.json({
            defaultLanguage: config.defaultLanguage || 'en',
            timezone: config.timezone || 'UTC',
            dateFormat: config.dateFormat || 'YYYY-MM-DD',
            namingConvention: config.namingConvention || '{mode}_{date}_{time}',
            exportFormat: config.exportFormat || 'json'
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

router.put('/settings', async (req, res) => {
    try {
        const updates = req.body;

        for (const [key, value] of Object.entries(updates)) {
            await req.prisma.systemSettings.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value), category: 'general' }
            });
        }

        res.json({ message: 'Settings updated' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// ============================================
// 10. LOGS & ANALYTICS
// ============================================
router.get('/logs', async (req, res) => {
    try {
        const { type, category, limit = 50 } = req.query;

        const where = {};
        if (type) where.type = type;
        if (category) where.category = category;

        const logs = await req.prisma.systemLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit)
        });

        res.json(logs);
    } catch (error) {
        console.error('Get logs error:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

router.get('/analytics', async (req, res) => {
    try {
        // Mode usage analytics
        const modeUsage = await req.prisma.session.groupBy({
            by: ['modeId'],
            _count: { id: true },
            _avg: { duration: true }
        });

        // Get mode names
        const modes = await req.prisma.mode.findMany({
            select: { id: true, name: true }
        });
        const modeMap = Object.fromEntries(modes.map(m => [m.id, m.name]));

        // Daily session counts for last 7 days
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const dailySessions = await req.prisma.session.groupBy({
            by: ['createdAt'],
            where: { createdAt: { gte: weekAgo } },
            _count: { id: true }
        });

        res.json({
            modeUsage: modeUsage.map(m => ({
                mode: modeMap[m.modeId] || 'Unknown',
                count: m._count.id,
                avgDuration: Math.round(m._avg.duration || 0)
            })),
            totalRecordingTime: await req.prisma.session.aggregate({
                _sum: { duration: true }
            }).then(r => r._sum.duration || 0),
            averageSessionLength: await req.prisma.session.aggregate({
                _avg: { duration: true }
            }).then(r => Math.round(r._avg.duration || 0))
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// ============================================
// 11. HELP & DIAGNOSTICS
// ============================================
router.get('/diagnostics', async (req, res) => {
    try {
        const [dbStatus, deviceCount, errorCount] = await Promise.all([
            req.prisma.$queryRaw`SELECT 1`.then(() => 'healthy').catch(() => 'error'),
            req.prisma.device.count(),
            req.prisma.systemLog.count({ where: { type: 'error', createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
        ]);

        res.json({
            database: dbStatus,
            devices: deviceCount,
            recentErrors: errorCount,
            version: {
                server: '1.0.0',
                firmware: '1.0.0'
            },
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    } catch (error) {
        console.error('Get diagnostics error:', error);
        res.status(500).json({ error: 'Failed to fetch diagnostics' });
    }
});

module.exports = router;
