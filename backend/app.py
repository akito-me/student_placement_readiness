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

branch_map = {
    "CSE": 0,
    "Civil": 1,
    "ECE": 2,
    "IT": 3,
    "ME": 4
}

@app.get("/")
def home():
    return {"message": "Placement Prediction API Running"}

@app.post("/predict")
def predict(data: dict):

    branch_value = branch_map[data["Branch"]]

    features = np.array([[
        data["Age"],
        branch_value,
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

    if data["CGPA"] < 7.0:
        suggestions.append("Improve your CGPA through consistent academic preparation.")

    if data["Internships"] < 1:
        suggestions.append("Try to complete at least one internship for industry exposure.")

    if data["Projects"] < 4:
        suggestions.append("Build more academic or real-world projects to strengthen your profile.")

    if data["Coding_Skills"] < 6:
        suggestions.append("Improve coding skills by practicing DSA and solving programming problems regularly.")

    if data["Communication_Skills"] < 6:
        suggestions.append("Work on communication skills through presentations, mock interviews, and group discussions.")

    if data["Aptitude_Test_Score"] < 70:
        suggestions.append("Practice aptitude regularly to improve quantitative and logical reasoning performance.")

    if data["Certifications"] < 2:
        suggestions.append("Complete relevant certifications in technical domains like web development, cloud, or programming.")

    if data["Backlogs"] > 0:
        suggestions.append("Clear backlogs as early as possible because they negatively affect placement chances.")

    if len(suggestions) == 0:
        suggestions.append("Your profile looks strong. Keep improving through advanced projects, interview practice, and skill development.")

    return {
        "prediction": int(prediction),
        "probability": float(prob),
        "suggestions": suggestions
    }