const express = require('express');
const router = express.Router();
const { aiChat, getSuggestions } = require('../controllers/aiController');

router.post('/chat', aiChat);
router.get('/suggestions/:productId', getSuggestions);

module.exports = router;

