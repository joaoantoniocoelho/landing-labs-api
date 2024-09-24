const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('pino')();
const userSchema = require('../schemas/userSchema'); 

const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/emailUtils');
const Constants = require('../constants/constants'); // Importando as constantes

exports.registerUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        logger.warn(`${Constants.VALIDATION.FAILED.MESSAGE} ${error.details[0].message}`);
        return res.status(400).json({ 
            code: Constants.VALIDATION.FAILED.CODE, 
            message: Constants.VALIDATION.FAILED.MESSAGE + error.details[0].message 
        });
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            logger.info(`${Constants.LOGGER.REGISTER.USER_ALREADY_REGISTERED} ${email}`);
            return res.status(400).json({
                code: Constants.USER.ALREADY_EXISTS.CODE,
                message: Constants.USER.ALREADY_EXISTS.MESSAGE
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash
        });

        await newUser.save();
        logger.info(`${Constants.LOGGER.REGISTER.NEW_USER_REGISTERED} ${email}`);

        res.status(201).json({ 
            code: Constants.USER.CREATED.CODE, 
            message: Constants.USER.CREATED.MESSAGE 
        });
    } catch (err) {
        logger.error(`${Constants.ERROR.SERVER_ERROR.MESSAGE}: ${err.message}`);
        res.status(500).json({ 
            code: Constants.ERROR.SERVER_ERROR.CODE, 
            message: Constants.ERROR.SERVER_ERROR.MESSAGE 
        });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            logger.info(`${Constants.LOGGER.LOGIN.INVALID_EMAIL} ${email}`);
            return res.status(400).json({
                code: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.CODE,
                message: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.MESSAGE
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            logger.info(`${Constants.LOGGER.LOGIN.INVALID_PASSWORD} ${email}`);
            return res.status(400).json({
                code: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.CODE,
                message: Constants.AUTH.INVALID_EMAIL_OR_PASSWORD.MESSAGE
            });
        }

        const token = generateToken(user._id, user.email, user.name);
        logger.info(`${Constants.LOGGER.LOGIN.SUCCESSFUL_LOGIN} ${email}`);
        res.status(200).json({ 
            token, 
            code: Constants.USER.LOGIN_SUCCESSFUL.CODE, 
            message: Constants.USER.LOGIN_SUCCESSFUL.MESSAGE 
        });
    } catch (err) {
        logger.error(`${Constants.ERROR.SERVER_ERROR.MESSAGE}: ${err.message}`);
        res.status(500).json({ 
            code: Constants.ERROR.SERVER_ERROR.CODE, 
            message: Constants.ERROR.SERVER_ERROR.MESSAGE 
        });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
        const user = await User.findOne({ email });
  
        if (!user) {
            logger.info(`${Constants.LOGGER.PASSWORD_RESET.ATTEMPT_NON_EXISTENT_USER} ${email}`);
            return res.status(404).json({ 
                code: Constants.USER.NOT_FOUND.CODE,
                message: Constants.USER.NOT_FOUND.MESSAGE
            });
        }
  
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333333; background-color: #F4ECF7; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #6A1B9A;">Redefinição de Senha</h1>
          <p style="font-size: 16px; color: #333333;">Olá,</p>
          <p style="font-size: 16px; color: #333333;">
            Você solicitou a redefinição de sua senha. Clique no botão abaixo para redefinir:
          </p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" 
               style="background-color: #8E44AD; color: #ffffff; padding: 12px 24px; border-radius: 5px; font-size: 16px; text-decoration: none; display: inline-block; font-weight: bold;">
              Redefinir Minha Senha
            </a>
          </p>
          <p style="font-size: 14px; color: #333333;">
            Se você não solicitou a redefinição de senha, por favor desconsidere este e-mail. Seus dados estão protegidos e sua conta segura.
          </p>
          <p style="font-size: 14px; color: #333333;">
            Obrigado,<br>
            A Equipe do Page Express
          </p>
          <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999999;">
            Este é um e-mail automático, por favor, não responda.
          </p>
        </div>
      `;
  
        await sendEmail({
            to: user.email,
            subject: 'Redefinição de Senha',
            html: htmlContent,
        });
  
        logger.info(`${Constants.LOGGER.PASSWORD_RESET.EMAIL_SENT} ${email}`);
        res.status(200).json({ 
            code: Constants.USER.PASSWORD_RESET_EMAIL_SENT.CODE, 
            message: Constants.USER.PASSWORD_RESET_EMAIL_SENT.MESSAGE 
        });
    } catch (err) {
        logger.error(`${Constants.ERROR.EMAIL_SEND_ERROR.MESSAGE} ${email}: ${err.message}`);
        res.status(500).json({ 
            code: Constants.ERROR.EMAIL_SEND_ERROR.CODE, 
            message: Constants.ERROR.EMAIL_SEND_ERROR.MESSAGE 
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
    
        if (!user) {
            logger.info(`${Constants.LOGGER.PASSWORD_RESET.ATTEMPT_NON_EXISTENT_USER} ${decoded.id}`);
            return res.status(404).json({ 
                code: Constants.USER.NOT_FOUND.CODE,
                message: Constants.USER.NOT_FOUND.MESSAGE
            });
        }
  
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
  
        user.password = passwordHash;
        user.lastPasswordChange = Date.now();

        await user.save();
  
        logger.info(`Password reset successful for user: ${user.email}`);
        res.status(200).json({ 
            code: Constants.USER.PASSWORD_RESET_SUCCESSFUL.CODE, 
            message: Constants.USER.PASSWORD_RESET_SUCCESSFUL.MESSAGE 
        });
    } catch (err) {
        logger.error(`${Constants.AUTH.TOKEN_INVALID.MESSAGE}: ${err.message}`);
        res.status(400).json({ 
            code: Constants.AUTH.TOKEN_INVALID.CODE,
            message: Constants.AUTH.TOKEN_INVALID.MESSAGE 
        });
    }
};

exports.validateToken = async (req,res) => {
    logger.info(Constants.LOGGER.AUTH.TOKEN_VALIDATION);
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = req.params.token;

    if (!token) {
        return res.status(400).json({ code: Constants.AUTH.NO_TOKEN.CODE, message: Constants.AUTH.NO_TOKEN.MESSAGE });
    };

    try {
        jwt.verify(token, JWT_SECRET);
        return res.status(200).json({ code: Constants.AUTH.TOKEN_VALID.CODE, message: Constants.AUTH.TOKEN_VALID.MESSAGE }); 
    } catch (error) {
        logger.error(`${Constants.LOGGER.AUTH.TOKEN_VERIFICATION_FAILED}: ${error.message}`);
        return res.status(401).json({ code: Constants.AUTH.TOKEN_VERIFICATION_FAILED.CODE, message: Constants.AUTH.TOKEN_VERIFICATION_FAILED.MESSAGE });
    }
};
