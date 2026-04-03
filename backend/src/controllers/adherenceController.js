const AdherenceLog = require('../models/AdherenceLog');
const NotificationService = require('../services/notificationService');
const GamificationService = require('../services/gamificationService');
const User = require('../models/User');

// Log when a medication is taken manually by a patient
const logIntake = async (req, res, next) => {
  try {
    const { user_id, mimic_prescription_row_id, mimic_subject_id, status, scheduled_time } = req.body;
    
    const log = await AdherenceLog.create({
      user_id,
      mimic_prescription_row_id,
      mimic_subject_id,
      scheduled_time: scheduled_time || new Date(), 
      status: status || 'TAKEN', 
      taken_time: status === 'TAKEN' ? new Date() : null,
      is_simulated: false
    });

    // Handle Phase 5: Notifications & Escalation
    if (status === 'MISSED') {
      const patient = await User.findById(user_id);
      if (patient) {
        // Simple logic: If history shows 2 missed doses, go to Tier 2 (Caregiver)
        const missedCount = await AdherenceLog.countDocuments({ user_id, status: 'MISSED' });
        
        let tier = 1;
        if (missedCount >= 5) tier = 3; // Critical: Doctor
        else if (missedCount >= 3) tier = 2; // Warning: Caregiver
        
        await NotificationService.triggerEscalation(patient, tier, 'Current Medication');
      }
    }

    // Handle Phase 6: Gamification (Streaks, health score)
    await GamificationService.updateMetrics(user_id);

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// Fetch adherence history for a specific patient
const getPatientAdherenceLogs = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    
    const logs = await AdherenceLog.find({ mimic_subject_id: subjectId })
      .sort({ scheduled_time: -1 });

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

/**
 * Phase 5 Smart AI Alert integration.
 * Triggered by the system or via frontend for manual testing.
 */
const getAdherencePrediction = async (req, res, next) => {
  try {
    const { userId, medicationName } = req.body;
    const patient = await User.findById(userId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Call the AI Prediction and Notification service
    const predictionResult = await NotificationService.predictAdherenceAndNotify(patient, medicationName);

    res.status(200).json({
      success: true,
      data: predictionResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Phase 6: Gamification - Top 10 Patients.
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await GamificationService.getLeaderboard();
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logIntake,
  getPatientAdherenceLogs,
  getAdherencePrediction,
  getLeaderboard
};
