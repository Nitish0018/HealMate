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
    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
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
