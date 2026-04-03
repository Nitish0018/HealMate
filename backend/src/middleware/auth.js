const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');
const User = require('../models/User');

/**
 * Protect routes — supports both JWT and Firebase ID tokens
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    // Try verifying as a Firebase ID token first
    try {
      const decodedFirebase = await admin.auth().verifyIdToken(token);
      req.user = await User.findOne({ firebaseUid: decodedFirebase.uid });
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found.' });
      }
      return next();
    } catch {
      // Fall back to JWT
    }

    // Verify as JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized. Token invalid.' });
  }
};

/**
 * Restrict access by role(s)
 * Usage: authorize('doctor', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not permitted.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
