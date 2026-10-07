const express = require('express');
const router = express.Router();
const { getAuditLogs, getLogsByUser } = require('../controllers/AuditLogController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

// Restricted to SuperAdmin only
router.get('/', protect, authorizeRoles('SuperAdmin'), getAuditLogs);
router.get('/user/:userId', protect, authorizeRoles('SuperAdmin'), getLogsByUser);

module.exports = router;