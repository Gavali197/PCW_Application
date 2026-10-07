const JobDrive = require('../models/JobDrive');
const Company = require('../models/Company'); 

const createJobDrive = async (req, res) => {
  try {
    const { companyId, jobRole, ctc, eligibility, deadline } = req.body;

 

    const jobDrive = await JobDrive.create({
      createdBy: req.user._id,
      companyId,
      jobRole,
      ctc,
      eligibility,
      deadline
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
      .sort({ createdAt: -1 }); // Newest first

    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getJobDriveById = async (req, res) => {
  try {
    const drive = await JobDrive.findById(req.params.id)
      .populate('companyId', 'companyName hrContactName');

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