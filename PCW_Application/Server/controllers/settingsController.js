const User = require('../models/User');
const CommitteeProfile = require('../models/CommitteeProfile');
const bcrypt = require('bcrypt'); // Or 'bcrypt' depending on what you used in authController

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    
    let committeeData = null;
    if (user.role === 'Committee') {
      committeeData = await CommitteeProfile.findOne({ userId: user._id });
    }
    
    res.json({ user, committeeData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { fullName, phone, profilePicUrl, email, password, department, managingClass } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Update Core User Details
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (profilePicUrl) user.profilePicUrl = profilePicUrl;
    
    // Only update email if it doesn't conflict with an existing one
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    // 2. Hash and Update Password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }
    
    await user.save();

    // 3. Update Committee-Specific Details
    if (user.role === 'Committee') {
      let committeeProfile = await CommitteeProfile.findOne({ userId: user._id });
      
      if (committeeProfile) {
        if (department) committeeProfile.department = department;
        if (managingClass) committeeProfile.managingClass = managingClass;
        await committeeProfile.save();
      } else {
        await CommitteeProfile.create({
          userId: user._id,
          department: department || 'Not Assigned',
          managingClass: managingClass || 'Not Assigned'
        });
      }
    }

    res.json({ message: 'Settings updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSettings, updateSettings };