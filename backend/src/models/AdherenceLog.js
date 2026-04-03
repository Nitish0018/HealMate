const mongoose = require('mongoose');

const adherenceLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mimic_prescription_row_id: { type: String, required: true }, // Links to the exact MIMIC-III prescription
  mimic_subject_id: { type: Number }, // To easily query logs by MIMIC patient
  
  scheduled_time: { type: Date, required: true },
  status: { type: String, enum: ['TAKEN', 'MISSED', 'DELAYED', 'UPCOMING'], default: 'UPCOMING' },
  taken_time: { type: Date, default: null }, // Actual time they hit "taken"
  
  // AI related fields (for phase 4)
  ai_risk_score: { type: Number, default: 0 },
  is_simulated: { type: Boolean, default: true } // Since we don't have real app users yet, these will be seeded
}, {
  timestamps: true
});

module.exports = mongoose.model('AdherenceLog', adherenceLogSchema);
