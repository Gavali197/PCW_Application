const express = require('express');
const router = express.Router();
const { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead, 
  sendNotification 
} = require('../controllers/NoticationController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

// Routes for the currently logged-in user (Student, Committee, or Admin)
router.get('/', protect, getMyNotifications);
router.patch('/read-all', protect, markAllAsRead);
router.patch('/:id/read', protect, markAsRead);

// Route for Admins/Committee to manually trigger an alert to a student
router.post('/', protect, authorizeRoles('Committee', 'SuperAdmin'), sendNotification);

module.exports = router;