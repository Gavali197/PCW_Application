const jobDriveSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobRole: { type: String, required: true },
  ctc: { type: String },
  
  // Embedded Eligibility Rules
  eligibility: {
    minCgpa: { type: Number, default: 0 },
    maxBacklogs: { type: Number, default: 0 },
    allowedBranches: [{ type: String }] // Array of strings e.g., ["BTech CS", "MSc ICT"]
  },
  
  deadline: { type: Date, required: true },

  // Embedded Schedules (Replaces the InterviewSchedules SQL table)
  interviewSchedules: [{
    roundName: { type: String, required: true },
    dateTime: { type: Date, required: true },
    venueOrLink: { type: String, required: true }
  }]
}, { timestamps: true });