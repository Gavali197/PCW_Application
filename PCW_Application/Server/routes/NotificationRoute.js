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
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);
router.post('/send', protect, sendNotification);

// Route for Admins/Committee to manually trigger an alert to a student
router.post('/', protect, authorizeRoles('Committee', 'SuperAdmin'), sendNotification);

module.exports = router;