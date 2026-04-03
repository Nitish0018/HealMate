const User = require('../models/User');

/**
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('assignedDoctor', 'name email specialization')
    .populate('caregivers', 'name email phone');
  res.status(200).json({ success: true, data: user });
};

/**
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'profilePicture', 'dateOfBirth', 'gender', 'specialization', 'hospitalAffiliation'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/patients        (Doctor/Caregiver only)
 * @access  Private
 */
const getMyPatients = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'patients',
      'name email phone healthScore streak lastLogin'
    );
    res.status(200).json({ success: true, data: user.patients });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/assign-doctor
 * @desc    Patient assigns a doctor by doctorId
 * @access  Private (patient)
 */
const assignDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.body;
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });

    await User.findByIdAndUpdate(req.user._id, { assignedDoctor: doctorId });
    await User.findByIdAndUpdate(doctorId, { $addToSet: { patients: req.user._id } });

    res.status(200).json({ success: true, message: 'Doctor assigned successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/search?role=doctor&q=cardio
 * @access  Private
 */
const searchUsers = async (req, res, next) => {
  try {
    const { role, q } = req.query;
    const query = { isActive: true };
    if (role) query.role = role;
    if (q) query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { specialization: { $regex: q, $options: 'i' } },
    ];

    const users = await User.find(query).select('name email role specialization hospitalAffiliation profilePicture').limit(20);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getMyPatients, assignDoctor, searchUsers };
