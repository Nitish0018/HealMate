const express = require('express');
const router = express.Router();
const { 
    getHighRiskPatients, 
    getPatientDetail, 
    getComplianceData, 
    getMissedDoses 
} = require('../controllers/doctorController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Endpoints for Doctor Monitoring Dashboard
 */
router.get('/high-risk', verifyToken, getHighRiskPatients);
router.get('/patient/:id', verifyToken, getPatientDetail);
router.get('/patient/:id/compliance', verifyToken, getComplianceData);
router.get('/patient/:id/missed-doses', verifyToken, getMissedDoses);

module.exports = router;
