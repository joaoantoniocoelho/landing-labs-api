const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { generateToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/emailUtils')

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id, user.email);
        res.status(200).json({ token, message: 'Login successful' })
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
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
  
      res.status(200).json({ message: 'E-mail was sended.' });
    } catch (error) {
      console.error(error);
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
            return res.status(404).json({ message: 'User not found.' });
        }
  
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
  
        user.password = passwordHash;
  
        await user.save();
  
        res.status(200).json({ message: 'Password was reseted.' });
    } catch (error) {
        res.status(400).json({ message: 'Token invalid.' });
    }
}
  