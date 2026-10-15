const express = require('express');
const router = express.Router();
const { getDashboardMetrics, getAllUsers, seedData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/metrics', protect, admin, getDashboardMetrics);
router.get('/users', protect, admin, getAllUsers);
router.post('/seed', seedData); // Public for demo purposes

module.exports = router;

