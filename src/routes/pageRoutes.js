const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware'); 
const pageController = require('../controllers/pageController'); 

router.post('/', authMiddleware, pageController.createPage);
router.put('/:id', authMiddleware, pageController.updatePage);
router.delete('/:id', authMiddleware, pageController.deletePage);
router.get('/', authMiddleware, pageController.getUserPages);
router.get('/:slug', pageController.getPageBySlug);
