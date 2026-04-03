const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  time: { type: String, required: true }, // "08:00", "14:00", "21:00"
  label: { type: String, default: '' },   // "Morning", "Afternoon", "Night"
});

const medicationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true,
    },
    genericName: { type: String, trim: true },
    dosage: {
      amount: { type: String, required: true }, // "500"
      unit: { type: String, default: 'mg' },    // "mg", "ml", "tablet"
    },
    form: {
      type: String,
      enum: ['tablet', 'capsule', 'liquid', 'injection', 'patch', 'inhaler', 'drops', 'other'],
      default: 'tablet',
    },
    frequency: {
      type: String,
      enum: ['once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'as_needed', 'weekly', 'custom'],
      default: 'once_daily',
    },
    schedules: [scheduleSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isPermanent: { type: Boolean, default: false },
    instructions: { type: String, default: '' }, // "Take with food"
    sideEffects: [{ type: String }],
    isActive: { type: Boolean, default: true },

    // AI risk context
    riskScore: { type: Number, default: 0 },     // 0-100
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
