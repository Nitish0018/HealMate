const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  addMedication,
  getMyMedications,
  getMedication,
  updateMedication,
  deleteMedication,
} = require('../controllers/medicationController');

router.post('/', protect, addMedication);
router.get('/', protect, getMyMedications);
router.get('/:id', protect, getMedication);
router.put('/:id', protect, updateMedication);
router.delete('/:id', protect, deleteMedication);

module.exports = router;
