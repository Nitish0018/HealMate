const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { admin } = require('../config/firebase');

// Helper: sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Helper: send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      healthScore: user.healthScore,
      streak: user.streak,
      badges: user.badges,
    },
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register with email & password
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, role: role || 'patient', phone });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login with email & password
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/firebase
 * @desc    Authenticate via Firebase ID token (Google Sign-In, etc.)
 * @access  Public
 */
const firebaseAuth = async (req, res, next) => {
  try {
    const { idToken, role, name } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Firebase ID token is required.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name: firebaseName, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // First-time Firebase login — create user
      user = await User.create({
        firebaseUid: uid,
        name: name || firebaseName || email.split('@')[0],
        email,
        role: role || 'patient',
        profilePicture: picture || '',
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

/**
 * @route   PUT /api/auth/update-fcm-token
 * @desc    Update FCM device token for push notifications
 * @access  Private
 */
const updateFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user._id, { fcmToken });
    res.status(200).json({ success: true, message: 'FCM token updated.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, firebaseAuth, getMe, updateFcmToken };
