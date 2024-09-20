const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', userController.registerUser);

module.exports = router;
