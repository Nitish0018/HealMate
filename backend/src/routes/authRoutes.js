const express = require('express');
const router = express.Router();
const { register, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public route: Sync user immediately after they sign up on Firebase
router.post('/register', register);

// Protected route: Fetch DB profile details using valid Firebase JWT
router.get('/profile', verifyToken, getProfile);

module.exports = router;
