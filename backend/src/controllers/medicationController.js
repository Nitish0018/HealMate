const Medication = require('../models/Medication');
const User = require('../models/User');

/**
 * @route   POST /api/medications
 * @access  Private (patient or doctor)
 */
const addMedication = async (req, res, next) => {
  try {
    const { patientId, name, genericName, dosage, form, frequency, schedules, startDate, endDate, isPermanent, instructions } = req.body;

    // Doctors can add for a patient; patients add for themselves
    const targetPatient = req.user.role === 'doctor' ? patientId : req.user._id;

    if (!targetPatient) {
      return res.status(400).json({ success: false, message: 'Patient ID is required for doctor.' });
    }

    const medication = await Medication.create({
      patient: targetPatient,
      prescribedBy: req.user._id,
      name,
      genericName,
      dosage,
      form,
      frequency,
      schedules,
      startDate,
      endDate,
      isPermanent,
      instructions,
    });

    res.status(201).json({ success: true, data: medication });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/medications
 * @access  Private
 */
const getMyMedications = async (req, res, next) => {
  try {
    const patientId = req.query.patientId || req.user._id;

    // Doctors can view their patients; patients only see their own
    if (req.user.role === 'patient' && patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const medications = await Medication.find({ patient: patientId, isActive: true })
      .populate('prescribedBy', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: medications.length, data: medications });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/medications/:id
 * @access  Private
 */
const getMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findById(req.params.id).populate('prescribedBy', 'name specialization');
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found.' });

    res.status(200).json({ success: true, data: medication });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/medications/:id
 * @access  Private
 */
const updateMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found.' });

    res.status(200).json({ success: true, data: medication });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/medications/:id
 * @access  Private
 */
const deleteMedication = async (req, res, next) => {
  try {
    const medication = await Medication.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!medication) return res.status(404).json({ success: false, message: 'Medication not found.' });

    res.status(200).json({ success: true, message: 'Medication deactivated.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addMedication, getMyMedications, getMedication, updateMedication, deleteMedication };
