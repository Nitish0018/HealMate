import pandas as pd
import os

# Define the paths to the MIMIC-III CSV files
# IMPORTANT: Update these paths to point to the actual location of your MIMIC-III dataset
MIMIC_DIR = os.environ.get('MIMIC_DIR', 'path/to/mimic-iii-clinical-database-1.4')
PRESCRIPTIONS_CSV = os.path.join(MIMIC_DIR, 'PRESCRIPTIONS.csv')
PATIENTS_CSV = os.path.join(MIMIC_DIR, 'PATIENTS.csv')
ADMISSIONS_CSV = os.path.join(MIMIC_DIR, 'ADMISSIONS.csv')

def load_data():
    """
    Loads the relevant MIMIC-III datasets.
    """
    try:
        prescriptions = pd.read_csv(PRESCRIPTIONS_CSV, low_memory=False)
        patients = pd.read_csv(PATIENTS_CSV)
        admissions = pd.read_csv(ADMISSIONS_CSV)
        return prescriptions, patients, admissions
    except FileNotFoundError as e:
        print(f"Error loading data: {e}")
        print(f"Please make sure the MIMIC_DIR environment variable is set correctly or update the path in the script.")
        return None, None, None

def preprocess_prescriptions(prescriptions, patients, admissions):
    """
    Preprocesses the prescriptions data.
    - Merges with patient and admission data.
    - Handles missing values.
    - Converts data types.
    """
    if prescriptions is None or patients is None or admissions is None:
        return None

    # Merge prescriptions with patient and admission data
    df = prescriptions.merge(patients, on='SUBJECT_ID')
    df = df.merge(admissions, on='HADM_ID')

    # Select relevant columns
    df = df[[
        'SUBJECT_ID', 'HADM_ID', 'ICUSTAY_ID',
        'STARTDATE', 'ENDDATE', 'DRUG', 'DOSE_VAL_RX', 'DOSE_UNIT_RX', 'ROUTE',
        'GENDER', 'DOB', 'ADMITTIME', 'DISCHTIME', 'DEATHTIME', 'DIAGNOSIS'
    ]]

    # Convert date columns to datetime objects
    for col in ['STARTDATE', 'ENDDATE', 'DOB', 'ADMITTIME', 'DISCHTIME', 'DEATHTIME']:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    # Handle missing values
    df['ROUTE'].fillna('UNKNOWN', inplace=True)
    df['DOSE_VAL_RX'].fillna(0, inplace=True)
    df['DOSE_UNIT_RX'].fillna('UNKNOWN', inplace=True)

    return df

def main():
    """
    Main function to run the data processing pipeline.
    """
    print("Starting data processing pipeline...")
    prescriptions, patients, admissions = load_data()
    
    if prescriptions is not None:
        processed_data = preprocess_prescriptions(prescriptions, patients, admissions)
        
        if processed_data is not None:
            print("Data processing complete.")
            print("Processed data head:")
            print(processed_data.head())
            
            # You can now save the processed data to a new CSV or a database
            # For example:
            # processed_data.to_csv('processed_prescriptions.csv', index=False)

if __name__ == '__main__':
    main()
