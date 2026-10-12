const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../Middleware/authMiddleware'); // Adjust path to your auth middleware if needed

// These will handle GET and PUT requests to /api/v1/settings
router.get('/', protect, getSettings);
router.put('/', protect, updateSettings);

module.exports = router;