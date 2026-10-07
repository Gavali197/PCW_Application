const express = require('express');
const router = express.Router();
const { registerStudent, loginUser, createCommitteeMember } = require('../controllers/UserController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);

router.post(
  '/committee', 
  protect, 
  authorizeRoles('SuperAdmin'), 
  createCommitteeMember
);



module.exports = router;