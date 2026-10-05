const express = require('express');
const router = express.Router();
const { 
  applyForJob, 
  getMyApplications, 
  getApplicationsByDrive, 
  updateApplicationStatus 
} = require('../controllers/ApplicaitonController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

// Student Routes
router.post('/drive/:driveId', protect, authorizeRoles('Student'), applyForJob);
router.get('/me', protect, authorizeRoles('Student'), getMyApplications);

// Committee & Admin Routes
router.get('/drive/:driveId', protect, authorizeRoles('Committee', 'SuperAdmin'), getApplicationsByDrive);
router.put('/:id/status', protect, authorizeRoles('Committee', 'SuperAdmin'), updateApplicationStatus);

module.exports = router;