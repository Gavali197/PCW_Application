const mongoose = require("mongoose")
const applicationSchema = new mongoose.Schema({
  driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDrive', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'studentProfile', required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Shortlisted_Round1', 'Shortlisted_Round2', 'Placed', 'Rejected'], 
    default: 'Applied' 
  }
}, { timestamps: true });

// Prevent a student from applying to the same drive twice
applicationSchema.index({ driveId: 1, profileId: 1 }, { unique: true });

module.exports = mongoose.model("appliction", applicationSchema);