const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('pino')();  // Cria instância do logger
const userSchema = require('../schemas/userSchema'); 

const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/emailUtils');

exports.registerUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        logger.warn(`Validation failed during registration: ${error.details[0].message}`);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            logger.info(`Attempt to register existing user with email: ${email}`);
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash
        });

        await newUser.save();
        logger.info(`New user registered with email: ${email}`);

        res.status(201).json({ message: 'User created.' });
    } catch (err) {
        logger.error(`Error during user registration: ${err.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            logger.info(`Invalid login attempt: user with email ${email} not found`);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            logger.info(`Invalid login attempt: wrong password for email ${email}`);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id, user.email);
        logger.info(`User logged in successfully: ${email}`);
        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        logger.error(`Error during login: ${err.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
        const user = await User.findOne({ email });
  
        if (!user) {
            logger.info(`Password reset attempt for non-existent user: ${email}`);
            return res.status(404).json({ message: 'User not found.' });
        }
  
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; text-align: center;">
          <h1 style="color: #333333;">Redefinição de Senha</h1>
          <p style="font-size: 16px; color: #555555;">Olá,</p>
          <p style="font-size: 16px; color: #555555;">
            Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:
          </p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" 
               style="color: #2ecc71; font-size: 16px;">
              Redefinir minha senha
            </a>
          </p>
          <p style="font-size: 14px; color: #999999;">
            Se você não solicitou a redefinição de senha, por favor ignore este e-mail. Seus dados estão protegidos e sua conta segura.
          </p>
          <p style="font-size: 14px; color: #999999;">
            Obrigado,<br>
            A Equipe do Landing Labs
          </p>
        </div>
      `;
  
        await sendEmail({
            to: user.email,
            subject: 'Redefinição de Senha',
            html: htmlContent,
        });
  
        logger.info(`Password reset email sent to: ${email}`);
        res.status(200).json({ message: 'E-mail was sent.' });
    } catch (err) {
        logger.error(`Error sending password reset email to ${email}: ${err.message}`);
        res.status(500).json({ message: 'Error sending e-mail.' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
    
        if (!user) {
            logger.info(`Password reset attempt for non-existent user ID: ${decoded.id}`);
            return res.status(404).json({ message: 'User not found.' });
        }
  
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
  
        user.password = passwordHash;
        user.lastPasswordChange = Date.now();

        await user.save();
  
        logger.info(`Password reset successful for user: ${user.email}`);
        res.status(200).json({ message: 'Password was reset.' });
    } catch (err) {
        logger.error(`Invalid token during password reset: ${err.message}`);
        res.status(400).json({ message: 'Token invalid.' });
    }
};
