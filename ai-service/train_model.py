import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

DATA_PATH = os.path.join("..", "data-pipeline", "output", "patient_features.csv")
MODEL_PATH = "model.joblib"

FEATURES = [
    "age", 
    "total_prescriptions", 
    "unique_drugs", 
    "oral_drug_count", 
    "non_oral_drug_count", 
    "avg_dose_duration_days",
    "max_concurrent_meds",
    "num_admissions",
    "avg_icu_los",
    "route_diversity"
]
TARGET = "risk_label"

def train():
    print("🚀 Starting model training...")
    if not os.path.exists(DATA_PATH):
        print(f"❌ Cannot find data at {DATA_PATH}. Run the data pipeline first.")
        return

    df = pd.read_csv(DATA_PATH)
    print(f"✅ Loaded {len(df)} patient records.")

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest Classifier
    rf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=5)
    rf.fit(X_train, y_train)

    # Evaluate
    y_pred = rf.predict(X_test)
    print("\n📊 Model Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))

    # Save Model
    joblib.dump(rf, MODEL_PATH)
    print(f"✅ Model saved to '{MODEL_PATH}'")

if __name__ == "__main__":
    train()
