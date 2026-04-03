const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { logIntake, getAdherenceLogs, getAdherenceStats } = require('../controllers/adherenceController');

router.post('/log', protect, logIntake);
router.get('/', protect, getAdherenceLogs);
router.get('/stats', protect, getAdherenceStats);

module.exports = router;
