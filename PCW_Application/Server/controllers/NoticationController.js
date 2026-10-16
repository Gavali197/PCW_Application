const Notification = require('../models/Notification');
const User = require('../models/User');


const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); 

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      unreadCount,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


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