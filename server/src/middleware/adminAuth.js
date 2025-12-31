const jwt = require('jsonwebtoken');

// Middleware to check if user is authenticated and has admin role
const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user with role
        const user = await req.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to check if user has moderator or admin role
const moderatorAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await req.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!['ADMIN', 'MODERATOR'].includes(user.role)) {
            return res.status(403).json({ error: 'Moderator access required' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Moderator auth error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { adminAuth, moderatorAuth };
