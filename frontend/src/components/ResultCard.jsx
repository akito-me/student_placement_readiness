import { LoadingSpinner } from "./LoadingSpinner.jsx";

function formatPct(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return `${v.toFixed(2)}%`;
}

export function ResultCard({ prediction, probabilityPct, isLoading, emptyState }) {
  const placed =
    prediction === 1 || prediction === "1" || prediction === true || prediction === "Placed";
  const known = prediction !== null && prediction !== undefined;

  const title = isLoading
    ? "Running prediction"
    : emptyState
      ? "Your results will appear here"
      : "Prediction result";

  const subtitle = isLoading
    ? "Please wait while we contact the model API."
    : emptyState
      ? "Submit the form to see prediction, probability, and suggestions."
      : "Based on the details you provided.";

  const pct = formatPct(probabilityPct);
  const badge =
    isLoading || emptyState
      ? null
      : known
        ? placed
          ? { label: "Likely Placed", tone: "good" }
          : { label: "Not Likely Placed", tone: "bad" }
        : { label: "Unknown", tone: "neutral" };

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <div className="cardTitle">{title}</div>
          <div className="cardHint">{subtitle}</div>
        </div>
        {badge ? <div className={`badge badge-${badge.tone}`}>{badge.label}</div> : null}
      </div>

      <div className="resultBody">
        {isLoading ? (
          <div className="loadingRow">
            <LoadingSpinner />
            <div>
              <div className="loadingTitle">Predicting…</div>
              <div className="muted">This usually takes a moment.</div>
            </div>
          </div>
        ) : emptyState ? (
          <div className="emptyState">
            <div className="emptyIcon" aria-hidden="true" />
            <div className="emptyText">
              Fill in the form and click <strong>Predict</strong>.
            </div>
          </div>
        ) : (
          <div className="resultGrid">
            <div className="metric">
              <div className="metricLabel">Prediction</div>
              <div className="metricValue">
                {known ? (placed ? "Likely Placed" : "Not Likely Placed") : "—"}
              </div>
            </div>
            <div className="metric">
              <div className="metricLabel">Placement probability</div>
              <div className="metricValue">{pct ?? "—"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

