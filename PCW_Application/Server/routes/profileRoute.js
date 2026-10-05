const express = require('express');
const router = express.Router();
const { upsertProfile, getMyProfile, verifyProfile } = require('../controllers/profileController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

// Student Routes
router.post('/', protect, authorizeRoles('Student'), upsertProfile);
router.get('/me', protect, authorizeRoles('Student'), getMyProfile);

// Committee & SuperAdmin Routes
router.put('/:id/verify', protect, authorizeRoles('Committee', 'SuperAdmin'), verifyProfile);

module.exports = router;