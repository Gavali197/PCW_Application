const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['SuperAdmin', 'Committee', 'Student'], 
    required: true 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });