const Application = require("../models/Application")
const JobDrive = require('../models/JobDrive');
const StudentProfile = require('../models/StudentProfile');
const AuditLog = require('../models/AuditLog');


const applyForJob = async (req, res) => {
  try {
    const driveId = req.params.driveId;

    // 1. Fetch Student Profile & Job Drive
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const drive = await JobDrive.findById(driveId);

    if (!profile) return res.status(404).json({ message: 'Student profile not found' });
    if (!drive) return res.status(404).json({ message: 'Job Drive not found' });

    // 2. Pre-requisite Checks
    if (profile.verificationStatus !== 'Verified') {
      return res.status(403).json({ message: 'Your profile must be verified by the committee to apply' });
    }
    if (profile.isPlaced) {
      return res.status(403).json({ message: 'Placement Policy Lock active: You are already placed.' });
    }
    if (new Date() > new Date(drive.deadline)) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // 3. The Eligibility Engine Core Logic
    const meetsCgpa = profile.cgpa >= drive.eligibility.minCgpa;
    const meetsBacklogs = profile.activeBacklogs <= drive.eligibility.maxBacklogs;
    const meetsBranch = drive.eligibility.allowedBranches.includes(profile.branch);

    if (!meetsCgpa || !meetsBacklogs || !meetsBranch) {
      return res.status(403).json({ message: 'You do not meet the eligibility criteria for this drive.' });
    }

    // 4. Check for existing application
    const existingApp = await Application.findOne({ driveId, profileId: profile._id });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this drive' });
    }

    // 5. Submit Application
    const application = await Application.create({
      driveId,
      profileId: profile._id,
      status: 'Applied'
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getMyApplications = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const applications = await Application.find({ profileId: profile._id })
      .populate({
        path: 'driveId',
        select: 'jobRole companyId deadline ctc',
        populate: { path: 'companyId', select: 'companyName' }
      })
      .sort({ appliedOn: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getApplicationsByDrive = async (req, res) => {
  try {
    const applications = await Application.find({ driveId: req.params.driveId })
      .populate('profileId', 'enrollmentNo branch cgpa resumeUrl userId')
      .sort({ appliedOn: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('profileId');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();

    // The Policy Lock: If status changes to 'Placed', update the Student Profile
    if (status === 'Placed') {
      const studentProfile = await StudentProfile.findById(application.profileId._id);
      studentProfile.isPlaced = true;
      await studentProfile.save();
    }

    // Audit Log for accountability
    await AuditLog.create({
      performedBy: req.user._id,
      action: `Updated application status to ${status} for AppID: ${application._id}`,
      targetId: application._id
    });

    res.json({ message: `Status updated to ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationsByDrive,
  updateApplicationStatus
};