import { useMemo, useState } from "react";
import "./App.css";
import { PredictionForm } from "./components/PredictionForm.jsx";
import { ResultCard } from "./components/ResultCard.jsx";
import { SuggestionsList } from "./components/SuggestionsList.jsx";

const PREDICT_URL = "http://127.0.0.1:8000/predict";

const BRANCH_OPTIONS = ["CSE", "Civil", "ECE", "IT", "ME"];

const FIELD_RULES = {
  Age: { label: "Age", min: 18, max: 30, step: 1 },
  CGPA: { label: "CGPA", min: 0, max: 10, step: 0.01 },
  Internships: { label: "Internships", min: 0, max: 5, step: 1 },
  Projects: { label: "Projects", min: 0, max: 10, step: 1 },
  Coding_Skills: { label: "Coding Skills", min: 0, max: 10, step: 0.1 },
  Communication_Skills: { label: "Communication Skills", min: 0, max: 10, step: 0.1 },
  Aptitude_Test_Score: { label: "Aptitude Test Score", min: 0, max: 100, step: 1 },
  Soft_Skills_Rating: { label: "Soft Skills Rating", min: 0, max: 10, step: 0.1 },
  Certifications: { label: "Certifications", min: 0, max: 10, step: 1 },
  Backlogs: { label: "Backlogs", min: 0, max: 10, step: 1 },
};

const INITIAL_FORM = {
  Age: "",
  Branch: "",
  CGPA: "",
  Internships: "",
  Projects: "",
  Coding_Skills: "",
  Communication_Skills: "",
  Aptitude_Test_Score: "",
  Soft_Skills_Rating: "",
  Certifications: "",
  Backlogs: "",
};

function App() {
  // required state per spec
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function validateField(name, value) {
    if (name === "Branch") {
      if (!value) return "Please select your branch.";
      if (!BRANCH_OPTIONS.includes(value)) return "Invalid branch selection.";
      return "";
    }

    const rule = FIELD_RULES[name];
    if (!rule) return "";

    const raw = String(value ?? "").trim();
    if (raw === "") return `${rule.label} is required.`;
    if (!/^\d+(\.\d+)?$/.test(raw)) return `${rule.label} must be a number.`;

    const num = Number(raw);
    if (!Number.isFinite(num)) return `${rule.label} must be a valid number.`;
    if (num < rule.min) return `${rule.label} must be at least ${rule.min}.`;
    if (num > rule.max) return `${rule.label} must be at most ${rule.max}.`;
    return "";
  }

  function validateForm(nextForm = formData) {
    const nextErrors = {};
    for (const key of Object.keys(INITIAL_FORM)) {
      const msg = validateField(key, nextForm[key]);
      if (msg) nextErrors[key] = msg;
    }
    return nextErrors;
  }

  const isFormValid = useMemo(() => {
    const nextErrors = validateForm(formData);
    return Object.keys(nextErrors).length === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const progress = useMemo(() => {
    const filled = Object.values(formData).filter((v) => String(v).trim() !== "").length;
    return { filled, total: Object.keys(INITIAL_FORM).length };
  }, [formData]);

  function handleChange(name, value) {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      return next;
    });
    setErrors((prev) => {
      const msg = validateField(name, value);
      if (!msg && prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      if (msg) return { ...prev, [name]: msg };
      return prev;
    });
  }

  function handleBlur(name) {
    setErrors((prev) => {
      const msg = validateField(name, formData[name]);
      if (!msg && prev[name]) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      if (msg) return { ...prev, [name]: msg };
      return prev;
    });
  }

  function buildPayload() {
    return {
      Age: Number(formData.Age),
      Branch: formData.Branch,
      CGPA: Number(formData.CGPA),
      Internships: Number(formData.Internships),
      Projects: Number(formData.Projects),
      Coding_Skills: Number(formData.Coding_Skills),
      Communication_Skills: Number(formData.Communication_Skills),
      Aptitude_Test_Score: Number(formData.Aptitude_Test_Score),
      Soft_Skills_Rating: Number(formData.Soft_Skills_Rating),
      Certifications: Number(formData.Certifications),
      Backlogs: Number(formData.Backlogs),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await fetch(PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        // ignore parse errors; handled below
      }

      if (!response.ok) {
        const msg =
          (data && (data.detail || data.error || data.message)) ||
          `Request failed (${response.status})`;
        throw new Error(msg);
      }

      setResult(data?.prediction ?? null);
      const prob = typeof data?.probability === "number" ? data.probability : null;
      setProbability(prob === null ? null : Number((prob * 100).toFixed(2)));
      setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
      setResult(null);
      setProbability(null);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  const canShowResults = result !== null || probability !== null || suggestions.length > 0;

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="titleRow">
            <div className="brandMark" aria-hidden="true" />
            <div>
              <h1 className="h1">Placement Prediction System</h1>
              <div className="subtle">
                Fill the details below to predict your placement chances and get improvement suggestions.
              </div>
            </div>
          </div>
          <div className="progressPill" title="Form completion">
            {progress.filled}/{progress.total} filled
          </div>
        </header>

        <section className="appShell">
          <section className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Student details</div>
              <div className="cardHint">All fields are required.</div>
            </div>
          </div>

          <PredictionForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
            loading={loading}
            disabled={!isFormValid || loading}
            branchOptions={BRANCH_OPTIONS}
            fieldRules={FIELD_RULES}
          />

          {apiError ? <div className="inlineError">Error: {apiError}</div> : null}
          </section>

          <section className="resultsStack">
            <ResultCard
              prediction={result}
              probabilityPct={probability}
              isLoading={loading}
              emptyState={!canShowResults}
            />
            <SuggestionsList suggestions={suggestions} isLoading={loading} />
          </section>
        </section>
      </div>
    </div>
  );
}

export default App;