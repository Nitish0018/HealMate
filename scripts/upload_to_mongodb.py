import os
import pandas as pd
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv

# Load environment variables from backend/.env
ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", ".env")
load_dotenv(ENV_PATH)

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "healmate" 

# Data Path Configuration
BASE_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets", "mimic_iii_demo", "mimic-iii-clinical-database-demo-1.4")

# Tables to upload
TABLES = {
    "patients": "PATIENTS.csv",
    "admissions": "ADMISSIONS.csv",
    "prescriptions": "PRESCRIPTIONS.csv"
}

def upload_table(collection_name, csv_filename):
    file_path = os.path.join(BASE_DATA_DIR, csv_filename)
    
    if not os.path.exists(file_path):
        print(f"Error: {csv_filename} not found at {file_path}")
        return

    print(f"Reading {csv_filename}...")
    df = pd.read_csv(file_path)
    
    # Convert column names to lowercase for MongoDB consistency
    df.columns = [c.lower() for c in df.columns]
    
    import json
    # Convert dates if they exist (searching for 'time' or 'date' in column names)
    date_cols = [c for c in df.columns if 'time' in c or 'date' in c or 'dob' in c or 'dod' in c]
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    records = json.loads(df.to_json(orient='records', date_format='iso'))

    # Initialize MongoDB Client
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[collection_name]

    print(f"Uploading {len(df)} records to collection: '{collection_name}'...")
    

    
    # Use bulk operation for better performance
    # We identify records by 'row_id' to prevent duplicates during multiple runs
    ops = [
        UpdateOne({"row_id": r["row_id"]}, {"$set": r}, upsert=True)
        for r in records
    ]
    
    result = collection.bulk_write(ops)
    print(f"Success! Matched: {result.matched_count}, Upserted: {result.upserted_count}")
    client.close()

def main():
    if not MONGO_URI or "<username>" in MONGO_URI:
        print("Error: MONGO_URI is not properly configured in backend/.env")
        print("Please replace <username> and <password> with your actual MongoDB Atlas credentials.")
        return

    for coll, file in TABLES.items():
        try:
            upload_table(coll, file)
        except Exception as e:
            print(f"Failed to upload {file}: {str(e)}")

if __name__ == "__main__":
    main()
