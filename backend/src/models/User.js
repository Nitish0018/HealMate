const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['PATIENT', 'DOCTOR', 'CAREGIVER'], required: true },
  name: { type: String, required: true },
  
  // Link this user to the MIMIC-III database subject_id if they are a simulated patient
  mimic_subject_id: { type: Number, default: null },
  
  // Notification fields (Phase 5)
  phone: { type: String },
  caregiverPhone: { type: String },
  doctorPhone: { type: String },
  fcmToken: { type: String, default: null }, // Firebase Registration Token for push notifications

  // Patient stats for AI AI
  age: { type: Number },
  total_prescriptions: { type: Number },
  unique_drugs: { type: Number },
  oral_drug_count: { type: Number },
  non_oral_drug_count: { type: Number },
  avg_dose_duration_days: { type: Number },
  max_concurrent_meds: { type: Number },
  num_admissions: { type: Number },
  avg_icu_los: { type: Number },
  route_diversity: { type: Number },

  // Phase 6: Gamification & Engagement
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  healthScore: { type: Number, default: 100 }, // Scaled 0-100
  badges: [{ 
    name: String, 
    dateEarned: { type: Date, default: Date.now } 
  }],

  // Relationships (Phase 7+: Caregiver Collaboration)
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastLoginAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
