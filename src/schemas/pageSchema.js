const Joi = require('joi');

const pageSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    slug: Joi.string().pattern(new RegExp('^[a-z0-9]+(?:-[a-z0-9]+)*$')).required(), // O slug deve ser amigável para URL
    metaTitle: Joi.string().max(60).optional(), // Meta title com limite de 60 caracteres para SEO
    metaDescription: Joi.string().max(160).optional(), // Meta description com limite de 160 caracteres para SEO
    metaKeywords: Joi.array().items(Joi.string()).min(5).required(), // Pelo menos 5 keywords
    content: Joi.object().required(), // O conteúdo da página será um JSON, obrigatório
});

// Função para validar os dados
const validatePage = (data) => {
    return pageSchema.validate(data);
};

module.exports = validatePage;
