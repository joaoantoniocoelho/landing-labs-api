const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Pega o token do header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = decoded;
    
    next();
};

module.exports = authMiddleware;
