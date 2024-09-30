const express = require('express');
const router = express.Router();

const leadController = require('../controllers/leadController');

router.post('/register-lead', leadController.registerLead);

module.exports = router;
