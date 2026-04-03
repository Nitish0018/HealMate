const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  row_id: { type: Number, index: true },
  subject_id: { type: Number, required: true, unique: true, index: true },
  gender: { type: String },
  dob: { type: Date },
  dod: { type: Date },
  dod_hosp: { type: Date },
  dod_ssn: { type: Date },
  expire_flag: { type: Number }
}, { 
  collection: 'patients', // Binds exactly to the MongoDB collection seeded by python
  timestamps: false 
});

module.exports = mongoose.model('Patient', patientSchema);
