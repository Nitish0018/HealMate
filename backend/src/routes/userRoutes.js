const express = require('express');
const router = express.Router();
const { getPatientsList, getClinicalPatientProfile, sendPatientSms } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/patients', verifyToken, getPatientsList);
router.get('/patients/:subjectId/clinical', verifyToken, getClinicalPatientProfile);
router.post('/patients/:patientId/sms', verifyToken, sendPatientSms);

module.exports = router;
