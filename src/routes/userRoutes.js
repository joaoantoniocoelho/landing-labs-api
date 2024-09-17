const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/protected', authMiddleware, userController.hello);

module.exports = router;
