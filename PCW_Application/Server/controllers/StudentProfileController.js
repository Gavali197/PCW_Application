const StudentProfile = require('../models/StudentProfile');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User'); // Add this line

const upsertProfile = async (req, res) => {
  try {
    const { enrollmentNo, branch, cgpa, activeBacklogs, resumeUrl } = req.body;

    
    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (profile) {
 
      profile.enrollmentNo = enrollmentNo || profile.enrollmentNo;
      profile.branch = branch || profile.branch;
      profile.resumeUrl = resumeUrl || profile.resumeUrl;
      

      if (cgpa !== profile.cgpa || activeBacklogs !== profile.activeBacklogs) {
        profile.cgpa = cgpa;
        profile.activeBacklogs = activeBacklogs;
        profile.verificationStatus = 'Pending'; 
      }

      const updatedProfile = await profile.save();
      return res.json(updatedProfile);
    }


    profile = await StudentProfile.create({
      userId: req.user._id,
      enrollmentNo,
      branch,
      cgpa,
      activeBacklogs,
      resumeUrl,
      verificationStatus: 'Pending',
      isPlaced: false
    });

    res.status(201).json(profile);
  } catch (error) {
   
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Enrollment Number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate('userId', 'email isActive'); 

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const verifyProfile = async (req, res) => {
  try {
    const { status } = req.body; 
    const profileId = req.params.id;

    if (!['Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const profile = await StudentProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    profile.verificationStatus = status;
    const updatedProfile = await profile.save();

    await AuditLog.create({
      performedBy: req.user._id,
      action: `${status} Profile for Enrollment: ${profile.enrollmentNo}`,
      targetId: profile._id
    });

    res.json({
      message: `Profile successfully marked as ${status}`,
      profile: updatedProfile
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await StudentProfile.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    console.log("BACKEND CRASH REASON:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  upsertProfile,
  getMyProfile,
  verifyProfile,
  getAllProfiles
};