const express = require('express');
const router = express.Router();
const { 
  createJobDrive, 
  getAllJobDrives, 
  getJobDriveById, 
  addInterviewSchedule 
} = require('../controllers/jobDriveController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

// Publicly viewable by logged-in users (Students, Committee, Admin)
router.get('/', protect, getAllJobDrives);
router.get('/:id', protect, getJobDriveById);

// Restricted to Committee and SuperAdmin
router.post('/', protect, authorizeRoles('Committee', 'SuperAdmin'), createJobDrive);
router.post('/:id/schedules', protect, authorizeRoles('Committee', 'SuperAdmin'), addInterviewSchedule);

module.exports = router;