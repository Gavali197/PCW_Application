const mongoose = require("mongoose");
const committeeProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  department: { type: String, required: true }, // e.g., "Computer Science"
  managingClass: { type: String, required: true }, // e.g., "TYBCA Div A"
}, { timestamps: true });

module.exports = mongoose.model("committeeProfile", committeeProfileSchema);