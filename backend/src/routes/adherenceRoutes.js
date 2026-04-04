const express = require('express');
const router = express.Router();
const { logIntake, getPatientAdherenceLogs, getAdherencePrediction, getLeaderboard } = require('../controllers/adherenceController');
const { verifyToken, requireDbUser } = require('../middleware/authMiddleware');

router.post('/log', verifyToken, requireDbUser, logIntake);
router.get('/patient/:subjectId', verifyToken, requireDbUser, getPatientAdherenceLogs);
router.post('/predict', verifyToken, requireDbUser, getAdherencePrediction);
router.get('/leaderboard', verifyToken, getLeaderboard);

module.exports = router;
