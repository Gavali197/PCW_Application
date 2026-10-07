const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private (All Roles)
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // Newest first

    // Calculate unread count for the frontend badge
    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      unreadCount,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private (All Roles)
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();

    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark all notifications as read for the logged-in user
// @route   PATCH /api/notifications/read-all
// @access  Private (All Roles)
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send a manual notification to a specific user
// @route   POST /api/notifications
// @access  Private (Committee / SuperAdmin)
const sendNotification = async (req, res) => {
  try {
    const { targetUserId, title, message } = req.body;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const notification = await Notification.create({
      userId: targetUserId,
      title,
      message
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  sendNotification
};