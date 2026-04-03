const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
    },
    type: {
      type: String,
      enum: [
        'medication_reminder',
        'missed_dose',
        'caregiver_alert',
        'doctor_alert',
        'high_risk_warning',
        'streak_milestone',
        'badge_earned',
        'system',
      ],
      required: true,
    },
    tier: {
      type: Number,
      enum: [1, 2, 3], // Escalation tiers
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: {
      type: String,
      enum: ['push', 'sms', 'in_app'],
      default: 'in_app',
    },
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
