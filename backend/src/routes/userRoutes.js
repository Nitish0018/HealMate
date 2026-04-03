const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getProfile, updateProfile, getMyPatients, assignDoctor, searchUsers } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/patients', protect, authorize('doctor', 'caregiver'), getMyPatients);
router.post('/assign-doctor', protect, authorize('patient'), assignDoctor);
router.get('/search', protect, searchUsers);

module.exports = router;
