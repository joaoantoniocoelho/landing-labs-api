const Lead = require('../models/Leads');
const { sendEmail } = require('../utils/emailUtils');
const Constants = require('../constants/constants');

exports.registerLead = async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ 
            code: Constants.VALIDATION.FAILED.CODE, 
            message: Constants.VALIDATION.FAILED.MESSAGE + ' Email inválido.' 
        });
    }

    try {
        const leadExists = await Lead.findOne({ email });

        if (leadExists) {
            return res.status(200).json({
                code: Constants.LEAD.ALREADY_EXISTS.CODE,
                message: Constants.LEAD.ALREADY_EXISTS.MESSAGE,
            });
        }

        const newLead = new Lead({ email });
        await newLead.save();

        const htmlContent = `
        <div style="font-family: 'Inter', sans-serif; color: #212121; background-color: #FEFEFE; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; text-align: center; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #1A73E8;">Bem-vindo ao Page Express!</h1>
          <p style="font-size: 16px; color: #212121;">
            Obrigado por se inscrever no Page Express. Você será um dos primeiros a saber sobre nosso lançamento.
          </p>
          <p style="font-size: 14px; color: #212121;">
            Enquanto isso, fique atento ao seu e-mail para atualizações exclusivas.
          </p>
          <p style="font-size: 14px; color: #212121;">
            Atenciosamente,<br>A Equipe do Page Express
          </p>
          <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 20px 0;">
          <p style="font-size: 12px; color: #999999;">
            Este é um e-mail automático, por favor, não responda.
          </p>
        </div>
        `;

        await sendEmail({
            to: email,
            subject: 'Obrigado por se inscrever no Page Express',
            html: htmlContent,
        });


        res.status(201).json({ 
            code: Constants.LEAD.CREATED.CODE, 
            message: Constants.LEAD.CREATED.MESSAGE 
        });
    } catch {
        res.status(500).json({ 
            code: Constants.ERROR.SERVER_ERROR.CODE, 
            message: Constants.ERROR.SERVER_ERROR.MESSAGE 
        });
    }
};
