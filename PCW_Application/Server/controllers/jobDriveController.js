const JobDrive = require('../models/JobDrive');
const Company = require('../models/Company'); 

const createJobDrive = async (req, res) => {
  try {
    // ADDED: extracted 'description' from the request body
    const { companyId, jobRole, ctc, eligibility, deadline, description } = req.body;

    const jobDrive = await JobDrive.create({
      createdBy: req.user._id, // This links the committee member
      companyId,
      jobRole,
      ctc,
      eligibility,
      deadline,
      description // ADDED: save the description to the database
    });

    res.status(201).json(jobDrive);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllJobDrives = async (req, res) => {
  try {
    const drives = await JobDrive.find()
      .populate('companyId', 'companyName')
      // ADDED: Populate the committee member's details so the student can see who posted it
      .populate('createdBy', 'fullName email phone') 
      .sort({ createdAt: -1 }); // Newest first

    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getJobDriveById = async (req, res) => {
  try {
    const drive = await JobDrive.findById(req.params.id)
      .populate('companyId', 'companyName hrContactName')
      // ADDED: Populate here as well for consistency
      .populate('createdBy', 'fullName email phone');

    if (!drive) {
      return res.status(404).json({ message: 'Job Drive not found' });
    }

    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addInterviewSchedule = async (req, res) => {
  try {
    const { roundName, dateTime, venueOrLink } = req.body;
    const driveId = req.params.id;

    const drive = await JobDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ message: 'Job Drive not found' });
    }

    drive.interviewSchedules.push({
      roundName,
      dateTime,
      venueOrLink
    });

    const updatedDrive = await drive.save();

    res.json({
      message: 'Interview schedule added',
      drive: updatedDrive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createJobDrive,
  getAllJobDrives,
  getJobDriveById,
  addInterviewSchedule
};