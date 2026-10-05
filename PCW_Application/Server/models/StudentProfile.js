const mongoose = require("mongoose")
const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  enrollmentNo: { type: String, required: true, unique: true },
  branch: { type: String, required: true }, // e.g., "BTech CS", "MSc ICT"
  cgpa: { type: Number, required: true, min: 0, max: 10 },
  activeBacklogs: { type: Number, default: 0 },
  resumeUrl: { type: String },
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  isPlaced: { type: Boolean, default: false } // The Policy Lock
}, { timestamps: true });

module.exports = mongoose.model("studentProfile", studentProfileSchema)