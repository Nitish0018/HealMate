const Prescription = require('../models/Prescription');

// Get all medications/prescriptions for a specific MIMIC-III subject (Patient)
const getPatientMedications = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    
    // We only fetch MAIN drug types to reduce fluid flush noise (like D5W or NaCl)
    const medications = await Prescription.find({ 
      subject_id: subjectId,
      drug_type: 'MAIN'
    }).sort({ startdate: -1 });

    res.status(200).json({ success: true, count: medications.length, data: medications });
  } catch (error) {
    next(error);
  }
};

// Log a new medication manually (For the demo flow)
const addMedication = async (req, res, next) => {
  try {
    // In our system, the "User" might be adding a personal med not in MIMIC
    // We could store these in a separate CustomMedication schema, but for Phase 2 
    // we'll mock the success response to let the UI proceed.
    const { subject_id, drug, startdate, dose_val_rx, dose_unit_rx, route, hadm_id } = req.body;
    
    const newMed = await Prescription.create({
      subject_id,
      hadm_id: hadm_id || Math.floor(100000 + Math.random() * 900000), // Random dummy HADM_ID if manual
      drug,
      startdate: startdate || new Date(),
      dose_val_rx,
      dose_unit_rx,
      route: route || 'PO', // Default to 'PO' (By Mouth)
      drug_type: 'MAIN'
    });

    res.status(201).json({ success: true, data: newMed });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatientMedications,
  addMedication
};
