const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  row_id: { type: Number, index: true },
  subject_id: { type: Number, required: true, index: true },
  hadm_id: { type: Number, required: true, unique: true, index: true },
  admittime: { type: Date },
  dischtime: { type: Date },
  deathtime: { type: Date },
  admission_type: { type: String },
  admission_location: { type: String },
  discharge_location: { type: String },
  insurance: { type: String },
  language: { type: String },
  religion: { type: String },
  marital_status: { type: String },
  ethnicity: { type: String },
  edregtime: { type: Date },
  edouttime: { type: Date },
  diagnosis: { type: String },
  hospital_expire_flag: { type: Number },
  has_chartevents_data: { type: Number }
}, {
  collection: 'admissions',
  timestamps: false
});

module.exports = mongoose.model('Admission', admissionSchema);
