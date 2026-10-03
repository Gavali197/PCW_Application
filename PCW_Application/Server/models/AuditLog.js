const auditLogSchema = new mongoose.Schema({
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., "Verified Profile", "Updated Status"
  targetId: { type: mongoose.Schema.Types.ObjectId } // Can refer to a ProfileID or DriveID
}, { timestamps: true });