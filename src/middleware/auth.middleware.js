const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const logger = require('pino')(); 

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.warn('Access denied. No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            logger.warn('Invalid or expired token.');
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            logger.warn(`User not found. Token provided for user ID: ${decoded.id}`);
            return res.status(401).json({ message: 'User not found.' });
        }

        const tokenIssuedAt = new Date(decoded.iat * 1000);
        const lastPasswordChange = new Date(user.lastPasswordChange);

        if (tokenIssuedAt < lastPasswordChange) {
            logger.info(`Token invalid due to password change. User: ${user.email}`);
            return res.status(401).json({ message: 'Token is invalid, password was changed.' });
        }

        req.user = decoded;
        logger.info(`Authenticated request for user: ${user.email}`);
        
        next();
    } catch (err) {
        logger.error(`Error during token verification: ${err.message}`);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = authMiddleware;
