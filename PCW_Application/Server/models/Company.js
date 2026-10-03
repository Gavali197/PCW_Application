const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  hrContactName: { type: String },
  hrEmail: { type: String },
  isBlacklisted: { type: Boolean, default: false }
}, { timestamps: true });