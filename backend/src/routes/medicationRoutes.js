const express = require('express');
const router = express.Router();
const { getPatientMedications, addMedication } = require('../controllers/medicationController');
const { verifyToken, requireDbUser } = require('../middleware/authMiddleware');

router.get('/patient/:subjectId', verifyToken, requireDbUser, getPatientMedications);
router.post('/', verifyToken, requireDbUser, addMedication);

module.exports = router;
