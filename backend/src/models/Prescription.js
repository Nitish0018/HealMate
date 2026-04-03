const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  row_id: { type: Number, index: true },
  subject_id: { type: Number, required: true, index: true },
  hadm_id: { type: Number, required: true, index: true },
  icustay_id: { type: Number },
  startdate: { type: Date },
  enddate: { type: Date },
  drug_type: { type: String },
  drug: { type: String },
  drug_name_poe: { type: String },
  drug_name_generic: { type: String },
  formulary_drug_cd: { type: String },
  gsn: { type: String },
  ndc: { type: String },
  prod_strength: { type: String },
  dose_val_rx: { type: String },
  dose_unit_rx: { type: String },
  form_val_disp: { type: String },
  form_unit_disp: { type: String },
  route: { type: String }
}, {
  collection: 'prescriptions',
  timestamps: false
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
