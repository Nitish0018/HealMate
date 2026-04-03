"""
HealMate – MIMIC-III Demo Data Processing Pipeline
====================================================
Processes raw MIMIC-III CSVs into:
  1. A clean medication adherence feature matrix
  2. Synthetic adherence logs  (for frontend seeding)
  3. A patient risk summary    (for AI model training)

Usage:
    python data-pipeline/data_processing.py
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import timedelta

# ── Paths ─────────────────────────────────────────────────────────────────────
MIMIC_DIR = os.environ.get(
    'MIMIC_DIR',
    os.path.join('datasets', 'mimic_iii_demo', 'mimic-iii-clinical-database-demo-1.4')
)
OUTPUT_DIR = os.path.join('data-pipeline', 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── 1. Load Raw CSVs ──────────────────────────────────────────────────────────
def load_data():
    print("📥  Loading MIMIC-III Demo CSVs...")
    try:
        prescriptions = pd.read_csv(os.path.join(MIMIC_DIR, 'PRESCRIPTIONS.csv'), low_memory=False)
        patients      = pd.read_csv(os.path.join(MIMIC_DIR, 'PATIENTS.csv'))
        admissions    = pd.read_csv(os.path.join(MIMIC_DIR, 'ADMISSIONS.csv'))
        diagnoses     = pd.read_csv(os.path.join(MIMIC_DIR, 'DIAGNOSES_ICD.csv'))
        labevents     = pd.read_csv(os.path.join(MIMIC_DIR, 'LABEVENTS.csv'), low_memory=False)
        icustays      = pd.read_csv(os.path.join(MIMIC_DIR, 'ICUSTAYS.csv'))
    except FileNotFoundError as e:
        print(f"❌  {e}")
        print(f"    Set MIMIC_DIR env var or check datasets/mimic_iii_demo/")
        raise SystemExit(1)

    print(f"    ✅  Prescriptions : {len(prescriptions):,} rows")
    print(f"    ✅  Patients       : {len(patients):,} rows")
    print(f"    ✅  Admissions     : {len(admissions):,} rows")
    return prescriptions, patients, admissions, diagnoses, labevents, icustays


# ── 2. Preprocess ─────────────────────────────────────────────────────────────
def preprocess(prescriptions, patients, admissions, diagnoses, icustays):
    print("\n🔧  Preprocessing...")

    # Standardise column names to lowercase
    prescriptions.columns = prescriptions.columns.str.lower()
    patients.columns      = patients.columns.str.lower()
    admissions.columns    = admissions.columns.str.lower()
    diagnoses.columns     = diagnoses.columns.str.lower()
    icustays.columns      = icustays.columns.str.lower()

    # Date columns
    for col in ['startdate', 'enddate']:
        prescriptions[col] = pd.to_datetime(prescriptions[col], errors='coerce')
    for col in ['dob', 'dod']:
        patients[col] = pd.to_datetime(patients[col], errors='coerce')
    for col in ['admittime', 'dischtime', 'deathtime']:
        admissions[col] = pd.to_datetime(admissions[col], errors='coerce')

    # Fill missing values
    prescriptions['route']          = prescriptions['route'].fillna('UNKNOWN')
    prescriptions['dose_val_rx']    = pd.to_numeric(prescriptions['dose_val_rx'], errors='coerce').fillna(0)
    prescriptions['dose_unit_rx']   = prescriptions['dose_unit_rx'].fillna('UNKNOWN')
    prescriptions['drug']           = prescriptions['drug'].fillna('UNKNOWN')

    # Merge
    df = prescriptions.merge(patients[['subject_id', 'gender', 'dob', 'dod']], on='subject_id', how='left')
    df = df.merge(
        admissions[['subject_id', 'hadm_id', 'admittime', 'dischtime', 'hospital_expire_flag', 'diagnosis']],
        on=['subject_id', 'hadm_id'],
        how='left'
    )
    df = df.merge(
        icustays[['subject_id', 'hadm_id', 'los']].rename(columns={'los': 'icu_los'}),
        on=['subject_id', 'hadm_id'],
        how='left'
    )

    # Derived features
    df['duration_days'] = (df['enddate'] - df['startdate']).dt.days.clip(lower=0)
    df['age_at_admission'] = (
        (df['admittime'] - df['dob']).dt.days / 365.25
    ).clip(lower=0, upper=120)

    # Oral medication flag (key for non-adherence modelling)
    oral_routes = ['PO', 'PO/NG', 'ORAL', 'SL']
    df['is_oral'] = df['route'].str.upper().isin(oral_routes).astype(int)

    # Patient deceased flag
    df['deceased'] = df['dod'].notna().astype(int)

    print(f"    ✅  Merged dataset : {len(df):,} rows, {df['subject_id'].nunique()} unique patients")
    return df


# ── 3. Feature Engineering (per patient) ─────────────────────────────────────
def build_patient_features(df):
    print("\n📊  Building patient-level features...")
    grp = df.groupby('subject_id')

    features = pd.DataFrame({
        'subject_id'          : grp['subject_id'].first(),
        'gender'              : grp['gender'].first(),
        'age'                 : grp['age_at_admission'].mean().round(1),
        'deceased'            : grp['deceased'].max(),
        'hospital_expire_flag': grp['hospital_expire_flag'].max(),

        # Polypharmacy
        'total_prescriptions' : grp['drug'].count(),
        'unique_drugs'        : grp['drug'].nunique(),
        'oral_drug_count'     : grp['is_oral'].sum(),
        'non_oral_drug_count' : grp.apply(lambda x: (x['is_oral'] == 0).sum()),

        # Complexity
        'avg_dose_duration_days' : grp['duration_days'].mean().round(1),
        'max_concurrent_meds'    : grp.apply(_max_concurrent_meds),

        # Temporal
        'num_admissions'     : grp['hadm_id'].nunique(),
        'avg_icu_los'        : grp['icu_los'].mean().round(2),

        # Route diversity
        'route_diversity'    : grp['route'].nunique(),
    }).reset_index(drop=True)

    # Risk label: deceased OR expired in hospital → high risk
    features['risk_label'] = np.where(
        (features['deceased'] == 1) | (features['hospital_expire_flag'] == 1), 1, 0
    )

    # Adherence score simulation (inverse of complexity)
    features['simulated_adherence_pct'] = (
        100
        - (features['unique_drugs'].clip(0, 10) * 2)
        - (features['non_oral_drug_count'].clip(0, 5) * 3)
        - (features['num_admissions'].clip(0, 5) * 5)
    ).clip(30, 100).round(1)

    print(f"    ✅  {len(features)} patient profiles built")
    print(f"    ✅  High-risk patients : {features['risk_label'].sum()} / {len(features)}")
    return features


def _max_concurrent_meds(group):
    """Count the maximum number of medications active on any single day."""
    if group['startdate'].isna().all():
        return 0
    dates = []
    for _, row in group.iterrows():
        if pd.notna(row['startdate']) and pd.notna(row['enddate']):
            dates += [(row['startdate'], 1), (row['enddate'], -1)]
    if not dates:
        return 0
    dates.sort()
    peak = cur = 0
    for _, delta in dates:
        cur += delta
        peak = max(peak, cur)
    return peak


# ── 4. Synthetic Adherence Log Generation ────────────────────────────────────
def generate_synthetic_logs(df, n_patients=20, seed=42):
    """
    Simulate daily medication intake events for n_patients.
    Generates realistic missed/taken/late patterns for frontend demo.
    """
    print(f"\n🎲  Generating synthetic adherence logs for {n_patients} patients...")
    np.random.seed(seed)

    patients_sample = df['subject_id'].drop_duplicates().head(n_patients).tolist()
    df_sample = df[df['subject_id'].isin(patients_sample)].copy()

    logs = []
    for _, row in df_sample.iterrows():
        if pd.isna(row['startdate']) or pd.isna(row['enddate']):
            continue
        if not row['is_oral']:
            continue  # Only simulate oral medications

        current = row['startdate']
        end     = min(row['enddate'], row['startdate'] + timedelta(days=30))

        while current <= end:
            # Probability of missing dose based on drug count
            miss_prob = min(0.05 * row.get('unique_drugs', 1), 0.4)

            rand = np.random.random()
            if rand < miss_prob:
                status = 'missed'
                taken_at = None
            elif rand < miss_prob + 0.15:
                status = 'late'
                taken_at = (current + timedelta(minutes=int(np.random.uniform(31, 180)))).isoformat()
            else:
                status = 'taken'
                taken_at = (current + timedelta(minutes=int(np.random.uniform(0, 30)))).isoformat()

            logs.append({
                'subject_id'    : int(row['subject_id']),
                'drug'          : row['drug'],
                'dosage'        : f"{row['dose_val_rx']} {row['dose_unit_rx']}",
                'route'         : row['route'],
                'scheduledTime' : current.isoformat(),
                'takenAt'       : taken_at,
                'status'        : status,
            })
            current += timedelta(days=1)

    print(f"    ✅  {len(logs):,} synthetic log entries generated")
    return logs


# ── 5. Save Outputs ───────────────────────────────────────────────────────────
def save_outputs(df_clean, patient_features, synthetic_logs):
    print("\n💾  Saving outputs...")

    # Clean merged dataset
    clean_path = os.path.join(OUTPUT_DIR, 'prescriptions_clean.csv')
    df_clean.to_csv(clean_path, index=False)
    print(f"    ✅  {clean_path}")

    # Patient features (for ML model)
    feat_path = os.path.join(OUTPUT_DIR, 'patient_features.csv')
    patient_features.to_csv(feat_path, index=False)
    print(f"    ✅  {feat_path}")

    # Synthetic logs (for MongoDB seeding / frontend demo)
    logs_path = os.path.join(OUTPUT_DIR, 'synthetic_adherence_logs.json')
    with open(logs_path, 'w') as f:
        json.dump(synthetic_logs, f, indent=2)
    print(f"    ✅  {logs_path}  ({len(synthetic_logs):,} entries)")

    # Summary stats
    summary = {
        'total_patients'      : int(patient_features['subject_id'].nunique()),
        'total_prescriptions' : int(len(df_clean)),
        'high_risk_patients'  : int(patient_features['risk_label'].sum()),
        'avg_adherence_pct'   : round(float(patient_features['simulated_adherence_pct'].mean()), 1),
        'synthetic_log_count' : len(synthetic_logs),
    }
    summary_path = os.path.join(OUTPUT_DIR, 'pipeline_summary.json')
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    print(f"    ✅  {summary_path}")
    print(f"\n📋  Summary: {json.dumps(summary, indent=4)}")


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  HealMate – MIMIC-III Data Processing Pipeline")
    print("=" * 60)

    prescriptions, patients, admissions, diagnoses, labevents, icustays = load_data()
    df_clean      = preprocess(prescriptions, patients, admissions, diagnoses, icustays)
    patient_feats = build_patient_features(df_clean)
    synth_logs    = generate_synthetic_logs(df_clean)
    save_outputs(df_clean, patient_feats, synth_logs)

    print("\n✅  Pipeline complete! Outputs in:", OUTPUT_DIR)
    print("=" * 60)


if __name__ == '__main__':
    main()
