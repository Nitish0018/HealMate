const Prescription = require('../models/Prescription');

// Get all medications/prescriptions for a specific MIMIC-III subject (Patient)
const getPatientMedications = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const dbUserId = req.dbUser?._id;
    
    // Fetch medications matching either the MIMIC subject_id OR the current user's DB _id
    const medications = await Prescription.find({ 
      $or: [
        { subject_id: subjectId, drug_type: 'MAIN' },
        { user_id: dbUserId }
      ]
    }).sort({ startdate: -1 });

    res.status(200).json({ success: true, count: medications.length, data: medications });
  } catch (error) {
    next(error);
  }
};

// Log a new medication manually (For the demo flow)
const addMedication = async (req, res, next) => {
  try {
    const { subject_id, drug, startdate, dose_val_rx, dose_unit_rx, route, hadm_id } = req.body;
    const dbUserId = req.dbUser?._id;
    
    // Validate required fields for the schema
    if (!drug) {
      return res.status(400).json({ success: false, message: 'Drug name is required' });
    }

    // Use a default subject_id if missing. If the user has a real one, we'll keep it.
    const finalSubjectId = subject_id || 99999; 
    
    const newMed = await Prescription.create({
      subject_id: finalSubjectId,
      user_id: dbUserId, // Link to the specific user who added this manually
      hadm_id: hadm_id || Math.floor(100000 + Math.random() * 900000), 
      drug,
      startdate: startdate || new Date(),
      dose_val_rx: dose_val_rx || '1',
      dose_unit_rx: dose_unit_rx || 'tab',
      route: route || 'PO', 
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
