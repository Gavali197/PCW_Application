const express = require('express');
const router = express.Router();
const { getSystemOverview } = require('../controllers/analyticsController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

router.get('/overview', protect, authorizeRoles('SuperAdmin'), getSystemOverview);

module.exports = router;