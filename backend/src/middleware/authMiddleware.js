const admin = require('../config/firebase');
const User = require('../models/User'); // Used if we want to sync Firebase auth with our local DB

/**
 * Middleware to verify Firebase JWT tokens.
 * Extracts the Bearer token from the Authorization header and verifies it.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the JWT with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach the decoded token payload to the request object
    // Contains uid, email, etc.
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Firebase Auth Verification Error:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }
    
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

/**
 * Optional Extended Middleware: Ensures the user also exists in our MongoDB database.
 * This can be chained after verifyToken if you need specific roles/DB data for a route.
 */
const requireDbUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found in local database' });
    }
    
    // Attach the DB user profile to the request
    req.dbUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving user data' });
  }
};

module.exports = {
  verifyToken,
  requireDbUser
};
