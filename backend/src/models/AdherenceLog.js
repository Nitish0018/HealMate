const mongoose = require('mongoose');

const adherenceLogSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
      required: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    takenAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['taken', 'missed', 'late', 'skipped'],
      default: 'missed',
    },
    delayMinutes: {
      type: Number,
      default: 0, // How many minutes late the dose was taken
    },
    notes: { type: String, default: '' },

    // Verification (future: camera-based pill detection)
    verified: { type: Boolean, default: false },
    verificationMethod: {
      type: String,
      enum: ['manual', 'camera', 'caregiver'],
      default: 'manual',
    },

    // AI prediction at the time of this log
    predictedRisk: { type: Number }, // 0-100 risk score at time of scheduling
  },
  { timestamps: true }
);

// Compound index for efficient queries
adherenceLogSchema.index({ patient: 1, scheduledTime: -1 });
adherenceLogSchema.index({ medication: 1, scheduledTime: -1 });

module.exports = mongoose.model('AdherenceLog', adherenceLogSchema);
