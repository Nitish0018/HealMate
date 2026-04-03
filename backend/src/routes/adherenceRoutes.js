const express = require('express');
const router = express.Router();
const { logIntake, getPatientAdherenceLogs } = require('../controllers/adherenceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/log', verifyToken, logIntake);
router.get('/patient/:subjectId', verifyToken, getPatientAdherenceLogs);

module.exports = router;
