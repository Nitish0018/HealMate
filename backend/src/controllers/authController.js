const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { email, role, name, mimic_subject_id } = req.body;
    
    // In a real flow, firebase does the password handling. We just sync the profile.
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists in DB' });
    }

    user = await User.create({
      email,
      passwordHash: 'firebase-managed',
      role,
      name,
      mimic_subject_id
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    // req.user comes from the firebase auth middleware
    let user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      console.warn(`Auto-syncing Firebase user to MongoDB: ${req.user.email}`);
      // Auto-create profile if missing but Firebase auth succeeded
      user = await User.create({
        email: req.user.email,
        name: req.user.name || req.user.email.split('@')[0],
        role: 'PATIENT', // Default role for auto-migrated users
        passwordHash: 'firebase-managed'
      });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  getProfile
};
