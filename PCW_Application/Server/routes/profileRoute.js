const express = require('express');
const router = express.Router();
const { upsertProfile, getMyProfile, verifyProfile, getAllProfiles, getStudentSummary } = require('../controllers/StudentProfileController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

// Student Routes
router.post('/', protect, authorizeRoles('Student'), upsertProfile);
router.get('/me', protect, authorizeRoles('Student'), getMyProfile);

// Committee & SuperAdmin Routes
router.get('/', protect, authorizeRoles('Committee', 'SuperAdmin'), getAllProfiles);
router.get('/:id/summary', protect, authorizeRoles('SuperAdmin', 'Committee'), getStudentSummary);
router.put('/:id/verify', protect, authorizeRoles('Committee', 'SuperAdmin'), verifyProfile);


module.exports = router;