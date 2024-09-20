const { verifyToken } = require('../utils/jwt');
const User = require('../models/User'); // Ou o caminho correto para o modelo de usuário

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ message: 'User not found.' });
    }

    const tokenIssuedAt = new Date(decoded.iat * 1000);
    const lastPasswordChange = new Date(user.lastPasswordChange);

    if (tokenIssuedAt < lastPasswordChange) {
        return res.status(401).json({ message: 'Token is invalid, password was changed.' });
    }

    req.user = decoded;
    
    next();
};

module.exports = authMiddleware;
