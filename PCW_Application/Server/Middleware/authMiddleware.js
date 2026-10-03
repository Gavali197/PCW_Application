const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Verify Token & Attach User to Request
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database and exclude the password hash
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Enforce Role-Based Access Control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user ? req.user.role : 'None'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };