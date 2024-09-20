const nodemailer = require('nodemailer');

exports.sendEmail = async ({ to, subject, html }) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Sua Empresa" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

    } catch {
        throw new Error('Error sending email');
    }
};
