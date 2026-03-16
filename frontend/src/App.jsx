import { useMemo, useState } from "react";
import "./App.css";
import { PredictionForm } from "./components/PredictionForm.jsx";
import { ResultCard } from "./components/ResultCard.jsx";
import { SuggestionsList } from "./components/SuggestionsList.jsx";

const PREDICT_URL = "http://127.0.0.1:8000/predict";

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
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [probabilityPct, setProbabilityPct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const canShowResults = prediction !== null || probabilityPct !== null || suggestions.length > 0;

  const stats = useMemo(() => {
    const filled = Object.values(form).filter((v) => String(v).trim() !== "").length;
    return { filled, total: Object.keys(form).length };
  }, [form]);

  async function handleSubmit(validatedPayload) {
    setSubmitError("");
    setIsLoading(true);

    try {
      const response = await fetch(PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedPayload),
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

      setPrediction(data?.prediction ?? null);
      const prob = typeof data?.probability === "number" ? data.probability : null;
      setProbabilityPct(prob === null ? null : Number((prob * 100).toFixed(2)));
      setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
      setPrediction(null);
      setProbabilityPct(null);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div>
            <div className="brandTitle">Placement Prediction System</div>
            <div className="brandSubtitle">
              Enter your profile metrics to get a prediction, probability, and improvement suggestions.
            </div>
          </div>
        </div>
        <div className="progressPill" title="Form completion">
          {stats.filled}/{stats.total} filled
        </div>
      </header>

      <main className="layout">
        <section className="card">
          <div className="cardHeader">
            <div>
              <div className="cardTitle">Student details</div>
              <div className="cardHint">All fields are required. Use numeric values (as expected by your model).</div>
            </div>
          </div>

          <PredictionForm
            value={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {submitError ? <div className="inlineError">Error: {submitError}</div> : null}
        </section>

        <section className="stack">
          <ResultCard
            prediction={prediction}
            probabilityPct={probabilityPct}
            isLoading={isLoading}
            emptyState={!canShowResults}
          />

          <SuggestionsList suggestions={suggestions} isLoading={isLoading} />
        </section>
      </main>
    </div>
  );
}

export default App;