const AuditLog = require('../models/AuditLog');


const getAuditLogs = async (req, res) => {
  try {
    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // 20 logs per page
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .populate('performedBy', 'email role') // Get the email of the person who did it
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    const totalLogs = await AuditLog.countDocuments();

    res.json({
      logs,
      page,
      pages: Math.ceil(totalLogs / limit),
      totalLogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get Audit Logs for a specific User (e.g., track a specific committee member)
// @route   GET /api/audit-logs/user/:userId
// @access  Private (SuperAdmin Only)
const getLogsByUser = async (req, res) => {
  try {
    const logs = await AuditLog.find({ performedBy: req.params.userId })
      .populate('performedBy', 'email role')
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAuditLogs,
  getLogsByUser
};