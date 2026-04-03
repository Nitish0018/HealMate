const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, firebaseAuth, getMe, updateFcmToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['patient', 'doctor', 'caregiver']).withMessage('Invalid role'),
    validate,
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

router.post('/firebase', firebaseAuth);

router.get('/me', protect, getMe);
router.put('/update-fcm-token', protect, updateFcmToken);

module.exports = router;
