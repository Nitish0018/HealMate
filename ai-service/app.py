from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="HealMate AI Prediction API", version="1.0")

MODEL_PATH = "model.joblib"
model = None

# Specify the expected input format from the Node.js backend
class PatientData(BaseModel):
    age: float
    total_prescriptions: int
    unique_drugs: int
    oral_drug_count: int
    non_oral_drug_count: int
    avg_dose_duration_days: float
    max_concurrent_meds: int
    num_admissions: int
    avg_icu_los: float
    route_diversity: int

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"✅ Model loaded successfully from {MODEL_PATH}")
    else:
        print(f"⚠️ Model not found at {MODEL_PATH}. Pre-generate it by running train_model.py")

@app.post("/predict_risk")
def predict_risk(data: PatientData):
    if model is None:
        raise HTTPException(status_code=503, detail="AI Model is not loaded. Train it first.")
    
    # Create a DataFrame for prediction
    input_data = pd.DataFrame([data.dict()])
    
    probability = model.predict_proba(input_data)[0][1] # Probability of high risk (class 1)
    
    # Determine risk level
    if probability >= 0.7:
        risk_level = "High"
    elif probability >= 0.4:
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    return {
        "success": True,
        "probability_of_missing_dose_or_risk": float(probability),
        "predicted_risk_level": risk_level,
        "risk_score_percentage": round(probability * 100, 1)
    }

@app.get("/")
def root():
    return {"message": "HealMate AI Engine is running! 🚀 Endpoint: POST /predict_risk"}
