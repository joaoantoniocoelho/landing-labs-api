const jwt = require('jsonwebtoken');
const logger = require('pino')(); // Para logs
const Constants = require('../constants/constants'); // Importando as constantes

const generateToken = (userId, email, name) => {
    try {
        const token = jwt.sign(
            { id: userId, email: email, name: name},              
            process.env.JWT_SECRET,             
            { expiresIn: '1h' }                 
        );
        logger.info(`${Constants.LOGGER.AUTH.TOKEN_GENERATED} ${email}`);
        return token;
    } catch (error) {
        logger.error(`${Constants.LOGGER.AUTH.TOKEN_GENERATION_FAILED} ${email}, ${error.message}`);
        throw new Error(Constants.AUTH.TOKEN_GENERATION_FAILED.MESSAGE);
    }
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        logger.info(`${Constants.LOGGER.AUTH.TOKEN_VERIFIED} ${decoded.email}`);
        return decoded;
    } catch (error) {
        logger.warn(`${Constants.LOGGER.AUTH.TOKEN_VERIFICATION_FAILED} ${error.message}`);
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
