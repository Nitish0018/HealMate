/**
 * HealMate – MongoDB Seed Script
 * ================================
 * Seeds the database with:
 *   1. Demo Users       (1 doctor + 1 caregiver + 20 patients from MIMIC-III)
 *   2. Medications      (derived from synthetic logs)
 *   3. Adherence Logs   (3,994 events from data-pipeline output)
 *
 * Usage (from /backend):
 *   node scripts/seedDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path     = require('path');
const fs       = require('fs');

const User         = require('../src/models/User');
const Medication   = require('../src/models/Medication');
const AdherenceLog = require('../src/models/AdherenceLog');

// ── Helpers ───────────────────────────────────────────────────────────────────
const LOGS_PATH = path.join(
  __dirname, '..', '..', 'data-pipeline', 'output', 'synthetic_adherence_logs.json'
);

const log  = (msg) => console.log(`  ${msg}`);
const ok   = (msg) => console.log(`  ✅  ${msg}`);
const warn = (msg) => console.log(`  ⚠️   ${msg}`);

// ── 1. Fixed Demo Users ───────────────────────────────────────────────────────
const DEMO_DOCTOR = {
  name            : 'Dr. Sarah Patel',
  email           : 'doctor@healmate.dev',
  passwordHash    : 'HealMate@123',
  role            : 'DOCTOR',
};

const DEMO_CAREGIVER = {
  name      : 'Alex Johnson',
  email     : 'caregiver@healmate.dev',
  passwordHash: 'HealMate@123',
  role      : 'CAREGIVER',
};

// Patient names mapped to MIMIC subject_ids (the 20 patients in our logs)
const PATIENT_NAMES = [
  'James Wilson',    'Maria Garcia',   'Robert Chen',    'Linda Thompson',
  'Michael Brown',   'Jennifer Davis', 'William Martinez','Barbara Anderson',
  'David Taylor',    'Susan Thomas',   'Richard Jackson', 'Jessica White',
  'Joseph Harris',   'Sarah Martin',   'Thomas Lee',      'Karen Walker',
  'Charles Hall',    'Nancy Allen',    'Christopher Young','Lisa King',
];

// ── 2. Build patients from unique subject_ids in log file ─────────────────────
function buildPatients(logs, doctorId, caregiverId) {
  const uniqueIds = [...new Set(logs.map(l => l.subject_id))];

  return uniqueIds.map((sid, i) => ({
    name          : PATIENT_NAMES[i] || `Patient ${sid}`,
    email         : `patient${sid}@healmate.dev`,
    passwordHash  : 'HealMate@123',
    role          : 'PATIENT',
    mimic_subject_id: sid
  }));
}

// ── 3. Build Medications from unique drug+patient combos ──────────────────────
function buildMedications(logs, patientMap) {
  const seen = new Set();
  const meds = [];

  for (const entry of logs) {
    const key = `${entry.subject_id}|${entry.drug}|${entry.dosage}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const patientId = patientMap[entry.subject_id];
    if (!patientId) continue;

    // Parse dosage: "500.0 mg" → amount:"500", unit:"mg"
    const [amountStr, ...unitParts] = entry.dosage.trim().split(' ');
    const amount = amountStr || '1';
    const unit   = unitParts.join(' ') || 'mg';

    // Derive a start date close to now (offset by index for variety)
    const start = new Date();
    start.setDate(start.getDate() - Math.floor(Math.random() * 30));
    const end = new Date(start);
    end.setDate(end.getDate() + 90);

    meds.push({
      patient     : patientId,
      name        : entry.drug,
      dosage      : { amount, unit },
      form        : 'tablet',
      frequency   : 'once_daily',
      schedules   : [{ time: '08:00', label: 'Morning' }],
      startDate   : start,
      endDate     : end,
      isPermanent : false,
      isActive    : true,
      instructions: 'Take with water.',
    });
  }

  return meds;
}

// ── 4. Build Adherence Logs ───────────────────────────────────────────────────
function buildAdherenceLogs(rawLogs, patientMap, medMap) {
  const docs = [];

  for (const entry of rawLogs) {
    const patientId = patientMap[entry.subject_id];
    if (!patientId) continue;

    const medKey    = `${entry.subject_id}|${entry.drug}|${entry.dosage}`;
    const medId     = medMap[medKey];
    if (!medId) continue;

    // Re-anchor dates to the present (original MIMIC dates are from ~2100s)
    const now     = new Date();
    const offset  = Math.floor(Math.random() * 30); // 0-30 days ago
    const scheduled = new Date(now);
    scheduled.setDate(scheduled.getDate() - offset);
    scheduled.setHours(8, 0, 0, 0);

    let takenAt     = null;
    let delayMinutes = 0;

    if (entry.status === 'taken') {
      takenAt = new Date(scheduled.getTime() + Math.random() * 30 * 60000);
      delayMinutes = Math.round((takenAt - scheduled) / 60000);
    } else if (entry.status === 'late') {
      takenAt = new Date(scheduled.getTime() + (31 + Math.random() * 149) * 60000);
      delayMinutes = Math.round((takenAt - scheduled) / 60000);
    }

    const statusMap = { 'taken': 'TAKEN', 'missed': 'MISSED', 'late': 'DELAYED' };

    docs.push({
      user_id      : patientId,
      mimic_prescription_row_id: 1, // Dummy placeholder
      mimic_subject_id: entry.subject_id,
      scheduled_time: scheduled,
      taken_time   : takenAt,
      status       : statusMap[entry.status] || 'UPCOMING',
      is_simulated : true
    });
  }

  return docs;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n' + '═'.repeat(55));
  console.log('  HealMate – MongoDB Seed');
  console.log('═'.repeat(55));

  // Connect
  await mongoose.connect(process.env.MONGO_URI);
  ok('Connected to MongoDB');

  // ── Wipe existing data ──
  log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Medication.deleteMany({}),
    AdherenceLog.deleteMany({}),
  ]);
  ok('Collections cleared');

  // ── Load synthetic logs ──
  if (!fs.existsSync(LOGS_PATH)) {
    warn(`Synthetic logs not found at:\n     ${LOGS_PATH}`);
    warn('Run: python data-pipeline/data_processing.py first.');
    process.exit(1);
  }
  const rawLogs = JSON.parse(fs.readFileSync(LOGS_PATH, 'utf-8'));
  ok(`Loaded ${rawLogs.length.toLocaleString()} synthetic log entries`);

  // ── Seed Doctor & Caregiver ──
  log('Seeding doctor & caregiver...');
  const [doctor, caregiver] = await User.create([DEMO_DOCTOR, DEMO_CAREGIVER]);
  ok(`Doctor    : ${doctor.email}`);
  ok(`Caregiver : ${caregiver.email}`);

  // ── Seed Patients ──
  log('Seeding patients...');
  const patientDefs  = buildPatients(rawLogs, doctor._id, caregiver._id);
  const createdPatients = await User.create(patientDefs);
  ok(`${createdPatients.length} patients created`);

  // subject_id → MongoDB ObjectId
  const uniqueIds = [...new Set(rawLogs.map(l => l.subject_id))];
  const patientMap = {};
  uniqueIds.forEach((sid, i) => {
    if (createdPatients[i]) patientMap[sid] = createdPatients[i]._id;
  });

  // Link patients to doctor & caregiver
  const patientIds = createdPatients.map(p => p._id);
  await User.findByIdAndUpdate(doctor._id,    { patients: patientIds });
  await User.findByIdAndUpdate(caregiver._id, { patients: patientIds });

  // ── Seed Medications ──
  log('Seeding medications...');
  const medDefs    = buildMedications(rawLogs, patientMap);
  const createdMeds = await Medication.insertMany(medDefs);
  ok(`${createdMeds.length} medications created`);

  // drug key → MongoDB ObjectId
  const medMap = {};
  const seenKeys = new Set();
  const keyList  = [];
  for (const entry of rawLogs) {
    const key = `${entry.subject_id}|${entry.drug}|${entry.dosage}`;
    if (!seenKeys.has(key)) { seenKeys.add(key); keyList.push(key); }
  }
  keyList.forEach((key, i) => {
    if (createdMeds[i]) medMap[key] = createdMeds[i]._id;
  });

  // ── Seed Adherence Logs ──
  log('Seeding adherence logs (bulk insert)...');
  const logDocs = buildAdherenceLogs(rawLogs, patientMap, medMap);

  // Insert in batches of 500 to avoid memory issues
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < logDocs.length; i += BATCH) {
    await AdherenceLog.insertMany(logDocs.slice(i, i + BATCH));
    inserted += Math.min(BATCH, logDocs.length - i);
  }
  ok(`${inserted.toLocaleString()} adherence log entries inserted`);

  // ── Summary ──
  console.log('\n' + '─'.repeat(55));
  console.log('  📋  Seed Summary');
  console.log('─'.repeat(55));
  console.log(`  👤  Users          : ${await User.countDocuments()}`);
  console.log(`  💊  Medications    : ${await Medication.countDocuments()}`);
  console.log(`  📝  Adherence Logs : ${await AdherenceLog.countDocuments()}`);
  console.log('\n  Demo Credentials:');
  console.log('  ┌────────────────────────────────────────────────┐');
  console.log('  │  Doctor     : doctor@healmate.dev              │');
  console.log('  │  Caregiver  : caregiver@healmate.dev           │');
  console.log('  │  Patient    : patient<ID>@healmate.dev         │');
  console.log('  │  Password   : HealMate@123  (all accounts)     │');
  console.log('  └────────────────────────────────────────────────┘');
  console.log('\n✅  Seed complete!\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
