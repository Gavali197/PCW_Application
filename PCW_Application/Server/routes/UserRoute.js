const express = require('express');
const router = express.Router();
const { registerStudent,
  loginUser,
  createCommitteeMember,
  getCommitteeMembers,
  toggleUserStatus } = require('../controllers/UserController');

const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);

router.post(
  '/committee',
  protect,
  authorizeRoles('SuperAdmin'),
  createCommitteeMember
);
router.get('/committee', protect, authorizeRoles('SuperAdmin'), getCommitteeMembers); // NEW
router.patch('/:id/status', protect, authorizeRoles('SuperAdmin'), toggleUserStatus);


module.exports = router;