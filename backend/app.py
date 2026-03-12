from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
model_path = os.path.join(BASE_DIR, "placement_model.pkl")
model = joblib.load(model_path)
@app.get("/")
def home():
    return {"message": "Placement Prediction API Running"}

@app.post("/predict")
def predict(data: dict):

    features = np.array([[
        data["Age"],
        data["Branch"],
        data["CGPA"],
        data["Internships"],
        data["Projects"],
        data["Coding_Skills"],
        data["Communication_Skills"],
        data["Aptitude_Test_Score"],
        data["Soft_Skills_Rating"],
        data["Certifications"],
        data["Backlogs"]
    ]])

    prediction = model.predict(features)[0]
    prob = model.predict_proba(features)[0][1]

    suggestions = []

    if data["Coding_Skills"] < 6:
        suggestions.append("Improve coding skills and practice DSA")

    if data["Projects"] < 3:
        suggestions.append("Build more real-world projects")

    if data["CGPA"] < 7:
        suggestions.append("Improve academic performance")

    if data["Communication_Skills"] < 6:
        suggestions.append("Work on communication skills")

    return {
    "prediction": int(prediction),
    "probability": float(prob),
    "suggestions": suggestions
}