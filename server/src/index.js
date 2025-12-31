require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const modeRoutes = require('./routes/modes');
const deviceRoutes = require('./routes/device');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const recorderRoutes = require('./routes/recorder');

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000', // Luno Recorder app
    'http://127.0.0.1:3000'
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins in development
        }
    },
    credentials: true
}));
app.use(express.json());

// Make Prisma available in routes
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);
app.use('/modes', modeRoutes);
app.use('/device', deviceRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);
app.use('/recorder', recorderRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Start server
async function start() {
    try {
        await prisma.$connect();
        console.log('📦 Connected to database');
        const [userCount, sessionCount] = await Promise.all([
            prisma.user.count(),
            prisma.session.count()
        ]);
        console.log(`📊 STATS: Users: ${userCount}, Sessions: ${sessionCount}`);

        app.listen(PORT, () => {
            console.log(`🚀 LUNO server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
