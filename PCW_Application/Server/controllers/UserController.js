const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', 
  });
};


const registerStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash: hashedPassword,
      role: 'Student',
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      

      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated. Contact Admin.' });
      }

      res.json({
        _id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const createCommitteeMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({
      email,
      passwordHash: hashedPassword,
      role: 'Committee',
    });

    res.status(201).json({
      _id: user.id,
      email: user.email,
      role: user.role,
      message: 'Committee member created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all Committee Members
// @route   GET /api/v1/users/committee
// @access  Private (SuperAdmin Only)
const getCommitteeMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'Committee' }).select('-passwordHash');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle User Active Status (Revoke/Restore Access)
// @route   PATCH /api/v1/users/:id/status
// @access  Private (SuperAdmin Only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Security check: Prevent the Admin from accidentally deactivating themselves
    if (user.role === 'SuperAdmin') {
      return res.status(403).json({ message: 'Cannot deactivate a SuperAdmin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `Account is now ${user.isActive ? 'Active' : 'Deactivated'}`, 
      isActive: user.isActive 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerStudent,
  loginUser,
  createCommitteeMember,
  getCommitteeMembers,
  toggleUserStatus
};