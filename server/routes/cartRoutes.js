const express = require('express');
const router = express.Router();

// Cart is handled client-side with Redux. These endpoints are for server-side cart sync.
router.get('/', (req, res) => res.json({ success: true, message: 'Cart API - use Redux client-side' }));

module.exports = router;

