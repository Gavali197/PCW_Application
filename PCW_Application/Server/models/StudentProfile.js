const mongoose = require("mongoose");
const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  enrollmentNo: { type: String, required: true, unique: true },
  
  // Existing fields
  branch: { type: String, required: true },
  cgpa: { type: Number, required: true, min: 0, max: 10 },
  activeBacklogs: { type: Number, default: 0 },
  resumeUrl: { type: String },
  verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  isPlaced: { type: Boolean, default: false },

  // NEW ACADEMIC & PERSONAL FIELDS
  tenthMarks: { type: String }, // String to allow "85%" or "8.5 CGPA"
  twelfthMarks: { type: String },
  highestEducation: { type: String },
  collegeName: { type: String, default: 'Veer Narmad South Gujarat University' },
  lastSemCgpa: { type: Number },
  address: { type: String },
  
  // NEW INTERNSHIP OBJECT
  internship: {
    hasCompleted: { type: Boolean, default: false },
    companyName: { type: String },
    duration: { type: String } // e.g., "May 2025 - July 2025"
  }
}, { timestamps: true });

module.exports = mongoose.model("studentProfile", studentProfileSchema);