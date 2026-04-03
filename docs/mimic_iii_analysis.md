# MIMIC-III Demo Dataset Analysis for HealMate MEMS

This document provides a technical breakdown of the [MIMIC-III Demo Dataset](https://physionet.org/content/mimiciii-demo/) and how it can be integrated into the HealMate project for Phase 4 (AI Prediction Engine).

---

## 1. Dataset Overview
MIMIC-III is a relational database containing clinical data for 100 de-identified patients. While the demo is a subset, the schema is identical to the full database.

### Critical Tables for MEMS
| Table | Rows (Approx) | Use Case |
| :--- | :--- | :--- |
| **`PRESCRIPTIONS.csv`** | 10,700+ | **Primary Source.** Tracks drug names, dosages, routes (PO/IV), and start/end times. |
| **`PATIENTS.csv`** | 100 | Demographics (Gender, DOB, Mortality). All 100 patients in the demo have a Date of Death (`DOD`), providing clear labels for risk prediction. |
| **`ADMISSIONS.csv`** | 130+ | Admission types (Emergency/Elective) and primary diagnoses (Sepsis, CHF, etc.). |
| **`LABEVENTS.csv`** | Large | Biochemical markers to correlate with medication adherence/efficacy. |

---

## 2. Key Schema Details

### `PRESCRIPTIONS` Table
- **`drug` / `drug_name_generic`**: Identifies the medication.
- **`dose_val_rx` / `dose_unit_rx`**: The quantity prescribed.
- **`route`**: Crucial for adherence context (e.g., `PO` for oral, `IV` for hospital-only).
- **`startdate` / `enddate`**: Defines the therapeutic window.

### `ADMISSIONS` Table
- **`diagnosis`**: Provides context for *why* the patient is on specific meds.
- **`hospital_expire_flag`**: Useful as a target variable for predicting high-risk patients.

---

## 3. Implementation Roadmap for Phase 4 (AI Engine)

### A. Feature Engineering
From the raw CSVs, we can derive:
1. **Polypharmacy Index**: Count of concurrent active medications per day.
2. **Medication Complexity**: Number of different routes (oral vs. injectables).
3. **Temporal Patterns**: Frequency of prescription changes.
4. **Clinical Context**: Mapping medications to diagnoses (e.g., Insulin -> Diabetes).

### B. Prediction Targets
Since the dataset lacks actual "missed dose" logs, we will simulate adherence based on clinical markers:
- **Label 1 (Simulated Adherence)**: Correlate vitals (`CHARTEVENTS`) with medication timing.
- **Label 2 (Risk Score)**: Predict probability of `hospital_expire_flag` or short-term mortality based on current med regimen.

### C. MongoDB Integration
We can seed the `Medications` collection using:
```js
{
  "subject_id": row.subject_id,
  "drug_name": row.drug,
  "dosage": row.dose_val_rx + row.dose_unit_rx,
  "route": row.route,
  "schedule": {
    "start": row.startdate,
    "end": row.enddate
  }
}
```

---

## 4. Next Steps
1. **Data Acquisition**: Download the 13.4MB ZIP from PhysioNet.
2. **Setup Python Pipeline**: Use `pandas` to merge `PRESCRIPTIONS` and `PATIENTS` on `subject_id`.
3. **Synthetic Log Generation**: Create a script to generate "intake logs" for the frontend to display, based on the `startdate`/`enddate` in the dataset.
