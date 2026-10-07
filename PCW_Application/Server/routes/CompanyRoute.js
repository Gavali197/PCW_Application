const express = require('express');
const router = express.Router();
const { 
  createCompany, 
  getAllCompanies, 
  updateCompany, 
  toggleBlacklistStatus 
} = require('../controllers/CompanyController');
const { protect, authorizeRoles } = require('../Middleware/authMiddleware');

// Viewable by all logged-in users
router.get('/', protect, getAllCompanies);

// Restricted to Committee and SuperAdmin
router.post('/', protect, authorizeRoles('Committee', 'SuperAdmin'), createCompany);
router.put('/:id', protect, authorizeRoles('Committee', 'SuperAdmin'), updateCompany);

// Highly restricted: Only HOD/SuperAdmin can blacklist a company
router.patch('/:id/blacklist', protect, authorizeRoles('SuperAdmin'), toggleBlacklistStatus);

module.exports = router;