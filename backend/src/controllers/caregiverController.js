const User = require('../models/User');
const AdherenceLog = require('../models/AdherenceLog');

/**
 * Caregiver Controller
 * Handles operations specifically for the Caregiver role
 */

// Fetch all patients assigned to a specific caregiver
const getMyPatients = async (req, res, next) => {
  try {
    // Caregiver's ID from authenticated request
    const caregiverId = req.user.id;

    const patients = await User.find({ caregiverId, role: 'PATIENT' })
      .select('name age email mimic_subject_id currentStreak healthScore total_prescriptions')
      .lean();

    // Enrich patients with their last 5 adherence logs
    const enrichedPatients = await Promise.all(patients.map(async (patient) => {
      const logs = await AdherenceLog.find({ user_id: patient._id })
        .sort({ scheduled_time: -1 })
        .limit(5)
        .lean();
      
      return {
        ...patient,
        recentLogs: logs
      };
    }));

    res.status(200).json({
      success: true,
      count: patients.length,
      data: enrichedPatients
    });
  } catch (error) {
    next(error);
  }
};

// Invite/Add a patient by email (Phase 7+: Link logic)
const invitePatient = async (req, res, next) => {
  try {
    const { email } = req.body;
    const caregiverId = req.user.id;

    const patient = await User.findOne({ email, role: 'PATIENT' });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient with this email not found in HealMate. Please ensure they are registered.'
      });
    }

    if (patient.caregiverId) {
      return res.status(400).json({
        success: false,
        message: 'This patient is already connected to a caregiver.'
      });
    }

    // Link patient to caregiver
    patient.caregiverId = caregiverId;
    await patient.save();

    res.status(200).json({
      success: true,
      message: `Successfully connected with ${patient.name}.`,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPatients,
  invitePatient
};
