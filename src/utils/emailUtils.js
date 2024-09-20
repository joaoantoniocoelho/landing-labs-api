const nodemailer = require('nodemailer');
const logger = require('pino')(); // Para logs

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
            from: `"Landing Labs" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        logger.info(`Email successfully sent to ${to}`);
    } catch (error) {
        logger.error(`Error sending email to ${to}: ${error.message}`);
        throw new Error('Error sending email');
    }
};
