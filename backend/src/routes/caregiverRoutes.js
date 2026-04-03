const express = require('express');
const router = express.Router();
const caregiverController = require('../controllers/caregiverController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Caregiver Routes
 * Base route: /api/caregiver
 */

// Authenticated caregiver operations
router.use(protect);

router.get('/patients', caregiverController.getMyPatients);
router.post('/invite', caregiverController.invitePatient);

module.exports = router;
