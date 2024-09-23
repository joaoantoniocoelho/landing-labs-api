const nodemailer = require('nodemailer');
const logger = require('pino')(); // Para logs
const Constants = require('../constants/constants'); // Importando as constantes

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Page Express" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        logger.info(`${Constants.LOGGER.EMAIL.SUCCESS} ${to}`);
    } catch (error) {
        logger.error(`${Constants.LOGGER.EMAIL.ERROR} ${to}: ${error.message}`);
        throw new Error(Constants.ERROR.EMAIL_SEND_ERROR.MESSAGE);
    }
};
