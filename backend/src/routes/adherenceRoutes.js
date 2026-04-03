const express = require('express');
const router = express.Router();
const { logIntake, getPatientAdherenceLogs, getAdherencePrediction, getLeaderboard } = require('../controllers/adherenceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/log', verifyToken, logIntake);
router.get('/patient/:subjectId', verifyToken, getPatientAdherenceLogs);
router.post('/predict', verifyToken, getAdherencePrediction);
router.get('/leaderboard', verifyToken, getLeaderboard);

module.exports = router;
