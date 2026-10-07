const StudentProfile = require('../models/StudentProfile');
const JobDrive = require('../models/JobDrive');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get System Overview Analytics
// @route   GET /api/analytics/overview
// @access  Private (SuperAdmin Only)
const getSystemOverview = async (req, res) => {
  try {
    // 1. High-Level KPI Counts
    const totalStudents = await StudentProfile.countDocuments();
    const placedStudents = await StudentProfile.countDocuments({ isPlaced: true });
    const totalCompanies = await Company.countDocuments();
    const totalDrives = await JobDrive.countDocuments();
    const totalApplications = await Application.countDocuments();

    const placementPercentage = totalStudents > 0 
      ? Math.round((placedStudents / totalStudents) * 100) 
      : 0;

    // 2. Chart Data: Placements by Branch
    const branchStats = await StudentProfile.aggregate([
      {
        $group: {
          _id: "$branch",
          totalStudents: { $sum: 1 },
          placedStudents: { 
            $sum: { $cond: [{ $eq: ["$isPlaced", true] }, 1, 0] } 
          }
        }
      },
      {
        $project: {
          branch: "$_id",
          totalStudents: 1,
          placedStudents: 1,
          _id: 0
        }
      },
      { $sort: { branch: 1 } }
    ]);

    res.json({
      kpis: {
        totalStudents,
        placedStudents,
        placementPercentage,
        totalCompanies,
        totalDrives,
        totalApplications
      },
      branchStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSystemOverview };