const jwt = require('jsonwebtoken');
const logger = require('pino')(); // Para logs

const generateToken = (userId, email) => {
    try {
        const token = jwt.sign(
            { id: userId, email },              
            process.env.JWT_SECRET,             
            { expiresIn: '1h' }                 
        );
        logger.info(`Token generated for user: ${email}`);
        return token;
    } catch (error) {
        logger.error(`Error generating token for user: ${email}, ${error.message}`);
        throw new Error('Token generation failed');
    }
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        logger.info(`Token verified successfully for user: ${decoded.email}`);
        return decoded;
    } catch (error) {
        logger.warn(`Token verification failed: ${error.message}`);
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
