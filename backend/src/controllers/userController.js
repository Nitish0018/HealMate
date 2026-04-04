const User = require('../models/User');
const Patient = require('../models/Patient'); // The MIMIC-III data
const { sendSms } = require('../services/notificationService');

// Only accessible by DOCTOR role
const getPatientsList = async (req, res, next) => {
  try {
    // Return a list of users who are registered as PATIENTs
    const patients = await User.find({ role: 'PATIENT' }).select('-passwordHash');
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
};

// Fetch the clinical data from MIMIC-III using the subject_id
const getClinicalPatientProfile = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    
    const clinicalData = await Patient.findOne({ subject_id: subjectId });
    if (!clinicalData) {
      return res.status(404).json({ success: false, message: 'Clinical data not found in MIMIC-III DB' });
    }
    res.status(200).json({ success: true, data: clinicalData });
  } catch (error) {
    next(error);
  }
};

const sendPatientSms = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { message } = req.body;

    const patient = await User.findById(patientId);

    if (!patient || patient.role !== 'PATIENT') {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (!patient.phone) {
      return res.status(400).json({ success: false, message: 'Patient does not have a registered phone number.' });
    }

    await sendSms(patient.phone, message);
    res.status(200).json({ success: true, message: 'SMS sent successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatientsList,
  getClinicalPatientProfile,
  sendPatientSms
};
