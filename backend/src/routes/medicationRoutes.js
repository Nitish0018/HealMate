const express = require('express');
const router = express.Router();
const { getPatientMedications, addMedication } = require('../controllers/medicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/patient/:subjectId', verifyToken, getPatientMedications);
router.post('/', verifyToken, addMedication);

module.exports = router;
