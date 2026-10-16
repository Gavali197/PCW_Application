const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Who receives it
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Job', 'Profile', 'System'], default: 'System' },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);