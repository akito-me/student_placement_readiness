import { useMemo, useRef, useState } from "react";
import { PredictionForm } from "../components/PredictionForm.jsx";
import { ResultCard } from "../components/ResultCard.jsx";
import { SuggestionsList } from "../components/SuggestionsList.jsx";
import { SideNavigation } from "../components/SideNavigation.jsx";
import { ProbabilityChart } from "../components/charts/ProbabilityChart.jsx";
import { SkillRadarChart } from "../components/charts/SkillRadarChart.jsx";

const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const PREDICT_URL = `${API_BASE_URL}/predict`;

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

export function Predict() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const resultsRef = useRef(null);
  const lastSubmittedRef = useRef(null);

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
      const payload = buildPayload();
      lastSubmittedRef.current = payload;
      const response = await fetch(PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

      // smooth scroll to results after prediction
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : "Something went wrong";
      const isNetworkError =
        err instanceof TypeError ||
        /failed to fetch|networkerror|load failed/i.test(String(rawMsg));
      setApiError(
        isNetworkError
          ? `Cannot reach the prediction API at ${PREDICT_URL}. Make sure the backend is running and accessible.`
          : rawMsg,
      );
      setResult(null);
      setProbability(null);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  const canShowResults = result !== null || probability !== null || suggestions.length > 0;

  function handleSideScroll(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="predictPage">
      <header className="predictTop">
        <div>
          <h1 className="pageTitle">Placement Prediction</h1>
          <p className="pageSubtitle">
            Enter your profile details, run the prediction, and review the result with charts and insights.
          </p>
        </div>
        <div className="progressPill" title="Form completion">
          {progress.filled}/{progress.total} filled
        </div>
      </header>

      <div className="predictGrid">
        <aside className="predictQuickNav">
          <SideNavigation onScroll={handleSideScroll} />
        </aside>

        <section className="predictLeft" id="form">
          <div className="panel">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">Student details</div>
                <div className="panelHint">All fields are required. Values must be within the allowed ranges.</div>
              </div>
            </div>

            <PredictionForm
              formData={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              loading={loading}
              disabled={loading}
              branchOptions={BRANCH_OPTIONS}
              fieldRules={FIELD_RULES}
            />

            {apiError ? <div className="inlineError">Error: {apiError}</div> : null}
          </div>
        </section>

        <section className="predictRight">
          <div className="rightStack">
            <section id="results" ref={resultsRef}>
              <ResultCard
                prediction={result}
                probabilityPct={probability}
                isLoading={loading}
                emptyState={!canShowResults}
              />
            </section>

            <div className="chartsRow">
              <ProbabilityChart probabilityPct={probability} />
              <SkillRadarChart formData={lastSubmittedRef.current ?? formData} />
            </div>

            <section className="panel" id="suggestions">
              <div className="panelHeader">
                <div>
                  <div className="panelTitle">How to Improve</div>
                  <div className="panelHint">Suggestions generated by the backend model.</div>
                </div>
              </div>
              <SuggestionsList suggestions={suggestions} isLoading={loading} />
            </section>

            <section className="panel" id="graphs">
              <div className="panelHeader">
                <div>
                  <div className="panelTitle">Insights</div>
                </div>
              </div>
              <div className="insightsText">
                <ul className="insightsList">
                  <li>Higher CGPA, projects, coding skills, aptitude, and certifications generally improve chances.</li>
                  <li>Backlogs can negatively affect placement readiness.</li>
                  <li>Communication and soft skills help during interviews and group discussions.</li>
                </ul>
                <div className="mutedSmall">
                  These insights are general guidance. Final outcomes depend on opportunities, preparation, and the model’s training data.
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

