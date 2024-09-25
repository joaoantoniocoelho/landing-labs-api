const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const logger = require('pino')();
const Constants = require('../constants/constants');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.warn(Constants.LOGGER.AUTH.NO_TOKEN);
        return res.status(401).json({ 
            code: Constants.AUTH.NO_TOKEN.CODE, 
            message: Constants.AUTH.NO_TOKEN.MESSAGE 
        });
    }

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            logger.warn(Constants.LOGGER.AUTH.TOKEN_INVALID);
            return res.status(401).json({ 
                code: Constants.AUTH.TOKEN_INVALID.CODE, 
                message: Constants.AUTH.TOKEN_INVALID.MESSAGE 
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ 
                code: Constants.USER.NOT_FOUND.CODE, 
                message: Constants.USER.NOT_FOUND.MESSAGE 
            });
        }

        const tokenIssuedAt = new Date(decoded.iat * 1000);
        const lastPasswordChange = new Date(user.lastPasswordChange);

        if (tokenIssuedAt < lastPasswordChange) {
            logger.info(`${Constants.LOGGER.AUTH.TOKEN_EXPIRED_PASSWORD_CHANGE} ${user.email}`);
            return res.status(401).json({ 
                code: Constants.AUTH.TOKEN_EXPIRED_PASSWORD_CHANGE.CODE, 
                message: Constants.AUTH.TOKEN_EXPIRED_PASSWORD_CHANGE.MESSAGE 
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        logger.error(`Error during token verification: ${err.message}`);
        return res.status(500).json({ 
            code: Constants.ERROR.SERVER_ERROR.CODE, 
            message: Constants.ERROR.SERVER_ERROR.MESSAGE 
        });
    }
};

module.exports = authMiddleware;
