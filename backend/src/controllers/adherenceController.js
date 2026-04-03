const AdherenceLog = require('../models/AdherenceLog');

// Log when a medication is taken manually by a patient
const logIntake = async (req, res, next) => {
  try {
    const { user_id, mimic_prescription_row_id, mimic_subject_id, status } = req.body;
    
    const log = await AdherenceLog.create({
      user_id,
      mimic_prescription_row_id,
      mimic_subject_id,
      scheduled_time: new Date(), // Mocks the schedule time to now for demo purposes
      status: status || 'TAKEN', // e.g., 'TAKEN' or 'MISSED'
      taken_time: status === 'TAKEN' ? new Date() : null,
      is_simulated: false
    });

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

module.exports = {
  logIntake,
  getPatientAdherenceLogs
};
