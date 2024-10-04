const { json } = require('express/lib/response');
const Page = require('../models/Page');
const validatePage = require('../schemas/pageSchema');

exports.createPage = async (req, res) => {
    const { error } = validatePage(req.body);
    if (error) {
        return res.status(400).json ({
            code: 'VALIDATION_ERROR',
            message: error.details[0].message
        });
    }

    const { title, slug, metaTitle, metaDescription, metaKeywords, content } = req.body;
  
    try {
        const newPage = new Page({
            user: req.user.id,
            title,
            slug,
            metaTitle,
            metaDescription,
            metaKeywords,
            content,
            status: 'draft'
        });

        await newPage.save();

        res.status(201),json({
            code: 'PAGE_CREATED',
            message: 'Página criada com sucesso.',
            page: newPage
        });
    } catch {
        res.status(500).json({
            code: 'ERROR_CREATING_PAGE',
            message: 'Error ao criar página'
        });
    }
};

exports.updatePage = async (req, res) => {
    const { error } = validatePage(req.body);

    if (error) {
        return res.status(400).json({ 
            code: 'VALIDATION_ERROR', 
            message: error.details[0].message 
        });
    }

    try {
        const page = await Page.findOne({
            _id: req.params.id,
            user: req.user.id,
            deletedAt: null
        });

        if (!page) {
            return res.status(404).json({ 
                code: 'PAGE_NOT_FOUND', 
                message: 'Página não encontrada.' 
            });
        }

        page.title = req.body.title || page.title;
        page.slug = req.body.slug || page.slug;
        page.metaTitle = req.body.metaTitle || page.metaTitle;
        page.metaDescription = req.body.metaDescription || page.metaDescription;
        page.metaKeywords = req.body.metaKeywords || page.metaKeywords;
        page.content = req.body.content || page.content;
        page.updatedAt = Date.now();

        await page.save();

        res.status(200).json({
            code: 'PAGE_UPDATED',
            message: 'Página atualizada com sucesso',
            page: page
        });

    } catch {
        res.status(500).json({ 
            code: 'ERROR_UPDATING_PAGE', 
            message: 'Erro ao atualizar página.' 
        });
    }
};

exports.deletePage = async (req, res) => {
    try {
        const page = await Page.findOne({
            _id: req.params.id,
            user: req.user.id,
            deletedAt: null
        });

        if (!page) {
            return res.status(404).json({
                code: 'PAGE_NOT_FOUND',
                message: 'Página não encontrada ou já foi deletada.'
            });
        }

        page.deletedAt = Date.now();

        await page.save();

        res.status(200).json({
            code: 'PAGE_DELETED',
            message: 'Página deletada com sucesso.'
        });
    } catch {
        res.status(500).json({
            code: 'ERROR_DELETING_PAGE',
            message: 'Erro ao deletar página.'
        });
    }
};

exports.getUserPages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await Page.aggregate([
            { $match: { user: req.user.id, deletedAt: null } },
            {
                $facet: {
                    pages: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                    totalCount: [
                        { $count: 'total' }         
                    ]
                }
            }
        ]);

        const pages = result[0].pages;
        const totalCount = result[0].totalCount[0] ? result[0].totalCount[0].total : 0;

        res.status(200).json({
            code: 'PAGES_FOUND',
            message: 'Páginas encontradas com sucesso.',
            pages,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch {
        res.status(500).json({ 
            code: 'ERROR_FETCHING_PAGES', 
            message: 'Erro ao buscar páginas.' 
        });
    }
};

exports.getPageBySlug = async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug, status: 'published', deletedAt: null });

        if (!page) {
            return res.status(404).json({
                code: 'PAGE_NOT_FOUND',
                message: 'Página não encontrada ou ainda não foi publicada.'
            });
        }

        res.status(200).json({
            code: 'PAGE_FOUND',
            message: 'Página encontrada com sucesso.',
            page
        });
    
    } catch {
        res.status(500).json({
            code: 'ERROR_FETCHING_PAGE',
            message: 'Erro ao buscar página.'
        });
    }
};