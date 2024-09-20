const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware.js');

router.get('/ping', authMiddleware, async(req, res) => {
    return res.status(200).json({ message: 'Pong!' });
});

module.exports = router;
