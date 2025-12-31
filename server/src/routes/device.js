const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All device routes require authentication
router.use(authenticate);

/**
 * GET /device
 * Get user's device status (simulated)
 */
router.get('/', async (req, res) => {
    try {
        let device = await req.prisma.device.findFirst({
            where: { userId: req.userId }
        });

        // Create default device if none exists
        if (!device) {
            device = await req.prisma.device.create({
                data: {
                    name: 'LUNO Edge Device',
                    status: 'disconnected',
                    firmware: '1.0.0',
                    battery: 100,
                    userId: req.userId
                }
            });
        }

        res.json(device);
    } catch (error) {
        console.error('Get device error:', error);
        res.status(500).json({ error: 'Failed to get device status' });
    }
});

/**
 * POST /device/connect
 * Simulate device connection
 */
router.post('/connect', async (req, res) => {
    try {
        let device = await req.prisma.device.findFirst({
            where: { userId: req.userId }
        });

        if (!device) {
            device = await req.prisma.device.create({
                data: {
                    name: 'LUNO Edge Device',
                    status: 'connected',
                    firmware: '1.0.0',
                    battery: 100,
                    userId: req.userId
                }
            });
        } else {
            device = await req.prisma.device.update({
                where: { id: device.id },
                data: { status: 'connected' }
            });
        }

        res.json({
            message: 'Device connected successfully',
            device
        });
    } catch (error) {
        console.error('Connect device error:', error);
        res.status(500).json({ error: 'Failed to connect device' });
    }
});

/**
 * POST /device/disconnect
 * Simulate device disconnection
 */
router.post('/disconnect', async (req, res) => {
    try {
        const device = await req.prisma.device.findFirst({
            where: { userId: req.userId }
        });

        if (!device) {
            return res.status(404).json({ error: 'No device found' });
        }

        const updated = await req.prisma.device.update({
            where: { id: device.id },
            data: { status: 'disconnected' }
        });

        res.json({
            message: 'Device disconnected',
            device: updated
        });
    } catch (error) {
        console.error('Disconnect device error:', error);
        res.status(500).json({ error: 'Failed to disconnect device' });
    }
});

/**
 * POST /device/sync
 * Simulate device sync
 */
router.post('/sync', async (req, res) => {
    try {
        const device = await req.prisma.device.findFirst({
            where: { userId: req.userId }
        });

        if (!device) {
            return res.status(404).json({ error: 'No device found' });
        }

        if (device.status !== 'connected') {
            return res.status(400).json({ error: 'Device must be connected to sync' });
        }

        // Simulate sync delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const updated = await req.prisma.device.update({
            where: { id: device.id },
            data: {
                lastSync: new Date(),
                battery: Math.max(0, device.battery - Math.floor(Math.random() * 5))
            }
        });

        res.json({
            message: 'Sync completed successfully',
            device: updated,
            syncedSessions: 0 // Simulated
        });
    } catch (error) {
        console.error('Sync device error:', error);
        res.status(500).json({ error: 'Failed to sync device' });
    }
});

/**
 * PUT /device
 * Update device settings
 */
router.put('/', async (req, res) => {
    try {
        const { name } = req.body;

        const device = await req.prisma.device.findFirst({
            where: { userId: req.userId }
        });

        if (!device) {
            return res.status(404).json({ error: 'No device found' });
        }

        const updated = await req.prisma.device.update({
            where: { id: device.id },
            data: { name }
        });

        res.json(updated);
    } catch (error) {
        console.error('Update device error:', error);
        res.status(500).json({ error: 'Failed to update device' });
    }
});

module.exports = router;
