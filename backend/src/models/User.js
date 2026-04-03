const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['PATIENT', 'DOCTOR', 'CAREGIVER'], required: true },
  name: { type: String, required: true },
  
  // Link this user to the MIMIC-III database subject_id if they are a simulated patient
  mimic_subject_id: { type: Number, default: null } 
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
